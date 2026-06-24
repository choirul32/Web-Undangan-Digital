"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "./config";
import BankCatalogManager from "./BankCatalogManager";
import {
  DashboardButton,
  Field,
  SelectInput,
  TextAreaInput,
  TextInput,
} from "./FormControls";
import { readFileAsDataUrl } from "./widget-previews/shared";

const storageKey = "nusa-invite:platform-settings";

const defaultSettings = {
  brandName: "Nusa Event Organizer",
  adminWhatsapp: "6281234567890",
  contactEmail: "hello@nusaevent.com",
  domain: "nustainvite.com",
  defaultPackage: "Premium",
  defaultTemplate: "standard",
  defaultTemplateThumbnail: "/assets/CoverPasangan.png",
  defaultGroomPhoto: "/assets/catin_pria.jpg",
  defaultBridePhoto: "/assets/catin_wanita.jpg",
  paymentInstructions:
    "Pembayaran manual via transfer bank. Admin memverifikasi bukti bayar dari WhatsApp sebelum order diproses.",
  orderMessage:
    "Halo [Nama Tamu],\nKami sangat berbahagia mengundang Anda untuk hadir di acara pernikahan kami.\nSilakan akses undangan digital melalui tautan berikut: [Link Undangan]\n\nTerima kasih.",
  timezone: "WIB",
  dateFormat: "DD MMMM YYYY",
  dashboardTheme: "light",
  dashboardPalette: "royal-gold",
  autoSaveDraft: true,
  internalNotes: "",
  integrations: {
    emailGateway: "active",
    whatsappApi: "active",
  },
  packagePrices: {
    basic: "Rp 45.000",
    premium: "Rp 90.000",
    exclusive: "Rp 149.000",
  },
};

const dashboardPalettes = [
  { id: "royal-gold", name: "Royal Gold", colors: ["#1f2a44", "#c8a96b", "#f8f3ea"] },
  { id: "ocean-cyan", name: "Ocean Mist", colors: ["#1f3a5f", "#3c8dad", "#eef5fb"] },
  { id: "sunset-coral", name: "Terracotta Calm", colors: ["#5b3a2e", "#c98b6a", "#fbf1eb"] },
  { id: "forest-lime", name: "Sage Olive", colors: ["#344a3f", "#8da06f", "#f2f5ee"] },
  { id: "mono-slate", name: "Slate Neutral", colors: ["#2f3542", "#7d8793", "#f3f5f7"] },
];

function ImageUploadControl({ field, uploadingField, onUpload, showReset, onReset }) {
  const isUploading = uploadingField === field;
  return (
    <div className="space-y-3">
      <label
        className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-accent-pale)] bg-white px-4 py-2 text-sm font-bold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-bg)] ${
          isUploading ? "pointer-events-none opacity-60" : ""
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="M17 8l-5-5-5 5" />
          <path d="M12 3v12" />
        </svg>
        {isUploading ? "Mengunggah..." : "Upload Gambar"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={isUploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onUpload(field, file);
            }
            event.target.value = "";
          }}
        />
      </label>
      {showReset ? (
        <DashboardButton type="button" variant="secondary" size="sm" onClick={onReset}>
          Hapus & pakai default
        </DashboardButton>
      ) : null}
    </div>
  );
}

function SectionCard({ title, desc, onReset, children }) {
  return (
    <section className="rounded-xl border border-[var(--color-accent-pale)]/40 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-[var(--color-text)]">{title}</h3>
          <p className="mt-1 text-sm font-semibold text-[var(--color-text)]/70">{desc}</p>
        </div>
        {onReset ? (
          <DashboardButton
            type="button"
            onClick={onReset}
            variant="secondary"
            size="sm"
          >
            Reset
          </DashboardButton>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [message, setMessage] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [uploadingField, setUploadingField] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetch("/api/settings")
      .then((res) => res.json())
      .then((res) => {
        if (!isMounted) return;
        if (res.data) {
          setSettings({ ...defaultSettings, ...res.data });
        } else {
          const stored = window.localStorage.getItem(storageKey);
          if (stored) {
            setSettings({ ...defaultSettings, ...JSON.parse(stored) });
          }
        }
      })
      .catch(() => {
        if (!isMounted) return;
        const stored = window.localStorage.getItem(storageKey);
        if (stored) {
          setSettings({ ...defaultSettings, ...JSON.parse(stored) });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateSetting = (field, value) => {
    setSettings((current) => ({ ...current, [field]: value }));
    setMessage("");
    setIsDirty(true);
  };

  const uploadSettingImage = async (field, file) => {
    if (!file) {
      return;
    }

    // Instant local preview (and the value used in dev/sample mode).
    const dataUrl = await readFileAsDataUrl(file);
    updateSetting(field, dataUrl);

    setUploadingField(field);
    setMessage("Mengunggah gambar...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/settings/thumbnail", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal mengunggah gambar.");
      }
      if (result?.data?.url) {
        updateSetting(field, result.data.url);
        setMessage("Gambar terunggah. Jangan lupa Simpan Perubahan.");
      } else {
        setMessage("Gambar aktif secara lokal. Jangan lupa Simpan Perubahan.");
      }
    } catch (err) {
      setMessage(`Gambar dipakai lokal (server offline: ${err.message}).`);
    } finally {
      setUploadingField("");
    }
  };

  const updateIntegration = (field, value) => {
    setSettings((current) => ({
      ...current,
      integrations: {
        ...(current.integrations || {}),
        [field]: value,
      },
    }));
    setMessage("");
    setIsDirty(true);
  };

  const saveSettings = async () => {
    setMessage("Menyimpan pengaturan...");
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.error || "Gagal menyimpan ke server.");
      }

      window.localStorage.setItem(storageKey, JSON.stringify(settings));
      window.dispatchEvent(
        new CustomEvent("nusa-invite:settings-updated", {
          detail: { settings },
        }),
      );
      setMessage("Pengaturan berhasil disimpan.");
      setIsDirty(false);
    } catch (err) {
      window.localStorage.setItem(storageKey, JSON.stringify(settings));
      window.dispatchEvent(
        new CustomEvent("nusa-invite:settings-updated", {
          detail: { settings },
        }),
      );
      setMessage(`Tersimpan lokal (server offline: ${err.message})`);
      setIsDirty(false);
    }
  };

  const resetSettings = async () => {
    setMessage("Mengembalikan ke default...");
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: defaultSettings }),
      });
      if (!response.ok) {
        throw new Error("Gagal mereset di server.");
      }
      setSettings(defaultSettings);
      window.localStorage.removeItem(storageKey);
      window.dispatchEvent(
        new CustomEvent("nusa-invite:settings-updated", {
          detail: { settings: defaultSettings },
        }),
      );
      setMessage("Pengaturan dikembalikan ke default.");
      setIsDirty(false);
    } catch (err) {
      setSettings(defaultSettings);
      window.localStorage.removeItem(storageKey);
      window.dispatchEvent(
        new CustomEvent("nusa-invite:settings-updated", {
          detail: { settings: defaultSettings },
        }),
      );
      setMessage("Pengaturan dikembalikan ke default secara lokal.");
      setIsDirty(true);
    }
  };

  const orderWhatsappLink = useMemo(
    () =>
      `https://wa.me/${settings.adminWhatsapp}?text=${encodeURIComponent(
        settings.orderMessage,
      )}`,
    [settings.adminWhatsapp, settings.orderMessage],
  );

  return (
    <motion.section variants={fadeUp} className="mx-auto w-full max-w-4xl space-y-6 pb-28">
      <div>
        <h2 className="text-3xl font-black text-[var(--color-primary)]">Pengaturan</h2>
        <p className="mt-1 text-sm font-semibold text-[var(--color-text)]/80">
          Kelola profil bisnis, default teks, preferensi sistem, dan operasional.
        </p>
      </div>

      <SectionCard
        title="Profil Bisnis"
        desc="Kelola informasi dasar brand dan kontak yang ditampilkan ke customer."
        onReset={() => {
          updateSetting("brandName", defaultSettings.brandName);
          updateSetting("adminWhatsapp", defaultSettings.adminWhatsapp);
          updateSetting("contactEmail", defaultSettings.contactEmail);
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nama Brand">
            <TextInput
              value={settings.brandName}
              onChange={(event) => updateSetting("brandName", event.target.value)}
            />
          </Field>
          <Field label="Nomor WhatsApp Admin">
            <TextInput
              value={settings.adminWhatsapp}
              onChange={(event) => updateSetting("adminWhatsapp", event.target.value)}
              placeholder="62812..."
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Email Kontak">
              <TextInput
                type="email"
                value={settings.contactEmail}
                onChange={(event) => updateSetting("contactEmail", event.target.value)}
              />
            </Field>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Default Teks"
        desc="Atur template pesan standar untuk broadcast dan fallback teks."
        onReset={() => {
          updateSetting("orderMessage", defaultSettings.orderMessage);
          updateSetting("paymentInstructions", defaultSettings.paymentInstructions);
        }}
      >
        <div className="space-y-5">
          <Field label="Pesan Broadcast Default">
            <TextAreaInput
              value={settings.orderMessage}
              onChange={(event) => updateSetting("orderMessage", event.target.value)}
              rows={5}
            />
          </Field>
          <div className="flex flex-wrap gap-2">
            <span className="rounded bg-[var(--color-muted)] px-2 py-1 text-xs font-black text-[var(--color-text)]/75">
              [Nama Tamu]
            </span>
            <span className="rounded bg-[var(--color-muted)] px-2 py-1 text-xs font-black text-[var(--color-text)]/75">
              [Link Undangan]
            </span>
          </div>
          <Field label="Instruksi Pembayaran Manual">
            <TextAreaInput
              value={settings.paymentInstructions}
              onChange={(event) => updateSetting("paymentInstructions", event.target.value)}
              rows={4}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Thumbnail Template Default"
        desc="Gambar cadangan yang dipakai saat sebuah template belum punya thumbnail sendiri. Tampil di katalog dashboard dan landing page."
        onReset={() =>
          updateSetting("defaultTemplateThumbnail", defaultSettings.defaultTemplateThumbnail)
        }
      >
        <div className="flex flex-wrap items-start gap-5">
          <div className="shrink-0">
            <img
              src={settings.defaultTemplateThumbnail || defaultSettings.defaultTemplateThumbnail}
              alt="Pratinjau thumbnail default"
              className="aspect-[4/5] w-28 rounded-lg border border-[var(--color-accent-pale)] bg-[var(--color-muted)] object-cover"
            />
          </div>
          <div className="min-w-[220px] flex-1 space-y-3">
            <ImageUploadControl
              field="defaultTemplateThumbnail"
              uploadingField={uploadingField}
              onUpload={uploadSettingImage}
              showReset={
                settings.defaultTemplateThumbnail &&
                settings.defaultTemplateThumbnail !== defaultSettings.defaultTemplateThumbnail
              }
              onReset={() =>
                updateSetting("defaultTemplateThumbnail", defaultSettings.defaultTemplateThumbnail)
              }
            />
            <p className="text-xs font-medium text-[var(--color-text)]/60">
              Format gambar (PNG/JPG/SVG). Rekomendasi rasio potret 4:5. Klik Simpan Perubahan setelah upload.
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Foto Mempelai Default"
        desc="Pas foto cadangan untuk section Mempelai (di atas nama). Dipakai saat undangan belum upload foto mempelai sendiri."
        onReset={() => {
          updateSetting("defaultGroomPhoto", defaultSettings.defaultGroomPhoto);
          updateSetting("defaultBridePhoto", defaultSettings.defaultBridePhoto);
        }}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            { field: "defaultGroomPhoto", label: "Foto Mempelai Pria" },
            { field: "defaultBridePhoto", label: "Foto Mempelai Wanita" },
          ].map(({ field, label }) => (
            <div key={field} className="flex items-start gap-4">
              <img
                src={settings[field] || defaultSettings[field]}
                alt={`Pratinjau ${label}`}
                className="aspect-[3/4] w-24 shrink-0 rounded-lg border border-[var(--color-accent-pale)] bg-[var(--color-muted)] object-cover"
              />
              <div className="min-w-[160px] flex-1 space-y-2">
                <p className="text-sm font-bold text-[var(--color-text)]">{label}</p>
                <ImageUploadControl
                  field={field}
                  uploadingField={uploadingField}
                  onUpload={uploadSettingImage}
                  showReset={settings[field] && settings[field] !== defaultSettings[field]}
                  onReset={() => updateSetting(field, defaultSettings[field])}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs font-medium text-[var(--color-text)]/60">
          Rekomendasi rasio potret 3:4. Klik Simpan Perubahan setelah upload.
        </p>
      </SectionCard>

      <SectionCard
        title="Katalog Bank"
        desc="Daftar nama dan logo bank yang dapat dipilih saat mengisi Amplop Digital."
      >
        <BankCatalogManager />
      </SectionCard>

      <SectionCard title="Preferensi Sistem" desc="Konfigurasi zona waktu, format tanggal, tema, dan perilaku preview.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Zona Waktu">
            <SelectInput
              value={settings.timezone}
              onChange={(event) => updateSetting("timezone", event.target.value)}
            >
              <option value="WIB">Waktu Indonesia Barat (WIB) - GMT+7</option>
              <option value="WITA">Waktu Indonesia Tengah (WITA) - GMT+8</option>
              <option value="WIT">Waktu Indonesia Timur (WIT) - GMT+9</option>
            </SelectInput>
          </Field>
          <Field label="Format Tanggal">
            <SelectInput
              value={settings.dateFormat}
              onChange={(event) => updateSetting("dateFormat", event.target.value)}
            >
              <option value="DD MMMM YYYY">15 Agustus 2024 (DD MMMM YYYY)</option>
              <option value="DD/MM/YYYY">15/08/2024 (DD/MM/YYYY)</option>
              <option value="MMMM DD, YYYY">Agustus 15, 2024 (MMMM DD, YYYY)</option>
            </SelectInput>
          </Field>
          <div className="md:col-span-2">
            <Field label="Tema Dashboard">
              <div className="flex w-full max-w-md rounded-xl bg-[var(--color-muted)] p-1">
                {[
                  { id: "light", label: "Terang" },
                  { id: "dark", label: "Gelap" },
                  { id: "system", label: "Sistem" },
                ].map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => updateSetting("dashboardTheme", theme.id)}
                    className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                      settings.dashboardTheme === theme.id
                        ? "bg-white text-[var(--color-text)] shadow-sm"
                        : "text-[var(--color-text)]/70 hover:text-[var(--color-text)]"
                    }`}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Palet Warna Dashboard">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {dashboardPalettes.map((palette) => {
                  const selected = settings.dashboardPalette === palette.id;
                  return (
                    <button
                      key={palette.id}
                      type="button"
                      onClick={() => updateSetting("dashboardPalette", palette.id)}
                      className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                        selected
                          ? "border-[var(--color-accent)] bg-[var(--color-bg)]"
                          : "border-[var(--color-accent-pale)] bg-white hover:bg-[var(--color-bg)]"
                      }`}
                    >
                      <p className="text-xs font-bold text-[var(--color-text)]">{palette.name}</p>
                      <div className="mt-2 flex items-center gap-1.5">
                        {palette.colors.map((color) => (
                          <span
                            key={color}
                            className="h-4 w-4 rounded-full border border-black/10"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center justify-between rounded-lg border border-[var(--color-accent-pale)]/50 bg-white px-3 py-3">
              <div>
                <p className="text-sm font-bold text-[var(--color-text)]">Auto-Save Mode Draft</p>
                <p className="text-xs font-semibold text-[var(--color-text)]/70">
                  Simpan perubahan otomatis saat edit undangan/template.
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateSetting("autoSaveDraft", !settings.autoSaveDraft)}
                className={`relative h-6 w-10 rounded-full transition-colors ${
                  settings.autoSaveDraft ? "bg-[var(--color-accent)]" : "bg-[var(--color-muted)]"
                }`}
                aria-label="Toggle Auto-Save"
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                    settings.autoSaveDraft ? "left-5" : "left-1"
                  }`}
                />
              </button>
            </label>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Integrasi & Operasional" desc="Status koneksi API dan catatan internal tim admin.">
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-[var(--color-accent-pale)]/40 bg-[var(--color-muted)]/45 p-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16v16H4z" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-black text-[var(--color-text)]">Email Gateway</p>
                <p className="text-xs font-semibold text-[var(--color-text)]/70">Terhubung via SendGrid</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                updateIntegration(
                  "emailGateway",
                  settings.integrations.emailGateway === "active" ? "disabled" : "active",
                )
              }
              className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-bold ${
                settings.integrations.emailGateway === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-white text-[var(--color-text)]/65 border border-[var(--color-accent-pale)]"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${settings.integrations.emailGateway === "active" ? "bg-green-500" : "bg-[var(--color-text)]/40"}`} />
              {settings.integrations.emailGateway === "active" ? "Aktif" : "Nonaktif"}
            </button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-[var(--color-accent-pale)]/40 bg-[var(--color-muted)]/45 p-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)]/20 text-[var(--color-primary)]">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 0 1-13.2 7.9L3 21l1.1-4.5A9 9 0 1 1 21 12Z" />
                  <path d="M9 10h.01" />
                  <path d="M12 10h.01" />
                  <path d="M15 10h.01" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-black text-[var(--color-text)]">WhatsApp API</p>
                <p className="text-xs font-semibold text-[var(--color-text)]/70">Terhubung via Wablas</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                updateIntegration(
                  "whatsappApi",
                  settings.integrations.whatsappApi === "active" ? "disabled" : "active",
                )
              }
              className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-bold ${
                settings.integrations.whatsappApi === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-white text-[var(--color-text)]/65 border border-[var(--color-accent-pale)]"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${settings.integrations.whatsappApi === "active" ? "bg-green-500" : "bg-[var(--color-text)]/40"}`} />
              {settings.integrations.whatsappApi === "active" ? "Aktif" : "Nonaktif"}
            </button>
          </div>

          <Field label="Catatan Internal (Hanya Admin)">
            <TextAreaInput
              value={settings.internalNotes}
              onChange={(event) => updateSetting("internalNotes", event.target.value)}
              rows={3}
              placeholder="Tambahkan catatan khusus untuk tim admin..."
            />
          </Field>

          <a
            href={orderWhatsappLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-lg border border-[var(--color-accent-pale)] bg-white px-4 py-2 text-sm font-bold text-[var(--color-primary)] hover:bg-[var(--color-bg)]"
          >
            Test Link WA Order
          </a>
        </div>
      </SectionCard>

      <SectionCard
        title="Paket & Harga"
        desc="Harga yang ditampilkan di landing page. Ubah sesuai promo atau update tarif terbaru."
        onReset={() => {
          setSettings((current) => ({
            ...current,
            packagePrices: defaultSettings.packagePrices,
          }));
          setIsDirty(true);
        }}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Harga Paket Basic">
            <TextInput
              value={settings.packagePrices?.basic ?? defaultSettings.packagePrices.basic}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  packagePrices: { ...(current.packagePrices || {}), basic: event.target.value },
                }))
              }
              placeholder="Rp 45.000"
            />
          </Field>
          <Field label="Harga Paket Premium">
            <TextInput
              value={settings.packagePrices?.premium ?? defaultSettings.packagePrices.premium}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  packagePrices: { ...(current.packagePrices || {}), premium: event.target.value },
                }))
              }
              placeholder="Rp 90.000"
            />
          </Field>
          <Field label="Harga Paket Exclusive">
            <TextInput
              value={settings.packagePrices?.exclusive ?? defaultSettings.packagePrices.exclusive}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  packagePrices: { ...(current.packagePrices || {}), exclusive: event.target.value },
                }))
              }
              placeholder="Rp 149.000"
            />
          </Field>
        </div>
        <p className="mt-3 text-xs font-medium text-[var(--color-text)]/60">
          Harga ini akan langsung tampil di landing page setelah disimpan.
        </p>
      </SectionCard>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--color-accent-pale)] bg-white/95 px-4 py-3 backdrop-blur md:left-64">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4">
          <p className="hidden text-sm font-semibold text-[var(--color-text)]/70 sm:block">
            {isDirty ? "Anda memiliki perubahan yang belum disimpan." : "Semua perubahan sudah tersimpan."}
          </p>
          <div className="flex w-full gap-3 sm:w-auto">
            <DashboardButton
              type="button"
              onClick={resetSettings}
              variant="secondary"
              className="flex-1 sm:flex-none"
            >
              Batal
            </DashboardButton>
            <DashboardButton
              type="button"
              onClick={saveSettings}
              className="flex-1 sm:flex-none"
            >
              Simpan Perubahan
            </DashboardButton>
          </div>
        </div>
        {message ? (
          <p className="mx-auto mt-2 w-full max-w-4xl text-xs font-semibold text-[var(--color-text)]/70">
            {message}
          </p>
        ) : null}
      </div>
    </motion.section>
  );
}
