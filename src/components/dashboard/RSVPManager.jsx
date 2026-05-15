"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { sampleInvitation } from "../../data/sampleInvitation";
import { fadeUp } from "./config";

export default function RSVPManager() {
  const [rsvps, setRsvps] = useState(sampleInvitation.rsvps);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/rsvps?invitationSlug=dimas-salsa")
      .then((response) => response.json())
      .then((result) => {
        if (isMounted && Array.isArray(result.data)) {
          setRsvps(result.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setRsvps(sampleInvitation.rsvps);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const totalPax = rsvps.reduce((total, item) => total + Number(item.pax || 0), 0);
  const attending = rsvps.filter((item) => item.attendance === "hadir").length;
  const exportCsv = () => {
    const headers = ["Nama", "Status", "Pax", "Ucapan", "Waktu"];
    const rows = rsvps.map((item) => [
      item.guestName,
      item.attendance === "hadir" ? "Hadir" : "Tidak Hadir",
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
    link.download = "rsvp-dimas-salsa.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] shadow-xl shadow-[var(--color-primary)]/8"
    >
      <div className="flex flex-col gap-4 border-b border-[var(--color-accent-pale)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
            RSVP Manager
          </p>
          <h2 className="mt-2 text-2xl font-black text-[var(--color-primary)]">
            Konfirmasi kehadiran
          </h2>
          <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
            {attending} tamu hadir, total estimasi {totalPax} pax.
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="rounded-2xl border border-[var(--color-accent-pale)] bg-white px-5 py-3 text-base font-black text-[var(--color-text)]"
        >
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-[var(--color-muted)] text-sm uppercase tracking-[0.12em] text-[var(--color-text)]">
            <tr>
              <th className="px-6 py-4">Nama</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Pax</th>
              <th className="px-6 py-4">Ucapan</th>
              <th className="px-6 py-4">Waktu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-accent-pale)]/65">
            {rsvps.map((item, index) => (
              <tr key={`${item.guestName}-${index}`} className="hover:bg-[var(--color-bg)]">
                <td className="px-6 py-5 text-lg font-black text-[var(--color-primary)]">
                  {item.guestName}
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1.5 text-sm font-black ${
                      item.attendance === "hadir"
                        ? "bg-[var(--color-wa)] text-white"
                        : "bg-[var(--color-section-soft)] text-[var(--color-text)]"
                    }`}
                  >
                    {item.attendance === "hadir" ? "Hadir" : "Tidak Hadir"}
                  </span>
                </td>
                <td className="px-6 py-5 font-black text-[var(--color-primary)]">
                  {item.pax}
                </td>
                <td className="max-w-sm px-6 py-5 text-base font-semibold leading-7 text-[var(--color-text)]">
                  {item.message || "-"}
                </td>
                <td className="px-6 py-5 text-sm font-semibold text-[var(--color-text)]">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString("id-ID")
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}
