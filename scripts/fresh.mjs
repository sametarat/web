#!/usr/bin/env node
/**
 * Temiz geliştirme başlangıcı.
 *
 * NEDEN VAR: Next.js aynı anda ikinci bir dev server başlatmayı reddediyor ve
 * "Another next dev server is already running" deyip mevcut adresi gösteriyor.
 * Bu mesaj hata gibi durmadığı için insan yeniden başlattığını sanıyor, oysa
 * tarayıcı hâlâ eski sürece bağlı: yeni rotalar görünmüyor, değişen ortam
 * değişkenleri okunmuyor, düzenlenen bileşenler güncellenmiyor.
 *
 * Bu script önce portu kontrol ediyor, boşsa Turbopack önbelleğini silip
 * temiz başlatıyor. Doluysa ne yapılacağını açıkça söylüyor.
 *
 * Kullanım:  npm run fresh
 */

import { rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT || 5555);

function portInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err) => resolve(err.code === 'EADDRINUSE'));
    server.once('listening', () => server.close(() => resolve(false)));
    server.listen(port, '127.0.0.1');
  });
}

const busy = await portInUse(PORT);
if (busy) {
  console.error(`
────────────────────────────────────────────────────────────
  ${PORT} portu DOLU — eski bir dev server hâlâ çalışıyor.
────────────────────────────────────────────────────────────

  Başlatmıyorum, çünkü başlatsam Next.js eski sunucuya
  yönlendirir ve değişikliklerin görünmez. Önce onu kapat:

    Windows:   taskkill /F /IM node.exe
    macOS/Linux:  pkill -f "next dev"

  Sonra tekrar:  npm run fresh
`);
  process.exit(1);
}

const cacheDir = path.join(ROOT, '.next');
if (existsSync(cacheDir)) {
  process.stdout.write('Turbopack önbelleği siliniyor... ');
  await rm(cacheDir, { recursive: true, force: true });
  console.log('tamam');
}

console.log(`Temiz başlatılıyor → http://localhost:${PORT}\n`);

const child = spawn(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['next', 'dev', '-p', String(PORT)],
  { cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32' },
);

child.on('exit', (code) => process.exit(code ?? 0));
