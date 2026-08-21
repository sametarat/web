'use client';

/**
 * Kodara CRM — iç kullanım arayüzü.
 *
 * Tek dosyada iki ekran var: parola girişi ve lead tablosu. Sayfa açılışında
 * önce `GET /api/crm` deneniyor; çerez hâlâ geçerliyse giriş ekranı hiç
 * görünmüyor. 401 bir hata değil, sadece "giriş gerekiyor" demek.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Logo } from '@/components/Logo';
import { LEAD_STATUSES, type LeadStatus, type StoredLead } from '@/lib/leadStore';

type StatusOption = { id: string; label: string };

type CrmResponse = {
  configured: boolean;
  leads: StoredLead[];
  statuses: StatusOption[];
};

const SOURCE_LABELS: Record<string, string> = {
  chatbot: 'Chatbot',
  form: 'Form',
  landing: 'Landing',
  pentest: 'Pentest',
  'guvenlik-analizi': 'Güvenlik analizi',
  'iso-27001': 'ISO 27001',
  'is-ortakligi': 'İş ortaklığı',
  hizmet: 'Hizmet',
  'hizmet-teklif': 'Hizmet teklifi',
};

/** Durum renkleri: zemin tonu okumayı bozmayacak kadar hafif tutuldu. */
const STATUS_TONE: Record<string, string> = {
  yeni: 'bg-brand-500/15 text-brand-200 border-brand-400/30',
  arandi: 'bg-amber-500/15 text-amber-200 border-amber-400/30',
  teklif: 'bg-sky-500/15 text-sky-200 border-sky-400/30',
  kazanildi: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/30',
  kaybedildi: 'bg-slate-500/15 text-slate-300 border-slate-400/30',
};

function toneOf(status: string): string {
  return STATUS_TONE[status] ?? STATUS_TONE.kaybedildi;
}

/** Türkçe'de i/I dönüşümü farklı; arama bunu bozmasın. */
function fold(value: string): string {
  return value.toLocaleLowerCase('tr');
}

function formatDate(ms: number): string {
  try {
    return new Date(ms).toLocaleString('tr-TR');
  } catch {
    return '—';
  }
}

async function readError(res: Response, fallback: string): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    return data.error || fallback;
  } catch {
    return fallback;
  }
}

/* ------------------------------------------------------------------ */

export default function KodaraCRM() {
  const [booting, setBooting] = useState(true);
  const [authed, setAuthed] = useState(false);

  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginHint, setLoginHint] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const [data, setData] = useState<CrmResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState('');

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const load = useCallback(async (): Promise<'ok' | 'unauthorized' | 'error'> => {
    setLoading(true);
    try {
      const res = await fetch('/api/crm', { cache: 'no-store' });
      if (res.status === 401) return 'unauthorized';
      if (!res.ok) {
        setListError(await readError(res, 'Lead listesi alınamadı.'));
        return 'error';
      }
      const body = (await res.json()) as CrmResponse;
      setData(body);
      setListError('');
      return 'ok';
    } catch {
      setListError('Bağlantı kurulamadı. İnternet bağlantınızı kontrol edin.');
      return 'error';
    } finally {
      setLoading(false);
    }
  }, []);

  // Açılışta çerezi dene: geçerliyse giriş ekranını atla.
  useEffect(() => {
    let alive = true;
    void (async () => {
      const result = await load();
      if (!alive) return;
      if (result === 'ok') setAuthed(true);
      setBooting(false);
    })();
    return () => {
      alive = false;
    };
  }, [load]);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    if (loggingIn) return;
    setLoggingIn(true);
    setLoginError('');
    setLoginHint(false);
    try {
      const res = await fetch('/api/crm/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setLoginError(await readError(res, 'Giriş yapılamadı.'));
        if (res.status === 503) setLoginHint(true);
        return;
      }
      setPassword('');
      const result = await load();
      if (result === 'ok') setAuthed(true);
      else setLoginError('Giriş yapıldı ancak liste alınamadı. Yenilemeyi deneyin.');
    } catch {
      setLoginError('Bağlantı kurulamadı. İnternet bağlantınızı kontrol edin.');
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/crm/login', { method: 'DELETE' });
    } catch {
      // Çerez sunucuda silinemese bile arayüzü kilitlemek doğru davranış.
    }
    setAuthed(false);
    setData(null);
    setQuery('');
    setStatusFilter('all');
  }

  /** Tek bir lead'i yerelde değiştirir. */
  const patchLocal = useCallback((id: string, patch: Partial<StoredLead>) => {
    setData((prev) =>
      prev
        ? { ...prev, leads: prev.leads.map((l) => (l.id === id ? { ...l, ...patch } : l)) }
        : prev,
    );
  }, []);

  const removeLocal = useCallback((id: string) => {
    setData((prev) => (prev ? { ...prev, leads: prev.leads.filter((l) => l.id !== id) } : prev));
  }, []);

  if (booting) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-sm text-slate-400">Yükleniyor…</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <LoginCard
        password={password}
        setPassword={setPassword}
        onSubmit={handleLogin}
        busy={loggingIn}
        error={loginError}
        showSetupHint={loginHint}
      />
    );
  }

  return (
    <LeadBoard
      data={data}
      loading={loading}
      error={listError}
      query={query}
      setQuery={setQuery}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      onRefresh={load}
      onLogout={handleLogout}
      patchLocal={patchLocal}
      removeLocal={removeLocal}
    />
  );
}

/* ------------------------------ giriş ------------------------------ */

function LoginCard({
  password,
  setPassword,
  onSubmit,
  busy,
  error,
  showSetupHint,
}: {
  password: string;
  setPassword: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  busy: boolean;
  error: string;
  showSetupHint: boolean;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <Logo size="md" />
        <h1 className="mt-6 font-display text-xl font-bold text-white">CRM Girişi</h1>
        <p className="mt-2 text-sm text-slate-400">
          Bu alan yalnızca ekip içi kullanım içindir.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="crm-password" className="mb-1.5 block text-sm text-slate-300">
              Parola
            </label>
            <input
              id="crm-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-brand-400 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={busy || password.length === 0}
            className="lift w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Kontrol ediliyor…' : 'Giriş yap'}
          </button>

          <div aria-live="polite" className="min-h-0">
            {error ? (
              <div
                role="alert"
                className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
              >
                <p>{error}</p>
                {showSetupHint ? (
                  <p className="mt-1.5 text-xs text-red-200/80">
                    Kurulum: ortam değişkenlerine{' '}
                    <code className="font-mono">CRM_PASSWORD</code> ekleyip uygulamayı yeniden
                    başlatın.
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------ liste ------------------------------ */

function LeadBoard({
  data,
  loading,
  error,
  query,
  setQuery,
  statusFilter,
  setStatusFilter,
  onRefresh,
  onLogout,
  patchLocal,
  removeLocal,
}: {
  data: CrmResponse | null;
  loading: boolean;
  error: string;
  query: string;
  setQuery: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  onRefresh: () => void;
  onLogout: () => void;
  patchLocal: (id: string, patch: Partial<StoredLead>) => void;
  removeLocal: (id: string) => void;
}) {
  const leads = data?.leads ?? [];
  const statuses = data?.statuses ?? LEAD_STATUSES;

  const needle = fold(query.trim());
  const matchesQuery = (lead: StoredLead) =>
    needle.length === 0 ||
    [lead.fullName, lead.contactInfo, lead.projectType, lead.note]
      .filter(Boolean)
      .some((field) => fold(String(field)).includes(needle));

  const searched = leads.filter(matchesQuery);
  const visible = searched.filter(
    (lead) => statusFilter === 'all' || lead.status === statusFilter,
  );

  const countFor = (id: string) => searched.filter((l) => l.status === id).length;

  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 px-4 py-8 sm:px-6 sm:py-12">
      <header className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-3">
            <h1 className="font-display text-2xl font-bold text-white">Lead&apos;ler</h1>
            <span className="tabular-nums text-sm text-slate-400">{leads.length} kayıt</span>
          </div>
          <Logo size="sm" className="mt-1 opacity-60" />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:border-brand-400/40 disabled:opacity-50"
          >
            {loading ? 'Yenileniyor…' : 'Yenile'}
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-400 hover:text-white"
          >
            Çıkış
          </button>
        </div>
      </header>

      {error ? (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
        >
          {error}
        </div>
      ) : null}

      {data && !data.configured ? (
        <SetupCard />
      ) : (
        <>
          <p className="mt-4 text-xs text-slate-500">
            Silme işlemi KVKK silme taleplerini karşılamak içindir; kayıt kalıcı olarak gider.
          </p>

          <div className="mt-5 space-y-3">
            <div>
              <label htmlFor="crm-search" className="sr-only">
                Lead ara
              </label>
              <input
                id="crm-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="İsim, iletişim, proje ya da not içinde ara"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-brand-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={statusFilter === 'all'}
                onClick={() => setStatusFilter('all')}
                label="Tümü"
                count={searched.length}
                tone="bg-white/5 text-slate-200 border-white/10"
              />
              {statuses.map((s) => (
                <FilterChip
                  key={s.id}
                  active={statusFilter === s.id}
                  onClick={() => setStatusFilter(s.id)}
                  label={s.label}
                  count={countFor(s.id)}
                  tone={toneOf(s.id)}
                />
              ))}
            </div>
          </div>

          {leads.length === 0 ? (
            <EmptyState
              title="Henüz lead yok"
              body="Formlardan ilk kayıt geldiğinde burada listelenecek."
            />
          ) : visible.length === 0 ? (
            <EmptyState
              title="Eşleşen kayıt yok"
              body="Aramayı ya da durum filtresini gevşetmeyi deneyin."
            />
          ) : (
            <>
              {/* Masaüstü: tablo. Yatay taşma sayfada değil, bu kutunun içinde. */}
              <div className="mt-6 hidden overflow-x-auto rounded-xl border border-white/10 lg:block">
                <table className="w-full min-w-[64rem] text-left text-sm">
                  <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      <th scope="col" className="px-3 py-2.5 font-medium">Tarih</th>
                      <th scope="col" className="px-3 py-2.5 font-medium">Ad Soyad</th>
                      <th scope="col" className="px-3 py-2.5 font-medium">İletişim</th>
                      <th scope="col" className="px-3 py-2.5 font-medium">Proje</th>
                      <th scope="col" className="px-3 py-2.5 font-medium">Kaynak</th>
                      <th scope="col" className="px-3 py-2.5 font-medium">Durum</th>
                      <th scope="col" className="px-3 py-2.5 font-medium">Not</th>
                      <th scope="col" className="px-3 py-2.5 font-medium">
                        <span className="sr-only">İşlem</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((lead) => (
                      <LeadRow
                        key={lead.id}
                        lead={lead}
                        patchLocal={patchLocal}
                        removeLocal={removeLocal}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobil: kart yığını. */}
              <div className="mt-6 space-y-3 lg:hidden">
                {visible.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    patchLocal={patchLocal}
                    removeLocal={removeLocal}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  tone: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${tone} ${
        active ? 'ring-1 ring-brand-400/60' : 'opacity-70 hover:opacity-100'
      }`}
    >
      {label} <span className="tabular-nums opacity-70">({count})</span>
    </button>
  );
}

function SetupCard() {
  return (
    <section className="mt-6 rounded-xl border border-brand-400/25 bg-brand-500/[0.07] p-5 sm:p-6">
      <h2 className="font-display text-lg font-semibold text-white">Lead deposu henüz kurulu değil</h2>
      <p className="mt-2 max-w-2xl text-sm text-slate-300">
        Lead&apos;lerin CRM&apos;de listelenebilmesi için bir Upstash Redis veritabanı bağlanması
        gerekiyor. Bağlanana kadar hiçbir kayıt kaybolmuyor: lead&apos;ler e-posta ve Telegram
        bildirimi olarak gelmeye devam ediyor.
      </p>
      <p className="mt-4 text-sm text-slate-300">Eklenmesi gereken iki ortam değişkeni:</p>
      <ul className="mt-2 space-y-1.5 font-mono text-sm text-brand-200">
        <li>UPSTASH_REDIS_REST_URL</li>
        <li>UPSTASH_REDIS_REST_TOKEN</li>
      </ul>
      <p className="mt-4 text-xs text-slate-500">
        Değerleri Upstash panelindeki &quot;REST API&quot; bölümünden kopyalayıp uygulamayı yeniden
        başlatmak yeterli.
      </p>
    </section>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-10 text-center">
      <p className="text-sm font-medium text-slate-200">{title}</p>
      <p className="mt-1.5 text-sm text-slate-500">{body}</p>
    </div>
  );
}

/* --------------------------- tek lead --------------------------- */

type RowProps = {
  lead: StoredLead;
  patchLocal: (id: string, patch: Partial<StoredLead>) => void;
  removeLocal: (id: string) => void;
};

/** Durum, not ve silme davranışının tamamı; tablo ve kart bunu paylaşıyor. */
function useLeadActions({ lead, patchLocal, removeLocal }: RowProps) {
  const [note, setNote] = useState(lead.note ?? '');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sunucudan gelen not değiştiğinde alanı tazele. Efekt yerine render sırasında
  // türetiyoruz; React'in önerdiği yol bu ve fazladan bir tur render doğurmuyor.
  const incoming = lead.note ?? '';
  const [seenNote, setSeenNote] = useState(incoming);
  if (seenNote !== incoming) {
    setSeenNote(incoming);
    setNote(incoming);
  }

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function acknowledge() {
    setSaved(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setSaved(false), 2000);
  }

  async function changeStatus(next: LeadStatus) {
    const previous = lead.status;
    setError('');
    patchLocal(lead.id, { status: next }); // iyimser
    try {
      const res = await fetch('/api/crm', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, status: next }),
      });
      if (!res.ok) {
        patchLocal(lead.id, { status: previous });
        setError(await readError(res, 'Durum güncellenemedi.'));
        return;
      }
      acknowledge();
    } catch {
      patchLocal(lead.id, { status: previous });
      setError('Durum güncellenemedi. Bağlantıyı kontrol edin.');
    }
  }

  async function saveNote() {
    if (note === (lead.note ?? '')) return;
    setError('');
    try {
      const res = await fetch('/api/crm', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, note }),
      });
      if (!res.ok) {
        setError(await readError(res, 'Not kaydedilemedi.'));
        return;
      }
      patchLocal(lead.id, { note });
      acknowledge();
    } catch {
      setError('Not kaydedilemedi. Bağlantıyı kontrol edin.');
    }
  }

  async function remove() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/crm', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id }),
      });
      if (!res.ok) {
        setError(await readError(res, 'Kayıt silinemedi.'));
        setConfirming(false);
        return;
      }
      removeLocal(lead.id);
    } catch {
      setError('Kayıt silinemedi. Bağlantıyı kontrol edin.');
      setConfirming(false);
    } finally {
      setBusy(false);
    }
  }

  return {
    note,
    setNote,
    saved,
    error,
    confirming,
    setConfirming,
    busy,
    changeStatus,
    saveNote,
    remove,
  };
}

function ContactLink({ value }: { value: string }) {
  const trimmed = (value ?? '').trim();
  if (!trimmed) return <span className="text-slate-500">—</span>;
  const href = trimmed.includes('@')
    ? `mailto:${trimmed}`
    : `tel:${trimmed.replace(/[^\d+]/g, '')}`;
  return (
    <a href={href} className="break-words text-brand-300 underline-offset-2 hover:underline">
      {trimmed}
    </a>
  );
}

function StatusSelect({
  id,
  value,
  onChange,
}: {
  id: string;
  value: LeadStatus;
  onChange: (v: LeadStatus) => void;
}) {
  return (
    <>
      <label htmlFor={`status-${id}`} className="sr-only">
        Durum
      </label>
      <select
        id={`status-${id}`}
        value={value}
        onChange={(e) => onChange(e.target.value as LeadStatus)}
        className={`w-full max-w-[11rem] rounded-lg border px-2 py-1.5 text-xs font-medium focus:outline-none ${toneOf(value)}`}
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s.id} value={s.id} className="bg-surface text-slate-100">
            {s.label}
          </option>
        ))}
      </select>
    </>
  );
}

function NoteField({
  id,
  note,
  setNote,
  onBlur,
  rows,
}: {
  id: string;
  note: string;
  setNote: (v: string) => void;
  onBlur: () => void;
  rows: number;
}) {
  return (
    <>
      <label htmlFor={`note-${id}`} className="sr-only">
        Satış notu
      </label>
      <textarea
        id={`note-${id}`}
        value={note}
        rows={rows}
        maxLength={2000}
        onChange={(e) => setNote(e.target.value)}
        onBlur={onBlur}
        placeholder="Not…"
        className="w-full resize-y rounded-lg border border-white/10 bg-black/30 px-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:border-brand-400 focus:outline-none"
      />
    </>
  );
}

function DeleteButton({
  confirming,
  busy,
  onClick,
  onCancel,
  name,
}: {
  confirming: boolean;
  busy: boolean;
  onClick: () => void;
  onCancel: () => void;
  name: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        aria-label={confirming ? `${name} kaydını kalıcı olarak sil` : `${name} kaydını sil`}
        className={`rounded-lg border px-2 py-1.5 text-xs font-medium disabled:opacity-50 ${
          confirming
            ? 'border-red-400/40 bg-red-500/15 text-red-200'
            : 'border-white/10 text-slate-400 hover:text-red-200'
        }`}
      >
        {confirming ? 'Emin misiniz?' : 'Sil'}
      </button>
      {confirming ? (
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-1.5 py-1.5 text-xs text-slate-400 hover:text-white"
        >
          Vazgeç
        </button>
      ) : null}
    </span>
  );
}

function SavedHint({ saved, error }: { saved: boolean; error: string }) {
  if (error) {
    return (
      <p role="alert" className="mt-1 text-xs text-red-300">
        {error}
      </p>
    );
  }
  return (
    <p
      aria-live="polite"
      className={`mt-1 text-xs text-emerald-300 transition-opacity duration-500 ${
        saved ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {saved ? 'kaydedildi' : ' '}
    </p>
  );
}

function LeadRow(props: RowProps) {
  const { lead } = props;
  const a = useLeadActions(props);

  return (
    <tr className="border-t border-white/5 align-top">
      <td className="whitespace-nowrap px-3 py-3 text-xs tabular-nums text-slate-400">
        {formatDate(lead.createdAt)}
      </td>
      <td className="px-3 py-3 text-sm font-medium text-white">{lead.fullName}</td>
      <td className="max-w-[14rem] px-3 py-3 text-sm">
        <ContactLink value={lead.contactInfo} />
      </td>
      <td className="max-w-[12rem] px-3 py-3 text-sm text-slate-300">{lead.projectType}</td>
      <td className="whitespace-nowrap px-3 py-3 text-xs text-slate-500">
        {SOURCE_LABELS[lead.source] ?? lead.source}
      </td>
      <td className="px-3 py-3">
        <StatusSelect id={lead.id} value={lead.status} onChange={a.changeStatus} />
      </td>
      <td className="min-w-[16rem] px-3 py-3">
        <NoteField id={lead.id} note={a.note} setNote={a.setNote} onBlur={a.saveNote} rows={2} />
        <SavedHint saved={a.saved} error={a.error} />
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <DeleteButton
          confirming={a.confirming}
          busy={a.busy}
          onClick={a.remove}
          onCancel={() => a.setConfirming(false)}
          name={lead.fullName}
        />
      </td>
    </tr>
  );
}

function LeadCard(props: RowProps) {
  const { lead } = props;
  const a = useLeadActions(props);

  return (
    <article className="min-w-0 rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-2">
        <h3 className="min-w-0 break-words text-sm font-semibold text-white">{lead.fullName}</h3>
        <span className="tabular-nums text-xs text-slate-500">{formatDate(lead.createdAt)}</span>
      </div>

      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex min-w-0 gap-2">
          <dt className="w-20 shrink-0 text-xs text-slate-500">İletişim</dt>
          <dd className="min-w-0 flex-1 break-words">
            <ContactLink value={lead.contactInfo} />
          </dd>
        </div>
        <div className="flex min-w-0 gap-2">
          <dt className="w-20 shrink-0 text-xs text-slate-500">Proje</dt>
          <dd className="min-w-0 flex-1 break-words text-slate-300">{lead.projectType}</dd>
        </div>
        <div className="flex min-w-0 gap-2">
          <dt className="w-20 shrink-0 text-xs text-slate-500">Kaynak</dt>
          <dd className="min-w-0 flex-1 break-words text-slate-400">
            {SOURCE_LABELS[lead.source] ?? lead.source}
          </dd>
        </div>
      </dl>

      <div className="mt-3">
        <StatusSelect id={lead.id} value={lead.status} onChange={a.changeStatus} />
      </div>

      <div className="mt-3">
        <NoteField id={lead.id} note={a.note} setNote={a.setNote} onBlur={a.saveNote} rows={3} />
        <SavedHint saved={a.saved} error={a.error} />
      </div>

      <div className="mt-2">
        <DeleteButton
          confirming={a.confirming}
          busy={a.busy}
          onClick={a.remove}
          onCancel={() => a.setConfirming(false)}
          name={lead.fullName}
        />
      </div>
    </article>
  );
}
