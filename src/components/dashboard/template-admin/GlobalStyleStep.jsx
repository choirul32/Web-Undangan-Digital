import React from "react";
import ColorPalettePicker from "./ColorPalettePicker";
import { CoverSectionPreview, CoupleSectionPreview } from "../WidgetPreviews";

export default function GlobalStyleStep({
  visible,
  colorPalettePresets,
  parsedDesignConfig,
  applyColorPalette,
  globalSectionStyleConfig,
  updateGlobalSectionStyle,
  headingFontOptions,
  bodyFontOptions,
  sectionSpacingPresetOptions,
  sectionEntranceOptions,
  coverSectionConfig,
  updateTemplateSectionConfig,
  coverLayoutOptions,
  coverDateVariantOptions,
  coverOpeningAnimationOptions,
  coverBackgroundModeOptions,
  updateCoverBackgroundImage,
  coupleSectionConfig,
  couplePhotoStyleOptions,
  coupleFontPresetOptions,
}) {
  if (!visible) {
    return null;
  }

  return (
    <>
      <div className="scroll-mt-24 md:col-span-2">
        <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
          <ColorPalettePicker
            palettes={colorPalettePresets}
            activePaletteId={parsedDesignConfig?.palette || ""}
            onApplyPalette={applyColorPalette}
          />
        </div>
      </div>
      <div className="scroll-mt-24 md:col-span-2">
        <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
            Typography
          </p>
          <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
            Pilih font heading (nama, judul) dan body (paragraf, deskripsi).
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                Heading Font
              </span>
              <select
                value={globalSectionStyleConfig.headingFont || ""}
                onChange={(event) => updateGlobalSectionStyle("headingFont", event.target.value)}
                className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
              >
                <option value="">Default</option>
                {headingFontOptions.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.label} - {font.vibe}
                  </option>
                ))}
              </select>
              {globalSectionStyleConfig.headingFont ? (
                <p
                  className="mt-2 text-lg text-[var(--color-primary)]"
                  style={{
                    fontFamily: headingFontOptions.find(
                      (f) => f.id === globalSectionStyleConfig.headingFont,
                    )?.family,
                  }}
                >
                  Dimas & Salsa
                </p>
              ) : null}
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                Body Font
              </span>
              <select
                value={globalSectionStyleConfig.bodyFont || ""}
                onChange={(event) => updateGlobalSectionStyle("bodyFont", event.target.value)}
                className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
              >
                <option value="">Default</option>
                {bodyFontOptions.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.label} - {font.vibe}
                  </option>
                ))}
              </select>
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
            </label>
          </div>
        </div>
      </div>
      <div className="scroll-mt-24 md:col-span-2">
        <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
            Layout & Animation
          </p>
          <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
            Atur spacing, animasi masuk, dan style card untuk seluruh undangan.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                Spacing
              </span>
              <select
                value={globalSectionStyleConfig.spacingPreset || "normal"}
                onChange={(event) => updateGlobalSectionStyle("spacingPreset", event.target.value)}
                className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
              >
                {sectionSpacingPresetOptions.map((preset) => (
                  <option key={preset} value={preset}>
                    {preset}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-[10px] font-semibold text-[var(--color-text)]/60">
                {globalSectionStyleConfig.spacingPreset === "compact"
                  ? "Padding kecil, konten rapat"
                  : globalSectionStyleConfig.spacingPreset === "roomy"
                    ? "Padding besar, lega dan premium"
                    : "Padding standar, seimbang"}
              </p>
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                Entrance Animation
              </span>
              <select
                value={globalSectionStyleConfig.entranceAnimation || "fade-up"}
                onChange={(event) => updateGlobalSectionStyle("entranceAnimation", event.target.value)}
                className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
              >
                {sectionEntranceOptions.map((anim) => (
                  <option key={anim} value={anim}>
                    {anim}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-[10px] font-semibold text-[var(--color-text)]/60">
                Animasi saat section muncul di viewport
              </p>
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                Card Style
              </span>
              <select
                value={globalSectionStyleConfig.cardStyle || "rounded"}
                onChange={(event) => updateGlobalSectionStyle("cardStyle", event.target.value)}
                className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
              >
                <option value="rounded">Rounded</option>
                <option value="sharp">Sharp</option>
                <option value="pill">Pill</option>
              </select>
              <p className="mt-1.5 text-[10px] font-semibold text-[var(--color-text)]/60">
                {globalSectionStyleConfig.cardStyle === "sharp"
                  ? "Sudut tajam, formal"
                  : globalSectionStyleConfig.cardStyle === "pill"
                    ? "Sangat bulat, playful"
                    : "Sudut rounded, modern"}
              </p>
            </label>
          </div>
        </div>
      </div>
      <div id="template-cover" className="scroll-mt-24 md:col-span-2">
        <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
            Cover Section
          </p>
          <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
            Atur cover utama, foto, background, animasi konten, dan style nama tamu.
          </p>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
            <div className="grid gap-4 md:grid-cols-3">
              <label className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                <input
                  type="checkbox"
                  checked={Boolean(coverSectionConfig.photoEnabled)}
                  onChange={(event) =>
                    updateTemplateSectionConfig("home", "photoEnabled", event.target.checked)
                  }
                  className="h-4 w-4"
                />
                <span className="text-sm font-black text-[var(--color-primary)]">Foto aktif</span>
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                  Layout
                </span>
                <select
                  value={coverSectionConfig.layout}
                  onChange={(event) => updateTemplateSectionConfig("home", "layout", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                >
                  {coverLayoutOptions.map((layout) => (
                    <option key={layout} value={layout}>
                      {layout}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                  Date Style
                </span>
                <select
                  value={coverSectionConfig.dateVariant || "separator-dot"}
                  onChange={(event) =>
                    updateTemplateSectionConfig("home", "dateVariant", event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                >
                  {coverDateVariantOptions.map((variant) => (
                    <option key={variant} value={variant}>
                      {variant}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                  Opening Animation
                </span>
                <select
                  value={coverSectionConfig.openingAnimation}
                  onChange={(event) =>
                    updateTemplateSectionConfig("home", "openingAnimation", event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                >
                  {coverOpeningAnimationOptions.map((animation) => (
                    <option key={animation} value={animation}>
                      {animation}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                  Background
                </span>
                <select
                  value={coverSectionConfig.backgroundMode || "color"}
                  onChange={(event) =>
                    updateTemplateSectionConfig("home", "backgroundMode", event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                >
                  {coverBackgroundModeOptions.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </label>
              {coverSectionConfig.backgroundMode === "image" ? (
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                    Background Image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => updateCoverBackgroundImage(event.target.files?.[0])}
                    className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--color-primary)] file:px-3 file:py-2 file:text-sm file:font-black file:text-white focus:border-[var(--color-accent)]"
                  />
                </label>
              ) : (
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                    Background Color
                  </span>
                  <input
                    type="color"
                    value={coverSectionConfig.backgroundColor || "#fbf7ef"}
                    onChange={(event) =>
                      updateTemplateSectionConfig("home", "backgroundColor", event.target.value)
                    }
                    className="mt-2 h-11 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white p-1 outline-none focus:border-[var(--color-accent)]"
                  />
                </label>
              )}
            </div>
            <CoverSectionPreview config={coverSectionConfig} />
          </div>
        </div>
      </div>
      <div id="template-couple" className="scroll-mt-24 md:col-span-2">
        <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
            Couple Section
          </p>
          <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
            Atur foto mempelai, border foto, font, teks orang tua, dan tombol Instagram.
          </p>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                <input
                  type="checkbox"
                  checked={Boolean(coupleSectionConfig.photoEnabled)}
                  onChange={(event) =>
                    updateTemplateSectionConfig("couple", "photoEnabled", event.target.checked)
                  }
                  className="h-4 w-4"
                />
                <span className="text-sm font-black text-[var(--color-primary)]">Foto aktif</span>
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                <input
                  type="checkbox"
                  checked={Boolean(coupleSectionConfig.borderEnabled)}
                  onChange={(event) =>
                    updateTemplateSectionConfig("couple", "borderEnabled", event.target.checked)
                  }
                  className="h-4 w-4"
                />
                <span className="text-sm font-black text-[var(--color-primary)]">Border foto</span>
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                <input
                  type="checkbox"
                  checked={Boolean(coupleSectionConfig.parentTextEnabled)}
                  onChange={(event) =>
                    updateTemplateSectionConfig("couple", "parentTextEnabled", event.target.checked)
                  }
                  className="h-4 w-4"
                />
                <span className="text-sm font-black text-[var(--color-primary)]">Teks orang tua</span>
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                <input
                  type="checkbox"
                  checked={Boolean(coupleSectionConfig.instagramEnabled)}
                  onChange={(event) =>
                    updateTemplateSectionConfig("couple", "instagramEnabled", event.target.checked)
                  }
                  className="h-4 w-4"
                />
                <span className="text-sm font-black text-[var(--color-primary)]">Instagram</span>
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                  Photo Style
                </span>
                <select
                  value={coupleSectionConfig.photoStyle}
                  onChange={(event) =>
                    updateTemplateSectionConfig("couple", "photoStyle", event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                >
                  {couplePhotoStyleOptions.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                  Font Preset
                </span>
                <select
                  value={coupleSectionConfig.fontPreset}
                  onChange={(event) =>
                    updateTemplateSectionConfig("couple", "fontPreset", event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                >
                  {coupleFontPresetOptions.map((preset) => (
                    <option key={preset} value={preset}>
                      {preset}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <CoupleSectionPreview config={coupleSectionConfig} />
          </div>
        </div>
      </div>
    </>
  );
}

