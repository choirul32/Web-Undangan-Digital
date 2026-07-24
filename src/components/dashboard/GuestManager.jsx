"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "./config";
import ConfirmDialog from "./ConfirmDialog";
import {
  DashboardButton,
  DashboardPanel,
  SelectInput,
  TextAreaInput,
  TextInput,
} from "./FormControls";

const defaultBroadcastTemplate =
  "Assalamualaikum Wr. Wb.\n\nYth. {guest_name},\nKami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.\n\nBuka undangan personal:\n{guest_link}\n\nTerima kasih.";

export default function GuestManager({
  invitationSlug = "",
  panelTitle = "Link personal tamu",
  panelDescription,
}) {
  const [guests, setGuests] = useState([]);
  const [guestName, setGuestName] = useState("");
  const [guestGroup, setGuestGroup] = useState("Keluarga");
  const [guestPhone, setGuestPhone] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [rsvpFilter, setRsvpFilter] = useState("all");
  const [editingSlug, setEditingSlug] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [broadcastTemplate, setBroadcastTemplate] = useState(defaultBroadcastTemplate);
  const [bulkImportText, setBulkImportText] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null); // guest object to delete

  useEffect(() => {
    if (!invitationSlug) {
      setGuests([]);
      return undefined;
    }

    let isMounted = true;

    fetch(`/api/guests?invitationSlug=${encodeURIComponent(invitationSlug)}`)
      .then((response) => response.json())
      .then((result) => {
        if (isMounted && Array.isArray(result.data)) {
          setGuests(result.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setGuests([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [invitationSlug]);

  const createSlug = (name) =>
    name
      .toLowerCase()
      .trim()
      .replace(/&/g, "dan")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const groupOptions = useMemo(
    () => Array.from(new Set(["Keluarga", "Teman", "Kantor", "VIP", ...guests.map((guest) => guest.group).filter(Boolean)])),
    [guests],
  );

  const rsvpOptions = useMemo(
    () => Array.from(new Set(guests.map((guest) => guest.rsvpStatus || "Belum RSVP"))),
    [guests],
  );

  const filteredGuests = useMemo(
    () =>
      guests.filter((guest) => {
        const matchGroup = groupFilter === "all" || guest.group === groupFilter;
        const matchRsvp =
          rsvpFilter === "all" || (guest.rsvpStatus || "Belum RSVP") === rsvpFilter;

        return matchGroup && matchRsvp;
      }),
    [guests, groupFilter, rsvpFilter],
  );

  const resetForm = () => {
    setGuestName("");
    setGuestGroup("Keluarga");
    setGuestPhone("");
    setEditingSlug("");
  };

  const getGuestLink = (guest) =>
    `${window.location.origin}/${invitationSlug}/to/${guest.slug}`;

  const normalizeWhatsappNumber = (phone = "") => {
    const digits = String(phone).replace(/\D/g, "");

    if (!digits) {
      return "";
    }

    if (digits.startsWith("0")) {
      return `62${digits.slice(1)}`;
    }

    return digits;
  };

  const buildWhatsappMessage = (guest) =>
    broadcastTemplate
      .replaceAll("{guest_name}", guest.name || "")
      .replaceAll("{guest_link}", getGuestLink(guest))
      .replaceAll("{invitation_slug}", invitationSlug);

  const getWhatsappShareUrl = (guest) => {
    const normalizedPhone = normalizeWhatsappNumber(guest.phone);
    const message = encodeURIComponent(buildWhatsappMessage(guest));

    return normalizedPhone
      ? `https://wa.me/${normalizedPhone}?text=${message}`
      : `https://wa.me/?text=${message}`;
  };

  const saveGuest = async () => {
    if (!guestName.trim()) {
      return;
    }

    const nextSlug = createSlug(guestName);
    const duplicate = guests.some(
      (guest) => guest.slug === nextSlug && guest.slug !== editingSlug,
    );

    if (duplicate) {
      setSaveMessage(`Slug "${nextSlug}" sudah dipakai. Ubah nama tamu agar unik.`);
      return;
    }

    const newGuest = {
      name: guestName.trim(),
      slug: nextSlug,
      group: guestGroup,
      phone: guestPhone.trim(),
      rsvpStatus: "Belum RSVP",
      pax: 0,
    };

    const previousGuests = guests;

    if (editingSlug) {
      setGuests((current) =>
        current.map((guest) =>
          guest.slug === editingSlug
            ? { ...guest, ...newGuest, rsvpStatus: guest.rsvpStatus, pax: guest.pax }
            : guest,
        ),
      );
      setSaveMessage("Mengupdate tamu...");
    } else {
      setGuests((current) => [newGuest, ...current]);
      setSaveMessage("Menyimpan tamu...");
    }

    try {
      const response = await fetch("/api/guests", {
        method: editingSlug ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationSlug,
          originalSlug: editingSlug,
          name: newGuest.name,
          slug: newGuest.slug,
          group: newGuest.group,
          phone: newGuest.phone,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan tamu");
      }

      setSaveMessage(
        result.source === "supabase"
          ? editingSlug
            ? "Tamu berhasil diupdate."
            : "Tamu tersimpan ke Supabase."
          : editingSlug
            ? "Tamu berhasil diupdate."
            : "Tamu berhasil ditambahkan.",
      );
      resetForm();
    } catch (error) {
      setGuests(previousGuests);
      setSaveMessage(error.message || "Perubahan tamu dibatalkan.");
    }
  };

  const editGuest = (guest) => {
    setGuestName(guest.name || "");
    setGuestGroup(guest.group || "Keluarga");
    setGuestPhone(guest.phone || "");
    setEditingSlug(guest.slug);
    setSaveMessage(`Mode edit: ${guest.name}`);
  };

  const deleteGuest = async (guest) => {
    const previousGuests = guests;
    setGuests((current) => current.filter((item) => item.slug !== guest.slug));
    setSaveMessage(`Menghapus ${guest.name}...`);

    try {
      const response = await fetch("/api/guests", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationSlug, slug: guest.slug }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus tamu");
      }

      if (editingSlug === guest.slug) {
        resetForm();
      }
      setSaveMessage("Tamu berhasil dihapus.");
    } catch (error) {
      setGuests(previousGuests);
      setSaveMessage(error.message || "Hapus tamu dibatalkan.");
    }
  };

  const handleDeleteClick = (guest) => {
    setConfirmDelete(guest);
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      deleteGuest(confirmDelete);
    }
    setConfirmDelete(null);
  };

  const copyGuestLink = async (guest) => {
    const link = getGuestLink(guest);

    try {
      await window.navigator.clipboard.writeText(link);
      setCopyMessage(`Link ${guest.name} disalin.`);
    } catch {
      setCopyMessage(link);
    }
  };

  const copyWhatsappMessage = async (guest) => {
    const message = buildWhatsappMessage(guest);

    try {
      await window.navigator.clipboard.writeText(message);
      setCopyMessage(`Teks WhatsApp ${guest.name} disalin.`);
    } catch {
      setCopyMessage(message);
    }
  };

  const copyCustomerGuestManagerLink = async () => {
    try {
      const url = `${window.location.origin}/guest-manager/${encodeURIComponent(invitationSlug)}`;
      await window.navigator.clipboard.writeText(url);
      setCopyMessage("Link Guest Manager lokal untuk pelanggan disalin.");
    } catch (error) {
      setCopyMessage(error.message || "Gagal menyalin link pelanggan.");
    }
  };

  const openWhatsappMessage = (guest) => {
    window.open(getWhatsappShareUrl(guest), "_blank", "noopener,noreferrer");
    setCopyMessage(`WhatsApp ${guest.name} dibuka. Kirim tetap manual.`);
  };

  const copyBulkLinks = async () => {
    const text = guests
      .map((guest) => `${guest.name}\t${guest.phone || "-"}\t${getGuestLink(guest)}`)
      .join("\n");

    try {
      await window.navigator.clipboard.writeText(text);
      setCopyMessage("Daftar nama + link personal disalin. Broadcast tetap manual.");
    } catch {
      setCopyMessage(text);
    }
  };

  const copyBulkWhatsappMessages = async () => {
    const text = guests
      .map((guest) => `--- ${guest.name} ---\n${buildWhatsappMessage(guest)}`)
      .join("\n\n");

    try {
      await window.navigator.clipboard.writeText(text);
      setCopyMessage("Semua teks WhatsApp disalin. Sistem tidak mengirim otomatis.");
    } catch {
      setCopyMessage(text);
    }
  };

  const exportGuestLinksCsv = () => {
    const headers = ["Nama", "Group", "WA", "RSVP", "Link Personal"];
    const rows = guests.map((guest) => [
      guest.name,
      guest.group || "",
      guest.phone || "",
      guest.rsvpStatus || "",
      getGuestLink(guest),
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
    link.download = `guest-links-${invitationSlug}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importBulkGuests = async () => {
    const rows = bulkImportText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, group = "Keluarga", phone = ""] = line.split(/\t|,/).map((value) => value.trim());

        return {
          name,
          group: group || "Keluarga",
          phone,
          slug: createSlug(name || ""),
          rsvpStatus: "Belum RSVP",
          pax: 0,
        };
      })
      .filter((guest) => guest.name && guest.slug);

    const existingSlugs = new Set(guests.map((guest) => guest.slug));
    const uniqueRows = rows.filter((guest) => !existingSlugs.has(guest.slug));

    if (uniqueRows.length === 0) {
      setSaveMessage("Tidak ada tamu baru yang bisa diimport.");
      return;
    }

    const previousGuests = guests;
    setGuests((current) => [...uniqueRows, ...current]);
    setSaveMessage(`Mengimport ${uniqueRows.length} tamu...`);

    try {
      const results = await Promise.all(
        uniqueRows.map((guest) =>
          fetch("/api/guests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              invitationSlug,
              name: guest.name,
              slug: guest.slug,
              group: guest.group,
              phone: guest.phone,
            }),
          }).then(async (response) => {
            const result = await response.json();
            if (!response.ok) {
              throw new Error(result.error || "Import tamu gagal.");
            }
            return result;
          }),
        ),
      );

      const source = results[0]?.source;
      setBulkImportText("");
      setSaveMessage(
        source === "supabase"
          ? `${uniqueRows.length} tamu berhasil diimport.`
          : `${uniqueRows.length} tamu berhasil diimport.`,
      );
    } catch (error) {
      setGuests(previousGuests);
      setSaveMessage(error.message || "Import tamu dibatalkan.");
    }
  };

  if (!invitationSlug) {
    return (
      <motion.div variants={fadeUp}>
        <DashboardPanel
          eyebrow="Guest Manager"
          title="Pilih order aktif dulu"
          description="Panel tamu hanya berjalan untuk satu invitation yang sedang dibuka."
        />
      </motion.div>
    );
  }

  return (
    <motion.section
      variants={fadeUp}
      className="overflow-hidden rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] shadow-[var(--dash-shadow)]"
    >
      <div className="border-b border-[var(--dash-border)] px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
          Guest Manager
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-[var(--dash-ink)]">
          {panelTitle}
        </h2>
        <p className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
          {panelDescription ||
            `Buat link custom seperti /${invitationSlug}/to/bapak-andi. Broadcast tetap manual via WhatsApp.`}
        </p>
      </div>

      <div className="grid gap-3 border-b border-[var(--dash-border)] p-5 lg:grid-cols-[1fr_180px_180px_auto_auto]">
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
        <TextInput
          value={guestPhone}
          onChange={(event) => setGuestPhone(event.target.value)}
          placeholder="WA tamu"
        />
        <DashboardButton
          type="button"
          onClick={saveGuest}
        >
          {editingSlug ? "Update Tamu" : "Tambah Tamu"}
        </DashboardButton>
        {editingSlug ? (
          <DashboardButton
            type="button"
            onClick={resetForm}
            variant="secondary"
          >
            Batal
          </DashboardButton>
        ) : null}
      </div>

      <div className="grid gap-4 border-b border-[var(--dash-border)] p-5 lg:grid-cols-[1fr_320px]">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
            Template Teks WhatsApp Manual
          </span>
          <TextAreaInput
            value={broadcastTemplate}
            onChange={(event) => setBroadcastTemplate(event.target.value)}
            rows={7}
            className="mt-2"
          />
          <p className="mt-2 text-sm font-medium text-[var(--dash-muted)]">
            Token: {"{guest_name}"}, {"{guest_link}"}, {"{invitation_slug}"}.
            Sistem hanya copy/export, tidak broadcast otomatis.
          </p>
        </label>
        <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-fog)]/45 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
            Bulk Manual Broadcast
          </p>
          <div className="mt-4 space-y-2">
            <DashboardButton
              type="button"
              onClick={copyCustomerGuestManagerLink}
              variant="secondary"
              className="w-full justify-start"
            >
              Copy link pelanggan lokal
            </DashboardButton>
            <DashboardButton
              type="button"
              onClick={copyBulkLinks}
              variant="secondary"
              className="w-full justify-start"
            >
              Copy daftar nama + personal link
            </DashboardButton>
            <DashboardButton
              type="button"
              onClick={copyBulkWhatsappMessages}
              variant="secondary"
              className="w-full justify-start"
            >
              Copy semua teks WhatsApp
            </DashboardButton>
            <DashboardButton
              type="button"
              onClick={exportGuestLinksCsv}
              className="w-full justify-start"
            >
              Export CSV guest links
            </DashboardButton>
          </div>
        </div>
      </div>

      <div className="grid gap-4 border-b border-[var(--dash-border)] p-5 lg:grid-cols-[1fr_320px]">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
            Bulk Import Tamu
          </span>
          <TextAreaInput
            value={bulkImportText}
            onChange={(event) => setBulkImportText(event.target.value)}
            rows={5}
            className="mt-2"
            placeholder={"Bapak Andi,Keluarga,62812...\nIbu Sari,Teman,62813..."}
          />
          <p className="mt-2 text-sm font-medium text-[var(--dash-muted)]">
            Format per baris: nama, group, nomor WA. Duplikasi slug akan dilewati.
          </p>
        </label>
        <div className="rounded-[14px] border border-[var(--dash-border)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
            Filter Tamu
          </p>
          <div className="mt-4 grid gap-3">
            <SelectInput value={groupFilter} onChange={(event) => setGroupFilter(event.target.value)}>
              <option value="all">Semua group</option>
              {groupOptions.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </SelectInput>
            <SelectInput value={rsvpFilter} onChange={(event) => setRsvpFilter(event.target.value)}>
              <option value="all">Semua RSVP</option>
              {rsvpOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </SelectInput>
            <DashboardButton
              type="button"
              onClick={importBulkGuests}
            >
              Import Tamu
            </DashboardButton>
          </div>
        </div>
      </div>

      {copyMessage ? (
        <p className="px-5 pt-4 text-sm font-medium text-[var(--dash-ink)]">
          {copyMessage}
        </p>
      ) : null}
      {saveMessage ? (
        <p className="px-5 pt-3 text-sm font-medium text-[var(--dash-muted)]">
          {saveMessage}
        </p>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left">
          <thead className="bg-[var(--dash-fog)] text-xs uppercase tracking-[0.08em] text-[var(--dash-muted)]">
            <tr>
              <th className="px-5 py-3">Nama</th>
              <th className="px-5 py-3">Group</th>
              <th className="px-5 py-3">WA</th>
              <th className="px-5 py-3">RSVP</th>
              <th className="px-5 py-3">Link</th>
              <th className="px-5 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--dash-border)]">
            {filteredGuests.map((guest) => (
              <tr key={guest.slug} className="hover:bg-[var(--dash-fog)]/60">
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-[var(--dash-ink)]">
                    {guest.name}
                  </p>
                  <p className="mt-1 text-xs font-medium text-[var(--dash-muted)]">
                    {guest.slug}
                  </p>
                </td>
                <td className="px-5 py-4 text-sm font-medium text-[var(--dash-muted)]">
                  {guest.group}
                </td>
                <td className="px-5 py-4 text-sm font-medium text-[var(--dash-muted)]">
                  {guest.phone || "-"}
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full border border-[var(--dash-border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--dash-muted)]">
                    {guest.rsvpStatus}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm font-medium text-[var(--dash-muted)]">
                  /{invitationSlug}/to/{guest.slug}
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <DashboardButton
                      type="button"
                      size="sm"
                      onClick={() => copyGuestLink(guest)}
                    >
                      Copy Link
                    </DashboardButton>
                    <DashboardButton
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => copyWhatsappMessage(guest)}
                    >
                      Copy WA
                    </DashboardButton>
                    <DashboardButton
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => openWhatsappMessage(guest)}
                    >
                      Open WA
                    </DashboardButton>
                    <DashboardButton
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => editGuest(guest)}
                    >
                      Edit
                    </DashboardButton>
                    <DashboardButton
                      type="button"
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteClick(guest)}
                    >
                      Delete
                    </DashboardButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Hapus Tamu?"
        message={`"${confirmDelete?.name}" akan dihapus dari daftar tamu. Tindakan ini tidak bisa dibatalkan.`}
        confirmLabel="Ya, Hapus"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </motion.section>
  );
}
