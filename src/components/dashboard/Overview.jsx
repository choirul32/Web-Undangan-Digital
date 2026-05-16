"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { sampleInvitation } from "../../data/sampleInvitation";
import {
  invitations,
  templates,
  fadeUp,
  statusStyles,
  activities,
} from "./config";

export function MetricCard({ label, value, detail }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] p-4 shadow-[var(--dash-shadow)]"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-[var(--dash-ink)]">{value}</p>
      <p className="mt-1 text-sm font-medium text-[var(--dash-muted)]">{detail}</p>
    </motion.div>
  );
}

export function InvitationTable() {
  const [items, setItems] = useState(invitations);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetch("/api/invitations")
      .then((response) => response.json())
      .then((result) => {
        if (isMounted && Array.isArray(result.data) && result.data.length > 0) {
          setItems(result.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setItems(invitations);
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

  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] shadow-xl shadow-[var(--color-primary)]/8"
    >
      <div className="flex flex-col gap-4 border-b border-[var(--color-accent-pale)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-[var(--color-primary)]">Undangan Terbaru</h2>
          <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
            Kelola draft, revisi, preview, dan undangan yang sudah publish.
          </p>
        </div>
        <a
          href="/dashboard/invitations"
          className="rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-base font-black text-[var(--color-primary)] transition-colors hover:bg-[var(--color-accent-soft)]"
        >
          Buat Undangan
        </a>
      </div>

      {actionMessage ? (
        <p className="border-b border-[var(--color-accent-pale)] px-6 py-3 text-sm font-bold text-[var(--color-text)]">
          {actionMessage}
        </p>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] text-left">
          <thead className="bg-[var(--color-muted)] text-sm uppercase tracking-[0.12em] text-[var(--color-text)]">
            <tr>
              <th className="px-6 py-4">Pasangan</th>
              <th className="px-6 py-4">Pemesan</th>
              <th className="px-6 py-4">Template</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">RSVP</th>
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-accent-pale)]/65">
            {items.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-[var(--color-bg)]">
                <td className="px-6 py-5">
                  <p className="text-lg font-black text-[var(--color-primary)]">{item.couple}</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">/u/{item.slug}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="font-black text-[var(--color-primary)]">
                    {item.customerName || "-"}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
                    {item.customerWhatsapp || "-"}
                  </p>
                </td>
                <td className="px-6 py-5">
                  <p className="font-black text-[var(--color-primary)]">{item.template}</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">{item.category} | {item.package}</p>
                </td>
                <td className="px-6 py-5 font-bold text-[var(--color-text)]">{item.date}</td>
                <td className="px-6 py-5 font-black text-[var(--color-primary)]">{item.rsvp}</td>
                <td className="px-6 py-5">
                  <span className={`rounded-full px-3 py-1.5 text-sm font-black ${statusStyles[item.orderStatus] || statusStyles[item.status] || statusStyles.draft}`}>
                    {item.orderStatus || item.status}
                  </span>
                  <p className="mt-2 text-xs font-bold text-[var(--color-text)]">
                    invitation: {item.status}
                  </p>
                </td>
                <td className="px-6 py-5">
                  <span className={`rounded-full px-3 py-1.5 text-sm font-black ${statusStyles[item.paymentStatus] || statusStyles.draft}`}>
                    {item.paymentStatus || "unpaid"}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`/dashboard/invitations/${item.slug}`}
                      className="rounded-xl border border-[var(--color-accent-pale)] px-3 py-2 text-sm font-black text-[var(--color-text)] hover:bg-white"
                    >
                      Edit
                    </a>
                    <a
                      href={`/preview?slug=${encodeURIComponent(item.slug)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl bg-[var(--color-primary)] px-3 py-2 text-sm font-black text-white hover:bg-[var(--color-primary-hover)]"
                    >
                      Preview
                    </a>
                    {String(item.status).toLowerCase() === "published" ? (
                      <button
                        type="button"
                        onClick={() => updateInvitationStatus(item, "archive")}
                        className="rounded-xl border border-[var(--color-accent-pale)] px-3 py-2 text-sm font-black text-[var(--color-text)] hover:bg-white"
                      >
                        Archive
                      </button>
                    ) : String(item.status).toLowerCase() === "archived" ? (
                      <span className="rounded-xl border border-[var(--color-accent-pale)] px-3 py-2 text-sm font-black text-[var(--color-text)]">
                        Archived
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => updateInvitationStatus(item, "publish")}
                        className="rounded-xl bg-[var(--color-accent)] px-3 py-2 text-sm font-black text-[var(--color-primary)] hover:bg-[var(--color-accent-soft)]"
                      >
                        Publish
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
        <p className="mt-1 text-xs font-medium leading-5 text-[var(--dash-muted)]">
          Pilihan awal, bukan ranking penjualan.
        </p>
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
              <p className="mt-1 text-xs font-medium text-[var(--dash-muted)]">
                {template.category} · {template.price || "Template"}
              </p>
            </div>
            <span className="text-xs font-semibold text-[var(--dash-muted)] group-hover:text-[var(--dash-ink)]">
              Lihat
            </span>
          </a>
        ))}
      </div>

      <a
        href="/dashboard/invitations"
        className="mt-3 flex items-center justify-center rounded-md bg-[var(--dash-fog)] px-4 py-2.5 text-sm font-semibold text-[var(--dash-ink)] hover:bg-[var(--dash-border)]"
      >
        Buka menu Undangan
      </a>
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
