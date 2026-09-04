"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  fadeUp,
  initialInvitationForm,
  formSteps,
} from "./config";
import { DashboardButton, Field, TextInput, SelectInput, ToggleField, TextAreaInput } from "./FormControls";

const mutedPanelClass =
  "rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-fog)]/45 p-4";

const actionButtonClass =
  "rounded-md border border-[var(--dash-border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--dash-ink)] transition-colors hover:bg-[var(--dash-fog)]";

const primaryButtonClass =
  "rounded-md bg-[var(--dash-ink)] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--dash-dark)]";

const lifecycleLabels = {
  draft: "Belum Tayang",
  review: "Siap Ditinjau",
  published: "Tayang",
  archived: "Diarsipkan",
};
const orderStatusLabels = {
  inquiry: "Baru Masuk",
  waiting_payment: "Menunggu Pembayaran",
  paid: "Pembayaran Diterima",
  in_progress: "Sedang Dikerjakan",
  review: "Siap Ditinjau",
  revision: "Perlu Revisi",
  approved: "Disetujui Klien",
  published: "Tayang",
  completed: "Selesai",
  cancelled: "Dibatalkan",
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

function publicationLabel(status) {
  if (status === "published") return "Tayang";
  if (status === "archived") return "Diarsipkan";
  return "Belum Tayang";
}

function InvitationSaveBar({
  hasUnsavedChanges,
  isLocked,
  isSaving,
  saveMessage,
  onPreview,
  onSaveDraft,
  onSave,
}) {
  const statusText = isLocked
    ? "Memuat data undangan..."
    : isSaving
    ? "Menyimpan perubahan..."
    : hasUnsavedChanges
      ? "Ada perubahan belum disimpan."
      : saveMessage || "Semua perubahan tersimpan.";

  return (
    <div className="sticky bottom-0 z-30 mt-6 border-t border-[var(--dash-border)] bg-white/95 px-4 py-3 backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--dash-muted)]">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isSaving
                ? "bg-amber-500"
                : isLocked
                ? "bg-slate-400"
                : hasUnsavedChanges
                  ? "bg-red-500"
                  : "bg-emerald-500"
            }`}
          />
          <span>{statusText}</span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <DashboardButton
            type="button"
            onClick={onPreview}
            variant="secondary"
            disabled={!onPreview || isLocked}
          >
            Pratinjau
          </DashboardButton>
          <DashboardButton
            type="button"
            onClick={onSaveDraft}
            variant="secondary"
            loading={isSaving}
            disabled={isLocked}
          >
            {isSaving ? "Menyimpan..." : "Simpan Draft"}
          </DashboardButton>
          <DashboardButton type="button" onClick={onSave} loading={isSaving} disabled={isLocked}>
            {isSaving ? "Menyimpan..." : "Simpan"}
          </DashboardButton>
        </div>
      </div>
    </div>
  );
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
    orderStatus:
      invitation?.order?.status === "published"
        ? "completed"
        : invitation?.order?.status || initialInvitationForm.orderStatus,
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
    groomParents:
      invitation?.couple?.groomParents || initialInvitationForm.groomParents,
    groomInstagram:
      invitation?.couple?.groomInstagram || initialInvitationForm.groomInstagram,
    brideName: invitation?.couple?.brideName || initialInvitationForm.brideName,
    brideNickname:
      invitation?.couple?.brideNickname || initialInvitationForm.brideNickname,
    brideParents:
      invitation?.couple?.brideParents || initialInvitationForm.brideParents,
    brideInstagram:
      invitation?.couple?.brideInstagram || initialInvitationForm.brideInstagram,
    quote: invitation?.couple?.quote || initialInvitationForm.quote,
    rsvp: Boolean(invitation?.features?.rsvp ?? initialInvitationForm.rsvp),
    gift: Boolean(invitation?.features?.gift ?? initialInvitationForm.gift),
    music: Boolean(invitation?.features?.music ?? initialInvitationForm.music),
    guestName: Boolean(
      invitation?.features?.guestName ?? initialInvitationForm.guestName,
    ),
    viewCount: invitation?.viewCount || 0,
    lastViewedAt: invitation?.lastViewedAt || null,
  };
}

function CouplePreviewCard({ groomNickname, brideNickname, groomParents, brideParents, quote }) {
  return (
    <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-fog)]/45 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)] mb-4 text-center">
        Live Preview
      </p>
      <div className="relative flex min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-xl border border-[var(--dash-border)] bg-white p-6 text-center shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-rose-50/30 opacity-50" />
        <AnimatePresence mode="wait">
          <motion.div
            key={`${groomNickname}-${brideNickname}-${groomParents}-${brideParents}-${quote}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 flex flex-col items-center gap-1"
          >
            <span className="text-xs font-medium text-amber-600/80 tracking-widest uppercase">Wedding Preview</span>
            <h4 className="mt-2 text-2xl font-bold text-[var(--dash-ink)] font-serif">
              {groomNickname || "Pria"} & {brideNickname || "Wanita"}
            </h4>
            {groomParents || brideParents ? (
              <div className="mt-3 space-y-0.5 text-[11px] text-[var(--dash-muted)]">
                <p className="font-semibold">Putra-Putri dari:</p>
                {groomParents ? <p>Bapak/Ibu {groomParents}</p> : null}
                {brideParents ? <p>Bapak/Ibu {brideParents}</p> : null}
              </div>
            ) : null}
            {quote ? (
              <p className="mt-4 max-w-[200px] border-t border-[var(--dash-border)] pt-3 text-[10px] italic text-[var(--dash-muted)] leading-relaxed">
                "{quote}"
              </p>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function InvitationFormPanel({ invitationSlug = "" }) {
  const [activeStep, setActiveStep] = useState(0);
  const [templateOptions, setTemplateOptions] = useState([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [isLoadingInvitation, setIsLoadingInvitation] = useState(Boolean(invitationSlug));
  const [form, setForm] = useState({
    ...initialInvitationForm,
    slug: invitationSlug || initialInvitationForm.slug,
  });
  const [saveMessage, setSaveMessage] = useState("");
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [publishErrors, setPublishErrors] = useState([]);
  const [loadError, setLoadError] = useState("");
  const isHydratingInvitation = Boolean(invitationSlug) && isLoadingInvitation;
  const isFormLocked = isHydratingInvitation;

  const publicPath = `/${form.slug || "slug-order"}`;
  const publicUrl =
    typeof window !== "undefined" && form.slug
      ? `${window.location.origin}${publicPath}`
      : publicPath;

  useEffect(() => {
    if (invitationSlug) {
      return;
    }

    setForm({
      ...initialInvitationForm,
      slug: initialInvitationForm.slug,
    });
    setActiveStep(0);
    setSaveMessage("");
    setHasUnsavedChanges(false);
    setPublishErrors([]);
    setLoadError("");
    setIsLoadingInvitation(false);
  }, [invitationSlug]);

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

        const loadedTemplates = (result.data || [])
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
    if (!templateOptions.length) {
      return;
    }

    setForm((current) => {
      const selected = templateOptions.find((template) => template.id === current.templateId);

      if (!selected || selected.name === current.template) {
        return current;
      }

      return { ...current, template: selected.name };
    });
  }, [form.templateId, form.template, templateOptions]);

  useEffect(() => {
    if (!invitationSlug) {
      return;
    }

    let isMounted = true;
    setIsLoadingInvitation(true);
    setLoadError("");
    setSaveMessage("Memuat data undangan...");

    fetch(`/api/invitations/${encodeURIComponent(invitationSlug)}`)
      .then(async (response) => {
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Gagal memuat data undangan.");
        }

        return result;
      })
      .then((result) => {
        if (isMounted && result.data) {
          setForm(invitationToForm(result.data, templateOptions));
          setHasUnsavedChanges(false);
          setSaveMessage("Data siap diedit.");
        }
      })
      .catch((error) => {
        if (isMounted) {
          setForm((current) => ({ ...current, slug: invitationSlug }));
          setLoadError(error.message || "Gagal memuat data undangan.");
          setSaveMessage("Data undangan gagal dimuat. Jangan simpan sebelum refresh berhasil.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingInvitation(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [invitationSlug]);

  const updateForm = (field, value) => {
    if (isFormLocked) {
      return;
    }

    setForm((current) => ({ ...current, [field]: value }));
    setPublishErrors([]);
    setHasUnsavedChanges(true);
    setSaveMessage("Ada perubahan belum disimpan.");
  };

  useEffect(() => {
    if (!hasUnsavedChanges) {
      return undefined;
    }

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const redirectToActiveOrder = (savedInvitation) => {
    const savedSlug = savedInvitation?.slug || form.slug;

    if (savedSlug && savedSlug !== invitationSlug) {
      window.location.href = `/dashboard/invitations/${encodeURIComponent(savedSlug)}`;
      return true;
    }

    return false;
  };

  const saveDraft = async (overrides = {}) => {
    if (isSavingDraft || isFormLocked) {
      if (isFormLocked) {
        setSaveMessage("Tunggu data undangan selesai dimuat sebelum menyimpan.");
      }
      return null;
    }

    const nextForm = { ...form, ...overrides };

    try {
      setIsSavingDraft(true);
      setSaveMessage("Menyimpan perubahan...");
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
      setHasUnsavedChanges(false);
      return result.data || true;
    } catch (error) {
      setSaveMessage(error.message || "Draft lokal tersimpan. API belum tersedia.");
      return null;
    } finally {
      setIsSavingDraft(false);
    }
  };

  const saveDraftAndMaybeRedirect = async () => {
    const saved = await saveDraft();
    redirectToActiveOrder(saved);
  };

  const markReview = async () => {
    if (isFormLocked) {
      setSaveMessage("Tunggu data undangan selesai dimuat sebelum menyiapkan pratinjau.");
      return;
    }

    setSaveMessage("Menyiapkan undangan untuk ditinjau...");
    const saved = await saveDraft({ status: "review", orderStatus: "review" });

    if (saved) {
      setForm((current) => ({ ...current, status: "review", orderStatus: "review" }));
      setHasUnsavedChanges(false);
      setSaveMessage("Undangan siap ditinjau. Kirim pratinjau ke pelanggan via WhatsApp.");
      redirectToActiveOrder(saved);
    }
  };

  const openWaNotification = (type = "review") => {
    if (isFormLocked) {
      setSaveMessage("Tunggu data undangan selesai dimuat sebelum mengirim notifikasi.");
      return;
    }

    const wa = form.customerWhatsapp || "";
    if (!wa) {
      setSaveMessage("Nomor WhatsApp customer belum diisi di Step 0.");
      return;
    }

    const slug = form.slug || invitationSlug;
    const publicUrl = slug ? `${window.location.origin}/${slug}` : "(belum ada URL)";
    const groomName = form.groomNickname || form.groomName || "Mempelai Pria";
    const brideName = form.brideNickname || form.brideName || "Mempelai Wanita";
    const customerName = form.customerName || "Bapak/Ibu";

    const messages = {
      review:
        `Halo ${customerName} 😊\n\nUndangan digital ${groomName} & ${brideName} sudah siap untuk direview!\n\nSilakan cek preview di sini: ${publicUrl}\n\nJika ada yang perlu direvisi, mohon beritahu kami ya. Terima kasih! 🙏`,
      published:
        `Halo ${customerName} 🎉\n\nUndangan digital ${groomName} & ${brideName} sudah LIVE dan siap disebar!\n\nLink undangan: ${publicUrl}\n\nSelamat ya, semoga acaranya lancar dan penuh berkah! 🥰`,
    };

    const text = encodeURIComponent(messages[type] || messages.review);
    const cleanWa = wa.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanWa}?text=${text}`, "_blank", "noreferrer");
  };

  const publishInvitation = async () => {
    if (isFormLocked) {
      setSaveMessage("Tunggu data undangan selesai dimuat sebelum publish.");
      return;
    }

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

      setForm((current) => ({
        ...current,
        status: "published",
      }));
      setHasUnsavedChanges(false);
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
    if (isFormLocked) {
      setSaveMessage("Tunggu data undangan selesai dimuat sebelum arsip.");
      return;
    }

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
      setHasUnsavedChanges(false);
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
    if (isFormLocked) {
      setSaveMessage("Tunggu data undangan selesai dimuat sebelum copy link.");
      return;
    }

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

  const openInvitationPreview = () => {
    if (isFormLocked) {
      setSaveMessage("Tunggu data undangan selesai dimuat sebelum membuka pratinjau.");
      return;
    }

    if (!form.slug) {
      setSaveMessage("Isi slug publik dulu sebelum membuka pratinjau.");
      return;
    }

    window.open(publicPath, "_blank", "noreferrer");
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
          <Field label="Tahap Pengerjaan">
            <SelectInput
              value={form.orderStatus}
              onChange={(event) => updateForm("orderStatus", event.target.value)}
            >
              <option value="inquiry">Baru Masuk</option>
              <option value="waiting_payment">Menunggu Pembayaran</option>
              <option value="paid">Pembayaran Diterima</option>
              <option value="in_progress">Sedang Dikerjakan</option>
              <option value="review">Siap Ditinjau</option>
              <option value="revision">Perlu Revisi</option>
              <option value="approved">Disetujui Klien</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
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
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <section className={mutedPanelClass}>
                <div className="mb-5 border-b border-[var(--dash-border)] pb-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
                    Data Mempelai
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-[var(--dash-ink)]">
                    Mempelai Pria
                  </h3>
                </div>
                <div className="grid gap-5">
                  <Field label="Nama Lengkap">
                    <TextInput
                      value={form.groomName}
                      onChange={(event) => updateForm("groomName", event.target.value)}
                      placeholder="Nama lengkap mempelai pria"
                    />
                  </Field>
                  <Field label="Nama Panggilan">
                    <TextInput
                      value={form.groomNickname}
                      onChange={(event) => updateForm("groomNickname", event.target.value)}
                      placeholder="Nama panggilan"
                    />
                  </Field>
                  <Field label="Nama Orang Tua">
                    <TextInput
                      value={form.groomParents}
                      onChange={(event) => updateForm("groomParents", event.target.value)}
                      placeholder="Bapak ... & Ibu ..."
                    />
                  </Field>
                  <Field label="Instagram">
                    <TextInput
                      value={form.groomInstagram}
                      onChange={(event) => updateForm("groomInstagram", event.target.value)}
                      placeholder="@username atau https://instagram.com/username"
                    />
                  </Field>
                </div>
              </section>

              <section className={mutedPanelClass}>
                <div className="mb-5 border-b border-[var(--dash-border)] pb-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
                    Data Mempelai
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-[var(--dash-ink)]">
                    Mempelai Wanita
                  </h3>
                </div>
                <div className="grid gap-5">
                  <Field label="Nama Lengkap">
                    <TextInput
                      value={form.brideName}
                      onChange={(event) => updateForm("brideName", event.target.value)}
                      placeholder="Nama lengkap mempelai wanita"
                    />
                  </Field>
                  <Field label="Nama Panggilan">
                    <TextInput
                      value={form.brideNickname}
                      onChange={(event) => updateForm("brideNickname", event.target.value)}
                      placeholder="Nama panggilan"
                    />
                  </Field>
                  <Field label="Nama Orang Tua">
                    <TextInput
                      value={form.brideParents}
                      onChange={(event) => updateForm("brideParents", event.target.value)}
                      placeholder="Bapak ... & Ibu ..."
                    />
                  </Field>
                  <Field label="Instagram">
                    <TextInput
                      value={form.brideInstagram}
                      onChange={(event) => updateForm("brideInstagram", event.target.value)}
                      placeholder="@username atau https://instagram.com/username"
                    />
                  </Field>
                </div>
              </section>
            </div>
            <div>
              <Field label="Quote / Doa Pembuka">
                <TextAreaInput
                  value={form.quote}
                  onChange={(event) => updateForm("quote", event.target.value)}
                  rows={4}
                />
              </Field>
            </div>
          </div>
          <div className="lg:sticky lg:top-24 h-fit">
            <CouplePreviewCard
              groomNickname={form.groomNickname || form.groomName}
              brideNickname={form.brideNickname || form.brideName}
              groomParents={form.groomParents}
              brideParents={form.brideParents}
              quote={form.quote}
            />
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
            Link Undangan
          </p>
          <p className="mt-3 break-all text-lg font-semibold">{publicPath}</p>
          <p className="mt-2 text-sm font-medium text-white/68">
            Status tayang: {statusLabel(lifecycleLabels, form.status || "draft")}
          </p>
	          {form.status !== "published" && form.status !== "archived" ? (
	            <button
	              type="button"
	              onClick={publishInvitation}
	              disabled={isFormLocked || isSavingDraft}
	              className="mt-5 w-full rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-[var(--dash-ink)] hover:bg-[var(--dash-fog)] disabled:cursor-not-allowed disabled:opacity-60"
	            >
	              Simpan & Tayangkan
	            </button>
	          ) : null}
	          <div className="mt-3 grid grid-cols-2 gap-2">
	            <a
	              href={form.slug ? publicPath : undefined}
	              target="_blank"
	              rel="noreferrer"
	              aria-disabled={!form.slug || isFormLocked}
	              className={`rounded-md border border-white/18 px-4 py-2.5 text-center text-sm font-semibold ${
	                form.slug && !isFormLocked
	                  ? "bg-white/10 text-white hover:bg-white/16"
	                  : "pointer-events-none bg-white/5 text-white/35"
	              }`}
	            >
	              Buka Link
	            </a>
	            <button
	              type="button"
	              onClick={copyPublicLink}
	              disabled={isFormLocked}
	              className="rounded-md border border-white/18 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/16 disabled:cursor-not-allowed disabled:opacity-50"
	            >
	              Copy Link
	            </button>
	          </div>
	          {form.status === "published" ? (
            <button
              type="button"
              onClick={archiveInvitation}
              disabled={isFormLocked || isSavingDraft}
              className="mt-3 w-full rounded-md border border-white/18 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/16 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Arsipkan
            </button>
          ) : null}
          {(form.status === "review" || form.status === "published") ? (
            <button
              type="button"
              onClick={() => openWaNotification(form.status)}
              disabled={isFormLocked}
              className="mt-3 w-full rounded-md bg-emerald-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-emerald-700 border-none outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              Kirim Notifikasi WA
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
              Tahap: {statusLabel(orderStatusLabels, form.orderStatus)}
            </span>
            <span className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-fog)] px-3 py-2 text-xs font-semibold text-[var(--dash-muted)]">
              Pembayaran: {statusLabel(paymentStatusLabels, form.paymentStatus)}
            </span>
            <span className={`rounded-md border px-3 py-2 text-xs font-semibold ${
              form.status === "published"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-[var(--dash-border)] bg-[var(--dash-fog)] text-[var(--dash-muted)]"
            }`}>
              Publikasi: {publicationLabel(form.status)}
            </span>
            {form.viewCount !== undefined ? (
              <span className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-fog)] px-3 py-2 text-xs font-semibold text-[var(--dash-muted)]">
                Dibuka: {form.viewCount} kali
                {form.lastViewedAt ? ` (Terakhir: ${new Date(form.lastViewedAt).toLocaleDateString("id-ID")})` : ""}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="sticky top-[81px] z-20 border-b border-[var(--dash-border)] bg-[var(--dash-canvas)]/95 px-5 py-3 backdrop-blur-xl">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {form.status !== "published" && form.status !== "archived" ? (
              <button
                type="button"
                onClick={publishInvitation}
                disabled={isSavingDraft || isFormLocked}
                className={`${primaryButtonClass} disabled:cursor-not-allowed disabled:opacity-60`}
              >
                Simpan & Tayangkan
              </button>
            ) : (
              <span className="inline-flex items-center rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                {form.status === "published" ? "Undangan sedang tayang" : "Undangan diarsipkan"}
              </span>
            )}
            {form.status !== "review" && form.status !== "published" && form.status !== "archived" ? (
              <button
                type="button"
                onClick={markReview}
                disabled={isSavingDraft || isFormLocked}
                className={`${actionButtonClass} disabled:cursor-not-allowed disabled:opacity-60`}
              >
                Siapkan Pratinjau Pelanggan
              </button>
            ) : null}
            {(form.status === "review" || form.status === "published") && (
              <button
                type="button"
                onClick={() => openWaNotification(form.status)}
                disabled={isFormLocked}
                className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Kirim WA
              </button>
            )}
          </div>
          <p className="text-sm font-semibold text-[var(--dash-muted)]">
            {isFormLocked ? "Memuat data undangan..." : hasUnsavedChanges ? "Preview berubah, data belum disimpan." : saveMessage || "Data siap diedit."}
          </p>
        </div>
      </div>

      {loadError ? (
        <div className="border-b border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700">
          {loadError}
        </div>
      ) : null}

      <div className="border-b border-[var(--dash-border)] bg-[var(--dash-fog)]/35 px-5 py-4">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--dash-muted)]">
          Langkah Setup
        </p>
        <div className="flex flex-wrap gap-2">
          {formSteps.map((step, index) => (
            <button
              key={step}
              type="button"
              disabled={isFormLocked}
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

      <div className="relative">
        <fieldset disabled={isFormLocked} className={isFormLocked ? "pointer-events-none opacity-55" : ""}>
          <div className="p-5">{renderStep()}</div>
        </fieldset>
        {isFormLocked ? (
          <div className="absolute inset-0 z-10 flex items-start justify-center bg-white/55 px-5 py-10 backdrop-blur-[1px]">
            <div className="flex items-center gap-3 rounded-lg border border-[var(--dash-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--dash-ink)] shadow-sm">
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--dash-ink)] border-r-transparent"
              />
              Memuat data undangan...
            </div>
          </div>
        ) : null}
      </div>

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
          disabled={activeStep === 0 || isFormLocked}
          onClick={() => setActiveStep((current) => Math.max(0, current - 1))}
          className="rounded-md border border-[var(--dash-border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--dash-muted)] transition-colors hover:bg-[var(--dash-fog)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Sebelumnya
        </button>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {activeStep < formSteps.length - 1 ? (
            <button
              type="button"
              disabled={isFormLocked}
              onClick={() =>
                setActiveStep((current) => Math.min(formSteps.length - 1, current + 1))
              }
              className={`${primaryButtonClass} disabled:cursor-not-allowed disabled:opacity-60`}
            >
              Lanjut
            </button>
          ) : null}
        </div>
      </div>

      <InvitationSaveBar
        hasUnsavedChanges={hasUnsavedChanges}
        isLocked={isFormLocked}
        isSaving={isSavingDraft}
        saveMessage={saveMessage}
        onPreview={openInvitationPreview}
        onSaveDraft={saveDraftAndMaybeRedirect}
        onSave={saveDraftAndMaybeRedirect}
      />
    </motion.section>
  );
}
