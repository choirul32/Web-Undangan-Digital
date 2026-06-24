"use client";

import { useState } from "react";

export default function RSVPForm({ invitationSlug, guestSlug, guestName }) {
  const [form, setForm] = useState({
    guestName: guestName || "",
    attendance: "",
    pax: 1,
    message: "",
  });
  const [status, setStatus] = useState("");

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitRSVP = async (event) => {
    event.preventDefault();
    setStatus("Mengirim RSVP...");

    try {
      const response = await fetch("/api/rsvps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationSlug,
          guestSlug,
          guestName: form.guestName,
          attendance: form.attendance,
          pax: Number(form.pax),
          message: form.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengirim RSVP");
      }

      const result = await response.json();
      setStatus(
        result.source === "supabase"
          ? "RSVP berhasil dikirim."
          : "RSVP tersimpan sementara. Supabase belum dikonfigurasi.",
      );
    } catch {
      setStatus("RSVP gagal dikirim. Coba lagi sebentar.");
    }
  };

  return (
    <form
      onSubmit={submitRSVP}
      className="mt-8 space-y-4 rounded-2xl border border-[var(--color-accent-pale)] bg-white/95 p-5 text-left shadow-xl shadow-[var(--color-primary)]/8 sm:p-7"
    >
      <label className="block">
        <span className="sr-only">Nama</span>
        <input
          value={form.guestName}
          onChange={(event) => updateForm("guestName", event.target.value)}
          className="w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-3.5 text-base font-semibold text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/40 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
          placeholder="Nama"
          required
        />
      </label>

      <label className="block">
        <span className="sr-only">Ucapan dan doa</span>
        <textarea
          value={form.message}
          onChange={(event) => updateForm("message", event.target.value)}
          rows={4}
          className="w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-3.5 text-base font-semibold leading-7 text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/40 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
          placeholder="Ucapan dan doa"
        />
      </label>

      <label className="block">
        <span className="sr-only">Konfirmasi Kehadiran</span>
        <select
          value={form.attendance}
          onChange={(event) => updateForm("attendance", event.target.value)}
          required
          className="w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-3.5 text-base font-semibold text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
        >
          <option value="" disabled>
            Konfirmasi Kehadiran
          </option>
          <option value="hadir">Hadir</option>
          <option value="tidak_hadir">Tidak dapat hadir</option>
        </select>
      </label>

      {form.attendance === "hadir" ? (
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-[var(--color-text)]/70">
            Jumlah tamu yang hadir
          </span>
          <input
            type="number"
            min="1"
            max="10"
            value={form.pax}
            onChange={(event) => updateForm("pax", event.target.value)}
            className="w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-3.5 text-base font-semibold text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
          />
        </label>
      ) : null}

      <button className="min-w-32 rounded-xl bg-[var(--color-primary)] px-7 py-3 text-base font-black text-white shadow-md transition-transform hover:-translate-y-0.5">
        Kirim
      </button>

      {status ? (
        <p className="text-sm font-bold text-[var(--color-text)]/75">{status}</p>
      ) : null}
    </form>
  );
}
