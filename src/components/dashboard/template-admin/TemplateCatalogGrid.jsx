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
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {filteredTemplates.map((template) => (
          <DashboardCard
            key={template.id}
            className="group overflow-hidden bg-[var(--dash-canvas)] p-0 shadow-[var(--dash-shadow)]"
          >
            <img
              src={template.image || defaultThumbnail}
              alt={`Preview ${template.name}`}
              className="aspect-[4/5] w-full bg-[var(--dash-fog)] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="space-y-4 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-black text-[var(--dash-ink)]">{template.name}</h3>
                <span className="rounded-full bg-[var(--dash-fog)] px-3 py-1 text-xs font-black text-[var(--dash-ink)]">
                  {template.badge}
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-[var(--dash-muted)]">{template.id}</p>
              <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-[var(--dash-muted)]">
                {template.description}
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
                {template.supportedFeatures.length} fitur support
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-black text-[var(--dash-ink)]">{template.category}</p>
                  <p className="text-base font-black text-[var(--color-accent)]">{template.price}</p>
                </div>
                <TemplateStatusPill status={template.status} />
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-[var(--dash-border)] pt-3">
                <a
                  href={template.previewUrl}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--dash-border)] text-[var(--dash-ink)] transition-colors hover:bg-[var(--dash-fog)]"
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
                  className="h-9 w-9 !rounded-full !p-0"
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
                  className="h-9 w-9 !rounded-full !p-0"
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
                  className="h-9 w-9 !rounded-full !p-0"
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
                  className="h-9 w-9 !rounded-full !p-0"
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
            </div>
          </DashboardCard>
        ))}

        {isLoadingTemplates ? (
          <div className="px-5 py-12 text-center">
            <p className="text-xl font-black text-[var(--color-primary)]">Memuat template...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="px-5 py-12 text-center">
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
