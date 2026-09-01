"use client";

import React, { useEffect, useMemo, useState } from "react";
import { prepareImageForUpload } from "../../lib/imageUpload";
import AiOrnamentGenerator from "./AiOrnamentGenerator";
import {
  ConfirmationModal,
  DashboardButton,
  DashboardCard,
  Field,
  SelectInput,
  StatusToast,
  TextInput,
} from "./FormControls";

const CATEGORY_OPTIONS = [
  { value: "corner", label: "Sudut / Corner" },
  { value: "frame", label: "Frame / Bingkai" },
  { value: "divider", label: "Divider / Pemisah" },
  { value: "header-accent", label: "Header Accent" },
  { value: "footer-accent", label: "Footer Accent" },
  { value: "background-pattern", label: "Background Pattern" },
  { value: "floral", label: "Floral / Bunga" },
  { value: "leaf", label: "Leaf / Daun" },
  { value: "gold-accent", label: "Gold Accent" },
  { value: "watercolor", label: "Watercolor" },
  { value: "islamic-geometric", label: "Islamic / Geometric" },
  { value: "minimal-line", label: "Minimal Line" },
  { value: "badge-emblem", label: "Badge / Emblem" },
  { value: "custom", label: "Custom / Lainnya" },
];

// ---- Metadata AI untuk template generator ----
// Vocabulary sama dengan yang dipakai backend (src/app/api/templates/ornaments/upload/route.js)
export const ORNAMENT_THEME_OPTIONS = [
  "jawa",
  "wayang",
  "bali",
  "sunda",
  "islami",
  "floral",
  "tropical",
  "modern",
  "minimal",
  "klasik",
  "royal",
  "watercolor",
  "rustic",
  "elegant",
  "nature",
];

export const ORNAMENT_VISUAL_PROP_OPTIONS = [
  "gelap",
  "terang",
  "tebal",
  "halus",
  "tradisional",
  "modern",
  "mewah",
  "sederhana",
];

const ORNAMENT_SLOT_OPTIONS = [
  "fill",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
  "center-top",
  "center-bottom",
  "side-left",
  "side-right",
  "middle-left",
  "middle-right",
  "center",
];

const ORNAMENT_VISUAL_PROP_LABELS = {
  gelap: "Gelap (cocok di bg terang)",
  terang: "Terang (cocok di bg gelap)",
  tebal: "Tebal / pekat",
  halus: "Halus / tipis",
  tradisional: "Tradisional / adat",
  modern: "Modern / geometris",
  mewah: "Mewah / gold-royal",
  sederhana: "Sederhana / minimal",
};

function splitComma(value = "") {
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinComma(values = []) {
  return (values || []).join(", ");
}

function getCategoryLabel(value) {
  return CATEGORY_OPTIONS.find((option) => option.value === value)?.label || value || "Custom / Lainnya";
}

function slugify(value = "ornament") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "ornament";
}

function formatBytes(value) {
  const size = Number(value || 0);
  if (!size) return "-";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value) {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "-";
  }
}

function inferTags(asset) {
  const pieces = [
    asset.section,
    asset.templateId,
    ...(asset.name || "").split(/[-_\s]+/),
  ].filter(Boolean);

  return [...new Set(pieces.map((item) => String(item).toLowerCase()))].slice(0, 8);
}

function collectUsage(templates, asset) {
  const usage = [];
  const src = asset.src || "";
  const storagePath = asset.storagePath || "";
  const fileName = storagePath.split("/").pop() || asset.name || "";

  templates.forEach((template) => {
    const ornaments = template.designConfig?.ornaments || {};
    Object.entries(ornaments).forEach(([section, sectionOrnaments]) => {
      if (!Array.isArray(sectionOrnaments)) return;

      const count = sectionOrnaments.filter((ornament) => {
        const ornamentSrc = ornament?.src || ornament?.url || "";
        return (
          ornamentSrc === src ||
          (storagePath && ornamentSrc.includes(storagePath)) ||
          (fileName && ornamentSrc.includes(fileName))
        );
      }).length;

      if (count) {
        usage.push({
          templateId: template.id,
          templateName: template.name || template.id,
          section,
          count,
        });
      }
    });
  });

  return usage;
}

function OrnamentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3c2.5 3.2 4.9 5.4 8 6-1.2 3.5-3.4 5.8-8 12C7.4 14.8 5.2 12.5 4 9c3.1-.6 5.5-2.8 8-6Z" />
      <path d="M12 3v18" />
      <path d="M8 10h8" />
    </svg>
  );
}

export default function OrnamentManager() {
  const [assets, setAssets] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [dimensions, setDimensions] = useState({});
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [tag, setTag] = useState("all");
  const [uploadName, setUploadName] = useState("");
  const [uploadCategory, setUploadCategory] = useState("corner");
  const [uploadTags, setUploadTags] = useState("");
  const [uploadTheme, setUploadTheme] = useState("");
  const [uploadSlots, setUploadSlots] = useState("");
  const [uploadVisualProps, setUploadVisualProps] = useState("");
  const [uploadTemplateId, setUploadTemplateId] = useState("ornament-library");
  const [uploadFile, setUploadFile] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("custom");
  const [editTags, setEditTags] = useState("");
  const [editTheme, setEditTheme] = useState("");
  const [editSlots, setEditSlots] = useState("");
  const [editVisualProps, setEditVisualProps] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [message, setMessage] = useState(null);
  const [uploadHint, setUploadHint] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const enrichedAssets = useMemo(
    () =>
      assets.map((asset) => {
        const explicitTags = String(asset.tags || "").split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
        return {
          ...asset,
          explicitTags,
          tags: explicitTags,
          usage: collectUsage(templates, asset),
        };
      }),
    [assets, templates],
  );

  const tags = useMemo(
    () => [...new Set(enrichedAssets.flatMap((asset) => asset.tags))].sort(),
    [enrichedAssets],
  );

  const filteredAssets = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return enrichedAssets.filter((asset) => {
      const matchesCategory = category === "all" || asset.section === category;
      const matchesTag = tag === "all" || asset.tags.includes(tag);
      const haystack = [
        asset.name,
        asset.section,
        asset.templateId,
        asset.mimeType,
        asset.storagePath,
        getCategoryLabel(asset.section),
        ...inferTags(asset),
        ...asset.tags,
      ].join(" ").toLowerCase();
      return matchesCategory && matchesTag && (!needle || haystack.includes(needle));
    });
  }, [category, enrichedAssets, query, tag]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ornamentResponse, templateResponse] = await Promise.all([
        fetch("/api/templates/ornaments/upload?scope=all", { cache: "no-store" }),
        fetch("/api/templates?scope=admin", { cache: "no-store" }),
      ]);
      const ornamentResult = await ornamentResponse.json().catch(() => ({}));
      const templateResult = await templateResponse.json().catch(() => ({}));

      if (!ornamentResponse.ok) {
        throw new Error(ornamentResult.error || "Gagal memuat ornamen.");
      }
      if (!templateResponse.ok) {
        throw new Error(templateResult.error || "Gagal memuat template.");
      }

      setAssets(Array.isArray(ornamentResult.data) ? ornamentResult.data : []);
      setTemplates(Array.isArray(templateResult.data) ? templateResult.data : []);
    } catch (error) {
      setMessage({ tone: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!uploadFile) {
      setMessage({ tone: "error", text: "Pilih file ornamen dulu." });
      return;
    }

    setUploading(true);
    try {
      const prepared = await prepareImageForUpload(uploadFile, "ornament");
      const fileForUpload = prepared.file;
      const formData = new FormData();
      formData.append("templateId", uploadTemplateId || "ornament-library");
      formData.append("section", uploadCategory || "general");
      formData.append("ornamentId", slugify(uploadName || fileForUpload.name));
      formData.append("name", uploadName || fileForUpload.name);
      formData.append("tags", uploadTags);
      formData.append("theme", uploadTheme);
      formData.append("suggestedSlots", uploadSlots);
      formData.append("visualProps", uploadVisualProps);
      formData.append("file", fileForUpload);

      const response = await fetch("/api/templates/ornaments/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || "Gagal upload ornamen.");
      }

      const uploaded = {
        ...result.data,
        id: result.data.storagePath || result.data.url,
        name: uploadName || slugify(fileForUpload.name),
        section: uploadCategory,
        fileSize: fileForUpload.size,
        mimeType: fileForUpload.type,
        createdAt: new Date().toISOString(),
        tags: uploadTags,
        theme: result.data.theme || splitComma(uploadTheme),
        suggestedSlots: result.data.suggestedSlots || splitComma(uploadSlots),
        visualProps: result.data.visualProps || splitComma(uploadVisualProps),
        src: result.data.url,
      };
      setAssets((current) => [uploaded, ...current]);
      setUploadName("");
      setUploadTags("");
      setUploadTheme("");
      setUploadSlots("");
      setUploadVisualProps("");
      setUploadFile(null);
      setUploadHint(prepared.message || "");
      form.reset();
      setMessage({
        tone: "success",
        text: prepared.message
          ? `Ornamen berhasil ditambahkan. ${prepared.message}`
          : "Ornamen berhasil ditambahkan.",
      });
    } catch (error) {
      setMessage({ tone: "error", text: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleAiOrnamentSaved = (saved) => {
    if (!saved) return;

    const newAsset = {
      id: saved.storagePath,
      src: saved.url,
      storagePath: saved.storagePath,
      name: saved.name,
      section: "ai-generated",
      theme: saved.theme || [],
      suggestedSlots: saved.suggestedSlots || [],
      visualProps: saved.visualProps || [],
      tags: (saved.theme || []).join(", "),
      mimeType: "image/png",
      createdAt: new Date().toISOString(),
      source: "ai",
    };
    setAssets((current) => [newAsset, ...current]);
    setMessage({ tone: "success", text: "Ornamen AI tersimpan ke library." });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const response = await fetch("/api/templates/ornaments/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storagePath: deleteTarget.storagePath }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus ornamen.");
      }

      setAssets((current) => current.filter((asset) => asset.storagePath !== deleteTarget.storagePath));
      setMessage({ tone: "success", text: "Ornamen berhasil dihapus." });
      setDeleteTarget(null);
    } catch (error) {
      setMessage({ tone: "error", text: error.message });
    } finally {
      setDeleting(false);
    }
  };

  const openEditDetails = (asset) => {
    setEditTarget(asset);
    setEditName(asset.name || "");
    setEditCategory(asset.section || "custom");
    setEditTags(asset.explicitTags?.join(", ") || "");
    setEditTheme(joinComma(asset.theme));
    setEditSlots(joinComma(asset.suggestedSlots));
    setEditVisualProps(joinComma(asset.visualProps));
    setEditFile(null);
  };

  const handleSaveDetails = async (event) => {
    event.preventDefault();
    if (!editTarget) return;

    setSavingDetails(true);
    try {
      let prepared = { file: editFile, message: "" };
      let requestBody;
      let requestHeaders;

      if (editFile) {
        prepared = await prepareImageForUpload(editFile, "ornament");
        requestBody = new FormData();
        requestBody.append("storagePath", editTarget.storagePath);
        requestBody.append("name", editName);
        requestBody.append("category", editCategory);
        requestBody.append("tags", editTags);
        requestBody.append("theme", editTheme);
        requestBody.append("suggestedSlots", editSlots);
        requestBody.append("visualProps", editVisualProps);
        requestBody.append("mimeType", editTarget.mimeType || "");
        requestBody.append("file", prepared.file);
      } else {
        requestHeaders = { "Content-Type": "application/json" };
        requestBody = JSON.stringify({
          storagePath: editTarget.storagePath,
          name: editName,
          category: editCategory,
          tags: editTags,
          theme: editTheme,
          suggestedSlots: editSlots,
          visualProps: editVisualProps,
          mimeType: editTarget.mimeType,
        });
      }

      const response = await fetch("/api/templates/ornaments/upload", {
        method: "PATCH",
        headers: requestHeaders,
        body: requestBody,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan detail ornamen.");
      }

      const nextSrc = editFile
        ? `${editTarget.src}${editTarget.src.includes("?") ? "&" : "?"}v=${Date.now()}`
        : editTarget.src;
      setAssets((current) =>
        current.map((asset) =>
          asset.storagePath === editTarget.storagePath
            ? {
                ...asset,
                name: result.data.name,
                section: result.data.section,
                tags: result.data.tags,
                theme: result.data.theme || splitComma(editTheme),
                suggestedSlots: result.data.suggestedSlots || splitComma(editSlots),
                visualProps: result.data.visualProps || splitComma(editVisualProps),
                src: nextSrc,
                fileSize: result.data.fileSize || asset.fileSize,
                mimeType: result.data.mimeType || asset.mimeType,
              }
            : asset,
        ),
      );
      setEditTarget(null);
      setEditFile(null);
      setMessage({
        tone: "success",
        text: editFile
          ? `Ornamen berhasil diganti tanpa mengubah path. ${prepared.message || ""}`.trim()
          : "Detail ornamen berhasil diperbarui.",
      });
    } catch (error) {
      setMessage({ tone: "error", text: error.message });
    } finally {
      setSavingDetails(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-[var(--dash-ink)]">Library ornamen</h2>
          <p className="mt-1 max-w-3xl text-sm font-semibold leading-6 text-[var(--dash-muted)]">
            Kelola aset ornamen global, cek ukuran file, dimensi, kategori, tag pencarian, dan pemakaian di template.
          </p>
        </div>
        <DashboardButton type="button" variant="secondary" onClick={loadData} disabled={loading}>
          Refresh
        </DashboardButton>
      </div>

      {message ? (
        <StatusToast
          tone={message.tone}
          message={message.text}
          onDismiss={() => setMessage(null)}
        />
      ) : null}

      <AiOrnamentGenerator templates={templates} onSaved={handleAiOrnamentSaved} />

      <DashboardCard>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Field label="Upload ornamen">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={(event) => {
                    setUploadFile(event.target.files?.[0] || null);
                    setUploadHint("");
                  }}
                  className="block w-full rounded-xl border border-dashed border-[var(--dash-border)] bg-[var(--dash-fog)] px-3 py-3 text-sm font-semibold text-[var(--dash-ink)] file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-bold file:text-[var(--dash-ink)]"
                />
                <p className="mt-2 text-xs font-semibold leading-5 text-[var(--dash-muted)]">
                  PNG/JPG/WEBP akan dikompres otomatis maksimal 5MB. SVG tetap disimpan asli.
                </p>
                {uploadHint ? (
                  <p className="mt-1 text-xs font-bold text-emerald-700">{uploadHint}</p>
                ) : null}
              </Field>
            </div>
            <div className="lg:col-span-2">
              <Field label="Nama">
                <TextInput value={uploadName} onChange={(event) => setUploadName(event.target.value)} placeholder="corner floral" />
              </Field>
            </div>
            <div className="lg:col-span-2">
              <Field label="Kategori">
                <SelectInput value={uploadCategory} onChange={(event) => setUploadCategory(event.target.value)}>
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </SelectInput>
              </Field>
            </div>
            <div className="lg:col-span-2">
              <Field label="Simpan di">
                <SelectInput value={uploadTemplateId} onChange={(event) => setUploadTemplateId(event.target.value)}>
                  <option value="ornament-library">Library global</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>{template.name || template.id}</option>
                  ))}
                </SelectInput>
              </Field>
            </div>
            <div className="lg:col-span-2">
              <Field label="Tag">
                <TextInput value={uploadTags} onChange={(event) => setUploadTags(event.target.value)} placeholder="gold, floral" />
              </Field>
            </div>
            <div className="flex items-end lg:col-span-1">
              <DashboardButton type="submit" loading={uploading} className="w-full">
                Tambah
              </DashboardButton>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-fog)]/50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--dash-muted)]">
              Metadata AI Template Generator
            </p>
            <p className="mt-1 text-xs font-semibold leading-5 text-[var(--dash-muted)]">
              Dipakai AI untuk mencocokkan ornamen dengan prompt. Isi agar hasil generate lebih akurat.
            </p>
            <div className="mt-3 grid gap-4 lg:grid-cols-3">
              <Field label="Tema (pilih 1 atau lebih)">
                <SelectInput
                  value={uploadTheme}
                  onChange={(event) => setUploadTheme(event.target.value)}
                >
                  <option value="">Pilih tema...</option>
                  {ORNAMENT_THEME_OPTIONS.map((theme) => (
                    <option key={theme} value={theme}>{theme}</option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Slot yang cocok (pisahkan koma)">
                <TextInput
                  value={uploadSlots}
                  onChange={(event) => setUploadSlots(event.target.value)}
                  placeholder="top-left, bottom-right"
                />
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {ORNAMENT_SLOT_OPTIONS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        const current = splitComma(uploadSlots);
                        const next = current.includes(slot)
                          ? current.filter((item) => item !== slot)
                          : [...current, slot];
                        setUploadSlots(joinComma(next));
                      }}
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-bold transition-colors ${
                        splitComma(uploadSlots).includes(slot)
                          ? "border-[var(--color-accent)] bg-white text-[var(--dash-ink)]"
                          : "border-[var(--dash-border)] bg-white/60 text-[var(--dash-muted)] hover:bg-white"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Sifat visual (pilih 1 atau lebih)">
                <SelectInput
                  value={uploadVisualProps}
                  onChange={(event) => setUploadVisualProps(event.target.value)}
                >
                  <option value="">Pilih sifat...</option>
                  {ORNAMENT_VISUAL_PROP_OPTIONS.map((prop) => (
                    <option key={prop} value={prop}>
                      {ORNAMENT_VISUAL_PROP_LABELS[prop] || prop}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            </div>
          </div>
        </form>
      </DashboardCard>

      <DashboardCard>
        <div className="grid gap-3 md:grid-cols-4">
          <Field label="Cari">
            <TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="nama, tag, template" />
          </Field>
          <Field label="Kategori">
            <SelectInput value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">Semua kategori</option>
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Tag">
            <SelectInput value={tag} onChange={(event) => setTag(event.target.value)}>
              <option value="all">Semua tag</option>
              {tags.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </SelectInput>
          </Field>
          <div className="flex items-end">
            <div className="w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-fog)] px-4 py-2.5 text-sm font-bold text-[var(--dash-ink)]">
              {filteredAssets.length} dari {assets.length} ornamen
            </div>
          </div>
        </div>
      </DashboardCard>

      {loading ? (
        <DashboardCard>
          <div className="flex min-h-44 items-center justify-center text-sm font-bold text-[var(--dash-muted)]">
            Memuat library ornamen...
          </div>
        </DashboardCard>
      ) : filteredAssets.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredAssets.map((asset) => {
            const dimension = dimensions[asset.id || asset.storagePath];
            return (
              <article key={asset.id || asset.storagePath} className="overflow-hidden rounded-[14px] border border-[var(--dash-border)] bg-white shadow-[var(--dash-shadow)]">
                <div className="flex aspect-[4/3] items-center justify-center bg-slate-50 p-4">
                  {asset.src ? (
                    <img
                      src={asset.src}
                      alt={asset.name}
                      className="max-h-full max-w-full object-contain"
                      onLoad={(event) => {
                        const key = asset.id || asset.storagePath;
                        const { naturalWidth, naturalHeight } = event.currentTarget || {};
                        setDimensions((current) => ({
                          ...current,
                          [key]: naturalWidth && naturalHeight ? `${naturalWidth} x ${naturalHeight}px` : "-",
                        }));
                      }}
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--dash-fog)] text-[var(--dash-muted)]">
                      <OrnamentIcon />
                    </div>
                  )}
                </div>
                <div className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-black text-[var(--dash-ink)]" title={asset.name}>
                        {asset.name}
                      </h3>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
                        {getCategoryLabel(asset.section)}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => openEditDetails(asset)}
                        className="rounded-lg border border-[var(--dash-border)] px-3 py-2 text-sm font-bold text-[var(--dash-ink)] transition-colors hover:bg-[var(--dash-fog)]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(asset)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-bold text-red-700 transition-colors hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[var(--dash-muted)]">
                    <span className="rounded-lg bg-[var(--dash-fog)] px-3 py-2">Dimensi: {dimension || "loading"}</span>
                    <span className="rounded-lg bg-[var(--dash-fog)] px-3 py-2">Size: {formatBytes(asset.fileSize)}</span>
                    <span className="rounded-lg bg-[var(--dash-fog)] px-3 py-2">Type: {asset.mimeType || "-"}</span>
                    <span className="rounded-lg bg-[var(--dash-fog)] px-3 py-2">Upload: {formatDate(asset.createdAt)}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {asset.tags.slice(0, 6).map((item) => (
                      <span key={item} className="rounded-full bg-[#f3eadb] px-2.5 py-1 text-xs font-bold text-[var(--dash-ink)]">
                        #{item}
                      </span>
                    ))}
                  </div>

                  {(asset.theme?.length || asset.suggestedSlots?.length || asset.visualProps?.length) ? (
                    <div className="space-y-1.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-fog)]/40 p-3">
                      {asset.theme?.length ? (
                        <p className="text-xs font-semibold text-[var(--dash-muted)]">
                          <span className="font-black text-[var(--dash-ink)]">Tema:</span>{" "}
                          {asset.theme.join(", ")}
                        </p>
                      ) : null}
                      {asset.suggestedSlots?.length ? (
                        <p className="text-xs font-semibold text-[var(--dash-muted)]">
                          <span className="font-black text-[var(--dash-ink)]">Slot:</span>{" "}
                          {asset.suggestedSlots.join(", ")}
                        </p>
                      ) : null}
                      {asset.visualProps?.length ? (
                        <p className="text-xs font-semibold text-[var(--dash-muted)]">
                          <span className="font-black text-[var(--dash-ink)]">Visual:</span>{" "}
                          {asset.visualProps.join(", ")}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="rounded-xl border border-[var(--dash-border)] p-3">
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
                      Dipakai di template
                    </p>
                    {asset.usage.length ? (
                      <div className="mt-2 space-y-1.5">
                        {asset.usage.slice(0, 5).map((usage) => (
                          <p key={`${usage.templateId}-${usage.section}`} className="text-sm font-semibold text-[var(--dash-ink)]">
                            {usage.templateName} <span className="text-[var(--dash-muted)]">({usage.section}, {usage.count}x)</span>
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm font-semibold text-[var(--dash-muted)]">Belum terpasang di template.</p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <DashboardCard>
          <div className="flex min-h-44 flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--dash-fog)] text-[var(--dash-ink)]">
              <OrnamentIcon />
            </div>
            <p className="mt-3 text-sm font-bold text-[var(--dash-ink)]">Belum ada ornamen yang cocok.</p>
            <p className="mt-1 text-sm font-medium text-[var(--dash-muted)]">Coba ubah filter atau upload aset baru.</p>
          </div>
        </DashboardCard>
      )}

      <ConfirmationModal
        show={Boolean(deleteTarget)}
        title="Hapus ornamen?"
        description={
          deleteTarget
            ? `Ornamen "${deleteTarget.name}" akan dihapus dari storage. Template yang masih memakai file ini perlu diganti manual.`
            : ""
        }
        confirmLabel="Hapus"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />

      {editTarget ? (
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-slate-950/35 p-4">
          <form
            onSubmit={handleSaveDetails}
            className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[14px] border border-[var(--dash-border)] bg-white shadow-2xl"
          >
            <div className="border-b border-[var(--dash-border)] px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
                Detail ornamen
              </p>
              <h3 className="mt-1 text-2xl font-black text-[var(--dash-ink)]">Edit metadata</h3>
            </div>
            <div className="grid min-h-0 flex-1 gap-0 overflow-hidden lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.15fr)]">
              <div className="border-b border-[var(--dash-border)] bg-slate-50 p-5 lg:border-b-0 lg:border-r">
                <div className="flex h-64 items-center justify-center rounded-xl bg-white p-4 shadow-inner shadow-slate-200/70 lg:h-full lg:min-h-[360px]">
                  {editTarget.src ? (
                    <img src={editTarget.src} alt={editTarget.name} className="max-h-full max-w-full object-contain" />
                  ) : null}
                </div>
              </div>
              <div className="min-h-0 space-y-4 overflow-y-auto p-5">
                <Field label="Nama ornamen">
                  <TextInput
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    placeholder="Nama ornamen"
                    required
                  />
                </Field>
                <Field label="Kategori">
                  <SelectInput value={editCategory} onChange={(event) => setEditCategory(event.target.value)}>
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Tag pencarian">
                  <TextInput
                    value={editTags}
                    onChange={(event) => setEditTags(event.target.value)}
                    placeholder="gold, floral, classic"
                  />
                </Field>
                <div className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-fog)]/50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--dash-muted)]">
                    Metadata AI Template Generator
                  </p>
                  <div className="mt-3 space-y-4">
                    <Field label="Tema (pilih 1 atau lebih)">
                      <SelectInput
                        value={editTheme}
                        onChange={(event) => setEditTheme(event.target.value)}
                      >
                        <option value="">Pilih tema...</option>
                        {ORNAMENT_THEME_OPTIONS.map((theme) => (
                          <option key={theme} value={theme}>{theme}</option>
                        ))}
                      </SelectInput>
                    </Field>
                    <Field label="Slot yang cocok (pisahkan koma)">
                      <TextInput
                        value={editSlots}
                        onChange={(event) => setEditSlots(event.target.value)}
                        placeholder="top-left, bottom-right"
                      />
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {ORNAMENT_SLOT_OPTIONS.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => {
                              const current = splitComma(editSlots);
                              const next = current.includes(slot)
                                ? current.filter((item) => item !== slot)
                                : [...current, slot];
                              setEditSlots(joinComma(next));
                            }}
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-bold transition-colors ${
                              splitComma(editSlots).includes(slot)
                                ? "border-[var(--color-accent)] bg-white text-[var(--dash-ink)]"
                                : "border-[var(--dash-border)] bg-white/60 text-[var(--dash-muted)] hover:bg-white"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <Field label="Sifat visual (pilih 1 atau lebih)">
                      <SelectInput
                        value={editVisualProps}
                        onChange={(event) => setEditVisualProps(event.target.value)}
                      >
                        <option value="">Pilih sifat...</option>
                        {ORNAMENT_VISUAL_PROP_OPTIONS.map((prop) => (
                          <option key={prop} value={prop}>
                            {ORNAMENT_VISUAL_PROP_LABELS[prop] || prop}
                          </option>
                        ))}
                      </SelectInput>
                    </Field>
                  </div>
                </div>
                <Field label="Replace gambar">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={(event) => {
                      setEditFile(event.target.files?.[0] || null);
                    }}
                    className="block w-full rounded-xl border border-dashed border-[var(--dash-border)] bg-[var(--dash-fog)] px-3 py-3 text-sm font-semibold text-[var(--dash-ink)] file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-bold file:text-[var(--dash-ink)]"
                  />
                  <p className="mt-2 text-xs font-semibold leading-5 text-[var(--dash-muted)]">
                    Opsional. File baru akan dikompres lalu mengganti file lama di path yang sama, jadi template yang sudah memakai ornamen ini tetap aman.
                  </p>
                  {editFile ? (
                    <p className="mt-1 text-xs font-bold text-[var(--dash-ink)]">
                      Dipilih: {editFile.name} ({formatBytes(editFile.size)})
                    </p>
                  ) : null}
                </Field>
                <div className="break-all rounded-xl bg-[var(--dash-fog)] px-4 py-3 text-xs font-semibold leading-5 text-[var(--dash-muted)]">
                  File: {editTarget.storagePath}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-[var(--dash-border)] bg-slate-50 px-5 py-4">
              <DashboardButton
                type="button"
                variant="secondary"
                disabled={savingDetails}
                onClick={() => setEditTarget(null)}
              >
                Batal
              </DashboardButton>
              <DashboardButton type="submit" loading={savingDetails}>
                Simpan Detail
              </DashboardButton>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
