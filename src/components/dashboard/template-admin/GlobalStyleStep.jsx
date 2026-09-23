import React from "react";
import ColorPalettePicker from "./ColorPalettePicker";
import FontPicker from "./FontPicker";
import { CoupleSectionPreview } from "../WidgetPreviews";
import {
  DashboardButton,
  DashboardCard,
  Field,
  SelectInput,
  TextInput,
  ToggleField,
} from "../FormControls";
import { prepareImageForUpload } from "../../../lib/imageUpload";
import VisualChoiceControl from "./VisualChoiceControl";
import SectionSettingsPanel from "./SectionSettingsPanel";
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
  templateId,
  palettes = [],
  onAiGeneratePalette,
  onDeletePalette,
  isAiGeneratingPalette = false,
  paletteGenerateError = "",
  parsedDesignConfig,
  applyColorPalette,
  globalSectionStyleConfig,
  updateGlobalSectionStyle,
  updateTemplateSectionConfig,
  patchSectionsOrder,
  headingFontOptions,
  bodyFontOptions,
  coupleSectionConfig,
  couplePhotoStyleOptions,
  coupleFontPresetOptions,
}) {
  if (!visible) {
    return null;
  }

  const uploadGlobalBackground = async (file) => {
    if (!file) return;
    const prepared = await prepareImageForUpload(file, "cover");

    // Upload ke Supabase Storage → dapat URL kecil (bukan data URL raksasa)
    const formData = new FormData();
    formData.append("templateId", templateId || "template-draft");
    formData.append("file", prepared.file);

    const response = await fetch("/api/templates/background", {
      method: "POST",
      body: formData,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.error || "Gagal upload background.");
    }

    updateGlobalSectionStyle("backgroundImage", result.data.url);
  };

  const uploadSectionBackground = async (section, file) => {
    if (!file) return;
    const prepared = await prepareImageForUpload(file, "cover");

    const formData = new FormData();
    formData.append("templateId", templateId || "template-draft");
    formData.append("file", prepared.file);

    const response = await fetch("/api/templates/background", {
      method: "POST",
      body: formData,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.error || "Gagal upload background.");
    }

    updateTemplateSectionConfig(section, "backgroundImage", result.data.url);
    updateTemplateSectionConfig(section, "backgroundMode", "image");
  };

  const updateCoupleCardImage = async (file) => {
    if (!file) return;
    const prepared = await prepareImageForUpload(file, "default");
    const previewUrl = await readFileAsDataUrl(prepared.file);
    updateTemplateSectionConfig("couple", "cardBackgroundImage", previewUrl);
  };

  const spacingOptions = [
    {
      value: "compact",
      label: spacingLabels.compact,
      description: spacingDescriptions.compact,
      preview: previewSpacingCompact(),
    },
    {
      value: "normal",
      label: spacingLabels.normal,
      description: spacingDescriptions.normal,
      preview: previewSpacingNormal(),
    },
    {
      value: "roomy",
      label: spacingLabels.roomy,
      description: spacingDescriptions.roomy,
      preview: previewSpacingRoomy(),
    },
  ];

  const cardStyleOptions = [
    {
      value: "rounded",
      label: cardStyleLabels.rounded,
      description: cardStyleDescriptions.rounded,
      preview: previewCornerRounded(),
    },
    {
      value: "sharp",
      label: cardStyleLabels.sharp,
      description: cardStyleDescriptions.sharp,
      preview: previewCornerSharp(),
    },
    {
      value: "pill",
      label: cardStyleLabels.pill,
      description: cardStyleDescriptions.pill,
      preview: previewCornerPill(),
    },
  ];

  const entranceOptions = [
    {
      value: "fade-up",
      label: animationLabels["fade-up"],
      preview: previewAnimFadeUp(),
    },
    {
      value: "zoom-in",
      label: animationLabels["zoom-in"],
      preview: previewAnimZoomIn(),
    },
    {
      value: "pop-up",
      label: animationLabels["pop-up"],
      preview: previewAnimPop(),
    },
    {
      value: "slide-left",
      label: animationLabels["slide-left"],
      preview: previewAnimSlideLeft(),
    },
    {
      value: "slide-right",
      label: animationLabels["slide-right"],
      preview: previewAnimSlideRight(),
    },
    {
      value: "fade",
      label: animationLabels.fade,
      preview: previewAnimFade(),
    },
    {
      value: "none",
      label: animationLabels.none,
      preview: previewAnimNone(),
    },
  ];

  return (
    <div className="scroll-mt-24 md:col-span-2">
      <div className="space-y-5">
      <div className="scroll-mt-24 md:col-span-2">
        <DashboardCard>
          <ColorPalettePicker
            palettes={palettes}
            activePaletteId={parsedDesignConfig?.palette || ""}
            onApplyPalette={applyColorPalette}
            onGeneratePalette={onAiGeneratePalette}
            onDeletePalette={onDeletePalette}
            isGenerating={isAiGeneratingPalette}
            generateError={paletteGenerateError}
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
                <VisualChoiceControl
                  value={globalSectionStyleConfig.spacingPreset || "normal"}
                  options={spacingOptions}
                  onChange={(value) => updateGlobalSectionStyle("spacingPreset", value)}
                  columns={3}
                  ariaLabel="Jarak antar section"
                />
              </Field>
              <Field label="Gaya Card">
                <VisualChoiceControl
                  value={globalSectionStyleConfig.cardStyle || "rounded"}
                  options={cardStyleOptions}
                  onChange={(value) => updateGlobalSectionStyle("cardStyle", value)}
                  columns={3}
                  ariaLabel="Gaya sudut card"
                />
              </Field>
              <Field label="Animasi Masuk">
                <VisualChoiceControl
                  value={globalSectionStyleConfig.entranceAnimation || "fade-up"}
                  options={entranceOptions}
                  onChange={(value) => updateGlobalSectionStyle("entranceAnimation", value)}
                  columns={3}
                  ariaLabel="Animasi munculnya section"
                />
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
              <Field label="Parallax Background">
                <SelectInput
                  value={globalSectionStyleConfig.backgroundParallax || "none"}
                  onChange={(event) =>
                    updateGlobalSectionStyle("backgroundParallax", event.target.value)
                  }
                >
                  <option value="none">Tanpa parallax</option>
                  <option value="slow">Parallax pelan</option>
                  <option value="medium">Parallax sedang</option>
                  <option value="fast">Parallax cepat</option>
                </SelectInput>
                <p className="mt-1.5 text-[10px] font-semibold text-[var(--color-text)]/60">
                  Efek foto background bergerak pelan saat scroll.
                </p>
              </Field>
              <Field label="Gelap Overlay Background">
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="5"
                    value={Number(globalSectionStyleConfig.backgroundOverlay) || 0}
                    onChange={(event) =>
                      updateGlobalSectionStyle("backgroundOverlay", Number(event.target.value))
                    }
                    className="w-full"
                  />
                  <span className="w-10 shrink-0 text-right text-sm font-black text-[var(--dash-ink)]">
                    {Number(globalSectionStyleConfig.backgroundOverlay) || 0}%
                  </span>
                </div>
                <p className="mt-1.5 text-[10px] font-semibold text-[var(--color-text)]/60">
                  Gelapkan foto background biar teks lebih terbaca.
                </p>
              </Field>
              <Field label="Radius Card (custom)">
                <TextInput
                  type="number"
                  min="0"
                  max="48"
                  value={globalSectionStyleConfig.cardRadius ?? ""}
                  onChange={(event) =>
                    updateGlobalSectionStyle(
                      "cardRadius",
                      event.target.value === "" ? "" : Number(event.target.value),
                    )
                  }
                  placeholder="Kosongkan → pakai Gaya Card"
                />
                <p className="mt-1.5 text-[10px] font-semibold text-[var(--color-text)]/60">
                  Radius sudut card dalam px. Isi untuk override "Gaya Card".
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
      <div id="template-global-background" className="scroll-mt-24 md:col-span-2">
        <DashboardCard>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--dash-muted)]">
            Background Global
          </p>
          <p className="mt-1 text-base font-semibold text-[var(--dash-ink)]">
            Satu gambar background menempel di seluruh halaman (parallax saat scroll). Section yang memakai gaya global dan tidak punya background sendiri akan transparan di atasnya.
          </p>
          <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_280px] lg:items-start">
            <div className="space-y-4">
              <Field label="Gambar Background Global">
                {globalSectionStyleConfig.backgroundImage ? (
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={globalSectionStyleConfig.backgroundImage}
                      alt="Pratinjau background global"
                      className="aspect-[4/5] w-24 rounded-lg border border-[var(--dash-border)] object-cover"
                    />
                    <div className="space-y-2">
                      <DashboardButton
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          input.onchange = async (event) => {
                            const file = event.target.files?.[0];
                            if (!file) return;
                            try {
                              await uploadGlobalBackground(file);
                            } catch (err) {
                              window.alert(err.message || "Gagal upload background.");
                            }
                          };
                          input.click();
                        }}
                      >
                        Ganti Gambar
                      </DashboardButton>
                      <DashboardButton
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => updateGlobalSectionStyle("backgroundImage", "")}
                      >
                        Hapus
                      </DashboardButton>
                    </div>
                  </div>
                ) : (
                  <label className="block cursor-pointer rounded-xl border-2 border-dashed border-[var(--dash-border)] bg-[var(--dash-fog)] p-5 text-center transition-colors hover:border-[var(--dash-ink)]">
                    <span className="text-sm font-bold text-[var(--dash-ink)]">
                      Klik untuk upload gambar background
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-[var(--dash-muted)]">
                      PNG/JPG/WebP. Rasio potret 4:5 atau lebih tinggi agar parallax tidak bolong.
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        try {
                          await uploadGlobalBackground(file);
                        } catch (err) {
                          window.alert(err.message || "Gagal upload background.");
                        }
                      }}
                    />
                  </label>
                )}
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Parallax Background">
                  <SelectInput
                    value={globalSectionStyleConfig.backgroundParallax || "none"}
                    onChange={(event) =>
                      updateGlobalSectionStyle("backgroundParallax", event.target.value)
                    }
                  >
                    <option value="none">Tanpa parallax</option>
                    <option value="slow">Parallax pelan</option>
                    <option value="medium">Parallax sedang</option>
                    <option value="fast">Parallax cepat</option>
                  </SelectInput>
                  <p className="mt-1.5 text-[10px] font-semibold text-[var(--color-text)]/60">
                    Background bergerak pelan saat scroll.
                  </p>
                </Field>
                <Field label="Gelap Overlay Background">
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="80"
                      step="5"
                      value={Number(globalSectionStyleConfig.backgroundOverlay) || 0}
                      onChange={(event) =>
                        updateGlobalSectionStyle("backgroundOverlay", Number(event.target.value))
                      }
                      className="w-full"
                    />
                    <span className="w-10 shrink-0 text-right text-sm font-black text-[var(--dash-ink)]">
                      {Number(globalSectionStyleConfig.backgroundOverlay) || 0}%
                    </span>
                  </div>
                  <p className="mt-1.5 text-[10px] font-semibold text-[var(--color-text)]/60">
                    Gelapkan biar teks section terbaca.
                  </p>
                </Field>
              </div>
            </div>
            <div className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-fog)]/50 p-4 text-xs font-semibold leading-5 text-[var(--dash-muted)]">
              <p className="font-black text-[var(--dash-ink)]">Cara kerja:</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Background ini menempel & parallax saat scroll.</li>
                <li>Section tanpa background sendiri jadi transparan — background terlihat menyambung.</li>
                <li>Section yang set warna/foto sendiri tetap tampil normal di atasnya.</li>
              </ul>
            </div>
          </div>

          {/* Pengaturan per section: latar, warna teks, jarak, card, animasi */}
          <div className="mt-5 border-t border-[var(--dash-border)] pt-4">
            <SectionSettingsPanel
              parsedDesignConfig={parsedDesignConfig}
              updateTemplateSectionConfig={updateTemplateSectionConfig}
              uploadSectionBackground={uploadSectionBackground}
              patchSectionsOrder={patchSectionsOrder}
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
      </div>
    </div>
  );
}
