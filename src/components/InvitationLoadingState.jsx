export function InvitationLoadingState({
  title = "Menyiapkan Undangan",
  description = "Sebentar lagi undangan siap dibuka.",
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e8edf2] px-4">
      <div className="relative min-h-screen w-full max-w-[412px] overflow-hidden bg-[var(--color-bg)] px-8 text-center lg:border-x lg:border-black/10 lg:shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full border border-[var(--color-accent)]/25" />
        <div className="pointer-events-none absolute -right-20 top-20 h-56 w-56 rounded-full border border-[var(--color-accent)]/15" />
        <div className="pointer-events-none absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/35 to-transparent" />
        <div className="pointer-events-none absolute inset-x-8 bottom-8 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/35 to-transparent" />

        <div className="flex min-h-screen flex-col items-center justify-center py-14">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-[var(--color-accent)]/25" />
            <span className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-t-[var(--color-accent)] border-r-[var(--color-accent)]/60" />
            <span className="absolute inset-5 rounded-full bg-[var(--color-surface)] shadow-[0_18px_48px_rgba(15,23,42,0.12)]" />
            <span className="relative font-serif text-2xl font-black text-[var(--color-heading)]">
              N
            </span>
          </div>

          <p className="mt-8 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--color-accent)]">
            Digital Invitation
          </p>
          <h1 className="mt-3 font-serif text-3xl font-black leading-tight text-[var(--color-heading)]">
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-[260px] text-sm font-medium leading-6 text-[var(--color-text)]/70">
            {description}
          </p>

          <div className="mt-10 w-full max-w-[260px] space-y-3">
            <div className="h-2 overflow-hidden rounded-full bg-[var(--color-accent)]/12">
              <div className="h-full w-1/2 animate-[loading-slide_1.15s_ease-in-out_infinite] rounded-full bg-[var(--color-accent)]" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="h-1.5 rounded-full bg-[var(--color-accent)]/30" />
              <span className="h-1.5 rounded-full bg-[var(--color-accent)]/18" />
              <span className="h-1.5 rounded-full bg-[var(--color-accent)]/10" />
            </div>
          </div>
        </div>
        <style>{`
          @keyframes loading-slide {
            0% { transform: translateX(-110%); }
            55% { transform: translateX(70%); }
            100% { transform: translateX(230%); }
          }
        `}</style>
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
