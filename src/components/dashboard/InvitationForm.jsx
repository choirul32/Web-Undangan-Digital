"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createInvitationFromDashboardForm } from "../../data/sampleInvitation";
import {
  templates,
  fadeUp,
  initialInvitationForm,
  formSteps,
} from "./config";
import { Field, TextInput, SelectInput, ToggleField, TextAreaInput } from "./FormControls";

const mutedPanelClass =
  "rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-fog)]/45 p-4";

const actionButtonClass =
  "rounded-md border border-[var(--dash-border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--dash-ink)] transition-colors hover:bg-[var(--dash-fog)]";

const primaryButtonClass =
  "rounded-md bg-[var(--dash-ink)] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--dash-dark)]";

const lifecycleOptions = ["draft", "review", "published", "archived"];

function invitationToForm(invitation) {
  const event = invitation?.events?.[0] || {};
  const template = templates.find((item) => item.id === invitation?.templateId);

  return {
    ...initialInvitationForm,
    template: template?.name || invitation?.templateId || initialInvitationForm.template,
    templateId: invitation?.templateId || initialInvitationForm.templateId,
    package: invitation?.package || initialInvitationForm.package,
    slug: invitation?.slug || initialInvitationForm.slug,
    status: invitation?.status || "draft",
    customerName:
      invitation?.order?.customerName || initialInvitationForm.customerName,
    customerWhatsapp:
      invitation?.order?.customerWhatsapp || initialInvitationForm.customerWhatsapp,
    orderStatus: invitation?.order?.status || initialInvitationForm.orderStatus,
    paymentStatus:
      invitation?.order?.paymentStatus || initialInvitationForm.paymentStatus,
    orderAmount:
      invitation?.order?.amount?.toString() || initialInvitationForm.orderAmount,
    orderDeadline:
      invitation?.order?.deadline || initialInvitationForm.orderDeadline,
    conceptNotes:
      invitation?.order?.conceptNotes || initialInvitationForm.conceptNotes,
    paymentNotes:
      invitation?.order?.paymentNotes || initialInvitationForm.paymentNotes,
    groomName: invitation?.couple?.groomName || initialInvitationForm.groomName,
    groomNickname:
      invitation?.couple?.groomNickname || initialInvitationForm.groomNickname,
    brideName: invitation?.couple?.brideName || initialInvitationForm.brideName,
    brideNickname:
      invitation?.couple?.brideNickname || initialInvitationForm.brideNickname,
    quote: invitation?.couple?.quote || initialInvitationForm.quote,
    eventTitle: event.title || initialInvitationForm.eventTitle,
    eventDate: event.date || initialInvitationForm.eventDate,
    eventTime: event.time || initialInvitationForm.eventTime,
    venue: event.venue || initialInvitationForm.venue,
    mapsUrl: event.mapsUrl || initialInvitationForm.mapsUrl,
    rsvp: Boolean(invitation?.features?.rsvp ?? initialInvitationForm.rsvp),
    gift: Boolean(invitation?.features?.gift ?? initialInvitationForm.gift),
    music: Boolean(invitation?.features?.music ?? initialInvitationForm.music),
    guestName: Boolean(
      invitation?.features?.guestName ?? initialInvitationForm.guestName,
    ),
  };
}

export default function InvitationFormPanel({ invitationSlug = "" }) {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({
    ...initialInvitationForm,
    slug: invitationSlug || initialInvitationForm.slug,
  });
  const [saveMessage, setSaveMessage] = useState("");
  const [publishErrors, setPublishErrors] = useState([]);

  useEffect(() => {
    if (!invitationSlug) {
      return;
    }

    let isMounted = true;

    fetch(`/api/invitations/${encodeURIComponent(invitationSlug)}`)
      .then((response) => response.json())
      .then((result) => {
        if (isMounted && result.data) {
          setForm(invitationToForm(result.data));
        }
      })
      .catch(() => {
        if (isMounted) {
          setForm((current) => ({ ...current, slug: invitationSlug }));
        }
      });

    return () => {
      isMounted = false;
    };
  }, [invitationSlug]);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setPublishErrors([]);
  };

  const saveDraft = async (overrides = {}) => {
    const nextForm = { ...form, ...overrides };
    const invitationDraft = createInvitationFromDashboardForm(nextForm);
    window.localStorage.setItem("nusa-invite:draft", JSON.stringify(invitationDraft));

    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...nextForm, status: nextForm.status || "draft" }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan draft.");
      }

      setSaveMessage(
        result.source === "supabase"
          ? "Draft tersimpan ke Supabase."
          : "Draft lokal tersimpan. Supabase belum dikonfigurasi.",
      );
      return true;
    } catch (error) {
      setSaveMessage(error.message || "Draft lokal tersimpan. API belum tersedia.");
      return false;
    }
  };

  const markReview = async () => {
    setSaveMessage("Menandai order sebagai review...");
    const saved = await saveDraft({ status: "review", orderStatus: "review" });

    if (saved) {
      setForm((current) => ({ ...current, status: "review", orderStatus: "review" }));
      setSaveMessage("Order ditandai sebagai review. Kirim preview ke customer via WhatsApp.");
    }
  };

  const publishInvitation = async () => {
    const slug = form.slug || invitationSlug;

    if (!slug) {
      setPublishErrors(["Slug public wajib diisi sebelum publish."]);
      return;
    }

    setSaveMessage("Menyimpan draft sebelum publish...");
    const saved = await saveDraft();
    if (!saved) {
      setPublishErrors(["Draft belum berhasil disimpan, publish dihentikan."]);
      return;
    }

    setSaveMessage("Menjalankan publish guard...");

    try {
      const response = await fetch(`/api/invitations/${encodeURIComponent(slug)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish" }),
      });
      const result = await response.json();

      if (!response.ok) {
        setPublishErrors(
          Array.isArray(result.details)
            ? result.details
            : [result.error || "Undangan belum bisa dipublish."],
        );
        setSaveMessage("Publish dibatalkan. Lengkapi data yang wajib dulu.");
        return;
      }

      setForm((current) => ({ ...current, status: "published" }));
      setPublishErrors([]);
      setSaveMessage(
        result.source === "supabase"
          ? "Undangan berhasil dipublish."
          : "Mode sample: undangan dianggap published.",
      );
    } catch (error) {
      setPublishErrors([error.message || "Publish gagal."]);
      setSaveMessage("Publish gagal.");
    }
  };

  const archiveInvitation = async () => {
    const slug = form.slug || invitationSlug;

    if (!slug) {
      setPublishErrors(["Slug public wajib diisi sebelum archive."]);
      return;
    }

    setSaveMessage("Mengarsipkan undangan...");

    try {
      const response = await fetch(`/api/invitations/${encodeURIComponent(slug)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "archive" }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Archive gagal.");
      }

      setForm((current) => ({ ...current, status: "archived" }));
      setPublishErrors([]);
      setSaveMessage(
        result.source === "supabase"
          ? "Undangan berhasil diarsipkan."
          : "Mode sample: undangan dianggap archived.",
      );
    } catch (error) {
      setPublishErrors([error.message || "Archive gagal."]);
      setSaveMessage("Archive gagal.");
    }
  };

  const openPreview = async () => {
    await saveDraft();
    const slug = form.slug || invitationSlug;
    const previewUrl = slug ? `/preview?slug=${encodeURIComponent(slug)}` : "/preview";
    window.open(previewUrl, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    const handleEditorAction = (event) => {
      const action = event.detail?.action;

      if (action === "save") {
        saveDraft();
      }

      if (action === "publish") {
        publishInvitation();
      }
    };

    window.addEventListener("nusa-invite:active-editor-action", handleEditorAction);

    return () => {
      window.removeEventListener("nusa-invite:active-editor-action", handleEditorAction);
    };
  });

  const renderStep = () => {
    if (activeStep === 0) {
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Nama Pemesan">
            <TextInput
              value={form.customerName}
              onChange={(event) => updateForm("customerName", event.target.value)}
              placeholder="Nama customer dari WhatsApp"
            />
          </Field>
          <Field label="Nomor WhatsApp">
            <TextInput
              value={form.customerWhatsapp}
              onChange={(event) =>
                updateForm("customerWhatsapp", event.target.value)
              }
              placeholder="62812..."
            />
          </Field>
          <Field label="Status Order">
            <SelectInput
              value={form.orderStatus}
              onChange={(event) => updateForm("orderStatus", event.target.value)}
            >
              <option value="inquiry">Inquiry</option>
              <option value="waiting_payment">Waiting Payment</option>
              <option value="paid">Paid</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="revision">Revision</option>
              <option value="approved">Approved</option>
              <option value="published">Published</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </SelectInput>
          </Field>
          <Field label="Lifecycle Undangan">
            <SelectInput
              value={form.status || "draft"}
              onChange={(event) => updateForm("status", event.target.value)}
            >
              {lifecycleOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Status Pembayaran">
            <SelectInput
              value={form.paymentStatus}
              onChange={(event) => updateForm("paymentStatus", event.target.value)}
            >
              <option value="unpaid">Unpaid</option>
              <option value="waiting_confirmation">Waiting Confirmation</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </SelectInput>
          </Field>
          <Field label="Nominal Order">
            <TextInput
              type="number"
              value={form.orderAmount}
              onChange={(event) => updateForm("orderAmount", event.target.value)}
              placeholder="1500000"
            />
          </Field>
          <Field label="Deadline">
            <TextInput
              type="date"
              value={form.orderDeadline}
              onChange={(event) => updateForm("orderDeadline", event.target.value)}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Catatan Konsep">
              <TextAreaInput
                value={form.conceptNotes}
                onChange={(event) => updateForm("conceptNotes", event.target.value)}
                rows={4}
                placeholder="Catatan request dari WhatsApp"
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Catatan Pembayaran">
              <TextAreaInput
                value={form.paymentNotes}
                onChange={(event) => updateForm("paymentNotes", event.target.value)}
                rows={3}
                placeholder="Contoh: transfer BCA, DP 50%, bukti bayar via WA"
              />
            </Field>
          </div>
        </div>
      );
    }

    if (activeStep === 1) {
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
          <div className={mutedPanelClass}>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
              Public URL
            </p>
            <p className="mt-2 break-all text-base font-semibold text-[var(--dash-ink)]">
              /u/{form.slug || "slug-undangan"}
            </p>
          </div>
        </div>
      );
    }

    if (activeStep === 2) {
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
              <TextAreaInput
                value={form.quote}
                onChange={(event) => updateForm("quote", event.target.value)}
                rows={4}
              />
            </Field>
          </div>
        </div>
      );
    }

    if (activeStep === 3) {
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

    if (activeStep === 4) {
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

    if (activeStep === 5) {
      return (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className={mutedPanelClass}>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
              Media Manager
            </p>
            <h3 className="mt-2 text-lg font-semibold text-[var(--dash-ink)]">
              Upload cover, gallery, music, dan video di panel Media.
            </h3>
            <p className="mt-2 text-sm font-medium leading-6 text-[var(--dash-muted)]">
              Untuk mode edit order aktif, panel Media berada di bawah form ini dan sudah memakai slug yang sama.
            </p>
          </div>
          <div className={mutedPanelClass}>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
              Publish Safety
            </p>
            <p className="mt-2 text-sm font-medium leading-6 text-[var(--dash-muted)]">
              Cover atau gallery kosong tidak boleh membuat public page rusak. Simpan draft dulu sebelum mengisi asset agar semua media terikat ke order yang benar.
            </p>
          </div>
        </div>
      );
    }

    if (activeStep === 6) {
      return (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className={mutedPanelClass}>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
              Guest Manager
            </p>
            <h3 className="mt-2 text-lg font-semibold text-[var(--dash-ink)]">
              Tambah tamu, personal link, dan teks broadcast manual.
            </h3>
            <p className="mt-2 text-sm font-medium leading-6 text-[var(--dash-muted)]">
              Panel Guest berada di workspace order aktif. Setelah publish, admin bisa copy link personal atau template WhatsApp per tamu.
            </p>
          </div>
          <div className={mutedPanelClass}>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
              Manual Broadcast
            </p>
            <p className="mt-2 text-sm font-medium leading-6 text-[var(--dash-muted)]">
              Sistem tidak mengirim broadcast otomatis di phase ini. Admin tetap mengirim manual via WhatsApp agar aman dari risiko spam dan policy.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="rounded-[14px] border border-[var(--dash-border)] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
            Ringkasan Data
          </p>
          <dl className="mt-4 grid gap-4 text-base sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-[var(--dash-ink)]">Order</dt>
              <dd className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
                {form.customerName} | {form.orderStatus} | {form.paymentStatus}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--dash-ink)]">Pasangan</dt>
              <dd className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
                {form.groomNickname} & {form.brideNickname}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--dash-ink)]">Template</dt>
              <dd className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
                {form.template} | {form.package}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--dash-ink)]">Acara</dt>
              <dd className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
                {form.eventTitle}, {form.eventDate} {form.eventTime}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--dash-ink)]">Fitur</dt>
              <dd className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
                {[form.rsvp && "RSVP", form.gift && "Amplop", form.music && "Music", form.guestName && "Nama Tamu"]
                  .filter(Boolean)
                  .join(", ")}
              </dd>
            </div>
          </dl>
        </div>
        <div className="rounded-[14px] bg-[var(--dash-ink)] p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/60">
            Preview URL
          </p>
          <p className="mt-3 break-all text-lg font-semibold">/u/{form.slug}</p>
          <p className="mt-2 text-sm font-medium text-white/68">
            Status: {form.status || "draft"}
          </p>
          <button
            type="button"
            onClick={() => saveDraft()}
            className="mt-5 w-full rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-[var(--dash-ink)] hover:bg-[var(--dash-fog)]"
          >
            Simpan Draft
          </button>
          <button
            type="button"
            onClick={openPreview}
            className="mt-3 w-full rounded-md border border-white/18 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/16"
          >
            Preview Undangan
          </button>
          <button
            type="button"
            onClick={publishInvitation}
            className="mt-3 w-full rounded-md border border-white/18 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/16"
          >
            Publish
          </button>
          {form.status === "published" ? (
            <button
              type="button"
              onClick={archiveInvitation}
              className="mt-3 w-full rounded-md border border-white/18 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/16"
            >
              Archive
            </button>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <motion.section
      variants={fadeUp}
      className="overflow-hidden rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] shadow-[var(--dash-shadow)]"
    >
      <div className="border-b border-[var(--dash-border)] px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
              Create / Edit Order
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-[var(--dash-ink)]">
              Form data undangan
            </h2>
            <p className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
              Isi order WhatsApp, data mempelai, acara, fitur, lalu review sebelum publish.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-fog)] px-3 py-2 text-xs font-semibold text-[var(--dash-muted)]">
              Order: {form.orderStatus}
            </span>
            <span className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-fog)] px-3 py-2 text-xs font-semibold text-[var(--dash-muted)]">
              Payment: {form.paymentStatus}
            </span>
            <span className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-fog)] px-3 py-2 text-xs font-semibold text-[var(--dash-muted)]">
              Status: {form.status || "draft"}
            </span>
          </div>
        </div>
      </div>

      <div className="sticky top-[81px] z-20 border-b border-[var(--dash-border)] bg-[var(--dash-canvas)]/95 px-5 py-3 backdrop-blur-xl">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => saveDraft()} className={actionButtonClass}>
              Save Draft
            </button>
            <button type="button" onClick={openPreview} className={actionButtonClass}>
              Preview
            </button>
            <button type="button" onClick={markReview} className={actionButtonClass}>
              Mark Review
            </button>
            <button type="button" onClick={publishInvitation} className={primaryButtonClass}>
              Publish
            </button>
            {form.status === "published" ? (
              <button type="button" onClick={archiveInvitation} className={actionButtonClass}>
                Archive
              </button>
            ) : null}
          </div>
          {saveMessage ? (
            <p className="text-sm font-medium text-[var(--dash-muted)]">{saveMessage}</p>
          ) : null}
        </div>
      </div>

      <div className="border-b border-[var(--dash-border)] px-5 py-4">
        <div className="flex flex-wrap gap-3">
          {formSteps.map((step, index) => (
            <button
              key={step}
              type="button"
              onClick={() => setActiveStep(index)}
              className={`rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
                activeStep === index
                  ? "border-[var(--dash-ink)] bg-[var(--dash-ink)] text-white"
                  : "border-[var(--dash-border)] bg-white text-[var(--dash-muted)] hover:bg-[var(--dash-fog)] hover:text-[var(--dash-ink)]"
              }`}
            >
              {index + 1}. {step}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">{renderStep()}</div>

      {publishErrors.length > 0 ? (
        <div className="border-t border-[var(--dash-border)] bg-[var(--dash-fog)] px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
            Publish Guard
          </p>
          <ul className="mt-3 space-y-2">
            {publishErrors.map((error) => (
              <li
                key={error}
                className="rounded-lg border border-[var(--dash-border)] bg-white px-4 py-3 text-sm font-medium text-[var(--dash-ink)]"
              >
                {error}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3 border-t border-[var(--dash-border)] px-5 py-4">
        <button
          type="button"
          disabled={activeStep === 0}
          onClick={() => setActiveStep((current) => Math.max(0, current - 1))}
          className="rounded-md border border-[var(--dash-border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--dash-muted)] transition-colors hover:bg-[var(--dash-fog)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Sebelumnya
        </button>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {activeStep === formSteps.length - 1 ? (
            <>
              <button
                type="button"
                onClick={openPreview}
                className={actionButtonClass}
              >
                Preview
              </button>
              <button
                type="button"
                onClick={publishInvitation}
                className={primaryButtonClass}
              >
                Publish
              </button>
            </>
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
            className={primaryButtonClass}
          >
            {activeStep === formSteps.length - 1 ? "Simpan Draft" : "Lanjut"}
          </button>
        </div>
      </div>
    </motion.section>
  );
}
