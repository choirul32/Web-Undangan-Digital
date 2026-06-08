"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { mergeTemplateOverrides } from "../../data/templateAdminDefaults";
import {
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
const lifecycleLabels = {
  draft: "Draft",
  review: "Review",
  published: "Published",
  archived: "Arsip",
};
const orderStatusLabels = {
  inquiry: "Inquiry",
  waiting_payment: "Menunggu Pembayaran",
  paid: "Dibayar",
  in_progress: "Dikerjakan",
  review: "Review",
  revision: "Revisi",
  approved: "Disetujui",
  published: "Published",
  completed: "Selesai",
  cancelled: "Batal",
};
const paymentStatusLabels = {
  unpaid: "Belum Bayar",
  waiting_confirmation: "Menunggu Konfirmasi",
  paid: "Lunas",
  refunded: "Refund",
};

function statusLabel(labels, value) {
  return labels[value] || value || "-";
}

function normalizeTemplateOption(template) {
  return {
    ...template,
    id: template.id || template.templateId || template.template_id,
    name: template.name || template.title || template.id || "Template",
    status: template.status || "active",
  };
}

function invitationToForm(invitation, templateOptions = []) {
  const template = templateOptions.find((item) => item.id === invitation?.templateId);

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
  const [templateOptions, setTemplateOptions] = useState([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [form, setForm] = useState({
    ...initialInvitationForm,
    slug: invitationSlug || initialInvitationForm.slug,
  });
  const [saveMessage, setSaveMessage] = useState("");
  const [publishErrors, setPublishErrors] = useState([]);

  const publicPath = `/u/${form.slug || "slug-order"}`;
  const publicUrl =
    typeof window !== "undefined" && form.slug
      ? `${window.location.origin}${publicPath}`
      : publicPath;

  useEffect(() => {
    let isMounted = true;
    setIsLoadingTemplates(true);

    fetch("/api/templates?scope=admin")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal mengambil template admin.");
        }
        return response.json();
      })
      .then((result) => {
        if (!isMounted) {
          return;
        }

        const loadedTemplates = mergeTemplateOverrides(result.data || [])
          .map(normalizeTemplateOption)
          .filter((template) => template.id);
        const nextTemplates = loadedTemplates;

        setTemplateOptions(nextTemplates);
        setForm((current) => {
          if (current.templateId && nextTemplates.some((template) => template.id === current.templateId)) {
            const selected = nextTemplates.find((template) => template.id === current.templateId);
            return { ...current, template: selected?.name || current.template };
          }

          const firstTemplate = nextTemplates[0];
          return firstTemplate
            ? { ...current, templateId: firstTemplate.id, template: firstTemplate.name }
            : current;
        });
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setTemplateOptions([]);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingTemplates(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!invitationSlug) {
      return;
    }

    let isMounted = true;

    fetch(`/api/invitations/${encodeURIComponent(invitationSlug)}`)
      .then((response) => response.json())
      .then((result) => {
        if (isMounted && result.data) {
          setForm(invitationToForm(result.data, templateOptions));
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
  }, [invitationSlug, templateOptions]);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setPublishErrors([]);
  };

  const redirectToActiveOrder = (savedInvitation) => {
    const savedSlug = savedInvitation?.slug || form.slug;

    if (savedSlug && savedSlug !== invitationSlug) {
      window.location.href = `/dashboard/invitations/${encodeURIComponent(savedSlug)}`;
      return true;
    }

    return false;
  };

  const saveDraft = async (overrides = {}) => {
    const nextForm = { ...form, ...overrides };

    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...nextForm,
          originalSlug: invitationSlug || undefined,
          status: nextForm.status || "draft",
        }),
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
      return result.data || true;
    } catch (error) {
      setSaveMessage(error.message || "Draft lokal tersimpan. API belum tersedia.");
      return null;
    }
  };

  const saveDraftAndMaybeRedirect = async () => {
    const saved = await saveDraft();
    redirectToActiveOrder(saved);
  };

  const markReview = async () => {
    setSaveMessage("Menandai order sebagai review...");
    const saved = await saveDraft({ status: "review", orderStatus: "review" });

    if (saved) {
      setForm((current) => ({ ...current, status: "review", orderStatus: "review" }));
      setSaveMessage("Order ditandai sebagai review. Kirim preview ke customer via WhatsApp.");
      redirectToActiveOrder(saved);
    }
  };

  const publishInvitation = async () => {
    const slug = form.slug || invitationSlug;

    if (!slug) {
      setPublishErrors(["Slug publik wajib diisi sebelum publish."]);
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
        setSaveMessage("Publikasi dibatalkan. Lengkapi data yang wajib dulu.");
        return;
      }

      setForm((current) => ({ ...current, status: "published" }));
      setPublishErrors([]);
      setSaveMessage(
        result.source === "supabase"
          ? "Undangan berhasil dipublikasikan."
          : "Mode sample: undangan dianggap published.",
      );
      redirectToActiveOrder(saved);
    } catch (error) {
      setPublishErrors([error.message || "Publikasi gagal."]);
      setSaveMessage("Publikasi gagal.");
    }
  };

  const archiveInvitation = async () => {
    const slug = form.slug || invitationSlug;

    if (!slug) {
      setPublishErrors(["Slug publik wajib diisi sebelum arsip."]);
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
        throw new Error(result.error || "Arsip gagal.");
      }

      setForm((current) => ({ ...current, status: "archived" }));
      setPublishErrors([]);
      setSaveMessage(
        result.source === "supabase"
          ? "Undangan berhasil diarsipkan."
          : "Mode sample: undangan dianggap archived.",
      );
    } catch (error) {
      setPublishErrors([error.message || "Arsip gagal."]);
      setSaveMessage("Arsip gagal.");
    }
  };

  const copyPublicLink = async () => {
    if (!form.slug) {
      setSaveMessage("Isi slug publik dulu sebelum copy link.");
      return;
    }

    try {
      await navigator.clipboard.writeText(publicUrl);
      setSaveMessage("Link publish berhasil dicopy.");
    } catch {
      setSaveMessage(`Link publish: ${publicUrl}`);
    }
  };

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
              <option value="waiting_payment">Menunggu Pembayaran</option>
              <option value="paid">Dibayar</option>
              <option value="in_progress">Dikerjakan</option>
              <option value="review">Review</option>
              <option value="revision">Revisi</option>
              <option value="approved">Disetujui</option>
              <option value="published">Published</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Batal</option>
            </SelectInput>
          </Field>
          <Field label="Lifecycle Undangan">
            <SelectInput
              value={form.status || "draft"}
              onChange={(event) => updateForm("status", event.target.value)}
            >
              {lifecycleOptions.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(lifecycleLabels, status)}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Status Pembayaran">
            <SelectInput
              value={form.paymentStatus}
              onChange={(event) => updateForm("paymentStatus", event.target.value)}
            >
              <option value="unpaid">Belum Bayar</option>
              <option value="waiting_confirmation">Menunggu Konfirmasi</option>
              <option value="paid">Lunas</option>
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
              disabled={isLoadingTemplates || templateOptions.length === 0}
              onChange={(event) => {
                const selected = templateOptions.find(
                  (template) => template.id === event.target.value,
                );
                updateForm("templateId", event.target.value);
                updateForm("template", selected?.name || "Standard");
              }}
            >
              {isLoadingTemplates ? (
                <option value="">Memuat template...</option>
              ) : null}
              {!isLoadingTemplates && templateOptions.length === 0 ? (
                <option value="">Template tidak tersedia</option>
              ) : null}
              {templateOptions.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}{template.status === "hidden" ? " (Hidden)" : ""}
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
          <Field label="Slug Publik">
            <TextInput
              value={form.slug}
              onChange={(event) => updateForm("slug", event.target.value)}
              placeholder="slug-order"
            />
          </Field>
          <div className={mutedPanelClass}>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
              URL Publik
            </p>
            <p className="mt-2 break-all text-base font-semibold text-[var(--dash-ink)]">
              {publicPath}
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
        <div className="rounded-[14px] border border-[var(--dash-border)] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
            Ringkasan Data
          </p>
          <dl className="mt-4 grid gap-4 text-base sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-[var(--dash-ink)]">Order</dt>
              <dd className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
                {form.customerName || "-"} | {statusLabel(orderStatusLabels, form.orderStatus)} | {statusLabel(paymentStatusLabels, form.paymentStatus)}
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
            Path Publik
          </p>
          <p className="mt-3 break-all text-lg font-semibold">{publicPath}</p>
          <p className="mt-2 text-sm font-medium text-white/68">
            Status: {statusLabel(lifecycleLabels, form.status || "draft")}
          </p>
	          <button
	            type="button"
	            onClick={publishInvitation}
	            className="mt-5 w-full rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-[var(--dash-ink)] hover:bg-[var(--dash-fog)]"
	          >
	            Publikasikan
	          </button>
	          <div className="mt-3 grid grid-cols-2 gap-2">
	            <a
	              href={form.slug ? publicPath : undefined}
	              target="_blank"
	              rel="noreferrer"
	              aria-disabled={!form.slug}
	              className={`rounded-md border border-white/18 px-4 py-2.5 text-center text-sm font-semibold ${
	                form.slug
	                  ? "bg-white/10 text-white hover:bg-white/16"
	                  : "pointer-events-none bg-white/5 text-white/35"
	              }`}
	            >
	              Buka Link
	            </a>
	            <button
	              type="button"
	              onClick={copyPublicLink}
	              className="rounded-md border border-white/18 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/16"
	            >
	              Copy Link
	            </button>
	          </div>
	          {form.status === "published" ? (
            <button
              type="button"
              onClick={archiveInvitation}
              className="mt-3 w-full rounded-md border border-white/18 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/16"
            >
              Arsipkan
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
              Informasi Utama
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-[var(--dash-ink)]">
              Setup undangan
            </h2>
            <p className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
              Isi data order, template, mempelai, fitur, lalu tinjau sebelum publish.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-fog)] px-3 py-2 text-xs font-semibold text-[var(--dash-muted)]">
              Order: {statusLabel(orderStatusLabels, form.orderStatus)}
            </span>
            <span className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-fog)] px-3 py-2 text-xs font-semibold text-[var(--dash-muted)]">
              Pembayaran: {statusLabel(paymentStatusLabels, form.paymentStatus)}
            </span>
            <span className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-fog)] px-3 py-2 text-xs font-semibold text-[var(--dash-muted)]">
              Status: {statusLabel(lifecycleLabels, form.status || "draft")}
            </span>
          </div>
        </div>
      </div>

      <div className="sticky top-[81px] z-20 border-b border-[var(--dash-border)] bg-[var(--dash-canvas)]/95 px-5 py-3 backdrop-blur-xl">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={saveDraftAndMaybeRedirect} className={actionButtonClass}>
              Simpan Draft
            </button>
            <button type="button" onClick={markReview} className={actionButtonClass}>
              Tandai Review
            </button>
          </div>
          {saveMessage ? (
            <p className="text-sm font-medium text-[var(--dash-muted)]">{saveMessage}</p>
          ) : null}
        </div>
      </div>

      <div className="border-b border-[var(--dash-border)] bg-[var(--dash-fog)]/35 px-5 py-4">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--dash-muted)]">
          Langkah Setup
        </p>
        <div className="flex flex-wrap gap-2">
          {formSteps.map((step, index) => (
            <button
              key={step}
              type="button"
              onClick={() => setActiveStep(index)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeStep === index
                  ? "border-[var(--dash-ink)] bg-[var(--dash-ink)] text-white"
                  : "border-[var(--dash-border)] bg-[var(--dash-canvas)] text-[var(--dash-muted)] hover:bg-white hover:text-[var(--dash-ink)]"
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
            Validasi Publish
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
          {activeStep < formSteps.length - 1 ? (
            <button
              type="button"
              onClick={() =>
                setActiveStep((current) => Math.min(formSteps.length - 1, current + 1))
              }
              className={primaryButtonClass}
            >
              Lanjut
            </button>
          ) : null}
        </div>
      </div>
    </motion.section>
  );
}
