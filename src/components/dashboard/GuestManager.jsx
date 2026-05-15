"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { sampleInvitation } from "../../data/sampleInvitation";
import { fadeUp } from "./config";
import { TextInput, SelectInput } from "./FormControls";

export default function GuestManager() {
  const [guests, setGuests] = useState(sampleInvitation.guests);
  const [guestName, setGuestName] = useState("");
  const [guestGroup, setGuestGroup] = useState("Keluarga");
  const [copyMessage, setCopyMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetch("/api/guests?invitationSlug=dimas-salsa")
      .then((response) => response.json())
      .then((result) => {
        if (isMounted && Array.isArray(result.data)) {
          setGuests(result.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setGuests(sampleInvitation.guests);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const createSlug = (name) =>
    name
      .toLowerCase()
      .trim()
      .replace(/&/g, "dan")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const addGuest = async () => {
    if (!guestName.trim()) {
      return;
    }

    const newGuest = {
      name: guestName.trim(),
      slug: createSlug(guestName),
      group: guestGroup,
      rsvpStatus: "Belum RSVP",
      pax: 0,
    };

    setGuests((current) => [newGuest, ...current]);
    setGuestName("");
    setSaveMessage("Menyimpan tamu...");

    try {
      const response = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationSlug: "dimas-salsa",
          name: newGuest.name,
          slug: newGuest.slug,
          group: newGuest.group,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan tamu");
      }

      setSaveMessage(
        result.source === "supabase"
          ? "Tamu tersimpan ke Supabase."
          : "Tamu ditambahkan sementara. Supabase belum dikonfigurasi.",
      );
    } catch (error) {
      setSaveMessage(error.message || "Tamu ditambahkan secara lokal.");
    }
  };

  const copyGuestLink = async (guest) => {
    const link = `${window.location.origin}/u/dimas-salsa/to/${guest.slug}`;

    try {
      await window.navigator.clipboard.writeText(link);
      setCopyMessage(`Link ${guest.name} disalin.`);
    } catch {
      setCopyMessage(link);
    }
  };

  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] shadow-xl shadow-[var(--color-primary)]/8"
    >
      <div className="border-b border-[var(--color-accent-pale)] px-6 py-5">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
          Guest Manager
        </p>
        <h2 className="mt-2 text-2xl font-black text-[var(--color-primary)]">
          Link personal tamu
        </h2>
        <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
          Buat link custom seperti /u/dimas-salsa/to/bapak-andi.
        </p>
      </div>

      <div className="grid gap-4 border-b border-[var(--color-accent-pale)] p-6 md:grid-cols-[1fr_180px_auto]">
        <TextInput
          value={guestName}
          onChange={(event) => setGuestName(event.target.value)}
          placeholder="Nama tamu, contoh: Bapak Andi"
        />
        <SelectInput
          value={guestGroup}
          onChange={(event) => setGuestGroup(event.target.value)}
        >
          <option>Keluarga</option>
          <option>Teman</option>
          <option>Kantor</option>
          <option>VIP</option>
        </SelectInput>
        <button
          type="button"
          onClick={addGuest}
          className="rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-base font-black text-[var(--color-primary)] hover:bg-[var(--color-accent-soft)]"
        >
          Tambah Tamu
        </button>
      </div>

      {copyMessage ? (
        <p className="px-6 pt-5 text-sm font-bold text-[var(--color-wa)]">
          {copyMessage}
        </p>
      ) : null}
      {saveMessage ? (
        <p className="px-6 pt-3 text-sm font-bold text-[var(--color-text)]">
          {saveMessage}
        </p>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-[var(--color-muted)] text-sm uppercase tracking-[0.12em] text-[var(--color-text)]">
            <tr>
              <th className="px-6 py-4">Nama</th>
              <th className="px-6 py-4">Group</th>
              <th className="px-6 py-4">RSVP</th>
              <th className="px-6 py-4">Link</th>
              <th className="px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-accent-pale)]/65">
            {guests.map((guest) => (
              <tr key={guest.slug} className="hover:bg-[var(--color-bg)]">
                <td className="px-6 py-5">
                  <p className="text-lg font-black text-[var(--color-primary)]">
                    {guest.name}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
                    {guest.slug}
                  </p>
                </td>
                <td className="px-6 py-5 font-bold text-[var(--color-text)]">
                  {guest.group}
                </td>
                <td className="px-6 py-5">
                  <span className="rounded-full bg-[var(--color-section-soft)] px-3 py-1.5 text-sm font-black text-[var(--color-text)]">
                    {guest.rsvpStatus}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm font-semibold text-[var(--color-text)]">
                  /u/dimas-salsa/to/{guest.slug}
                </td>
                <td className="px-6 py-5">
                  <button
                    type="button"
                    onClick={() => copyGuestLink(guest)}
                    className="rounded-xl bg-[var(--color-primary)] px-3 py-2 text-sm font-black text-white hover:bg-[var(--color-primary-hover)]"
                  >
                    Copy Link
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}
