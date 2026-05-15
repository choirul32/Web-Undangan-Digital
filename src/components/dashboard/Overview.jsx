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
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-6 shadow-lg shadow-[var(--color-primary)]/8"
    >
      <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">
        {label}
      </p>
      <p className="mt-3 text-4xl font-black text-[var(--color-primary)]">{value}</p>
      <p className="mt-2 text-base font-semibold text-[var(--color-text)]">{detail}</p>
    </motion.div>
  );
}

export function InvitationTable() {
  const [items, setItems] = useState(invitations);

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
        <button className="rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-base font-black text-[var(--color-primary)] transition-colors hover:bg-[var(--color-accent-soft)]">
          Buat Undangan
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left">
          <thead className="bg-[var(--color-muted)] text-sm uppercase tracking-[0.12em] text-[var(--color-text)]">
            <tr>
              <th className="px-6 py-4">Pasangan</th>
              <th className="px-6 py-4">Template</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">RSVP</th>
              <th className="px-6 py-4">Status</th>
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
                  <p className="font-black text-[var(--color-primary)]">{item.template}</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">{item.category} | {item.package}</p>
                </td>
                <td className="px-6 py-5 font-bold text-[var(--color-text)]">{item.date}</td>
                <td className="px-6 py-5 font-black text-[var(--color-primary)]">{item.rsvp}</td>
                <td className="px-6 py-5">
                  <span className={`rounded-full px-3 py-1.5 text-sm font-black ${statusStyles[item.status]}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex gap-2">
                    <button className="rounded-xl border border-[var(--color-accent-pale)] px-3 py-2 text-sm font-black text-[var(--color-text)] hover:bg-white">
                      Edit
                    </button>
                    <button className="rounded-xl bg-[var(--color-primary)] px-3 py-2 text-sm font-black text-white hover:bg-[var(--color-primary-hover)]">
                      Preview
                    </button>
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

export function QuickCreateCard() {
  const [selectedTemplate, setSelectedTemplate] = useState("standard");

  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-primary)] p-6 text-white shadow-xl shadow-[var(--color-primary)]/12"
    >
      <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent-soft)]">
        Quick Create
      </p>
      <h2 className="mt-3 text-2xl font-black">Draft undangan baru</h2>
      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-black text-white/72">Nama pasangan</span>
          <input
            className="mt-2 w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-base font-bold text-white outline-none placeholder:text-white/36 focus:border-[var(--color-accent)]"
            placeholder="Contoh: Dimas & Salsa"
          />
        </label>
        <label className="block">
          <span className="text-sm font-black text-white/72">Template</span>
          <select
            value={selectedTemplate}
            onChange={(event) => setSelectedTemplate(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-base font-bold text-white outline-none focus:border-[var(--color-accent)]"
          >
            {templates.map((template) => (
              <option
                key={template.id}
                value={template.id}
                className="text-[var(--color-primary)]"
              >
                {template.name}
              </option>
            ))}
          </select>
        </label>
        <button className="w-full rounded-2xl bg-[var(--color-accent)] px-5 py-4 text-base font-black text-[var(--color-primary)] transition-colors hover:bg-[var(--color-accent-soft)]">
          Buat Draft
        </button>
      </div>
    </motion.section>
  );
}

export function TemplateHighlights() {
  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-6 shadow-lg shadow-[var(--color-primary)]/8"
    >
      <h2 className="text-2xl font-black text-[var(--color-primary)]">Template Terlaris</h2>
      <div className="mt-5 space-y-4">
        {templates.map((template) => (
          <div key={template.name} className="flex items-center gap-4">
            <img
              src={template.image}
              alt={`Preview ${template.name}`}
              className="h-16 w-14 rounded-[8px] border border-[var(--color-accent-pale)] object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="font-black text-[var(--color-primary)]">{template.name}</p>
              <p className="text-sm font-semibold text-[var(--color-text)]">{template.category}</p>
            </div>
            <p className="text-lg font-black text-[var(--color-accent)]">{template.orders}</p>
          </div>
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
