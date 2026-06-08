"use client";

import { CoverSectionPreview } from "../WidgetPreviews";

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
  );
}
