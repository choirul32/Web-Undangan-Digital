"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { sampleInvitation } from "../data/sampleInvitation";
import { fadeUp } from "./dashboard/config";
import { Field, TextInput, SelectInput } from "./dashboard/FormControls";

// Page components
import { MetricCard, InvitationTable, QuickCreateCard, TemplateHighlights, ActivityFeed } from "./dashboard/Overview";
import GuestManager from "./dashboard/GuestManager";
import RSVPManager from "./dashboard/RSVPManager";
import MediaManager from "./dashboard/MediaManager";
import ContentManagers from "./dashboard/ContentManagers";
import InvitationFormPanel from "./dashboard/InvitationForm";
import TemplateAdminPage from "./dashboard/TemplateAdmin";
import SettingsPage from "./dashboard/SettingsPage";

function Sidebar({ activePage = "overview" }) {
  const menu = [
    { label: "Overview", page: "overview", href: "/dashboard" },
    { label: "Undangan", page: "invitations", href: "/dashboard/invitations", count: 5 },
    { label: "Template", page: "templates", href: "/dashboard/templates" },
    { label: "RSVP", page: "rsvps", href: "/dashboard/rsvps" },
    { label: "Tamu", page: "guests", href: "/dashboard/guests" },
    { label: "Media", page: "media", href: "/dashboard/media" },
    { label: "Konten", page: "content", href: "/dashboard/content" },
    { label: "Pengaturan", page: "settings", href: "/dashboard/settings" },
  ];

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-[var(--color-accent-pale)]/55 bg-[var(--color-primary)] px-6 py-7 text-white lg:block">
      <a href="/" className="block text-2xl font-black">
        NusaInvite
      </a>
      <p className="mt-2 text-sm font-semibold text-white/62">Admin Workspace</p>

      <nav className="mt-10 space-y-2">
        {menu.map((item) => (
          <a
            key={item.page}
            href={item.href}
            className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-base font-black transition-colors ${
              activePage === item.page
                ? "bg-[var(--color-accent)] text-[var(--color-primary)]"
                : "text-white/78 hover:bg-white/8 hover:text-white"
            }`}
          >
            {item.label}
            {item.count ? (
              <span className="rounded-full bg-white/12 px-2 py-0.5 text-xs">{item.count}</span>
            ) : null}
          </a>
        ))}
      </nav>

      <div className="mt-10 rounded-[8px] border border-white/12 bg-white/8 p-5">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent-soft)]">
          Next Step
        </p>
        <p className="mt-3 text-lg font-black">Hubungkan Supabase</p>
        <p className="mt-2 text-sm leading-6 text-white/68">
          Auth, database, storage foto, RSVP, dan publikasi slug akan masuk di fase berikutnya.
        </p>
      </div>
    </aside>
  );
}

function LogoutButton() {
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <button
      type="button"
      onClick={logout}
      className="rounded-2xl border border-[var(--color-accent-pale)] bg-[var(--color-surface)] px-4 py-3 text-sm font-black text-[var(--color-text)] transition-colors hover:bg-white"
    >
      Logout
    </button>
  );
}

function buildDashboardMetrics(data = {}) {
  return [
    {
      label: "Undangan",
      value: data.invitations || 0,
      detail: `${data.activeThisMonth || 0} aktif bulan ini`,
    },
    {
      label: "RSVP",
      value: data.rsvps || 0,
      detail: `${data.rsvpPax || 0} orang dikonfirmasi`,
    },
    {
      label: "Tamu",
      value: data.guests || 0,
      detail: "undangan dikirim",
    },
    {
      label: "Status",
      value: data.published || 0,
      detail: `${data.revision || 0} revisi tertunda`,
    },
  ];
}

const pageMeta = {
  overview: {
    eyebrow: "Dashboard",
    title: "Kelola undangan digital",
  },
  invitations: {
    eyebrow: "Undangan",
    title: "Data undangan & draft",
  },
  templates: {
    eyebrow: "Template",
    title: "Katalog template admin",
  },
  rsvps: {
    eyebrow: "RSVP",
    title: "Konfirmasi kehadiran",
  },
  guests: {
    eyebrow: "Tamu",
    title: "Guest manager",
  },
  media: {
    eyebrow: "Media",
    title: "Media undangan",
  },
  settings: {
    eyebrow: "Pengaturan",
    title: "Pengaturan workspace",
  },
  content: {
    eyebrow: "Konten",
    title: "Acara, love story, dan amplop",
  },
};

function DashboardMainContent({ activePage, metrics }) {
  if (activePage === "invitations") {
    return (
      <>
        <InvitationTable />
        <InvitationFormPanel />
      </>
    );
  }

  if (activePage === "templates") {
    return <TemplateAdminPage />;
  }

  if (activePage === "rsvps") {
    return <RSVPManager />;
  }

  if (activePage === "guests") {
    return <GuestManager />;
  }

  if (activePage === "media") {
    return <MediaManager />;
  }

  if (activePage === "content") {
    return <ContentManagers />;
  }

  if (activePage === "settings") {
    return <SettingsPage />;
  }

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>
      <InvitationTable />
      <RSVPManager />
    </>
  );
}

function DashboardAside({ activePage }) {
  if (activePage === "invitations") {
    return (
      <>
        <QuickCreateCard />
        <TemplateHighlights />
      </>
    );
  }

  if (activePage === "templates") {
    return (
      <>
        <TemplateHighlights />
        <ActivityFeed />
      </>
    );
  }

  if (activePage === "overview") {
    return (
      <>
        <QuickCreateCard />
        <TemplateHighlights />
        <ActivityFeed />
      </>
    );
  }

  return <ActivityFeed />;
}

export default function Dashboard({ session, activePage = "overview" }) {
  const fallbackMetrics = useMemo(
    () =>
      buildDashboardMetrics({
        invitations: 1,
        activeThisMonth: 1,
        rsvps: sampleInvitation.rsvps.length,
        rsvpPax: sampleInvitation.rsvps.reduce(
          (total, item) => total + Number(item.pax || 0),
          0,
        ),
        published: 1,
        revision: 0,
        guests: sampleInvitation.guests.length,
      }),
    [],
  );
  const [metrics, setMetrics] = useState(fallbackMetrics);
  const meta = pageMeta[activePage] || pageMeta.overview;
  const showAside = activePage === "overview";

  useEffect(() => {
    let isMounted = true;

    fetch("/api/dashboard/stats")
      .then((response) => response.json())
      .then((result) => {
        if (isMounted && result.data) {
          setMetrics(buildDashboardMetrics(result.data));
        }
      })
      .catch(() => {
        if (isMounted) {
          setMetrics(fallbackMetrics);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fallbackMetrics]);

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-primary)]">
      <div className="flex">
        <Sidebar activePage={activePage} />
        <section className="min-w-0 flex-1">
          <header className="top-0 z-30 border-b border-[var(--color-accent-pale)]/55 bg-[var(--color-bg)]/88 px-5 py-4 backdrop-blur-xl sm:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]">
                  {meta.eyebrow}
                </p>
                <h1 className="mt-1 text-3xl font-black text-[var(--color-primary)] sm:text-4xl">
                  {meta.title}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-black text-[var(--color-primary)]">
                    {session?.email}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent)]">
                    {session?.mode === "dev" ? "Dev Mode" : "Admin"}
                  </p>
                </div>
                <a
                  href="/"
                  className="rounded-2xl border border-[var(--color-accent-pale)] bg-[var(--color-surface)] px-4 py-3 text-sm font-black text-[var(--color-text)] transition-colors hover:bg-white"
                >
                  Landing
                </a>
                <LogoutButton />
              </div>
            </div>
          </header>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
            className={`mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 ${
              showAside ? "lg:grid-cols-[1fr_360px]" : ""
            }`}
          >
            <div className="space-y-6">
              <DashboardMainContent activePage={activePage} metrics={metrics} />
            </div>
            {showAside ? (
              <aside className="space-y-6">
                <DashboardAside activePage={activePage} />
              </aside>
            ) : null}
          </motion.div>
        </section>
      </div>
    </main>
  );
}
