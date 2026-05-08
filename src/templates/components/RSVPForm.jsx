"use client";

import { useState } from "react";

export default function RSVPForm({ invitationSlug, guestSlug, guestName }) {
  const [form, setForm] = useState({
    guestName: guestName || "",
    attendance: "hadir",
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
    <form onSubmit={submitRSVP} className="mt-8 space-y-4 text-left">
      <label className="block">
        <span className="text-sm font-black uppercase tracking-[0.12em] text-white/70">
          Nama
        </span>
        <input
          value={form.guestName}
          onChange={(event) => updateForm("guestName", event.target.value)}
          className="mt-2 w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-base font-bold text-white outline-none placeholder:text-white/35 focus:border-[var(--color-accent)]"
          placeholder="Nama tamu"
          required
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-black uppercase tracking-[0.12em] text-white/70">
            Kehadiran
          </span>
          <select
            value={form.attendance}
            onChange={(event) => updateForm("attendance", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-base font-bold text-white outline-none focus:border-[var(--color-accent)]"
          >
            <option className="text-[var(--color-primary)]" value="hadir">
              Hadir
            </option>
            <option className="text-[var(--color-primary)]" value="tidak_hadir">
              Tidak hadir
            </option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-black uppercase tracking-[0.12em] text-white/70">
            Jumlah Tamu
          </span>
          <input
            type="number"
            min="1"
            max="10"
            value={form.pax}
            onChange={(event) => updateForm("pax", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-base font-bold text-white outline-none focus:border-[var(--color-accent)]"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-black uppercase tracking-[0.12em] text-white/70">
          Ucapan
        </span>
        <textarea
          value={form.message}
          onChange={(event) => updateForm("message", event.target.value)}
          rows={4}
          className="mt-2 w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-base font-bold leading-7 text-white outline-none placeholder:text-white/35 focus:border-[var(--color-accent)]"
          placeholder="Tulis ucapan dan doa..."
        />
      </label>

      <button className="w-full rounded-2xl bg-[var(--color-accent)] px-7 py-4 text-base font-black text-[var(--color-primary)]">
        Kirim RSVP
      </button>

      {status ? (
        <p className="text-center text-sm font-bold text-white/78">{status}</p>
      ) : null}
    </form>
  );
}
