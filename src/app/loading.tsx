/** Sayfa geçişlerinde markaya uygun sade bir yükleme göstergesi. */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface" role="status" aria-label="Yükleniyor">
      <span className="inline-flex gap-1.5">
        <span className="h-2 w-2 animate-bounce rounded-full bg-brand-500" style={{ animationDelay: '0ms' }} />
        <span className="h-2 w-2 animate-bounce rounded-full bg-brand-500" style={{ animationDelay: '150ms' }} />
        <span className="h-2 w-2 animate-bounce rounded-full bg-brand-500" style={{ animationDelay: '300ms' }} />
      </span>
    </div>
  );
}
