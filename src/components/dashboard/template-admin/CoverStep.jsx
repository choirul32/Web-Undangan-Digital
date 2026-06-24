"use client";

import { CoverSectionPreview } from "../WidgetPreviews";
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
};

function optionLabel(value) {
  return optionLabels[value] || value;
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
              <Field label="Gambar Background">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => updateCoverBackgroundImage(event.target.files?.[0])}
                  className="w-full rounded-xl border border-[var(--dash-border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--dash-ink)] outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--dash-ink)] file:px-3 file:py-2 file:text-sm file:font-bold file:text-white"
                />
              </Field>
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
          <CoverSectionPreview config={coverSectionConfig} />
        </div>
      </div>
    </div>
  );
}
