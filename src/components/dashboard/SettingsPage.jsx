"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, templates } from "./config";
import { Field, TextInput, SelectInput, TextAreaInput } from "./FormControls";

const storageKey = "nusa-invite:platform-settings";

const defaultSettings = {
  brandName: "NusaInvite",
  adminWhatsapp: "6282226551246",
  domain: "nustainvite.com",
  defaultPackage: "Premium",
  defaultTemplate: "standard",
  paymentInstructions:
    "Pembayaran manual via transfer bank. Admin memverifikasi bukti bayar dari WhatsApp sebelum order diproses.",
  orderMessage:
    "Halo Admin, saya ingin pesan undangan digital. Mohon info paket dan alur pembayarannya.",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const storedSettings = window.localStorage.getItem(storageKey);

      if (storedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(storedSettings) });
      }
    } catch {
      setSettings(defaultSettings);
    }
  }, []);

  const updateSetting = (field, value) => {
    setSettings((current) => ({ ...current, [field]: value }));
    setMessage("");
  };

  const saveSettings = () => {
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
    setMessage("Settings tersimpan lokal untuk workspace admin.");
  };

  const resetSettings = () => {
    window.localStorage.removeItem(storageKey);
    setSettings(defaultSettings);
    setMessage("Settings dikembalikan ke default.");
  };

  const orderWhatsappLink = `https://wa.me/${settings.adminWhatsapp}?text=${encodeURIComponent(settings.orderMessage)}`;

  return (
    <motion.section
      variants={fadeUp}
      className="overflow-hidden rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] shadow-[var(--dash-shadow)]"
    >
      <div className="border-b border-[var(--dash-border)] px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
          Platform Settings
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-[var(--dash-ink)]">
          Pengaturan manual order
        </h2>
        <p className="mt-1 text-sm font-medium leading-6 text-[var(--dash-muted)]">
          Phase awal fokus WA order, pembayaran manual, default paket, dan default template. Billing otomatis belum menjadi scope.
        </p>
      </div>

      <div className="grid gap-5 border-b border-[var(--dash-border)] p-5 md:grid-cols-2">
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
        <Field label="Domain Utama">
          <TextInput
            value={settings.domain}
            onChange={(event) => updateSetting("domain", event.target.value)}
            placeholder="nustainvite.com"
          />
        </Field>
        <Field label="Default Package">
          <SelectInput
            value={settings.defaultPackage}
            onChange={(event) => updateSetting("defaultPackage", event.target.value)}
          >
            <option>Basic</option>
            <option>Premium</option>
            <option>Exclusive</option>
          </SelectInput>
        </Field>
        <Field label="Default Template">
          <SelectInput
            value={settings.defaultTemplate}
            onChange={(event) => updateSetting("defaultTemplate", event.target.value)}
          >
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      <div className="grid gap-5 border-b border-[var(--dash-border)] p-5 lg:grid-cols-2">
        <Field label="Instruksi Pembayaran Manual">
          <TextAreaInput
            value={settings.paymentInstructions}
            onChange={(event) =>
              updateSetting("paymentInstructions", event.target.value)
            }
            rows={6}
          />
        </Field>
        <Field label="Template Pesan Order WhatsApp">
          <TextAreaInput
            value={settings.orderMessage}
            onChange={(event) => updateSetting("orderMessage", event.target.value)}
            rows={6}
          />
        </Field>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-[1fr_320px]">
        <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-fog)]/45 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
            Manual Flow Preview
          </p>
          <p className="mt-2 text-sm font-medium leading-6 text-[var(--dash-muted)]">
            Customer klik WA, admin balas paket, customer bayar manual, admin verifikasi bukti bayar, lalu order dibuat di dashboard.
          </p>
          <a
            href={orderWhatsappLink}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex rounded-md bg-[var(--dash-ink)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--dash-dark)]"
          >
            Test Link WA Order
          </a>
        </div>
        <div className="rounded-[14px] border border-[var(--dash-border)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
            Actions
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={saveSettings}
              className="rounded-md bg-[var(--dash-ink)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--dash-dark)]"
            >
              Save Settings
            </button>
            <button
              type="button"
              onClick={resetSettings}
              className="rounded-md border border-[var(--dash-border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--dash-ink)] hover:bg-[var(--dash-fog)]"
            >
              Reset
            </button>
          </div>
          {message ? (
            <p className="mt-3 text-sm font-medium text-[var(--dash-muted)]">
              {message}
            </p>
          ) : null}
        </div>
      </div>
    </motion.section>
  );
}
