/**
 * CRM oturum güvenliği.
 *
 * CRM ekranı müşteri adı, telefonu ve e-postası gösteriyor — KVKK kapsamında
 * kişisel veri. Bu yüzden burada üç şey birden yapılıyor:
 *
 *   1. İmzalı, süreli oturum jetonu (çerezde ham parola ya da sabit özet yok)
 *   2. Girişte IP başına kaba kuvvet kilidi (paylaşımlı sayaç, Upstash)
 *   3. Her giriş denemesinin loglanması
 *
 * ÖNCEKİ SÜRÜMÜN ZAAFI: çerez, parolanın sabit SHA-256 özetiydi. Süresi yoktu,
 * sunucu tarafında iptal edilemiyordu ve bir kez sızarsa parola değişene kadar
 * geçerli kalıyordu. Artık jetonun içinde son kullanma zamanı var ve imza
 * gizli anahtarla üretiliyor; anahtarı ya da parolayı değiştirmek tüm açık
 * oturumları anında düşürüyor.
 *
 * KURULUM
 *   CRM_PASSWORD          zorunlu, en az 12 karakter
 *   CRM_SESSION_SECRET    önerilir; tanımlı değilse paroladan türetilir.
 *                         Ayrı tanımlarsan parolayı değiştirmeden oturumları
 *                         iptal edebilirsin.
 *
 * DAHA GÜÇLÜSÜNÜ İSTERSEN: tek parola, tek kullanıcılık bir panel için makul
 * bir alt sınır. Gerçek kimlik doğrulama (e-posta ile tek kullanımlık kod,
 * Google girişi) istiyorsan Cloudflare Access bunu 50 kullanıcıya kadar
 * ücretsiz sağlıyor ve hiç kod gerektirmiyor — /crm yolunu onun arkasına al.
 */

const COOKIE = 'kodara_crm';

/** Oturum ömrü. Kişisel veri gösteren bir panel için 30 gün fazla uzundu. */
const SESSION_TTL_SECONDS = 12 * 60 * 60;

/** Parola en az bu kadar uzun olmalı; kısa parola kabul edilmiyor. */
const MIN_PASSWORD_LENGTH = 12;

export function isAuthConfigured(): boolean {
  const pw = process.env.CRM_PASSWORD;
  return Boolean(pw && pw.length >= MIN_PASSWORD_LENGTH);
}

/** Parola tanımlı ama çok kısaysa sebebini söyleyebilmek için. */
export function authConfigProblem(): string | null {
  const pw = process.env.CRM_PASSWORD;
  if (!pw) {
    return `CRM parolası tanımlı değil. Ortam değişkenlerine en az ${MIN_PASSWORD_LENGTH} karakterlik bir CRM_PASSWORD ekleyin.`;
  }
  if (pw.length < MIN_PASSWORD_LENGTH) {
    return `CRM parolası çok kısa (${pw.length} karakter). En az ${MIN_PASSWORD_LENGTH} karakter olmalı.`;
  }
  return null;
}

const encoder = new TextEncoder();

function secret(): string {
  // Ayrı bir oturum anahtarı verilmemişse paroladan türet. Böylece kurulum
  // tek değişkenle çalışıyor ama isteyen oturumları paroladan bağımsız
  // iptal edebiliyor.
  return process.env.CRM_SESSION_SECRET || `derived:${process.env.CRM_PASSWORD ?? ''}`;
}

async function hmac(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return base64url(new Uint8Array(signature));
}

function base64url(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Zamanlama saldırısına karşı sabit süreli karşılaştırma. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function passwordMatches(candidate: string): Promise<boolean> {
  const expected = process.env.CRM_PASSWORD;
  if (!expected) return false;
  // İki tarafı da HMAC'ten geçirip karşılaştırıyoruz: hem uzunluk farkı
  // gizleniyor hem karşılaştırma sabit sürede yapılıyor.
  const [a, b] = await Promise.all([hmac(`pw:${candidate}`), hmac(`pw:${expected}`)]);
  return safeEqual(a, b);
}

/**
 * Yeni oturum jetonu üretir: `<sonKullanma>.<imza>`
 * Son kullanma zamanı jetonun içinde ve imzaya dâhil — kurcalanamıyor.
 */
export async function issueSession(): Promise<{ value: string; maxAge: number }> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const signature = await hmac(`sess:${exp}`);
  return { value: `${exp}.${signature}`, maxAge: SESSION_TTL_SECONDS };
}

async function verifyToken(token: string): Promise<boolean> {
  const dot = token.indexOf('.');
  if (dot < 1) return false;

  const expRaw = token.slice(0, dot);
  const signature = token.slice(dot + 1);

  const exp = Number(expRaw);
  if (!Number.isFinite(exp)) return false;
  if (exp * 1000 < Date.now()) return false; // süresi dolmuş

  const expected = await hmac(`sess:${expRaw}`);
  return safeEqual(signature, expected);
}

/** İstekteki oturum çerezi geçerli mi? */
export async function isAuthorized(req: Request): Promise<boolean> {
  if (!isAuthConfigured()) return false;

  const header = req.headers.get('cookie') ?? '';
  const match = header.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!match) return false;

  return verifyToken(decodeURIComponent(match[1]));
}

/** Set-Cookie başlığı — httpOnly, SameSite=Strict, production'da Secure. */
export function sessionCookieHeader(value: string, maxAge: number): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

export function clearCookieHeader(): string {
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
}

export const CRM_COOKIE_NAME = COOKIE;
export const CRM_SESSION_TTL = SESSION_TTL_SECONDS;
