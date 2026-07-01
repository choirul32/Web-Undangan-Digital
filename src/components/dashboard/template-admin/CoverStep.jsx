"use client";

import { Field, SelectInput, ToggleField } from "../FormControls";

const optionLabels = {
  centered: "Tengah",
  split: "Terpisah",
  minimal: "Minimal",
  plain: "Polos",
  "separator-dot": "Titik pemisah",
  "separator-line": "Garis pemisah",
  stacked: "Bertumpuk",
  badge: "Badge",
  columns: "Kolom",
  "full-day": "Hari lengkap",
  block: "Blok tanggal",
  "fade-up": "Muncul dari bawah",
  "zoom-in": "Membesar halus",
  "pop-up": "Pop up lembut",
  color: "Warna",
  image: "Gambar",
  arch: "Lengkung",
  circle: "Lingkaran",
  square: "Kotak",
};

function optionLabel(value) {
  return optionLabels[value] || value;
}

function CoverLivePreview({ src }) {
  return (
    <div className="rounded-[14px] border border-[var(--dash-border)] bg-white p-3 lg:sticky lg:top-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--dash-muted)]">
          Pratinjau Cover
        </p>
        <span className="rounded-full bg-[var(--dash-fog)] px-2.5 py-1 text-[11px] font-black text-[var(--dash-ink)]">
          412px
        </span>
      </div>
      <div className="mx-auto w-fit">
        <div className="relative rounded-[24px] border-[3px] border-[var(--color-primary)]/65 bg-[var(--color-primary)]/10 p-1.5 shadow-[0_10px_24px_rgba(15,23,42,0.16)]">
          <div className="absolute left-1/2 top-0 z-20 h-4 w-16 -translate-x-1/2 rounded-b-2xl bg-[var(--color-primary)]/70" />
          <div
            className="relative overflow-hidden rounded-[18px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)]"
            style={{ width: 218, height: 388 }}
          >
            <iframe
              key={src}
              src={src}
              title="Pratinjau cover utama"
              className="absolute left-0 top-0 origin-top-left border-0"
              style={{ width: 412, height: 732, transform: "scale(0.529)" }}
            />
          </div>
          <div className="mx-auto mt-1 h-1 w-10 rounded-full bg-[var(--color-primary)]/35" />
        </div>
      </div>
    </div>
  );
}

export default function CoverStep({
  visible,
  coverSectionConfig,
  updateTemplateSectionConfig,
  coverLayoutOptions,
  coverDateVariantOptions,
  coverOpeningAnimationOptions,
  coverBackgroundModeOptions,
  updateCoverBackgroundImage,
  coverPreviewSrc,
}) {
  if (!visible) {
    return null;
  }

  return (
    <div id="template-cover" className="scroll-mt-24 md:col-span-2">
      <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-fog)]/45 p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--dash-muted)]">
          Cover Utama
        </p>
        <p className="mt-1 text-base font-semibold text-[var(--dash-ink)]">
          Atur cover utama, foto, background, animasi konten, dan style nama tamu.
        </p>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="mt-6">
              <ToggleField
                checked={Boolean(coverSectionConfig.photoEnabled)}
                label="Foto aktif"
                desc="Tampilkan foto pasangan pada cover."
                onChange={(checked) =>
                  updateTemplateSectionConfig("home", "photoEnabled", checked)
                }
              />
            </div>
            <Field label="Layout Cover">
              <SelectInput
                value={coverSectionConfig.layout}
                onChange={(event) => updateTemplateSectionConfig("home", "layout", event.target.value)}
              >
                {coverLayoutOptions.map((layout) => (
                  <option key={layout} value={layout}>
                    {optionLabel(layout)}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Bentuk Foto">
              <SelectInput
                value={coverSectionConfig.photoStyle || "arch"}
                onChange={(event) =>
                  updateTemplateSectionConfig("home", "photoStyle", event.target.value)
                }
              >
                {["arch", "circle", "square"].map((style) => (
                  <option key={style} value={style}>
                    {optionLabel(style)}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Gaya Tanggal">
              <SelectInput
                value={coverSectionConfig.dateVariant || "separator-dot"}
                onChange={(event) =>
                  updateTemplateSectionConfig("home", "dateVariant", event.target.value)
                }
              >
                {coverDateVariantOptions.map((variant) => (
                  <option key={variant} value={variant}>
                    {optionLabel(variant)}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Animasi Masuk">
              <SelectInput
                value={coverSectionConfig.openingAnimation}
                onChange={(event) =>
                  updateTemplateSectionConfig("home", "openingAnimation", event.target.value)
                }
              >
                {coverOpeningAnimationOptions.map((animation) => (
                  <option key={animation} value={animation}>
                    {optionLabel(animation)}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Background Cover">
              <SelectInput
                value={coverSectionConfig.backgroundMode || "color"}
                onChange={(event) =>
                  updateTemplateSectionConfig("home", "backgroundMode", event.target.value)
                }
              >
                {coverBackgroundModeOptions.map((mode) => (
                  <option key={mode} value={mode}>
                    {optionLabel(mode)}
                  </option>
                ))}
              </SelectInput>
            </Field>
            {coverSectionConfig.backgroundMode === "image" ? (
              <div className="rounded-xl border border-[var(--dash-border)] bg-white px-3 py-2 text-sm font-semibold leading-5 text-[var(--dash-muted)]">
                Background gambar memakai default dari Pengaturan. Upload foto asli dilakukan di order/media undangan.
              </div>
            ) : (
              <Field label="Warna Background">
                <input
                  type="color"
                  value={coverSectionConfig.backgroundColor || "#fbf7ef"}
                  onChange={(event) =>
                    updateTemplateSectionConfig("home", "backgroundColor", event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-[var(--dash-border)] bg-white p-1 outline-none focus:border-[var(--color-accent)]"
                />
              </Field>
            )}
          </div>
          <CoverLivePreview src={coverPreviewSrc} />
        </div>
      </div>
    </div>
  );
}
