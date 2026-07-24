"use client";

import LocalGuestManager from "../../../components/customer/LocalGuestManager";

export default function CustomerGuestManagerPage({ invitationSlug = "" }) {
  return (
    <main className="dashboard-ui theme-light palette-royal-gold min-h-screen bg-[var(--dash-fog)] px-4 py-6 text-[var(--dash-ink)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] p-5 shadow-[var(--dash-shadow)]">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--dash-muted)]">
            NusaInvite
          </p>
          <h1 className="mt-1 text-3xl font-black text-[var(--dash-ink)]">
            Kelola Daftar Tamu
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[var(--dash-muted)]">
            Masukkan nama tamu, buat link personal, lalu salin template WhatsApp tanpa masuk dashboard admin.
          </p>
        </header>

        <LocalGuestManager invitationSlug={invitationSlug} />
      </div>
    </main>
  );
}
