import React from "react";
import ColorPalettePicker from "./ColorPalettePicker";
import FontPicker from "./FontPicker";
import { CoupleSectionPreview } from "../WidgetPreviews";
import {
  DashboardCard,
  Field,
  SelectInput,
  ToggleField,
} from "../FormControls";
import { prepareImageForUpload } from "../../../lib/imageUpload";

const spacingLabels = {
  compact: "Rapat",
  normal: "Normal",
  roomy: "Lega",
};

const spacingDescriptions = {
  compact: "Padding kecil, konten lebih rapat.",
  normal: "Padding standar, tampilan seimbang.",
  roomy: "Padding besar, terasa lega dan premium.",
};

const animationLabels = {
  "fade-up": "Muncul dari bawah",
  "zoom-in": "Membesar halus",
  "pop-up": "Pop up lembut",
  "slide-left": "Geser dari kanan",
  "slide-right": "Geser dari kiri",
  fade: "Fade sederhana",
  none: "Tanpa animasi",
};

const cardStyleLabels = {
  rounded: "Sudut membulat",
  sharp: "Tegas / kotak",
  pill: "Sangat bulat",
};

const contentSizeOptions = ["small", "normal", "large", "xlarge"];

const contentSizeLabels = {
  small: "Kecil",
  normal: "Normal",
  large: "Besar",
  xlarge: "Sangat besar",
};

const contentSizeDescriptions = {
  small: "Teks & konten lebih ringkas (92%).",
  normal: "Ukuran standar (100%).",
  large: "Teks & konten lebih besar (108%).",
  xlarge: "Paling besar, mudah dibaca (116%).",
};

const contentSizeZoom = {
  small: 0.92,
  normal: 1,
  large: 1.08,
  xlarge: 1.16,
};

const cardStyleDescriptions = {
  sharp: "Sudut tajam, cocok untuk tema formal.",
  pill: "Sudut sangat bulat, terasa lebih playful.",
  rounded: "Sudut rounded, modern dan aman untuk banyak tema.",
};

const photoStyleLabels = {
  arch: "Lengkung atas",
  circle: "Lingkaran",
  square: "Kotak rounded",
};

const coupleFontLabels = {
  serif: "Elegan serif",
  sans: "Modern sans",
  script: "Script romantis",
};

const coupleCardBackgroundLabels = {
  color: "Warna",
  image: "Gambar",
};

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getSelectedFont(fonts, selectedId) {
  return fonts.find((font) => font.id === selectedId);
}

function StylePreviewCard({
  config,
  headingFontOptions,
  bodyFontOptions,
}) {
  const headingFont = getSelectedFont(headingFontOptions, config.headingFont);
  const bodyFont = getSelectedFont(bodyFontOptions, config.bodyFont);
  const cardRadius =
    config.cardStyle === "sharp"
      ? "rounded-none"
      : config.cardStyle === "pill"
        ? "rounded-[28px]"
        : "rounded-2xl";
  const spacingClass =
    config.spacingPreset === "compact"
      ? "p-3"
      : config.spacingPreset === "roomy"
        ? "p-6"
        : "p-4";

  return (
    <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-fog)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--dash-muted)]">
        Preview Ringkas
      </p>
      <div
        className={`mt-3 border border-[var(--dash-border)] bg-white shadow-sm ${cardRadius} ${spacingClass}`}
        style={{ zoom: contentSizeZoom[config.contentSize] || 1 }}
      >
        <p
          className="text-2xl font-semibold text-[var(--color-primary)]"
          style={{ fontFamily: headingFont?.family }}
        >
          Wulan & Irul
        </p>
        <p
          className="mt-2 text-sm font-medium leading-6 text-[var(--dash-muted)]"
          style={{ fontFamily: bodyFont?.family }}
        >
          Dengan penuh rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir.
        </p>
        <button
          type="button"
          className="mt-4 rounded-full bg-[var(--dash-ink)] px-4 py-2 text-xs font-semibold text-white"
        >
          Buka Undangan
        </button>
      </div>
      <p className="mt-3 text-xs font-medium text-[var(--dash-muted)]">
        {spacingLabels[config.spacingPreset] || "Normal"} ·{" "}
        {cardStyleLabels[config.cardStyle] || "Sudut membulat"} ·{" "}
        {animationLabels[config.entranceAnimation] || config.entranceAnimation || "Muncul dari bawah"}
      </p>
    </div>
  );
}

export default function GlobalStyleStep({
  visible,
  colorPalettePresets,
  parsedDesignConfig,
  applyColorPalette,
  globalSectionStyleConfig,
  updateGlobalSectionStyle,
  updateTemplateSectionConfig,
  headingFontOptions,
  bodyFontOptions,
  sectionSpacingPresetOptions,
  sectionEntranceOptions,
  coupleSectionConfig,
  couplePhotoStyleOptions,
  coupleFontPresetOptions,
}) {
  if (!visible) {
    return null;
  }

  const updateCoupleCardImage = async (file) => {
    if (!file) return;
    const prepared = await prepareImageForUpload(file, "default");
    const previewUrl = await readFileAsDataUrl(prepared.file);
    updateTemplateSectionConfig("couple", "cardBackgroundImage", previewUrl);
  };

  return (
    <>
      <div className="scroll-mt-24 md:col-span-2">
        <DashboardCard>
          <ColorPalettePicker
            palettes={colorPalettePresets}
            activePaletteId={parsedDesignConfig?.palette || ""}
            onApplyPalette={applyColorPalette}
          />
        </DashboardCard>
      </div>
      <div className="scroll-mt-24 md:col-span-2">
        <DashboardCard>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--dash-muted)]">
            Font Undangan
          </p>
          <p className="mt-1 text-base font-semibold text-[var(--dash-ink)]">
            Pilih font heading (nama, judul) dan body (paragraf, deskripsi).
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Font Judul">
              <FontPicker
                value={globalSectionStyleConfig.headingFont || ""}
                options={headingFontOptions}
                onChange={(id) => updateGlobalSectionStyle("headingFont", id)}
                sampleText="Dimas & Salsa"
              />
            </Field>
            <Field label="Font Isi">
              <FontPicker
                value={globalSectionStyleConfig.bodyFont || ""}
                options={bodyFontOptions}
                onChange={(id) => updateGlobalSectionStyle("bodyFont", id)}
                sampleText="Dan di antara tanda-tanda kekuasaan-Nya"
              />
              {globalSectionStyleConfig.bodyFont ? (
                <p
                  className="mt-2 text-sm text-[var(--color-text)]"
                  style={{
                    fontFamily: bodyFontOptions.find((f) => f.id === globalSectionStyleConfig.bodyFont)
                      ?.family,
                  }}
                >
                  Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup.
                </p>
              ) : null}
            </Field>
          </div>
        </DashboardCard>
      </div>
      <div className="scroll-mt-24 md:col-span-2">
        <DashboardCard>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--dash-muted)]">
            Tampilan Section
          </p>
          <p className="mt-1 text-base font-semibold text-[var(--dash-ink)]">
            Atur spacing, animasi masuk, dan style card untuk seluruh undangan.
          </p>
          <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_320px]">
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Jarak Section">
                <SelectInput
                  value={globalSectionStyleConfig.spacingPreset || "normal"}
                  onChange={(event) => updateGlobalSectionStyle("spacingPreset", event.target.value)}
                >
                  {sectionSpacingPresetOptions.map((preset) => (
                    <option key={preset} value={preset}>
                      {spacingLabels[preset] || preset}
                    </option>
                  ))}
                </SelectInput>
                <p className="mt-1.5 text-[10px] font-semibold text-[var(--color-text)]/60">
                  {spacingDescriptions[globalSectionStyleConfig.spacingPreset] ||
                    spacingDescriptions.normal}
                </p>
              </Field>
              <Field label="Gaya Card">
                <SelectInput
                  value={globalSectionStyleConfig.cardStyle || "rounded"}
                  onChange={(event) => updateGlobalSectionStyle("cardStyle", event.target.value)}
                >
                  <option value="rounded">{cardStyleLabels.rounded}</option>
                  <option value="sharp">{cardStyleLabels.sharp}</option>
                  <option value="pill">{cardStyleLabels.pill}</option>
                </SelectInput>
                <p className="mt-1.5 text-[10px] font-semibold text-[var(--color-text)]/60">
                  {cardStyleDescriptions[globalSectionStyleConfig.cardStyle] ||
                    cardStyleDescriptions.rounded}
                </p>
              </Field>
              <Field label="Animasi Masuk">
                <SelectInput
                  value={globalSectionStyleConfig.entranceAnimation || "fade-up"}
                  onChange={(event) => updateGlobalSectionStyle("entranceAnimation", event.target.value)}
                >
                  {sectionEntranceOptions.map((anim) => (
                    <option key={anim} value={anim}>
                      {animationLabels[anim] || anim}
                    </option>
                  ))}
                </SelectInput>
                <p className="mt-1.5 text-[10px] font-semibold text-[var(--color-text)]/60">
                  Cara section muncul saat tamu scroll undangan.
                </p>
              </Field>
              <Field label="Ukuran Konten">
                <SelectInput
                  value={globalSectionStyleConfig.contentSize || "normal"}
                  onChange={(event) => updateGlobalSectionStyle("contentSize", event.target.value)}
                >
                  {contentSizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {contentSizeLabels[size] || size}
                    </option>
                  ))}
                </SelectInput>
                <p className="mt-1.5 text-[10px] font-semibold text-[var(--color-text)]/60">
                  {contentSizeDescriptions[globalSectionStyleConfig.contentSize] ||
                    contentSizeDescriptions.normal}
                </p>
              </Field>
            </div>
            <StylePreviewCard
              config={globalSectionStyleConfig}
              headingFontOptions={headingFontOptions}
              bodyFontOptions={bodyFontOptions}
            />
          </div>
        </DashboardCard>
      </div>
      <div id="template-couple" className="scroll-mt-24 md:col-span-2">
        <DashboardCard>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--dash-muted)]">
            Section Mempelai
          </p>
          <p className="mt-1 text-base font-semibold text-[var(--dash-ink)]">
            Atur foto mempelai, border foto, font, teks orang tua, dan tombol Instagram.
          </p>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
            <div className="grid gap-4 md:grid-cols-3">
              <ToggleField
                checked={Boolean(coupleSectionConfig.photoEnabled)}
                label="Tampilkan Foto"
                onChange={(checked) =>
                  updateTemplateSectionConfig("couple", "photoEnabled", checked)
                }
              />
              <ToggleField
                checked={Boolean(coupleSectionConfig.borderEnabled)}
                label="Border foto"
                onChange={(checked) =>
                  updateTemplateSectionConfig("couple", "borderEnabled", checked)
                }
              />
              <ToggleField
                checked={Boolean(coupleSectionConfig.parentTextEnabled)}
                label="Tampilkan Orang Tua"
                onChange={(checked) =>
                  updateTemplateSectionConfig("couple", "parentTextEnabled", checked)
                }
              />
              <ToggleField
                checked={Boolean(coupleSectionConfig.instagramEnabled)}
                label="Tampilkan Instagram"
                onChange={(checked) =>
                  updateTemplateSectionConfig("couple", "instagramEnabled", checked)
                }
              />
              <ToggleField
                checked={coupleSectionConfig.cardEnabled !== false}
                label="Card aktif"
                onChange={(checked) =>
                  updateTemplateSectionConfig("couple", "cardEnabled", checked)
                }
              />
              <Field label="Bentuk Foto">
                <SelectInput
                  value={coupleSectionConfig.photoStyle}
                  onChange={(event) =>
                    updateTemplateSectionConfig("couple", "photoStyle", event.target.value)
                  }
                >
                  {couplePhotoStyleOptions.map((style) => (
                    <option key={style} value={style}>
                      {photoStyleLabels[style] || style}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Gaya Font Nama">
                <SelectInput
                  value={coupleSectionConfig.fontPreset}
                  onChange={(event) =>
                    updateTemplateSectionConfig("couple", "fontPreset", event.target.value)
                  }
                >
                  {coupleFontPresetOptions.map((preset) => (
                    <option key={preset} value={preset}>
                      {coupleFontLabels[preset] || preset}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              {coupleSectionConfig.cardEnabled !== false ? (
                <>
                  <Field label="Background Card">
                    <SelectInput
                      value={coupleSectionConfig.cardBackgroundMode || "color"}
                      onChange={(event) =>
                        updateTemplateSectionConfig("couple", "cardBackgroundMode", event.target.value)
                      }
                    >
                      {Object.entries(coupleCardBackgroundLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </SelectInput>
                  </Field>
                  {coupleSectionConfig.cardBackgroundMode === "image" ? (
                    <Field label="Gambar Card">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => updateCoupleCardImage(event.target.files?.[0])}
                        className="w-full rounded-xl border border-[var(--dash-border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--dash-ink)] outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--dash-ink)] file:px-3 file:py-2 file:text-sm file:font-bold file:text-white"
                      />
                    </Field>
                  ) : (
                    <Field label="Warna Card">
                      <input
                        type="color"
                        value={coupleSectionConfig.cardBackgroundColor || "#ffffff"}
                        onChange={(event) =>
                          updateTemplateSectionConfig("couple", "cardBackgroundColor", event.target.value)
                        }
                        className="h-11 w-full rounded-xl border border-[var(--dash-border)] bg-white p-1 outline-none focus:border-[var(--color-accent)]"
                      />
                    </Field>
                  )}
                </>
              ) : null}
            </div>
            <CoupleSectionPreview config={coupleSectionConfig} />
          </div>
        </DashboardCard>
      </div>
    </>
  );
}
