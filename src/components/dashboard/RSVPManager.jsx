"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "./config";
import { SelectInput, TextInput } from "./FormControls";

export default function RSVPManager({ invitationSlug = "" }) {
  const [rsvps, setRsvps] = useState([]);
  const [guests, setGuests] = useState([]);
  const [attendanceFilter, setAttendanceFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [invitationId, setInvitationId] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [recentIds, setRecentIds] = useState(() => new Set());

  useEffect(() => {
    if (!invitationSlug) {
      setRsvps([]);
      setGuests([]);
      setInvitationId("");
      setIsLive(false);
      return undefined;
    }

    let isMounted = true;

    Promise.all([
      fetch(`/api/rsvps?invitationSlug=${encodeURIComponent(invitationSlug)}`).then(
        (response) => response.json(),
      ),
      fetch(`/api/guests?invitationSlug=${encodeURIComponent(invitationSlug)}`).then(
        (response) => response.json(),
      ),
    ])
      .then(([rsvpResult, guestResult]) => {
        if (!isMounted) {
          return;
        }

        if (rsvpResult.invitationId) {
          setInvitationId(rsvpResult.invitationId);
        }

        if (Array.isArray(rsvpResult.data)) {
          setRsvps(rsvpResult.data);
        }

        if (Array.isArray(guestResult.data)) {
          setGuests(guestResult.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setRsvps([]);
          setGuests([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [invitationSlug]);

  useEffect(() => {
    if (!invitationId) {
      setIsLive(false);
      return undefined;
    }

    let supabase;
    try {
      const { createBrowserSupabaseClient } = require("../../lib/supabase/client");
      supabase = createBrowserSupabaseClient();
    } catch (e) {
      console.warn("Supabase client couldn't be initialized for real-time: ", e);
      setIsLive(false);
      return undefined;
    }

    if (!supabase) {
      setIsLive(false);
      return undefined;
    }

    const channel = supabase
      .channel(`realtime-rsvps-${invitationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "rsvps",
          filter: `invitation_id=eq.${invitationId}`,
        },
        (payload) => {
          const newRsvp = {
            id: payload.new.id,
            guestId: payload.new.guest_id,
            guestName: payload.new.guest_name,
            attendance: payload.new.attendance,
            pax: payload.new.pax,
            message: payload.new.message,
            hidden: payload.new.hidden || false,
            createdAt: payload.new.created_at,
          };
          setRsvps((prev) => {
            if (prev.some((r) => r.id === newRsvp.id)) return prev;
            return [newRsvp, ...prev];
          });
          setRecentIds((prev) => {
            const next = new Set(prev);
            next.add(newRsvp.id);
            return next;
          });
          setTimeout(() => {
            setRecentIds((prev) => {
              if (!prev.has(newRsvp.id)) return prev;
              const next = new Set(prev);
              next.delete(newRsvp.id);
              return next;
            });
          }, 6000);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsLive(true);
        } else {
          setIsLive(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [invitationId]);

  const guestGroupMap = useMemo(() => {
    const map = new Map();

    guests.forEach((guest) => {
      map.set(guest.name, guest.group || "-");
    });

    return map;
  }, [guests]);

  const enrichedRsvps = useMemo(
    () =>
      rsvps.map((item) => ({
        ...item,
        group: item.group || guestGroupMap.get(item.guestName) || "-",
      })),
    [guestGroupMap, rsvps],
  );

  const totalPax = enrichedRsvps.reduce((total, item) => total + Number(item.pax || 0), 0);
  const attendingPax = enrichedRsvps
    .filter((item) => item.attendance === "hadir")
    .reduce((total, item) => total + Number(item.pax || 0), 0);
  const attending = enrichedRsvps.filter((item) => item.attendance === "hadir").length;
  const notAttending = enrichedRsvps.filter((item) => item.attendance !== "hadir").length;
  const respondedNames = new Set(enrichedRsvps.map((item) => item.guestName));
  const pendingGuests = guests.filter((guest) => !respondedNames.has(guest.name)).length;
  const responseRate = guests.length
    ? Math.round((respondedNames.size / guests.length) * 100)
    : enrichedRsvps.length
      ? 100
      : 0;
  const latestMessages = enrichedRsvps
    .filter((item) => item.message)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3);
  const groupSummary = useMemo(() => {
    const groupMap = new Map();

    guests.forEach((guest) => {
      const groupName = guest.group || "-";
      const current = groupMap.get(groupName) || {
        group: groupName,
        invited: 0,
        responded: 0,
        attending: 0,
        pax: 0,
      };
      current.invited += 1;
      groupMap.set(groupName, current);
    });

    enrichedRsvps.forEach((item) => {
      const groupName = item.group || "-";
      const current = groupMap.get(groupName) || {
        group: groupName,
        invited: 0,
        responded: 0,
        attending: 0,
        pax: 0,
      };
      current.responded += 1;
      if (item.attendance === "hadir") {
        current.attending += 1;
        current.pax += Number(item.pax || 0);
      }
      groupMap.set(groupName, current);
    });

    return Array.from(groupMap.values())
      .sort((a, b) => b.responded - a.responded || b.pax - a.pax)
      .slice(0, 4);
  }, [enrichedRsvps, guests]);
  const groupOptions = useMemo(
    () => Array.from(new Set(guests.map((guest) => guest.group).filter(Boolean))),
    [guests],
  );
  const filteredRsvps = enrichedRsvps.filter((item) => {
    const matchAttendance =
      attendanceFilter === "all" ? true : item.attendance === attendanceFilter;
    const matchGroup = groupFilter === "all" ? true : item.group === groupFilter;
    const matchDate = dateFilter
      ? item.createdAt &&
        new Date(item.createdAt).toISOString().slice(0, 10) === dateFilter
      : true;

    return matchAttendance && matchGroup && matchDate;
  });

  const summaryCards = [
    { label: "Hadir", value: attending, detail: "RSVP menyatakan hadir" },
    { label: "Tidak Hadir", value: notAttending, detail: "RSVP tidak hadir" },
    { label: "Belum RSVP", value: pendingGuests, detail: "dari daftar tamu aktif" },
    { label: "Pax Hadir", value: attendingPax, detail: `${totalPax} total pax tercatat` },
  ];

  const formatAttendance = (attendance) =>
    attendance === "hadir" ? "Hadir" : "Tidak Hadir";

  const statusClass = (attendance) =>
    attendance === "hadir"
      ? "border-[var(--dash-ink)] bg-[var(--dash-ink)] text-white"
      : "border-[var(--dash-border)] bg-white text-[var(--dash-muted)]";

  const filteredHint = [
    attendanceFilter !== "all" ? formatAttendance(attendanceFilter) : null,
    groupFilter !== "all" ? groupFilter : null,
    dateFilter || null,
  ]
    .filter(Boolean)
    .join(" / ");

  const toggleHidden = async (item) => {
    const nextHidden = !item.hidden;
    setRsvps((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, hidden: nextHidden } : r)),
    );

    try {
      const response = await fetch("/api/rsvps", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, hidden: nextHidden }),
      });
      if (!response.ok) throw new Error("failed");
    } catch {
      // revert on failure
      setRsvps((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, hidden: item.hidden } : r)),
      );
    }
  };

  const deleteRsvp = async (item) => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(`Hapus RSVP dari ${item.guestName}? Tindakan ini tidak bisa dibatalkan.`)
    ) {
      return;
    }

    const snapshot = rsvps;
    setRsvps((prev) => prev.filter((r) => r.id !== item.id));

    try {
      const response = await fetch(
        `/api/rsvps?id=${encodeURIComponent(item.id)}`,
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error("failed");
    } catch {
      setRsvps(snapshot);
    }
  };

  const exportCsv = () => {
    const headers = ["Nama", "Group", "Status", "Pax", "Ucapan", "Waktu"];
    const rows = filteredRsvps.map((item) => [
      item.guestName,
      item.group || "",
      formatAttendance(item.attendance),
      item.pax,
      item.message || "",
      item.createdAt ? new Date(item.createdAt).toLocaleString("id-ID") : "",
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `rsvp-${invitationSlug}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.section
      variants={fadeUp}
      className="overflow-hidden rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] shadow-[var(--dash-shadow)]"
    >
      {!invitationSlug ? (
        <div className="border-b border-[var(--dash-border)] px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
            RSVP Manager
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-[var(--dash-ink)]">
            Pilih order aktif dulu
          </h2>
          <p className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
            Panel RSVP hanya berjalan untuk satu invitation yang sedang dibuka.
          </p>
        </div>
      ) : null}
      {!invitationSlug ? null : (
        <>
      <div className="flex flex-col gap-4 border-b border-[var(--dash-border)] px-5 py-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
            RSVP Manager
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-[var(--dash-ink)] flex items-center gap-2">
            Konfirmasi kehadiran
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live
              </span>
            ) : null}
          </h2>
          <p className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
            Data RSVP untuk order aktif: /{invitationSlug}
          </p>
          {filteredHint ? (
            <p className="mt-1 text-xs font-medium text-[var(--dash-muted)]">
              Filter aktif: {filteredHint}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[520px] lg:grid-cols-[1fr_1fr_150px_auto]">
          <SelectInput
            value={attendanceFilter}
            onChange={(event) => setAttendanceFilter(event.target.value)}
          >
            <option value="all">Semua RSVP</option>
            <option value="hadir">Hadir</option>
            <option value="tidak_hadir">Tidak Hadir</option>
          </SelectInput>
          <SelectInput
            value={groupFilter}
            onChange={(event) => setGroupFilter(event.target.value)}
          >
            <option value="all">Semua group</option>
            {groupOptions.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </SelectInput>
          <TextInput
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
          />
          <button
            type="button"
            onClick={exportCsv}
            className="rounded-md bg-[var(--dash-ink)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--dash-dark)]"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid gap-3 border-b border-[var(--dash-border)] p-5 md:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-[14px] border border-[var(--dash-border)] bg-white p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
              {card.label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-[var(--dash-ink)]">
              {card.value}
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
              {card.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 border-b border-[var(--dash-border)] bg-[var(--dash-fog)]/45 p-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[14px] border border-[var(--dash-border)] bg-white p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
                Smart Summary
              </p>
              <p className="mt-2 text-sm font-medium leading-6 text-[var(--dash-muted)]">
                Response rate {responseRate}% dari {guests.length || enrichedRsvps.length} target tamu.
              </p>
            </div>
            <span className="rounded-full bg-[var(--dash-ink)] px-3 py-1 text-xs font-semibold text-white">
              {respondedNames.size} RSVP
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {groupSummary.length ? (
              groupSummary.map((item) => {
                const groupRate = item.invited
                  ? Math.round((item.responded / item.invited) * 100)
                  : 100;

                return (
                  <div key={item.group} className="rounded-[12px] border border-[var(--dash-border)] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[var(--dash-ink)]">{item.group}</p>
                      <p className="text-xs font-semibold text-[var(--dash-muted)]">{groupRate}% respon</p>
                    </div>
                    <p className="mt-1 text-xs font-medium text-[var(--dash-muted)]">
                      {item.responded}/{item.invited || item.responded} RSVP, {item.attending} hadir, {item.pax} pax
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm font-medium text-[var(--dash-muted)]">
                Belum ada data group atau RSVP.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-[14px] border border-[var(--dash-border)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
            Pesan terbaru
          </p>
          <div className="mt-3 space-y-3">
            {latestMessages.length ? (
              latestMessages.map((item, index) => (
                <div key={`${item.guestName}-${index}`} className="rounded-[12px] bg-[var(--dash-fog)] px-3 py-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[var(--dash-ink)]">{item.guestName}</p>
                    <p className="text-xs font-semibold text-[var(--dash-muted)]">{formatAttendance(item.attendance)}</p>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm font-medium leading-6 text-[var(--dash-muted)]">
                    {item.message}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm font-medium text-[var(--dash-muted)]">
                Belum ada ucapan dari tamu.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-[var(--dash-fog)] text-xs uppercase tracking-[0.08em] text-[var(--dash-muted)]">
            <tr>
              <th className="px-5 py-3">Nama</th>
              <th className="px-5 py-3">Group</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Pax</th>
              <th className="px-5 py-3">Ucapan</th>
              <th className="px-5 py-3">Waktu</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--dash-border)]">
            {filteredRsvps.map((item, index) => (
              <tr
                key={`${item.guestName}-${index}`}
                className={`transition-colors duration-1000 ${
                  recentIds.has(item.id)
                    ? "bg-emerald-50"
                    : item.hidden
                      ? "bg-[var(--dash-fog)]/40"
                      : "hover:bg-[var(--dash-fog)]/60"
                }`}
              >
                <td className="px-5 py-4 text-sm font-semibold text-[var(--dash-ink)]">
                  {item.guestName}
                </td>
                <td className="px-5 py-4 text-sm font-medium text-[var(--dash-muted)]">
                  {item.group}
                </td>
                <td className="px-5 py-4">
                  <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${statusClass(item.attendance)}`}>
                    {formatAttendance(item.attendance)}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-[var(--dash-ink)]">
                  {item.pax}
                </td>
                <td className="max-w-sm px-5 py-4 text-sm font-medium leading-6 text-[var(--dash-muted)]">
                  <span className={item.hidden ? "line-through opacity-60" : undefined}>
                    {item.message || "-"}
                  </span>
                  {item.hidden && item.message ? (
                    <span className="ml-2 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                      Disembunyikan
                    </span>
                  ) : null}
                </td>
                <td className="px-5 py-4 text-sm font-medium text-[var(--dash-muted)]">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString("id-ID")
                    : "-"}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {item.message ? (
                      <button
                        type="button"
                        onClick={() => toggleHidden(item)}
                        className="rounded-md border border-[var(--dash-border)] px-2.5 py-1 text-xs font-semibold text-[var(--dash-ink)] transition-colors hover:bg-[var(--dash-fog)]"
                        title={item.hidden ? "Tampilkan ucapan di undangan" : "Sembunyikan ucapan dari undangan"}
                      >
                        {item.hidden ? "Tampilkan" : "Sembunyikan"}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => deleteRsvp(item)}
                      className="rounded-md border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                      title="Hapus RSVP"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </>
      )}
    </motion.section>
  );
}
