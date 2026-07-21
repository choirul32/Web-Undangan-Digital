"use client";

import React, { useEffect, useState } from "react";
import {
  DashboardButton,
  DashboardCard,
  Field,
  TextInput,
} from "./FormControls";
import { prepareImageForUpload } from "../../lib/imageUpload";

export default function BankCatalogManager() {
  const [banks, setBanks] = useState([]);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadBanks = async () => {
    try {
      const response = await fetch("/api/banks");
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal memuat katalog bank.");
      }
      setBanks(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadBanks();
  }, []);

  const addBank = async (event) => {
    event.preventDefault();

    if (!name.trim() || !logo) {
      setMessage("Nama dan gambar bank wajib diisi.");
      return;
    }

    setIsSaving(true);
    setMessage("Mengoptimalkan logo bank...");

    try {
      const prepared = await prepareImageForUpload(logo, "logo");
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("logo", prepared.file);
      setMessage(prepared.message || "Mengunggah logo bank...");
      const response = await fetch("/api/banks", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menambahkan bank.");
      }

      setBanks((current) =>
        [...current, result.data].sort((a, b) => a.name.localeCompare(b.name)),
      );
      setName("");
      setLogo(null);
      event.currentTarget.reset();
      setMessage("Bank berhasil ditambahkan dan sudah tersedia di form Amplop.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const removeBank = async (bank) => {
    setMessage(`Menghapus ${bank.name} dari pilihan...`);

    try {
      const response = await fetch("/api/banks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bank.id }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus bank.");
      }

      setBanks((current) => current.filter((item) => item.id !== bank.id));
      setMessage(
        `${bank.name} dihapus dari pilihan. Logo pada undangan lama tetap dipertahankan.`,
      );
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="space-y-5">
      <form onSubmit={addBank} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <Field label="Nama Bank">
          <TextInput
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Contoh: BCA"
          />
        </Field>
        <Field label="Gambar / Logo">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(event) => setLogo(event.target.files?.[0] || null)}
            className="block w-full rounded-xl border border-[var(--dash-border)] bg-white text-sm font-semibold text-[var(--dash-ink)] file:mr-3 file:border-0 file:bg-[var(--dash-fog)] file:px-3 file:py-2.5 file:font-bold file:text-[var(--dash-ink)]"
          />
        </Field>
        <DashboardButton
          type="submit"
          loading={isSaving}
          className="self-end"
        >
          {isSaving ? "Menyimpan..." : "Tambah Bank"}
        </DashboardButton>
      </form>

      {message ? (
        <p className="text-sm font-semibold text-[var(--color-text)]/70">{message}</p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {banks.map((bank) => (
          <DashboardCard
            key={bank.id}
            className="flex items-center gap-4 bg-[var(--dash-fog)]/45"
          >
            <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg border border-[var(--color-accent-pale)]/50 bg-white p-2">
              <img
                src={bank.logoUrl}
                alt={`Logo ${bank.name}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <p className="min-w-0 flex-1 truncate text-base font-black text-[var(--dash-ink)]">
              {bank.name}
            </p>
            <DashboardButton
              type="button"
              onClick={() => removeBank(bank)}
              variant="danger"
              size="sm"
            >
              Hapus
            </DashboardButton>
          </DashboardCard>
        ))}
        {!banks.length ? (
          <p className="text-sm font-semibold text-[var(--color-text)]/60">
            Belum ada bank. Tambahkan nama dan logo terlebih dahulu.
          </p>
        ) : null}
      </div>
    </div>
  );
}
