"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "./dashboard/config";

// Page components
import {
  MetricCard,
  InvitationTable,
  TemplateHighlights,
  ActivityFeed,
  OverviewAlertStrip,
  RSVPSnapshotCard,
  QuickActionsCard,
} from "./dashboard/Overview";
import GuestManager from "./dashboard/GuestManager";
import RSVPManager from "./dashboard/RSVPManager";
import MediaManager from "./dashboard/MediaManager";
import ContentManagers from "./dashboard/ContentManagers";
import InvitationFormPanel from "./dashboard/InvitationForm";
import TemplateAdminPage from "./dashboard/TemplateAdmin";
import OrnamentManager from "./dashboard/OrnamentManager";
import SettingsPage from "./dashboard/SettingsPage";
import RsvpNotifications from "./dashboard/RsvpNotifications";
import AnalyticsManager from "./dashboard/AnalyticsManager";

function Sidebar({
  activePage = "overview",
  collapsed = false,
  onToggleCollapse,
  invitationCount = 0,
  templateCount = 0,
}) {
  const menu = [
    { label: "Overview", page: "overview", href: "/dashboard", icon: "dashboard" },
    { label: "Undangan", page: "invitations", href: "/dashboard/invitations", count: invitationCount, icon: "mail" },
    { label: "Template", page: "templates", href: "/dashboard/templates", count: templateCount, icon: "style" },
    { label: "Ornamen", page: "ornaments", href: "/dashboard/ornaments", icon: "ornament" },
    { label: "Tamu", page: "guests", href: "/dashboard/guests", icon: "group" },
    { label: "Pengaturan", page: "settings", href: "/dashboard/settings", icon: "settings" },
  ];

  const SidebarIcon = ({ name }) => {
    const base = { viewBox: "0 0 24 24", className: "h-4 w-4", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" };
    if (name === "dashboard") return <svg {...base}><rect x="3" y="3" width="8" height="8" /><rect x="13" y="3" width="8" height="5" /><rect x="13" y="10" width="8" height="11" /><rect x="3" y="13" width="8" height="8" /></svg>;
    if (name === "mail") return <svg {...base}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
    if (name === "style") return <svg {...base}><path d="m7 7 10 10" /><path d="M8 15 4 19" /><path d="M16 9 20 5" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>;
    if (name === "ornament") return <svg {...base}><path d="M12 3c2.5 3.2 4.9 5.4 8 6-1.2 3.5-3.4 5.8-8 12C7.4 14.8 5.2 12.5 4 9c3.1-.6 5.5-2.8 8-6Z" /><path d="M12 3v18" /><path d="M8 10h8" /></svg>;
    if (name === "group") return <svg {...base}><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 19a6 6 0 0 1 12 0" /><path d="M14 19a4.5 4.5 0 0 1 7 0" /></svg>;
    if (name === "settings") return <svg {...base}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 0 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.2a1.7 1.7 0 0 0 1 1.5h0a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1Z" /></svg>;
    return <svg {...base}><circle cx="12" cy="12" r="9" /></svg>;
  };

  return (
    <aside
      className={`sticky top-0 hidden h-screen shrink-0 overflow-y-auto border-r border-[var(--dash-border)] bg-[var(--dash-canvas)] py-5 text-[var(--dash-ink)] lg:block ${collapsed ? "w-20 px-2" : "w-56 px-3"}`}
    >
      <button
        type="button"
        onClick={onToggleCollapse}
        className="absolute -right-4 top-6 z-20 flex h-9 w-6 items-center justify-center rounded-r-xl rounded-l-md border border-[var(--dash-border)] bg-[var(--dash-canvas)] text-[var(--dash-muted)] shadow-[0_4px_14px_rgba(15,23,42,0.12)] transition-all hover:w-7 hover:text-[var(--dash-ink)] hover:bg-[var(--dash-fog)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-ink)]/20"
        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="m8 4 6 6-6 6" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 4-6 6 6 6" />
          </svg>
        )}
      </button>
      <a href="/" className={`block text-xl font-semibold ${collapsed ? "text-center text-base" : ""}`}>
        {collapsed ? "N" : "NusaInvite"}
      </a>
      {!collapsed ? (
        <p className="mt-1 text-xs font-medium text-[var(--dash-muted)]">Admin Workspace</p>
      ) : null}

      <nav className="mt-8 space-y-1">
        {menu.map((item) => (
          <a
            key={item.page}
            href={item.href}
            className={`flex w-full items-center ${collapsed ? "justify-center" : "justify-between"} rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
              activePage === item.page
                ? "bg-[var(--dash-ink)] text-white"
                : "text-[var(--dash-muted)] hover:bg-[var(--dash-fog)] hover:text-[var(--dash-ink)]"
            }`}
            title={collapsed ? item.label : undefined}
          >
            <span className="flex items-center gap-2">
              <SidebarIcon name={item.icon} />
              {!collapsed ? item.label : null}
            </span>
            {!collapsed && item.count ? (
              <span className="rounded-md border border-[var(--dash-border)] px-1.5 py-0.5 text-[11px]">{item.count}</span>
            ) : null}
          </a>
        ))}
      </nav>

      {!collapsed ? (
        <div className="mt-8 rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-fog)]/45 p-4">
          <p className="text-xs font-semibold uppercase text-[var(--dash-muted)]">
            Workflow
          </p>
          <p className="mt-2 text-sm font-semibold text-[var(--dash-ink)]">Manual WA Order</p>
          <p className="mt-2 text-xs leading-5 text-[var(--dash-muted)]">
            Catat order, payment, data undangan, publish, lalu copy broadcast manual.
          </p>
        </div>
      ) : null}
    </aside>
  );
}

function LogoutButton({ session }) {
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const email = session?.email || "";
  const initial = (email.trim()[0] || "A").toUpperCase();

  return (
    <details className="relative">
      <summary
        className="list-none flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[var(--dash-border)] bg-[var(--dash-ink)] text-sm font-semibold text-white transition-colors hover:bg-[var(--dash-dark)]"
        title={email || "Akun"}
      >
        {initial}
      </summary>
      <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-canvas)] p-2 shadow-xl">
        <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
          {session?.mode === "dev" ? "Dev Mode" : "Admin"}
        </p>
        {email ? (
          <p className="truncate px-3 pb-2 text-sm font-semibold text-[var(--dash-ink)]" title={email}>
            {email}
          </p>
        ) : null}
        <a
          href="/"
          className="block rounded-lg px-3 py-2 text-sm font-semibold text-[var(--dash-ink)] transition-colors hover:bg-[var(--dash-fog)]"
        >
          Landing
        </a>
        <button
          type="button"
          onClick={logout}
          className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-[var(--dash-ink)] transition-colors hover:bg-[var(--dash-fog)]"
        >
          Logout
        </button>
      </div>
    </details>
  );
}

function HeaderPrimaryActions({ activePage, activeInvitationSlug }) {
  const hasActiveOrder = Boolean(activeInvitationSlug);
  const previewUrl = hasActiveOrder
    ? `/preview?slug=${encodeURIComponent(activeInvitationSlug)}`
    : "/preview";
  const publicUrl = hasActiveOrder
    ? `/${encodeURIComponent(activeInvitationSlug)}`
    : "";

  if (activePage !== "invitation-detail") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <a
          href="/dashboard/invitations/new"
          className="rounded-md bg-[var(--dash-ink)] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--dash-dark)]"
        >
          Buat Order
        </a>
      </div>
    );
  }

  if (!hasActiveOrder) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={previewUrl}
        target="_blank"
        rel="noreferrer"
        className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-canvas)] px-3 py-2 text-sm font-semibold text-[var(--dash-ink)] transition-colors hover:bg-[var(--dash-fog)]"
      >
        Pratinjau
      </a>
      <a
        href={publicUrl}
        target="_blank"
        rel="noreferrer"
        className="rounded-md bg-[var(--dash-ink)] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--dash-dark)]"
      >
        Link Publish
      </a>
    </div>
  );
}

function buildDashboardMetrics(data = {}) {
  return [
    {
      label: "Total Undangan",
      value: data.invitations || 0,
      detail: `${data.activeThisMonth || 0} aktif bulan ini`,
      icon: "invitations",
    },
    {
      label: "Tayang",
      value: data.published || 0,
      detail: "undangan aktif",
      icon: "published",
    },
    {
      label: "Menunggu Pembayaran",
      value: data.waitingPayment || 0,
      detail: "perlu follow-up",
      icon: "payment",
    },
    {
      label: "Total RSVP Pax",
      value: data.rsvpPax || 0,
      detail: "estimasi tamu hadir",
      icon: "groups",
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
  ornaments: {
    eyebrow: "Ornamen",
    title: "Library ornamen",
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
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState("order");
  const workspaceTabs = [
    { id: "order", label: "Informasi Utama" },
    { id: "events", label: "Acara", requiresOrder: true },
    { id: "story", label: "Cerita", requiresOrder: true },
    { id: "gift", label: "Amplop", requiresOrder: true },
    { id: "media", label: "Media", requiresOrder: true },
    { id: "guests", label: "Tamu", requiresOrder: true },
    { id: "rsvp", label: "RSVP", requiresOrder: true },
    { id: "analytics", label: "Statistik", requiresOrder: true },
  ];

  const renderActiveWorkspaceTab = () => {
    if (activeWorkspaceTab === "events") {
      return <ContentManagers invitationSlug={invitationSlug} section="events" />;
    }

    if (activeWorkspaceTab === "story") {
      return <ContentManagers invitationSlug={invitationSlug} section="story" />;
    }

    if (activeWorkspaceTab === "gift") {
      return <ContentManagers invitationSlug={invitationSlug} section="gift" />;
    }

    if (activeWorkspaceTab === "media") {
      return <MediaManager invitationSlug={invitationSlug} />;
    }

    if (activeWorkspaceTab === "guests") {
      return <GuestManager invitationSlug={invitationSlug} />;
    }

    if (activeWorkspaceTab === "rsvp") {
      return <RSVPManager invitationSlug={invitationSlug} />;
    }

    if (activeWorkspaceTab === "analytics") {
      return <AnalyticsManager invitationSlug={invitationSlug} />;
    }

    return <InvitationFormPanel invitationSlug={invitationSlug} />;
  };

  return (
    <>
      <nav className="overflow-x-auto rounded-[18px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] p-1.5 shadow-[var(--dash-shadow)]">
        <div className="flex min-w-max gap-1.5">
          {workspaceTabs.map((tab) => {
            const disabled = tab.requiresOrder && !invitationSlug;
            const active = activeWorkspaceTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                disabled={disabled}
                onClick={() => setActiveWorkspaceTab(tab.id)}
                className={`rounded-[14px] px-4 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-[var(--dash-ink)] text-white"
                    : "text-[var(--dash-muted)] hover:bg-[var(--dash-fog)] hover:text-[var(--dash-ink)]"
                } disabled:cursor-not-allowed disabled:opacity-35`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
      {renderActiveWorkspaceTab()}
    </>
  );
}

function DashboardMainContent({ activePage, metrics, activeInvitationSlug, stats }) {
  if (activePage === "invitation-detail") {
    return <ActiveInvitationWorkspace invitationSlug={activeInvitationSlug} />;
  }

  if (activePage === "invitations") {
    return (
      <div className="space-y-6">
        <div>
          <div>
            <h2 className="text-3xl font-black text-[var(--color-primary)]">Manajemen Undangan</h2>
            <p className="mt-1 text-sm font-semibold text-[var(--color-text)]/80">
              Kelola order dari pengerjaan, peninjauan pelanggan, sampai undangan tayang.
            </p>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-12">
            <InvitationTable variant="invitations" />
          </div>
        </div>
      </div>
    );
  }

  if (activePage === "templates") {
    return <TemplateAdminPage />;
  }

  if (activePage === "ornaments") {
    return <OrnamentManager />;
  }

  if (activePage === "rsvps") {
    return <RSVPManager invitationSlug={activeInvitationSlug} />;
  }

  if (activePage === "guests") {
    return <GuestManager invitationSlug={activeInvitationSlug} />;
  }

  if (activePage === "media") {
    return <MediaManager invitationSlug={activeInvitationSlug} />;
  }

  if (activePage === "content") {
    return <ContentManagers invitationSlug={activeInvitationSlug} />;
  }

  if (activePage === "settings") {
    return <SettingsPage />;
  }

  return (
    <>
      <OverviewAlertStrip pendingCount={(stats?.inProgress || 0) + (stats?.review || 0)} />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <InvitationTable variant="overview" />
        </div>
        <div className="space-y-6">
          <RSVPSnapshotCard stats={stats} />
          <QuickActionsCard />
        </div>
      </div>
    </>
  );
}

function DashboardAside({ activePage }) {
  if (activePage === "invitations") {
    return (
      <>
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
    return null;
  }

  return <ActivityFeed />;
}

export default function Dashboard({
  session,
  activePage = "overview",
  activeInvitationSlug = "",
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarReady, setIsSidebarReady] = useState(false);
  const [dashboardTheme, setDashboardTheme] = useState("light");
  const [dashboardPalette, setDashboardPalette] = useState("royal-gold");
  const [isThemeReady, setIsThemeReady] = useState(false);
  const fallbackMetrics = useMemo(
    () =>
      buildDashboardMetrics({
        invitations: 0,
        activeThisMonth: 0,
        rsvps: 0,
        rsvpPax: 0,
        published: 0,
        revision: 0,
        guests: 0,
        inquiry: 0,
        waitingPayment: 0,
        inProgress: 0,
        review: 0,
      }),
    [],
  );
  const [metrics, setMetrics] = useState(fallbackMetrics);
  const [stats, setStats] = useState({
    invitations: 0,
    activeThisMonth: 0,
    rsvpPax: 0,
    published: 0,
    waitingPayment: 0,
    inProgress: 0,
    review: 0,
    rsvpHadir: 0,
    rsvpTidakHadir: 0,
    rsvpBelum: 0,
  });
  const [templateCount, setTemplateCount] = useState(0);
  const meta = pageMeta[activePage] || pageMeta.overview;
  const showAside = false;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("nusa-invite:sidebar-collapsed");
      if (raw !== null) {
        setIsSidebarCollapsed(raw === "1");
      }
    } catch {}
    setIsSidebarReady(true);
  }, []);

  useEffect(() => {
    if (!isSidebarReady) return;
    try {
      window.localStorage.setItem(
        "nusa-invite:sidebar-collapsed",
        isSidebarCollapsed ? "1" : "0",
      );
    } catch {}
  }, [isSidebarCollapsed, isSidebarReady]);

  useEffect(() => {
    const resolveTheme = (rawTheme) => {
      if (rawTheme === "dark") {
        return "dark";
      }
      if (rawTheme === "system") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      return "light";
    };

    const readThemeFromStorage = () => {
      try {
        const raw = window.localStorage.getItem("nusa-invite:platform-settings");
        const parsed = raw ? JSON.parse(raw) : null;
        setDashboardTheme(resolveTheme(parsed?.dashboardTheme));
        setDashboardPalette(parsed?.dashboardPalette || "royal-gold");
      } catch {
        setDashboardTheme("light");
        setDashboardPalette("royal-gold");
      } finally {
        setIsThemeReady(true);
      }
    };

    const onSettingsUpdated = (event) => {
      const rawTheme = event.detail?.settings?.dashboardTheme;
      setDashboardTheme(resolveTheme(rawTheme));
      setDashboardPalette(event.detail?.settings?.dashboardPalette || "royal-gold");
    };

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSchemeChange = () => readThemeFromStorage();

    readThemeFromStorage();
    window.addEventListener("storage", readThemeFromStorage);
    window.addEventListener("nusa-invite:settings-updated", onSettingsUpdated);
    media.addEventListener("change", onSchemeChange);

    return () => {
      window.removeEventListener("storage", readThemeFromStorage);
      window.removeEventListener("nusa-invite:settings-updated", onSettingsUpdated);
      media.removeEventListener("change", onSchemeChange);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        const result = await response.json();

        if (isMounted && result.data) {
          setStats(result.data);
          setMetrics(buildDashboardMetrics(result.data));
        }
      } catch {
        if (isMounted) {
          setMetrics(fallbackMetrics);
        }
      }
    };

    const loadTemplateCount = async () => {
      try {
        const response = await fetch("/api/templates?scope=admin");
        const result = await response.json();

        if (isMounted && Array.isArray(result.data)) {
          setTemplateCount(result.data.length);
        }
      } catch {
        if (isMounted) {
          setTemplateCount(0);
        }
      }
    };

    loadDashboardStats();
    loadTemplateCount();

    return () => {
      isMounted = false;
    };
  }, [fallbackMetrics]);

  return (
    <main className={`dashboard-ui theme-${dashboardTheme} palette-${dashboardPalette} min-h-screen bg-[var(--dash-fog)] text-[var(--dash-ink)] ${isThemeReady ? "opacity-100" : "opacity-0"}`}>
      <div className="flex">
        <Sidebar
          activePage={activePage}
          collapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((current) => !current)}
          invitationCount={stats.invitations}
          templateCount={templateCount}
        />
        <section className="min-w-0 flex-1">
      <header className="border-b border-[var(--dash-border)] bg-[var(--dash-canvas)] px-5 py-3 sm:px-6">
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
                    Order aktif: <span className="font-semibold text-[var(--dash-ink)]">{activeInvitationSlug}</span>
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center justify-end gap-3">
                <HeaderPrimaryActions
                  activePage={activePage}
                  activeInvitationSlug={activeInvitationSlug}
                />
                <RsvpNotifications />
                <LogoutButton session={session} />
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
                stats={stats}
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
