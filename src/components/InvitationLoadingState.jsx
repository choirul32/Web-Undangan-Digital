export function InvitationLoadingState({
  title = "Memuat undangan...",
  description = "Mohon tunggu sebentar, kami sedang menyiapkan detail undangan.",
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e8edf2] px-6">
      <div className="min-h-screen w-full max-w-[412px] bg-[var(--color-bg)] px-8 py-14 text-center lg:border-x lg:border-black/10 lg:shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="mx-auto mt-16 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-accent)] border-r-transparent" />
        </div>
        <p className="mt-6 font-serif text-2xl font-bold text-[var(--color-heading)]">
          {title}
        </p>
        <p className="mx-auto mt-2 max-w-[280px] text-sm font-medium leading-6 text-[var(--color-text)]/70">
          {description}
        </p>
        <div className="mt-10 space-y-4">
          <div className="mx-auto h-4 w-40 animate-pulse rounded-full bg-[var(--color-accent)]/15" />
          <div className="mx-auto h-24 w-full max-w-[280px] animate-pulse rounded-[28px] bg-white/70 shadow-sm" />
          <div className="mx-auto grid max-w-[280px] grid-cols-3 gap-3">
            <div className="h-16 animate-pulse rounded-2xl bg-white/70" />
            <div className="h-16 animate-pulse rounded-2xl bg-white/70" />
            <div className="h-16 animate-pulse rounded-2xl bg-white/70" />
          </div>
        </div>
      </div>
    </main>
  );
}

export function InvitationErrorState({
  title = "Undangan tidak ditemukan",
  description = "Periksa kembali link undangan yang dibagikan.",
  actionLabel,
  onAction,
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e8edf2] px-6">
      <div className="flex min-h-screen w-full max-w-[412px] flex-col items-center justify-center bg-[var(--color-bg)] px-8 text-center lg:border-x lg:border-black/10 lg:shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl font-black text-red-600">
          !
        </div>
        <h1 className="mt-6 font-serif text-3xl font-bold text-[var(--color-heading)]">
          {title}
        </h1>
        <p className="mt-3 text-sm font-medium leading-6 text-[var(--color-text)]/70">
          {description}
        </p>
        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="mt-6 rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white shadow-sm"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </main>
  );
}
