"use client";

import React, { useState } from "react";
import { Field, SelectInput, TextInput } from "../FormControls";
import VisualChoiceControl from "./VisualChoiceControl";
import SectionOrderPanel from "./SectionOrderPanel";
import {
  previewSpacingCompact,
  previewSpacingNormal,
  previewSpacingRoomy,
  previewCornerRounded,
  previewCornerSharp,
  previewCornerPill,
  previewAnimNone,
  previewAnimFadeUp,
  previewAnimZoomIn,
  previewAnimPop,
  previewAnimSlideLeft,
  previewAnimSlideRight,
  previewAnimFade,
} from "./choicePreviews";

// ============================================================
// SectionSettingsPanel — satu panel untuk mengatur SEMUA section
// (Cover, Acara, Countdown, dst) dalam accordion. Menggabungkan
// kontrol yang tadinya tersebar: background (global/warna/foto),
// overlay, parallax, warna teks, jarak, gaya card, ukuran konten,
// dan animasi masuk — jadi admin tidak bolak-balik nyari setting.
// ============================================================

const SECTION_OPTIONS = [
  { id: "home", label: "Cover / Home" },
  { id: "couple", label: "Mempelai" },
  { id: "acara", label: "Acara" },
  { id: "countdown", label: "Hitung Mundur" },
  { id: "story", label: "Love Story" },
  { id: "gallery", label: "Galeri" },
  { id: "gift", label: "Amplop Digital" },
  { id: "rsvp", label: "RSVP" },
  { id: "doa-ucapan", label: "Doa & Ucapan" },
];

const spacingOptions = [
  {
    value: "compact",
    label: "Rapat",
    description: "Padding kecil, konten lebih rapat.",
    preview: previewSpacingCompact(),
  },
  {
    value: "normal",
    label: "Normal",
    description: "Padding standar, tampilan seimbang.",
    preview: previewSpacingNormal(),
  },
  {
    value: "roomy",
    label: "Lega",
    description: "Padding besar, terasa lega dan premium.",
    preview: previewSpacingRoomy(),
  },
];

const cardStyleOptions = [
  {
    value: "rounded",
    label: "Membulat",
    description: "Modern dan aman untuk banyak tema.",
    preview: previewCornerRounded(),
  },
  {
    value: "sharp",
    label: "Tegas",
    description: "Sudut tajam, cocok untuk tema formal.",
    preview: previewCornerSharp(),
  },
  {
    value: "pill",
    label: "Sangat bulat",
    description: "Terasa lebih playful.",
    preview: previewCornerPill(),
  },
];

const entranceOptions = [
  {
    value: "fade-up",
    label: "Muncul bawah",
    preview: previewAnimFadeUp(),
  },
  {
    value: "zoom-in",
    label: "Membesar",
    preview: previewAnimZoomIn(),
  },
  {
    value: "pop-up",
    label: "Pop up",
    preview: previewAnimPop(),
  },
  {
    value: "slide-left",
    label: "Geser kanan",
    preview: previewAnimSlideLeft(),
  },
  {
    value: "slide-right",
    label: "Geser kiri",
    preview: previewAnimSlideRight(),
  },
  {
    value: "fade",
    label: "Fade",
    preview: previewAnimFade(),
  },
  {
    value: "none",
    label: "Tanpa",
    preview: previewAnimNone(),
  },
];

function SectionAccordion({
  section,
  label,
  sectionConfig,
  defaultOpen = false,
  updateSection,
  uploadSectionBackground,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const enabled = sectionConfig.useGlobalBackground !== false;
  const mode = sectionConfig.backgroundMode || "color";

  const toggleUseGlobal = () => {
    updateSection(section, "useGlobalBackground", !enabled);
    updateSection(section, "useGlobal", !enabled ? false : true);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--dash-border)] bg-white">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--dash-fog)]/60"
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${
              enabled ? "bg-[var(--dash-ink)]" : "bg-[var(--color-accent)]"
            }`}
            aria-hidden="true"
          />
          <span className="truncate text-sm font-bold text-[var(--dash-ink)]">
            {label}
          </span>
          {!enabled ? (
            <span className="shrink-0 rounded-full bg-[var(--color-accent)]/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[var(--color-primary)]">
              Kustom
            </span>
          ) : null}
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="hidden text-[10px] font-semibold text-[var(--dash-muted)] sm:block">
            {enabled ? "Pakai gaya global" : "Diatur sendiri"}
          </span>
          <svg
            viewBox="0 0 20 20"
            className={`h-4 w-4 text-[var(--dash-muted)] transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="m6 8 4 4 4-4" />
          </svg>
        </span>
      </button>

      {open ? (
        <div className="space-y-4 border-t border-[var(--dash-border)] px-4 py-4">
          {/* Sumber latar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase tracking-[0.08em] text-[var(--dash-muted)]">
              Latar:
            </span>
            <button
              type="button"
              onClick={toggleUseGlobal}
              className={`rounded-full px-3 py-1.5 text-[11px] font-black transition-colors ${
                enabled
                  ? "bg-[var(--dash-ink)] text-white"
                  : "bg-white text-[var(--dash-muted)] ring-1 ring-[var(--dash-border)]"
              }`}
              aria-pressed={enabled}
            >
              Ikut global
            </button>
            {!enabled ? (
              <>
                <button
                  type="button"
                  onClick={() => updateSection(section, "backgroundMode", "color")}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-black transition-colors ${
                    mode === "color"
                      ? "bg-[var(--dash-ink)] text-white"
                      : "bg-white text-[var(--dash-muted)] ring-1 ring-[var(--dash-border)]"
                  }`}
                  aria-pressed={mode === "color"}
                >
                  Warna sendiri
                </button>
                <button
                  type="button"
                  onClick={() => updateSection(section, "backgroundMode", "image")}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-black transition-colors ${
                    mode === "image"
                      ? "bg-[var(--dash-ink)] text-white"
                      : "bg-white text-[var(--dash-muted)] ring-1 ring-[var(--dash-border)]"
                  }`}
                  aria-pressed={mode === "image"}
                >
                  Foto sendiri
                </button>
              </>
            ) : null}
          </div>

          {/* Isi latar saat tidak ikut global */}
          {!enabled ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {mode === "color" ? (
                <Field label="Warna Latar">
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={sectionConfig.backgroundColor || "#fbf7ef"}
                      onChange={(event) =>
                        updateSection(section, "backgroundColor", event.target.value)
                      }
                      className="h-11 w-16 shrink-0 cursor-pointer rounded-lg border border-[var(--dash-border)] bg-white p-1"
                    />
                    <span className="min-w-0 flex-1 text-xs font-semibold text-[var(--dash-muted)]">
                      {sectionConfig.backgroundColor || "Pilih warna"}
                    </span>
                  </div>
                </Field>
              ) : (
                <Field label="Foto Latar">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer rounded-lg border border-[var(--dash-border)] bg-white px-3 py-2 text-xs font-black text-[var(--dash-ink)] transition-colors hover:bg-[var(--dash-fog)]">
                      {sectionConfig.backgroundImage ? "Ganti Foto" : "Upload Foto"}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          try {
                            await uploadSectionBackground(section, file);
                          } catch (err) {
                            window.alert(err.message || "Gagal upload background section.");
                          }
                        }}
                      />
                    </label>
                    {sectionConfig.backgroundImage ? (
                      <button
                        type="button"
                        onClick={() => {
                          updateSection(section, "backgroundImage", "");
                          updateSection(section, "backgroundMode", "color");
                        }}
                        className="text-xs font-black text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    ) : null}
                  </div>
                  {sectionConfig.backgroundImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={sectionConfig.backgroundImage}
                      alt=""
                      className="mt-2 h-16 w-12 rounded-lg border border-[var(--dash-border)] object-cover"
                    />
                  ) : null}
                </Field>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Field label="Gelap Overlay">
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="80"
                      step="5"
                      value={Number(sectionConfig.backgroundOverlay) || 0}
                      onChange={(event) =>
                        updateSection(section, "backgroundOverlay", Number(event.target.value))
                      }
                      className="w-full"
                    />
                    <span className="w-9 shrink-0 text-right text-xs font-black text-[var(--dash-ink)]">
                      {Number(sectionConfig.backgroundOverlay) || 0}%
                    </span>
                  </div>
                </Field>
                <Field label="Parallax">
                  <SelectInput
                    value={sectionConfig.backgroundParallax || "none"}
                    onChange={(event) =>
                      updateSection(section, "backgroundParallax", event.target.value)
                    }
                  >
                    <option value="none">Tanpa</option>
                    <option value="slow">Pelan</option>
                    <option value="medium">Sedang</option>
                    <option value="fast">Cepat</option>
                  </SelectInput>
                </Field>
              </div>
            </div>
          ) : null}

          {/* Warna teks + jarak + card + ukuran + animasi (selalu tampil) */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Warna Teks">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={sectionConfig.textColor || "#262626"}
                  onChange={(event) => updateSection(section, "textColor", event.target.value)}
                  className="h-11 w-16 shrink-0 cursor-pointer rounded-lg border border-[var(--dash-border)] bg-white p-1"
                />
                <span className="min-w-0 flex-1 truncate text-xs font-semibold text-[var(--dash-muted)]">
                  {sectionConfig.textColor || "Pilih warna teks"}
                </span>
              </div>
            </Field>
            <Field label="Warna Card">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={sectionConfig.surfaceColor || "#ffffff"}
                  onChange={(event) => updateSection(section, "surfaceColor", event.target.value)}
                  className="h-11 w-16 shrink-0 cursor-pointer rounded-lg border border-[var(--dash-border)] bg-white p-1"
                />
                <span className="min-w-0 flex-1 truncate text-xs font-semibold text-[var(--dash-muted)]">
                  {sectionConfig.surfaceColor || "Pilih warna card"}
                </span>
              </div>
            </Field>
            <Field label="Jarak Section">
              <VisualChoiceControl
                value={sectionConfig.spacingPreset || "normal"}
                options={spacingOptions}
                onChange={(value) => updateSection(section, "spacingPreset", value)}
                columns={3}
                size="sm"
                ariaLabel={`Jarak section ${label}`}
              />
            </Field>
            <Field label="Gaya Card">
              <VisualChoiceControl
                value={sectionConfig.cardStyle || "rounded"}
                options={cardStyleOptions}
                onChange={(value) => updateSection(section, "cardStyle", value)}
                columns={3}
                size="sm"
                ariaLabel={`Gaya card section ${label}`}
              />
            </Field>
            <Field label="Ukuran Konten">
              <SelectInput
                value={sectionConfig.contentSize || "normal"}
                onChange={(event) => updateSection(section, "contentSize", event.target.value)}
              >
                <option value="small">Kecil (92%)</option>
                <option value="normal">Normal (100%)</option>
                <option value="large">Besar (108%)</option>
                <option value="xlarge">Sangat besar (116%)</option>
              </SelectInput>
            </Field>
            <Field label="Radius Card (px)">
              <TextInput
                type="number"
                min="0"
                max="48"
                value={sectionConfig.cardRadius ?? ""}
                onChange={(event) =>
                  updateSection(
                    section,
                    "cardRadius",
                    event.target.value === "" ? "" : Number(event.target.value),
                  )
                }
                placeholder="Kosongkan → pakai Gaya Card"
              />
            </Field>
            <Field label="Animasi Masuk">
              <VisualChoiceControl
                value={sectionConfig.entranceAnimation || "fade-up"}
                options={entranceOptions}
                onChange={(value) => updateSection(section, "entranceAnimation", value)}
                columns={3}
                size="sm"
                ariaLabel={`Animasi section ${label}`}
              />
            </Field>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function SectionSettingsPanel({
  parsedDesignConfig,
  updateTemplateSectionConfig,
  uploadSectionBackground,
  patchSectionsOrder,
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--dash-muted)]">
        Pengaturan per Section
      </p>
      <p className="text-xs font-semibold leading-5 text-[var(--dash-muted)]">
        Buka tiap section untuk atur latar, warna teks, jarak, gaya card, dan animasinya dalam satu tempat.
      </p>
      <div className="mt-3">
        <SectionOrderPanel
          parsedDesignConfig={parsedDesignConfig}
          patchSectionsOrder={patchSectionsOrder}
        />
      </div>
      <div className="mt-3 space-y-2">
        {SECTION_OPTIONS.map((sectionOption) => {
          const sectionConfig = parsedDesignConfig?.sections?.[sectionOption.id] || {};
          return (
            <SectionAccordion
              key={sectionOption.id}
              section={sectionOption.id}
              label={sectionOption.label}
              sectionConfig={sectionConfig}
              defaultOpen={sectionOption.id === "home"}
              updateSection={updateTemplateSectionConfig}
              uploadSectionBackground={uploadSectionBackground}
            />
          );
        })}
      </div>
    </div>
  );
}
