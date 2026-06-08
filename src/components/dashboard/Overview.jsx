"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { templates, fadeUp, statusStyles, activities } from "./config";

function Icon({ name, className = "h-4 w-4" }) {
  const common = { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" };
  if (name === "warning") return <svg {...common}><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>;
  if (name === "invitations") return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 8h18" /><path d="M8 12h8" /><path d="M8 16h5" /></svg>;
  if (name === "published") return <svg {...common}><path d="M20 6 9 17l-5-5" /></svg>;
  if (name === "payment") return <svg {...common}><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M2 10h20" /><path d="M7 14h.01" /></svg>;
  if (name === "groups") return <svg {...common}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
  if (name === "edit") return <svg {...common}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" /></svg>;
  if (name === "preview") return <svg {...common}><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" /><circle cx="12" cy="12" r="3" /></svg>;
  if (name === "publish") return <svg {...common}><path d="M12 3v12" /><path d="m7 8 5-5 5 5" /><path d="M5 21h14" /></svg>;
  if (name === "archive") return <svg {...common}><rect x="3" y="4" width="18" height="4" rx="1" /><path d="M5 8h14v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8Z" /><path d="M10 12h4" /></svg>;
  if (name === "trash") return <svg {...common}><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="m19 6-1 14H6L5 6" /><path d="M10 11v5" /><path d="M14 11v5" /></svg>;
  if (name === "template") return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>;
  return <svg {...common}><circle cx="12" cy="12" r="9" /></svg>;
}

export function MetricCard({ label, value, detail, icon }) {
  return (
    <motion.div
      variants={fadeUp}
      className="relative h-32 overflow-hidden rounded-xl border border-[var(--color-accent-pale)] bg-white p-4 shadow-lg shadow-[var(--color-primary)]/8"
    >
      <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-[var(--color-accent)]/10" />
      <div className="relative flex items-start justify-between gap-2">
        <p className="text-xs font-black uppercase tracking-[0.08em] text-[var(--color-text)]/70">{label}</p>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-bg)] text-[var(--color-primary)]">
          <Icon name={icon} className="h-4 w-4" />
        </span>
      </div>
      <p className="relative mt-2 text-4xl font-black text-[var(--color-primary)]">{value}</p>
      <p className="relative mt-1 text-xs font-semibold text-[var(--color-text)]/80">{detail}</p>
    </motion.div>
  );
}

export function OverviewAlertStrip({ pendingCount = 0 }) {
  if (!pendingCount) {
    return null;
  }

  return (
    <motion.div
      variants={fadeUp}
      className="flex items-start gap-3 rounded-lg border border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] px-4 py-3 text-[var(--color-warning-text)]"
    >
      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center text-[var(--color-warning-icon)]">
        <Icon name="warning" className="h-4 w-4" />
      </span>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.08em]">Butuh Perhatian</p>
        <p className="mt-1 text-sm font-semibold">
          Terdapat {pendingCount} undangan dalam status draft/review yang menunggu pengecekan akhir.
        </p>
      </div>
    </motion.div>
  );
}

export function InvitationTable({ variant = "full" }) {
  const [items, setItems] = useState([]);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(true);
  const [actionMessage, setActionMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeletingInvitation, setIsDeletingInvitation] = useState(false);
  const isOverviewVariant = variant === "overview";
  const isInvitationsVariant = variant === "invitations";
  const formatDateLabel = (rawValue) => {
    if (!rawValue) return "-";
    const parsed = new Date(rawValue);
    if (Number.isNaN(parsed.getTime())) return rawValue;
    return parsed.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    let isMounted = true;
    setIsLoadingInvitations(true);

    fetch("/api/invitations")
      .then((response) => response.json())
      .then((result) => {
        if (!isMounted) {
          return;
        }

        if (Array.isArray(result.data)) {
          setItems(result.data);
          return;
        }

        setItems([]);
      })
      .catch(() => {
        if (isMounted) {
          setItems([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingInvitations(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateInvitationStatus = async (item, action) => {
    setActionMessage(`${action === "publish" ? "Publish" : "Archive"} ${item.slug}...`);

    try {
      const response = await fetch(`/api/invitations/${encodeURIComponent(item.slug)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const result = await response.json();

      if (!response.ok) {
        const details = Array.isArray(result.details)
          ? ` ${result.details.join(" ")}`
          : "";
        throw new Error(`${result.error || "Action gagal."}${details}`);
      }

      const nextStatus = action === "publish" ? "published" : "archived";
      const nextOrderStatus = action === "publish" ? "published" : item.orderStatus;

      setItems((current) =>
        current.map((currentItem) =>
          currentItem.slug === item.slug
            ? {
                ...currentItem,
                status: nextStatus,
                orderStatus: nextOrderStatus,
              }
            : currentItem,
        ),
      );
      setActionMessage(
        result.source === "supabase"
          ? `${item.slug} berhasil ${nextStatus}.`
          : `Mode sample: ${item.slug} dianggap ${nextStatus}.`,
      );
    } catch (error) {
      setActionMessage(error.message || "Action gagal.");
    }
  };

  const closeDeleteModal = () => {
    if (isDeletingInvitation) return;
    setDeleteTarget(null);
  };

  const deleteInvitation = async () => {
    if (!deleteTarget) return;

    setIsDeletingInvitation(true);
    setActionMessage(`Menghapus ${deleteTarget.slug}...`);

    try {
      const response = await fetch(`/api/invitations/${encodeURIComponent(deleteTarget.slug)}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus undangan.");
      }

      setItems((current) =>
        current.filter((item) => item.slug !== deleteTarget.slug),
      );
      setActionMessage(`${deleteTarget.slug} berhasil dihapus.`);
      setDeleteTarget(null);
    } catch (error) {
      setActionMessage(error.message || "Gagal menghapus undangan.");
    } finally {
      setIsDeletingInvitation(false);
    }
  };

  return (
    <>
      <motion.section
        variants={fadeUp}
        className="overflow-hidden rounded-xl border border-[var(--color-accent-pale)] bg-white shadow-lg shadow-[var(--color-primary)]/8"
      >
      <div className="flex items-center justify-between border-b border-[var(--color-accent-pale)] px-6 py-4">
        <h2 className="text-xl font-black text-[var(--color-primary)]">Undangan Terbaru</h2>
        <a href="/dashboard/invitations" className="text-sm font-black text-[var(--color-primary)] hover:underline">
          Lihat Semua
        </a>
      </div>

      {actionMessage ? (
        <p className="border-b border-[var(--color-accent-pale)] px-6 py-3 text-sm font-bold text-[var(--color-text)]">
          {actionMessage}
        </p>
      ) : null}

      <div className="overflow-x-auto">
        <table className={`w-full text-left ${isOverviewVariant ? "min-w-[720px]" : isInvitationsVariant ? "min-w-[1220px]" : "min-w-[1040px]"}`}>
          <thead className="bg-[var(--color-muted)] text-xs uppercase tracking-[0.12em] text-[var(--color-text)]">
            <tr>
              <th className="px-6 py-4">Pasangan</th>
              {isInvitationsVariant ? <th className="px-6 py-4">Slug</th> : <th className="px-6 py-4">Template</th>}
              {isInvitationsVariant ? <th className="px-6 py-4">Template</th> : null}
              {!isInvitationsVariant ? <th className="px-6 py-4">Tanggal Acara</th> : <th className="px-6 py-4">Tanggal Acara</th>}
              {isInvitationsVariant ? <th className="px-6 py-4">Payment</th> : null}
              {isInvitationsVariant ? <th className="px-6 py-4">Update Terakhir</th> : null}
              <th className="px-6 py-4">Status</th>
              {!isOverviewVariant && !isInvitationsVariant ? (
                <>
                  <th className="px-6 py-4">Pemesan</th>
                  <th className="px-6 py-4">RSVP</th>
                  <th className="px-6 py-4">Payment</th>
                </>
              ) : null}
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-accent-pale)]/65">
            {isLoadingInvitations ? (
              <tr>
                <td
                  colSpan={isOverviewVariant ? 5 : isInvitationsVariant ? 8 : 8}
                  className="px-6 py-8 text-center text-base font-semibold text-[var(--color-text)]"
                >
                  Memuat undangan...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={isOverviewVariant ? 5 : isInvitationsVariant ? 8 : 8}
                  className="px-6 py-8 text-center text-base font-semibold text-[var(--color-text)]"
                >
                  Belum ada data undangan.
                </td>
              </tr>
            ) : items.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-[var(--color-bg)]">
                <td className="px-6 py-4">
                  <p className="text-lg font-black text-[var(--color-primary)]">{item.couple}</p>
                  <p className="mt-1 text-xs font-semibold text-[var(--color-text)]/70">
                    {isInvitationsVariant ? (item.package || "-") : (item.customerName || item.slug)}
                  </p>
                </td>
                <td className="px-6 py-4">
                  {isInvitationsVariant ? (
                    <p className="font-black text-[var(--color-text)]/80">{item.slug}</p>
                  ) : (
                    <p className="font-black text-[var(--color-primary)]">{item.template}</p>
                  )}
                  {!isOverviewVariant && !isInvitationsVariant ? (
                    <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
                      {item.category} | {item.package}
                    </p>
                  ) : null}
                </td>
                {isInvitationsVariant ? (
                  <td className="px-6 py-4">
                    <p className="font-black text-[var(--color-primary)]">{item.template || "-"}</p>
                    <p className="mt-1 text-xs font-semibold text-[var(--color-text)]/70">
                      {item.category || "-"}
                    </p>
                  </td>
                ) : null}
                <td className="px-6 py-4 font-bold text-[var(--color-text)]">
                  {item.date || formatDateLabel(item.eventDate)}
                </td>
                {isInvitationsVariant ? (
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1.5 text-xs font-black ${statusStyles[item.paymentStatus] || statusStyles.draft}`}>
                      {item.paymentStatus || "unpaid"}
                    </span>
                  </td>
                ) : null}
                {isInvitationsVariant ? (
                  <td className="px-6 py-4">
                    <p className="font-bold text-[var(--color-text)]">
                      {formatDateLabel(item.updatedAt || item.updated_at || item.createdAt || item.created_at)}
                    </p>
                  </td>
                ) : null}
                <td className="px-6 py-4">
                  <span className={`rounded-full px-3 py-1.5 text-xs font-black ${statusStyles[item.orderStatus] || statusStyles[item.status] || statusStyles.draft}`}>
                    {item.orderStatus || item.status}
                  </span>
                </td>
                {!isOverviewVariant && !isInvitationsVariant ? (
                  <>
                    <td className="px-6 py-4">
                      <p className="font-black text-[var(--color-primary)]">{item.customerName || "-"}</p>
                      <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">{item.customerWhatsapp || "-"}</p>
                    </td>
                    <td className="px-6 py-4 font-black text-[var(--color-primary)]">{item.rsvp}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1.5 text-sm font-black ${statusStyles[item.paymentStatus] || statusStyles.draft}`}>
                        {item.paymentStatus || "unpaid"}
                      </span>
                    </td>
                  </>
                ) : null}
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-1">
                    <a
                      href={`/dashboard/invitations/${item.slug}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-accent-pale)] text-[var(--color-text)] hover:bg-[var(--color-bg)]"
                      title="Edit"
                    >
                      <Icon name="edit" className="h-4 w-4" />
                    </a>
                    <a
                      href={`/preview?slug=${encodeURIComponent(item.slug)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-accent-pale)] text-[var(--color-text)] hover:bg-[var(--color-bg)]"
                      title="Preview"
                    >
                      <Icon name="preview" className="h-4 w-4" />
                    </a>
                    {String(item.status).toLowerCase() === "published" ? (
                      <button
                        type="button"
                        onClick={() => updateInvitationStatus(item, "archive")}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-accent-pale)] text-[var(--color-text)] hover:bg-[var(--color-bg)]"
                        title="Archive"
                      >
                        <Icon name="archive" className="h-4 w-4" />
                      </button>
                    ) : String(item.status).toLowerCase() === "archived" ? (
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-accent-pale)] text-[var(--color-text)]">
                        <Icon name="archive" className="h-4 w-4" />
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => updateInvitationStatus(item, "publish")}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-accent-pale)] text-[var(--color-text)] hover:bg-[var(--color-bg)]"
                        title="Publish"
                      >
                        <Icon name="publish" className="h-4 w-4" />
                      </button>
                    )}
                    {isInvitationsVariant ? (
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        title="Hapus"
                      >
                        <Icon name="trash" className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </motion.section>

      {deleteTarget ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-red-100 bg-white p-6 shadow-2xl shadow-slate-950/20">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                <Icon name="warning" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-red-600">Peringatan Hapus</p>
                <h3 className="mt-2 text-xl font-black text-[var(--color-primary)]">
                  Hapus undangan ini?
                </h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-[var(--color-text)]">
                  Undangan <span className="font-black">{deleteTarget.couple || deleteTarget.slug}</span> dengan slug <span className="font-black">{deleteTarget.slug}</span> akan dihapus permanen beserta acara, tamu, RSVP, story, rekening, dan media terkait.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeletingInvitation}
                className="rounded-lg border border-[var(--color-accent-pale)] px-4 py-2 text-sm font-black text-[var(--color-text)] hover:bg-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={deleteInvitation}
                disabled={isDeletingInvitation}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-black text-white shadow-lg shadow-red-600/20 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeletingInvitation ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function RSVPSnapshotCard({ stats }) {
  const hadir = Number(stats?.rsvpHadir || 0);
  const tidakHadir = Number(stats?.rsvpTidakHadir || 0);
  const belum = Number(stats?.rsvpBelum || 0);
  const total = hadir + tidakHadir + belum;
  const hadirPercent = total > 0 ? Math.round((hadir / total) * 100) : 0;

  return (
    <motion.section variants={fadeUp} className="rounded-xl border border-[var(--color-accent-pale)] bg-white p-4 shadow-lg shadow-[var(--color-primary)]/8">
      <h3 className="text-sm font-black uppercase tracking-[0.08em] text-[var(--color-text)]/80">RSVP Snapshot</h3>
      <div className="mt-4 flex items-center justify-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full border-[12px] border-[var(--color-muted)]">
          <div className="text-center">
            <p className="text-2xl font-black text-[var(--color-primary)]">{hadirPercent}%</p>
            <p className="text-xs font-semibold text-[var(--color-text)]/70">Hadir</p>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-sm font-semibold text-[var(--color-text)]">
        <div className="flex items-center justify-between"><span>Hadir</span><span>{hadir}</span></div>
        <div className="flex items-center justify-between"><span>Tidak Hadir</span><span>{tidakHadir}</span></div>
        <div className="flex items-center justify-between"><span>Belum RSVP</span><span>{belum}</span></div>
      </div>
    </motion.section>
  );
}

export function QuickActionsCard() {
  const actions = [
    { label: "Buat Undangan", href: "/dashboard/invitations" },
    { label: "Buka Template", href: "/dashboard/templates" },
    { label: "Cek Status RSVP", href: "/dashboard/rsvps" },
  ];

  return (
    <motion.section variants={fadeUp} className="rounded-xl border border-[var(--color-accent-pale)] bg-white p-4 shadow-lg shadow-[var(--color-primary)]/8">
      <h3 className="text-sm font-black uppercase tracking-[0.08em] text-[var(--color-text)]/80">Aksi Cepat</h3>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <a
            key={action.label}
            href={action.href}
            className={`rounded-lg border border-[var(--color-accent-pale)] px-3 py-3 text-center text-xs font-black text-[var(--color-primary)] hover:bg-[var(--color-bg)] ${
              action.label === "Cek Status RSVP" ? "col-span-2" : ""
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Icon name={action.label === "Buat Undangan" ? "invitations" : action.label === "Buka Template" ? "template" : "groups"} className="h-4 w-4" />
              {action.label}
            </span>
          </a>
        ))}
      </div>
    </motion.section>
  );
}

export function TemplateHighlights() {
  const recommendedTemplates = templates.slice(0, 4);

  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] p-4 shadow-[var(--dash-shadow)]"
    >
      <div className="border-b border-[var(--dash-border)] pb-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-[var(--dash-ink)]">
            Template Rekomendasi
          </h2>
          <a
            href="/dashboard/templates"
            className="text-xs font-semibold text-[var(--dash-muted)] hover:text-[var(--dash-ink)]"
          >
            Kelola
          </a>
        </div>
      </div>

      <div className="mt-3 divide-y divide-[var(--dash-border)]">
        {recommendedTemplates.map((template) => (
          <a
            key={template.id}
            href={`/preview?templateId=${encodeURIComponent(template.id)}`}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 py-3"
          >
            <img
              src={template.image}
              alt={`Preview ${template.name}`}
              className="h-12 w-10 rounded-[8px] border border-[var(--dash-border)] object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--dash-ink)]">
                {template.name}
              </p>
            </div>
          </a>
        ))}
      </div>
    </motion.section>
  );
}

export function ActivityFeed() {
  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-6 shadow-lg shadow-[var(--color-primary)]/8"
    >
      <h2 className="text-2xl font-black text-[var(--color-primary)]">Aktivitas</h2>
      <div className="mt-5 space-y-4">
        {activities.map((activity) => (
          <div key={activity} className="flex gap-3">
            <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
            <p className="text-base font-semibold leading-7 text-[var(--color-text)]">{activity}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

export function NextActionsCard() {
  return null;
}
