"use client";

import { useEffect, useState } from "react";
import { DashboardButton, DashboardCard } from "../FormControls";
import {
  FALLBACK_TEMPLATE_THUMBNAIL,
  readDefaultTemplateThumbnail,
} from "../../../lib/templateThumbnail";

function TemplateStatusPill({ status }) {
  const isActive = status === "active";
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.08em] ${
        isActive
          ? "bg-[var(--color-wa)] text-white"
          : "bg-[var(--color-section-soft)] text-[var(--color-text)]"
      }`}
    >
      {isActive ? "Active" : "Hidden"}
    </span>
  );
}

// Thumbnail dengan placeholder: gambar dimuat asinkron (lazy) dan
// tampil dengan fade-in setelah selesai. Selama belum ada, tampil
// placeholder abu-abu berdenyut — jadi card tidak "bolong".
function ThumbWithPlaceholder({ src, alt }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <div className="relative h-full w-full">
      {!loaded ? (
        <div className="absolute inset-0 animate-pulse bg-[var(--dash-fog)]" aria-hidden="true" />
      ) : null}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        onLoad={() => setLoaded(true)}
        className={`relative h-full w-full object-contain transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

function SkeletonCard() {
  return (
    <DashboardCard className="overflow-hidden bg-[var(--dash-canvas)] p-3 shadow-[var(--dash-shadow)]">
      <div className="flex gap-3">
        <div className="aspect-[9/13] w-24 shrink-0 animate-pulse rounded-[8px] bg-[var(--dash-fog)]" />
        <div className="min-w-0 flex-1 space-y-2.5">
          <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--dash-fog)]" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-[var(--dash-fog)]" />
          <div className="h-3 w-full animate-pulse rounded bg-[var(--dash-fog)]" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-[var(--dash-fog)]" />
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-1.5 border-t border-[var(--dash-border)] pt-2.5">
        <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--dash-fog)]" />
        <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--dash-fog)]" />
        <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--dash-fog)]" />
      </div>
    </DashboardCard>
  );
}

export default function TemplateCatalogGrid({
  visible,
  filteredTemplates,
  isLoadingTemplates,
  startEditTemplate,
  duplicateTemplate,
  toggleTemplateStatus,
  deleteTemplate,
}) {
  const [defaultThumbnail, setDefaultThumbnail] = useState(FALLBACK_TEMPLATE_THUMBNAIL);

  useEffect(() => {
    setDefaultThumbnail(readDefaultTemplateThumbnail());
  }, []);

  if (!visible) return null;

  return (
    <div className="mt-6">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filteredTemplates.map((template) => (
          <DashboardCard
            key={template.id}
            className="group overflow-hidden bg-[var(--dash-canvas)] p-3 shadow-[var(--dash-shadow)]"
          >
            <div className="flex gap-3">
              <a
                href={template.previewUrl}
                className="relative block aspect-[9/13] w-24 shrink-0 overflow-hidden rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] shadow-inner"
                title="Buka preview"
              >
                <ThumbWithPlaceholder
                  src={template.image || defaultThumbnail}
                  alt={`Preview ${template.name}`}
                />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/60" />
              </a>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-black text-[var(--dash-ink)]">{template.name}</h3>
                    <p className="mt-0.5 truncate text-[11px] font-bold text-[var(--dash-muted)]">{template.id}</p>
                  </div>
                  {template.badge ? (
                    <span className="shrink-0 rounded-full bg-[var(--dash-fog)] px-2 py-1 text-[10px] font-black text-[var(--dash-ink)]">
                      {template.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-[var(--dash-muted)]">
                  {template.description}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <TemplateStatusPill status={template.status} />
                  <span className="rounded-full bg-[var(--dash-fog)] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.06em] text-[var(--dash-muted)]">
                    {template.supportedFeatures.length} fitur
                  </span>
                </div>
                <div className="mt-2 flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-black text-[var(--dash-ink)]">{template.category}</p>
                    <p className="text-sm font-black text-[var(--color-accent)]">{template.price}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-1.5 border-t border-[var(--dash-border)] pt-2.5">
                <a
                  href={template.previewUrl}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--dash-border)] text-[var(--dash-ink)] transition-colors hover:bg-[var(--dash-fog)]"
                  title="Preview"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </a>
                <DashboardButton
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => startEditTemplate(template)}
                  className="h-8 w-8 !rounded-full !p-0"
                  title="Edit"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
                  </svg>
                </DashboardButton>
                <DashboardButton
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => duplicateTemplate(template)}
                  className="h-8 w-8 !rounded-full !p-0"
                  title="Duplikat"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </DashboardButton>
                <DashboardButton
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => toggleTemplateStatus(template.id)}
                  className="h-8 w-8 !rounded-full !p-0"
                  title={template.status === "active" ? "Sembunyikan" : "Aktifkan"}
                >
                  {template.status === "active" ? (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a21.8 21.8 0 0 1 5.06-6.94" />
                      <path d="M9.9 4.24A10.9 10.9 0 0 1 12 4c7 0 11 8 11 8a21.3 21.3 0 0 1-2.16 3.19" />
                      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                      <path d="m1 1 22 22" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </DashboardButton>
                <DashboardButton
                  type="button"
                  size="sm"
                  variant="danger"
                  onClick={() => deleteTemplate(template)}
                  className="h-8 w-8 !rounded-full !p-0"
                  title="Hapus"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                  </svg>
                </DashboardButton>
            </div>
          </DashboardCard>
        ))}

        {isLoadingTemplates && filteredTemplates.length === 0 ? (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} />
            ))}
          </>
        ) : filteredTemplates.length === 0 ? (
          <div className="px-5 py-12 text-center md:col-span-2 xl:col-span-3 2xl:col-span-4">
            <p className="text-xl font-black text-[var(--color-primary)]">Template tidak ditemukan</p>
            <p className="mt-2 text-base font-semibold text-[var(--color-text)]">
              Coba ubah keyword, kategori, atau status filter.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
