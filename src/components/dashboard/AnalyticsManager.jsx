"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "./config";

const RANGE_OPTIONS = [
  { label: "7 hari", value: 7 },
  { label: "30 hari", value: 30 },
  { label: "90 hari", value: 90 },
];

function formatDateShort(dateKey) {
  const [, month, day] = dateKey.split("-");
  return `${day}/${month}`;
}

function formatHour(hour) {
  return `${String(hour).padStart(2, "0")}.00`;
}

function StatCard({ label, value, detail }) {
  return (
    <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-[var(--dash-ink)]">{value}</p>
      {detail ? (
        <p className="mt-1 text-xs font-medium text-[var(--dash-muted)]">{detail}</p>
      ) : null}
    </div>
  );
}

function BarChart({ data, getLabel, getValue, highlightIndex = -1 }) {
  const max = Math.max(1, ...data.map(getValue));
  return (
    <div className="flex h-44 items-end gap-1 overflow-x-auto">
      {data.map((item, index) => {
        const value = getValue(item);
        const heightPct = Math.round((value / max) * 100);
        const isHighlight = index === highlightIndex;
        return (
          <div
            key={index}
            className="group flex min-w-[10px] flex-1 flex-col items-center justify-end gap-1"
            title={`${getLabel(item)}: ${value}`}
          >
            <span className="text-[9px] font-semibold text-[var(--dash-muted)] opacity-0 transition-opacity group-hover:opacity-100">
              {value}
            </span>
            <div
              className={`w-full rounded-t-sm transition-all ${
                isHighlight ? "bg-emerald-500" : "bg-[var(--dash-ink)]/80"
              }`}
              style={{ height: `${Math.max(value > 0 ? 6 : 2, heightPct)}%` }}
            />
            <span className="whitespace-nowrap text-[9px] font-medium text-[var(--dash-muted)]">
              {getLabel(item)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function AnalyticsManager({ invitationSlug = "" }) {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | error | ready
  const [guestFilter, setGuestFilter] = useState("all"); // all | opened | not

  useEffect(() => {
    if (!invitationSlug) {
      setData(null);
      setStatus("idle");
      return undefined;
    }

    let isMounted = true;
    setStatus("loading");

    fetch(
      `/api/invitations/${encodeURIComponent(invitationSlug)}/analytics?days=${days}`,
    )
      .then((response) => response.json())
      .then((result) => {
        if (!isMounted) return;
        if (result?.success && result.data) {
          setData(result.data);
          setStatus("ready");
        } else {
          setStatus("error");
        }
      })
      .catch(() => {
        if (isMounted) setStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, [invitationSlug, days]);

  const filteredGuests = useMemo(() => {
    const list = data?.guests?.list || [];
    if (guestFilter === "opened") return list.filter((g) => g.opened);
    if (guestFilter === "not") return list.filter((g) => !g.opened);
    return list;
  }, [data, guestFilter]);

  const openRate = useMemo(() => {
    const total = data?.guests?.total || 0;
    if (!total) return 0;
    return Math.round((data.guests.opened / total) * 100);
  }, [data]);

  if (!invitationSlug) {
    return (
      <motion.section
        variants={fadeUp}
        className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] px-5 py-6 shadow-[var(--dash-shadow)]"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
          Statistik
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-[var(--dash-ink)]">
          Pilih order aktif dulu
        </h2>
        <p className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
          Statistik hanya tersedia untuk satu undangan yang sedang dibuka.
        </p>
      </motion.section>
    );
  }

  return (
    <motion.section variants={fadeUp} className="space-y-5">
      <div className="flex flex-col gap-3 rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] px-5 py-4 shadow-[var(--dash-shadow)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
            Statistik undangan
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-[var(--dash-ink)]">
            /u/{invitationSlug}
          </h2>
        </div>
        <div className="flex gap-1.5 rounded-lg border border-[var(--dash-border)] p-1">
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setDays(option.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                days === option.value
                  ? "bg-[var(--dash-ink)] text-white"
                  : "text-[var(--dash-muted)] hover:bg-[var(--dash-fog)]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {status === "loading" ? (
        <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] px-5 py-10 text-center text-sm font-medium text-[var(--dash-muted)]">
          Memuat statistik…
        </div>
      ) : null}

      {status === "error" ? (
        <div className="rounded-[14px] border border-rose-200 bg-rose-50 px-5 py-6 text-sm font-medium text-rose-700">
          Gagal memuat statistik. Pastikan tabel <code>invitation_views</code> sudah dibuat di Supabase.
        </div>
      ) : null}

      {status === "ready" && data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total dibuka"
              value={data.totalViews}
              detail="sepanjang waktu"
            />
            <StatCard
              label={`Dibuka (${data.windowDays} hari)`}
              value={data.windowViews}
              detail="dalam rentang terpilih"
            />
            <StatCard
              label="Jam paling ramai"
              value={data.peakHour.count > 0 ? formatHour(data.peakHour.hour) : "-"}
              detail={data.peakHour.count > 0 ? `${data.peakHour.count} kali dibuka (WIB)` : "belum ada data"}
            />
            <StatCard
              label="Tamu sudah buka"
              value={`${data.guests.opened}/${data.guests.total}`}
              detail={`${openRate}% dari daftar tamu`}
            />
          </div>

          <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] p-5 shadow-[var(--dash-shadow)]">
            <p className="text-sm font-semibold text-[var(--dash-ink)]">Tren harian</p>
            <p className="mb-4 text-xs font-medium text-[var(--dash-muted)]">
              Jumlah undangan dibuka per hari (WIB)
            </p>
            <BarChart
              data={data.daily}
              getLabel={(item) => formatDateShort(item.date)}
              getValue={(item) => item.count}
            />
          </div>

          <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] p-5 shadow-[var(--dash-shadow)]">
            <p className="text-sm font-semibold text-[var(--dash-ink)]">Distribusi jam buka</p>
            <p className="mb-4 text-xs font-medium text-[var(--dash-muted)]">
              Kapan tamu paling sering membuka undangan (WIB)
            </p>
            <BarChart
              data={data.hourly.map((count, hour) => ({ hour, count }))}
              getLabel={(item) => String(item.hour).padStart(2, "0")}
              getValue={(item) => item.count}
              highlightIndex={data.peakHour.count > 0 ? data.peakHour.hour : -1}
            />
          </div>

          <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] shadow-[var(--dash-shadow)]">
            <div className="flex flex-col gap-3 border-b border-[var(--dash-border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--dash-ink)]">Status buka per tamu</p>
                <p className="text-xs font-medium text-[var(--dash-muted)]">
                  {data.guests.opened} sudah buka · {data.guests.notOpened} belum buka
                </p>
              </div>
              <div className="flex gap-1.5 rounded-lg border border-[var(--dash-border)] p-1">
                {[
                  { label: "Semua", value: "all" },
                  { label: "Sudah", value: "opened" },
                  { label: "Belum", value: "not" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setGuestFilter(option.value)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                      guestFilter === option.value
                        ? "bg-[var(--dash-ink)] text-white"
                        : "text-[var(--dash-muted)] hover:bg-[var(--dash-fog)]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredGuests.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm font-medium text-[var(--dash-muted)]">
                  {data.guests.total === 0
                    ? "Belum ada data tamu untuk undangan ini."
                    : "Tidak ada tamu pada filter ini."}
                </p>
              ) : (
                <table className="w-full text-left">
                  <tbody className="divide-y divide-[var(--dash-border)]">
                    {filteredGuests.map((guest) => (
                      <tr key={guest.id} className="hover:bg-[var(--dash-fog)]/60">
                        <td className="px-5 py-3 text-sm font-semibold text-[var(--dash-ink)]">
                          {guest.name}
                        </td>
                        <td className="px-5 py-3 text-sm font-medium text-[var(--dash-muted)]">
                          {guest.group}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                              guest.opened
                                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border border-[var(--dash-border)] text-[var(--dash-muted)]"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                guest.opened ? "bg-emerald-500" : "bg-[var(--dash-muted)]"
                              }`}
                            />
                            {guest.opened ? "Sudah buka" : "Belum buka"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right text-xs font-medium text-[var(--dash-muted)]">
                          {guest.rsvpStatus}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      ) : null}
    </motion.section>
  );
}
