"use client";

import { useState } from "react";

function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon({ isVisible }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {isVisible ? (
        <>
          <path d="M2.06 12.35a1 1 0 0 1 0-.7C3.63 7.7 7.48 5 12 5s8.37 2.7 9.94 6.65a1 1 0 0 1 0 .7C20.37 16.3 16.52 19 12 19s-8.37-2.7-9.94-6.65Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="m2 2 20 20" />
          <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88" />
          <path d="M6.1 6.1C4.25 7.36 2.84 9.27 2.06 11.65a1 1 0 0 0 0 .7C3.63 16.3 7.48 19 12 19c1.96 0 3.78-.5 5.35-1.38" />
          <path d="M13.73 5.15A10.5 10.5 0 0 1 21.94 11.65a1 1 0 0 1 0 .7 10.7 10.7 0 0 1-2.25 3.51" />
        </>
      )}
    </svg>
  );
}

export default function DashboardLoginCard({
  email,
  password,
  message,
  isSubmitting,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isError = message && !/memproses/i.test(message);

  return (
    <main className="dashboard-ui theme-light palette-mono-slate min-h-screen bg-[#f4f6f8] text-[var(--dash-ink)] [&_*]:tracking-normal">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-slate-200 pb-5">
          <a href="/" className="flex items-center gap-3 text-[var(--dash-ink)]">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--dash-ink)] text-sm font-black text-white">
              WU
            </span>
            <span>
              <span className="block text-sm font-black uppercase leading-none text-[var(--dash-ink)]">
                Web Undangan
              </span>
              <span className="mt-1 block text-xs font-semibold text-[var(--dash-muted)]">
                Admin Dashboard
              </span>
            </span>
          </a>
          <span className="hidden rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[var(--dash-muted)] shadow-sm sm:inline-flex">
            Private access
          </span>
        </header>

        <div className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_430px] lg:py-14">
          <section className="max-w-xl">
            <p className="text-sm font-black uppercase text-[var(--dash-muted)]">
              Panel pengelolaan undangan
            </p>
            <h1 className="mt-4 text-3xl font-black leading-tight text-[var(--dash-ink)] sm:text-5xl">
              Masuk untuk lanjut mengelola pesanan, template, dan konten.
            </h1>
            <p className="mt-4 max-w-lg text-base font-medium leading-7 text-[var(--dash-muted)]">
              Area ini khusus admin. Setelah login, kamu bisa membuka daftar undangan,
              RSVP, media, konten katalog, dan pengaturan dashboard.
            </p>
            <div className="mt-8 grid max-w-lg gap-3 sm:grid-cols-3">
              {[
                ["Template", "Atur tema undangan"],
                ["RSVP", "Pantau tamu masuk"],
                ["Konten", "Kelola bank & QRIS"],
              ].map(([title, desc]) => (
                <div
                  key={title}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
                >
                  <p className="text-sm font-black text-[var(--dash-ink)]">{title}</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-[var(--dash-muted)]">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="w-full rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <p className="text-xs font-black uppercase text-[var(--dash-muted)]">
                Admin Login
              </p>
              <h2 className="mt-2 text-2xl font-black text-[var(--dash-ink)]">
                Masuk Dashboard
              </h2>
              <p className="mt-2 text-sm font-medium leading-6 text-[var(--dash-muted)]">
                Gunakan akun admin yang sudah terdaftar.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5 px-6 py-6">
              <label className="block">
                <span className="text-sm font-bold text-[var(--dash-ink)]">Email</span>
                <span className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 text-[var(--dash-muted)] transition-colors focus-within:border-[var(--dash-ink)] focus-within:ring-4 focus-within:ring-slate-900/5">
                  <MailIcon />
                  <input
                    type="email"
                    value={email}
                    onChange={onEmailChange}
                    className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[var(--dash-ink)] outline-none placeholder:text-[var(--dash-subtle)]"
                    placeholder="admin@email.com"
                    required
                    autoComplete="email"
                  />
                </span>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-[var(--dash-ink)]">Password</span>
                <span className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 text-[var(--dash-muted)] transition-colors focus-within:border-[var(--dash-ink)] focus-within:ring-4 focus-within:ring-slate-900/5">
                  <LockIcon />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={onPasswordChange}
                    className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[var(--dash-ink)] outline-none placeholder:text-[var(--dash-subtle)]"
                    placeholder="Masukkan password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[var(--dash-muted)] transition-colors hover:bg-slate-100 hover:text-[var(--dash-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    <EyeIcon isVisible={showPassword} />
                  </button>
                </span>
              </label>

              {message ? (
                <div
                  className={`rounded-lg border px-4 py-3 text-sm font-semibold ${
                    isError
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-slate-200 bg-slate-50 text-[var(--dash-muted)]"
                  }`}
                >
                  {message}
                </div>
              ) : null}

              <button
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--dash-ink)] px-5 py-3.5 text-sm font-black text-white transition-colors hover:bg-[var(--dash-dark)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Memproses
                  </>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
