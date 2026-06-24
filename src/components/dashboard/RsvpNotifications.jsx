"use client";

import React, { useEffect, useRef, useState } from "react";

function mapRsvp(row) {
  return {
    id: row.id,
    guestName: row.guest_name || "Tamu",
    attendance: row.attendance,
    pax: row.pax,
    message: row.message,
    createdAt: row.created_at,
  };
}

function attendanceLabel(attendance) {
  return attendance === "hadir" ? "Hadir" : "Tidak hadir";
}

function timeAgo(createdAt) {
  if (!createdAt) return "";
  const diffMs = Date.now() - new Date(createdAt).getTime();
  if (Number.isNaN(diffMs)) return "";
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "baru saja";
  if (mins < 60) return `${mins} mnt lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return new Date(createdAt).toLocaleDateString("id-ID");
}

export default function RsvpNotifications() {
  const [items, setItems] = useState([]); // RSVP diterima selama sesi dashboard terbuka
  const [toasts, setToasts] = useState([]);
  const [unseen, setUnseen] = useState(0);
  const [open, setOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const toastTimers = useRef(new Map());

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = toastTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      toastTimers.current.delete(id);
    }
  };

  useEffect(() => {
    let supabase;
    try {
      const { createBrowserSupabaseClient } = require("../../lib/supabase/client");
      supabase = createBrowserSupabaseClient();
    } catch (error) {
      console.warn("RSVP notifications: Supabase client unavailable", error);
      setIsLive(false);
      return undefined;
    }

    if (!supabase) {
      setIsLive(false);
      return undefined;
    }

    const channel = supabase
      .channel("realtime-rsvps-global")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "rsvps" },
        (payload) => {
          const rsvp = mapRsvp(payload.new);
          setItems((prev) =>
            prev.some((item) => item.id === rsvp.id)
              ? prev
              : [rsvp, ...prev].slice(0, 30),
          );
          setUnseen((count) => count + 1);
          setToasts((prev) => {
            if (prev.some((item) => item.id === rsvp.id)) return prev;
            return [rsvp, ...prev].slice(0, 4);
          });

          const timer = setTimeout(() => dismissToast(rsvp.id), 8000);
          toastTimers.current.set(rsvp.id, timer);
        },
      )
      .subscribe((status) => {
        setIsLive(status === "SUBSCRIBED");
      });

    const timers = toastTimers.current;
    return () => {
      supabase.removeChannel(channel);
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const togglePanel = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) setUnseen(0);
      return next;
    });
  };

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={togglePanel}
          className="relative flex h-9 w-9 items-center justify-center rounded-md border border-[var(--dash-border)] bg-[var(--dash-canvas)] text-[var(--dash-ink)] transition-colors hover:bg-[var(--dash-fog)]"
          title={isLive ? "Notifikasi RSVP (live)" : "Notifikasi RSVP"}
          aria-label="Notifikasi RSVP"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[18px] w-[18px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {isLive ? (
            <span className="absolute -bottom-0.5 -left-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[var(--dash-canvas)]" />
          ) : null}
          {unseen > 0 ? (
            <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-[var(--dash-canvas)]">
              {unseen > 99 ? "99+" : unseen}
            </span>
          ) : null}
        </button>

        {open ? (
          <>
            <button
              type="button"
              aria-label="Tutup notifikasi"
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setOpen(false)}
            />
            <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-[var(--dash-border)] bg-[var(--dash-canvas)] shadow-xl">
              <div className="flex items-center justify-between border-b border-[var(--dash-border)] px-4 py-3">
                <p className="text-sm font-semibold text-[var(--dash-ink)]">RSVP terbaru</p>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    isLive
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border border-[var(--dash-border)] text-[var(--dash-muted)]"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${isLive ? "bg-emerald-500" : "bg-[var(--dash-muted)]"}`}
                  />
                  {isLive ? "Live" : "Offline"}
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {items.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm font-medium text-[var(--dash-muted)]">
                    Belum ada RSVP baru sejak dashboard dibuka.
                  </p>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 border-b border-[var(--dash-border)] px-4 py-3 last:border-b-0"
                    >
                      <span
                        className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                          item.attendance === "hadir" ? "bg-emerald-500" : "bg-rose-400"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[var(--dash-ink)]">
                          {item.guestName}
                        </p>
                        <p className="text-xs font-medium text-[var(--dash-muted)]">
                          {attendanceLabel(item.attendance)} · {item.pax || 0} pax · {timeAgo(item.createdAt)}
                        </p>
                        {item.message ? (
                          <p className="mt-1 line-clamp-2 text-xs text-[var(--dash-muted)]">
                            “{item.message}”
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>

      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(92vw,22rem)] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-canvas)] p-3 shadow-xl"
          >
            <span
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white ${
                toast.attendance === "hadir" ? "bg-emerald-500" : "bg-rose-400"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {toast.attendance === "hadir" ? (
                  <path d="m5 13 4 4L19 7" />
                ) : (
                  <path d="M18 6 6 18M6 6l12 12" />
                )}
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[var(--dash-ink)]">
                RSVP baru dari {toast.guestName}
              </p>
              <p className="text-xs font-medium text-[var(--dash-muted)]">
                {attendanceLabel(toast.attendance)} · {toast.pax || 0} pax
              </p>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 rounded-md p-1 text-[var(--dash-muted)] transition-colors hover:bg-[var(--dash-fog)] hover:text-[var(--dash-ink)]"
              aria-label="Tutup notifikasi"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
