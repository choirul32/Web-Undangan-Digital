"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { sampleInvitation } from "../data/sampleInvitation";
import { fadeUp } from "./dashboard/config";

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
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-[var(--dash-border)] bg-[var(--dash-canvas)] px-4 py-5 text-[var(--dash-ink)] lg:block">
      <a href="/" className="block text-xl font-semibold">
        NusaInvite
      </a>
      <p className="mt-1 text-xs font-medium text-[var(--dash-muted)]">Admin Workspace</p>

      <nav className="mt-8 space-y-1">
        {menu.map((item) => (
          <a
            key={item.page}
            href={item.href}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
              activePage === item.page
                ? "bg-[var(--dash-ink)] text-white"
                : "text-[var(--dash-muted)] hover:bg-[var(--dash-fog)] hover:text-[var(--dash-ink)]"
            }`}
          >
            {item.label}
            {item.count ? (
              <span className="rounded-md border border-[var(--dash-border)] px-1.5 py-0.5 text-[11px]">{item.count}</span>
            ) : null}
          </a>
        ))}
      </nav>

      <div className="mt-8 rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-fog)]/45 p-4">
        <p className="text-xs font-semibold uppercase text-[var(--dash-muted)]">
          Workflow
        </p>
        <p className="mt-2 text-sm font-semibold text-[var(--dash-ink)]">Manual WA Order</p>
        <p className="mt-2 text-xs leading-5 text-[var(--dash-muted)]">
          Catat order, payment, data undangan, publish, lalu copy broadcast manual.
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
      className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-canvas)] px-3 py-2 text-sm font-semibold text-[var(--dash-ink)] transition-colors hover:bg-[var(--dash-fog)]"
    >
      Logout
    </button>
  );
}

function HeaderPrimaryActions({ activePage, activeInvitationSlug }) {
  const hasActiveOrder = Boolean(activeInvitationSlug);
  const previewUrl = hasActiveOrder
    ? `/preview?slug=${encodeURIComponent(activeInvitationSlug)}`
    : "/preview";

  const dispatchEditorAction = (action) => {
    if (!hasActiveOrder) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent("nusa-invite:active-editor-action", {
        detail: { action },
      }),
    );
  };

  if (activePage !== "invitation-detail") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <a
          href="/dashboard/invitations"
          className="rounded-md bg-[var(--dash-ink)] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--dash-dark)]"
        >
          Create Order
        </a>
        <a
          href="/preview"
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-canvas)] px-3 py-2 text-sm font-semibold text-[var(--dash-ink)] transition-colors hover:bg-[var(--dash-fog)]"
        >
          Preview
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => dispatchEditorAction("save")}
        className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-canvas)] px-3 py-2 text-sm font-semibold text-[var(--dash-ink)] transition-colors hover:bg-[var(--dash-fog)]"
      >
        Save
      </button>
      <a
        href={previewUrl}
        target="_blank"
        rel="noreferrer"
        className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-canvas)] px-3 py-2 text-sm font-semibold text-[var(--dash-ink)] transition-colors hover:bg-[var(--dash-fog)]"
      >
        Preview
      </a>
      <button
        type="button"
        onClick={() => dispatchEditorAction("publish")}
        className="rounded-md bg-[var(--dash-ink)] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--dash-dark)]"
      >
        Publish
      </button>
    </div>
  );
}

function buildDashboardMetrics(data = {}) {
  return [
    {
      label: "Inquiry",
      value: data.inquiry || 0,
      detail: "pesanan baru dari WA",
    },
    {
      label: "Waiting Payment",
      value: data.waitingPayment || 0,
      detail: "menunggu konfirmasi manual",
    },
    {
      label: "In Progress",
      value: data.inProgress || 0,
      detail: "sedang dibuat admin",
    },
    {
      label: "Review",
      value: data.review || 0,
      detail: `${data.published || 0} sudah publish`,
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
  "invitation-detail": {
    eyebrow: "Edit Undangan",
    title: "Workspace undangan aktif",
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

function ActiveInvitationWorkspace({ invitationSlug }) {
  const previewUrl = invitationSlug
    ? `/preview?slug=${encodeURIComponent(invitationSlug)}`
    : "/preview";
  const publicUrl = invitationSlug ? `/u/${invitationSlug}` : "/u/slug-undangan";

  return (
    <>
      <motion.section
        variants={fadeUp}
        className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] p-4 text-[var(--dash-ink)] shadow-[var(--dash-shadow)]"
      >
        <p className="text-xs font-semibold uppercase text-[var(--dash-muted)]">
          Active Invitation
        </p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{invitationSlug || "Draft baru"}</h2>
            <p className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
              Semua panel di bawah ini memakai konteks slug yang sama.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-canvas)] px-4 py-2 text-sm font-semibold text-[var(--dash-ink)] hover:bg-[var(--dash-fog)]"
            >
              Preview
            </a>
            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-[var(--dash-ink)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--dash-dark)]"
            >
              Public URL
            </a>
          </div>
        </div>
      </motion.section>
      <InvitationFormPanel invitationSlug={invitationSlug} />
      <ContentManagers invitationSlug={invitationSlug} />
      <MediaManager invitationSlug={invitationSlug} />
      <GuestManager invitationSlug={invitationSlug} />
      <RSVPManager invitationSlug={invitationSlug} />
    </>
  );
}

function DashboardMainContent({ activePage, metrics, activeInvitationSlug }) {
  if (activePage === "invitation-detail") {
    return <ActiveInvitationWorkspace invitationSlug={activeInvitationSlug} />;
  }

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
      </>
    );
  }

  return <ActivityFeed />;
}

export default function Dashboard({
  session,
  activePage = "overview",
  activeInvitationSlug = "",
}) {
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
        inquiry: 0,
        waitingPayment: 0,
        inProgress: 1,
        review: 0,
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
    <main className="dashboard-ui min-h-screen bg-[var(--dash-fog)] text-[var(--dash-ink)]">
      <div className="flex">
        <Sidebar activePage={activePage} />
        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-[var(--dash-border)] bg-[var(--dash-canvas)]/92 px-5 py-3 backdrop-blur-xl sm:px-6">
            <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--dash-muted)]">
                  {meta.eyebrow}
                </p>
                <h1 className="mt-0.5 text-2xl font-semibold text-[var(--dash-ink)] sm:text-3xl">
                  {meta.title}
                </h1>
                {activeInvitationSlug ? (
                  <p className="mt-1 text-xs font-medium text-[var(--dash-muted)]">
                    Active order: <span className="font-semibold text-[var(--dash-ink)]">{activeInvitationSlug}</span>
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center justify-end gap-3">
                <HeaderPrimaryActions
                  activePage={activePage}
                  activeInvitationSlug={activeInvitationSlug}
                />
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-[var(--dash-ink)]">
                    {session?.email}
                  </p>
                  <p className="text-xs font-medium uppercase text-[var(--dash-muted)]">
                    {session?.mode === "dev" ? "Dev Mode" : "Admin"}
                  </p>
                </div>
                <a
                  href="/"
                  className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-canvas)] px-3 py-2 text-sm font-semibold text-[var(--dash-ink)] transition-colors hover:bg-[var(--dash-fog)]"
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
            className={`mx-auto grid max-w-[1440px] gap-5 px-5 py-6 sm:px-6 ${
              showAside ? "lg:grid-cols-[1fr_360px]" : ""
            }`}
          >
            <div className="space-y-6">
              <DashboardMainContent
                activePage={activePage}
                metrics={metrics}
                activeInvitationSlug={activeInvitationSlug}
              />
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
