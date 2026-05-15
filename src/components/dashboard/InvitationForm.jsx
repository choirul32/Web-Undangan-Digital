"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { createInvitationFromDashboardForm } from "../../data/sampleInvitation";
import {
  templates,
  fadeUp,
  initialInvitationForm,
  formSteps,
} from "./config";
import { Field, TextInput, SelectInput, ToggleField } from "./FormControls";

export default function InvitationFormPanel() {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState(initialInvitationForm);
  const [saveMessage, setSaveMessage] = useState("");

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveDraft = async () => {
    const invitationDraft = createInvitationFromDashboardForm(form);
    window.localStorage.setItem("nusa-invite:draft", JSON.stringify(invitationDraft));

    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status: "draft" }),
      });
      const result = await response.json();

      setSaveMessage(
        result.source === "supabase"
          ? "Draft tersimpan ke Supabase."
          : "Draft lokal tersimpan. Supabase belum dikonfigurasi.",
      );
    } catch {
      setSaveMessage("Draft lokal tersimpan. API belum tersedia.");
    }
  };

  const openPreview = async () => {
    await saveDraft();
    window.open("/preview", "_blank", "noopener,noreferrer");
  };

  const renderStep = () => {
    if (activeStep === 0) {
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Template">
            <SelectInput
              value={form.templateId}
              onChange={(event) => {
                const selected = templates.find(
                  (template) => template.id === event.target.value,
                );
                updateForm("templateId", event.target.value);
                updateForm("template", selected?.name || "Rana Kirana");
              }}
            >
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Paket">
            <SelectInput
              value={form.package}
              onChange={(event) => updateForm("package", event.target.value)}
            >
              <option>Basic</option>
              <option>Premium</option>
              <option>Exclusive</option>
            </SelectInput>
          </Field>
          <Field label="Slug Public">
            <TextInput
              value={form.slug}
              onChange={(event) => updateForm("slug", event.target.value)}
              placeholder="dimas-salsa"
            />
          </Field>
          <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">
              Public URL
            </p>
            <p className="mt-2 break-all text-lg font-black text-[var(--color-primary)]">
              /u/{form.slug || "slug-undangan"}
            </p>
          </div>
        </div>
      );
    }

    if (activeStep === 1) {
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Nama Mempelai Pria">
            <TextInput
              value={form.groomName}
              onChange={(event) => updateForm("groomName", event.target.value)}
            />
          </Field>
          <Field label="Panggilan Pria">
            <TextInput
              value={form.groomNickname}
              onChange={(event) => updateForm("groomNickname", event.target.value)}
            />
          </Field>
          <Field label="Nama Mempelai Wanita">
            <TextInput
              value={form.brideName}
              onChange={(event) => updateForm("brideName", event.target.value)}
            />
          </Field>
          <Field label="Panggilan Wanita">
            <TextInput
              value={form.brideNickname}
              onChange={(event) => updateForm("brideNickname", event.target.value)}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Quote / Doa Pembuka">
              <textarea
                value={form.quote}
                onChange={(event) => updateForm("quote", event.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-[var(--color-accent-pale)] bg-white px-4 py-3 text-base font-bold leading-7 text-[var(--color-primary)] outline-none transition-colors placeholder:text-[var(--color-text)]/40 focus:border-[var(--color-accent)]"
              />
            </Field>
          </div>
        </div>
      );
    }

    if (activeStep === 2) {
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Judul Acara">
            <TextInput
              value={form.eventTitle}
              onChange={(event) => updateForm("eventTitle", event.target.value)}
            />
          </Field>
          <Field label="Tanggal">
            <TextInput
              type="date"
              value={form.eventDate}
              onChange={(event) => updateForm("eventDate", event.target.value)}
            />
          </Field>
          <Field label="Jam">
            <TextInput
              type="time"
              value={form.eventTime}
              onChange={(event) => updateForm("eventTime", event.target.value)}
            />
          </Field>
          <Field label="Lokasi">
            <TextInput
              value={form.venue}
              onChange={(event) => updateForm("venue", event.target.value)}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Google Maps URL">
              <TextInput
                value={form.mapsUrl}
                onChange={(event) => updateForm("mapsUrl", event.target.value)}
              />
            </Field>
          </div>
        </div>
      );
    }

    if (activeStep === 3) {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <ToggleField
            checked={form.rsvp}
            label="RSVP"
            desc="Aktifkan form konfirmasi kehadiran tamu."
            onChange={(value) => updateForm("rsvp", value)}
          />
          <ToggleField
            checked={form.gift}
            label="Amplop Digital"
            desc="Tampilkan rekening atau e-wallet untuk wedding gift."
            onChange={(value) => updateForm("gift", value)}
          />
          <ToggleField
            checked={form.music}
            label="Backsound"
            desc="Tambahkan musik latar untuk undangan publik."
            onChange={(value) => updateForm("music", value)}
          />
          <ToggleField
            checked={form.guestName}
            label="Custom Nama Tamu"
            desc="Buat link personal untuk setiap tamu undangan."
            onChange={(value) => updateForm("guestName", value)}
          />
        </div>
      );
    }

    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-5">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">
            Ringkasan Data
          </p>
          <dl className="mt-4 grid gap-4 text-base sm:grid-cols-2">
            <div>
              <dt className="font-black text-[var(--color-primary)]">Pasangan</dt>
              <dd className="mt-1 font-semibold text-[var(--color-text)]">
                {form.groomNickname} & {form.brideNickname}
              </dd>
            </div>
            <div>
              <dt className="font-black text-[var(--color-primary)]">Template</dt>
              <dd className="mt-1 font-semibold text-[var(--color-text)]">
                {form.template} | {form.package}
              </dd>
            </div>
            <div>
              <dt className="font-black text-[var(--color-primary)]">Acara</dt>
              <dd className="mt-1 font-semibold text-[var(--color-text)]">
                {form.eventTitle}, {form.eventDate} {form.eventTime}
              </dd>
            </div>
            <div>
              <dt className="font-black text-[var(--color-primary)]">Fitur</dt>
              <dd className="mt-1 font-semibold text-[var(--color-text)]">
                {[form.rsvp && "RSVP", form.gift && "Amplop", form.music && "Music", form.guestName && "Nama Tamu"]
                  .filter(Boolean)
                  .join(", ")}
              </dd>
            </div>
          </dl>
        </div>
        <div className="rounded-[8px] bg-[var(--color-primary)] p-5 text-white">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-soft)]">
            Preview URL
          </p>
          <p className="mt-3 break-all text-lg font-black">/u/{form.slug}</p>
          <button
            type="button"
            onClick={saveDraft}
            className="mt-5 w-full rounded-2xl bg-[var(--color-accent)] px-4 py-3 text-base font-black text-[var(--color-primary)] hover:bg-[var(--color-accent-soft)]"
          >
            Simpan Draft
          </button>
          <button
            type="button"
            onClick={openPreview}
            className="mt-3 w-full rounded-2xl bg-white px-4 py-3 text-base font-black text-[var(--color-primary)] hover:bg-[var(--color-bg)]"
          >
            Preview Undangan
          </button>
        </div>
      </div>
    );
  };

  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] shadow-xl shadow-[var(--color-primary)]/8"
    >
      <div className="border-b border-[var(--color-accent-pale)] px-6 py-5">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
          Create / Edit
        </p>
        <h2 className="mt-2 text-2xl font-black text-[var(--color-primary)]">
          Form data undangan
        </h2>
        <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
          Struktur form ini disiapkan agar nanti langsung bisa disimpan ke tabel undangan.
        </p>
      </div>

      <div className="border-b border-[var(--color-accent-pale)] px-6 py-4">
        <div className="flex flex-wrap gap-3">
          {formSteps.map((step, index) => (
            <button
              key={step}
              type="button"
              onClick={() => setActiveStep(index)}
              className={`rounded-2xl border px-4 py-2 text-sm font-black transition-colors ${
                activeStep === index
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : "border-[var(--color-accent-pale)] bg-white text-[var(--color-text)] hover:border-[var(--color-accent)]"
              }`}
            >
              {index + 1}. {step}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">{renderStep()}</div>

      <div className="flex items-center justify-between gap-3 border-t border-[var(--color-accent-pale)] px-6 py-5">
        <button
          type="button"
          disabled={activeStep === 0}
          onClick={() => setActiveStep((current) => Math.max(0, current - 1))}
          className="rounded-2xl border border-[var(--color-accent-pale)] bg-white px-5 py-3 text-base font-black text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Sebelumnya
        </button>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {saveMessage ? (
            <p className="text-sm font-bold text-[var(--color-wa)]">{saveMessage}</p>
          ) : null}
          {activeStep === formSteps.length - 1 ? (
            <button
              type="button"
              onClick={openPreview}
              className="rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-base font-black text-white transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              Preview
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              if (activeStep === formSteps.length - 1) {
                saveDraft();
                return;
              }
              setActiveStep((current) => Math.min(formSteps.length - 1, current + 1));
            }}
            className="rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-base font-black text-[var(--color-primary)] transition-colors hover:bg-[var(--color-accent-soft)]"
          >
            {activeStep === formSteps.length - 1 ? "Simpan Draft" : "Lanjut"}
          </button>
        </div>
      </div>
    </motion.section>
  );
}
