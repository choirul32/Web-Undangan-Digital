"use client";

export default function DashboardLoginCard({
  email,
  password,
  message,
  isSubmitting,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}) {
  return (
    <main className="dashboard-ui theme-light palette-royal-gold relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--dash-fog)] px-6 py-16 text-[var(--dash-ink)] nusantara-pattern">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,169,107,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(31,42,68,0.1),transparent_30%)]" />
      <section className="relative w-full max-w-md rounded-[18px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] p-8 shadow-[var(--dash-shadow)] backdrop-blur-xl">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--dash-muted)]">
          Admin Login
        </p>
        <h1 className="mt-3 text-4xl font-black text-[var(--dash-ink)]">
          Masuk Dashboard
        </h1>
        <p className="mt-3 text-base font-semibold leading-7 text-[var(--dash-muted)]">
          Gunakan akun admin Supabase untuk mengelola undangan digital.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm font-black uppercase tracking-[0.12em] text-[var(--dash-muted)]">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={onEmailChange}
              className="mt-2 w-full rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-canvas)] px-4 py-3 text-base font-bold text-[var(--dash-ink)] outline-none transition-colors placeholder:text-[var(--dash-subtle)] focus:border-[var(--color-accent)]"
              required
              autoComplete="email"
            />
          </label>
          <label className="block">
            <span className="text-sm font-black uppercase tracking-[0.12em] text-[var(--dash-muted)]">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={onPasswordChange}
              className="mt-2 w-full rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-canvas)] px-4 py-3 text-base font-bold text-[var(--dash-ink)] outline-none transition-colors placeholder:text-[var(--dash-subtle)] focus:border-[var(--color-accent)]"
              required
              autoComplete="current-password"
            />
          </label>
          <button
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-[var(--dash-ink)] px-5 py-4 text-base font-black text-white transition-colors hover:bg-[var(--dash-dark)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Loading..." : "Login"}
          </button>
        </form>

        {message ? (
          <p className="mt-5 text-center text-sm font-bold text-[var(--dash-muted)]">
            {message}
          </p>
        ) : null}
      </section>
    </main>
  );
}
