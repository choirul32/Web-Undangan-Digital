import React from "react";

const openingAssetTypeOptions = ["motion", "lottie", "video", "image-sequence"];

function MiniInput({ label, type = "text", step, value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
        {label}
      </span>
      <input
        type={type}
        step={step}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
      />
    </label>
  );
}

export default function OpeningStep({
  visible,
  openingRevealWidgetConfig,
  openingSequenceWidgetConfig,
  openingRevealAnimationOptions,
  openingSequencePresetOptions,
  openingRevealBackgroundModeOptions,
  updateOpeningRevealWidget,
  updateOpeningSequenceWidget,
  updateOpeningRevealImage,
  updateOpeningSequenceAsset,
  updateOpeningSequenceAssetFile,
  openingSectionPreviewSrc,
  onReplayPreview,
}) {
  if (!visible) {
    return null;
  }

  return (
    <div id="template-opening-reveal" className="scroll-mt-24 md:col-span-2">
      <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
              Opening Reveal
            </p>
            <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
              Overlay pembuka sebelum undangan tampil, berisi judul cover, nama tamu, dan tombol buka.
            </p>
          </div>
          <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-3">
            <input
              type="checkbox"
              checked={Boolean(openingRevealWidgetConfig.enabled)}
              onChange={(event) => updateOpeningRevealWidget("enabled", event.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm font-black text-[var(--color-primary)]">Reveal aktif</span>
          </label>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                Opening Animation
              </span>
              <select
                value={openingRevealWidgetConfig.animation}
                onChange={(event) => updateOpeningRevealWidget("animation", event.target.value)}
                className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
              >
                {openingRevealAnimationOptions.map((animation) => (
                  <option key={animation} value={animation}>
                    {animation}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                Sequence Preset
              </span>
              <select
                value={openingSequenceWidgetConfig.preset || "auto"}
                onChange={(event) => updateOpeningSequenceWidget("preset", event.target.value)}
                className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
              >
                {openingSequencePresetOptions.map((preset) => (
                  <option key={preset} value={preset}>
                    {preset}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs font-semibold leading-5 text-[var(--color-text)]/70">
                Preset ini mengatur timing dan feel kartu opening. Animasi tetap mengatur gaya panel
                seperti curtain/gate.
              </p>
            </label>
            <MiniInput
              label="Button Text"
              value={openingRevealWidgetConfig.buttonText}
              onChange={(value) => updateOpeningRevealWidget("buttonText", value)}
            />
            <label className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
              <input
                type="checkbox"
                checked={openingRevealWidgetConfig.coverImageEnabled !== false}
                onChange={(event) => updateOpeningRevealWidget("coverImageEnabled", event.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm font-black text-[var(--color-primary)]">Cover image aktif</span>
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                Background
              </span>
              <select
                value={openingRevealWidgetConfig.backgroundMode}
                onChange={(event) => updateOpeningRevealWidget("backgroundMode", event.target.value)}
                className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
              >
                {openingRevealBackgroundModeOptions.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </label>
            {openingRevealWidgetConfig.backgroundMode === "image" ? (
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                  Background Image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => updateOpeningRevealImage("backgroundImage", event.target.files?.[0])}
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
                  value={openingRevealWidgetConfig.backgroundColor || "#fbf7ef"}
                  onChange={(event) => updateOpeningRevealWidget("backgroundColor", event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white p-1 outline-none focus:border-[var(--color-accent)]"
                />
              </label>
            )}
            <label className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
              <input
                type="checkbox"
                checked={Boolean(openingRevealWidgetConfig.autoPlayMusic)}
                onChange={(event) => updateOpeningRevealWidget("autoPlayMusic", event.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm font-black text-[var(--color-primary)]">Auto play musik</span>
            </label>
            <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-4 md:col-span-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">
                    Opening Asset
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-[var(--color-text)]">
                    Asset cinematic khusus opening. Default `motion` tetap ringan; video/Lottie wajib punya
                    fallback.
                  </p>
                </div>
                <span className="rounded-full bg-[var(--color-accent-pale)] px-3 py-1 text-xs font-black text-[var(--color-primary)]">
                  {openingSequenceWidgetConfig.asset?.type || "motion"}
                </span>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                    Asset Type
                  </span>
                  <select
                    value={openingSequenceWidgetConfig.asset?.type || "motion"}
                    onChange={(event) => updateOpeningSequenceAsset("type", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                  >
                    {openingAssetTypeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>
                <MiniInput
                  label="Duration"
                  type="number"
                  step="0.5"
                  value={openingSequenceWidgetConfig.asset?.duration ?? 4}
                  onChange={(value) => updateOpeningSequenceAsset("duration", Number(value))}
                />
                <MiniInput
                  label="Delay"
                  type="number"
                  step="0.1"
                  value={openingSequenceWidgetConfig.asset?.delay ?? 0}
                  onChange={(value) => updateOpeningSequenceAsset("delay", Number(value))}
                />
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                    Asset File
                  </span>
                  <input
                    type="file"
                    accept="video/*,image/*,.json,application/json"
                    onChange={(event) => updateOpeningSequenceAssetFile("src", event.target.files?.[0])}
                    className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--color-primary)] file:px-3 file:py-2 file:text-sm file:font-black file:text-white focus:border-[var(--color-accent)]"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                    Poster Fallback
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => updateOpeningSequenceAssetFile("poster", event.target.files?.[0])}
                    className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--color-primary)] file:px-3 file:py-2 file:text-sm file:font-black file:text-white focus:border-[var(--color-accent)]"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                    Fallback Preset
                  </span>
                  <select
                    value={openingSequenceWidgetConfig.asset?.fallbackPreset || "auto"}
                    onChange={(event) => updateOpeningSequenceAsset("fallbackPreset", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                  >
                    {openingSequencePresetOptions.map((preset) => (
                      <option key={preset} value={preset}>
                        {preset}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-[var(--color-bg)] px-3 py-2">
                  <input
                    type="checkbox"
                    checked={Boolean(openingSequenceWidgetConfig.asset?.loop)}
                    onChange={(event) => updateOpeningSequenceAsset("loop", event.target.checked)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-black text-[var(--color-primary)]">Loop asset</span>
                </label>
                <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-[var(--color-bg)] px-3 py-2">
                  <input
                    type="checkbox"
                    checked={openingSequenceWidgetConfig.asset?.skippable !== false}
                    onChange={(event) => updateOpeningSequenceAsset("skippable", event.target.checked)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-black text-[var(--color-primary)]">Skip button</span>
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                    Entrance Timing
                  </span>
                  <select
                    value={openingSequenceWidgetConfig.asset?.entranceTiming || "with-content"}
                    onChange={(event) => updateOpeningSequenceAsset("entranceTiming", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                  >
                    <option value="with-content">with-content</option>
                    <option value="before-content">before-content</option>
                    <option value="background-only">background-only</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
          <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
                Live Preview (Home)
              </p>
              <button
                type="button"
                onClick={onReplayPreview}
                className="rounded-md border border-[var(--color-accent-pale)] bg-white px-2.5 py-1 text-[11px] font-black text-[var(--color-primary)] hover:bg-[var(--color-bg)]"
              >
                Replay
              </button>
            </div>
            <div className="mx-auto w-full max-w-[260px]">
              <div className="relative rounded-[24px] border-[3px] border-[var(--color-primary)]/65 bg-[var(--color-primary)]/10 p-1.5 shadow-[0_10px_24px_rgba(15,23,42,0.16)]">
                <div className="absolute left-1/2 top-0 z-20 h-4 w-16 -translate-x-1/2 rounded-b-2xl bg-[var(--color-primary)]/70" />
                <div className="relative aspect-[9/16] overflow-hidden rounded-[18px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)]">
                  <iframe
                    src={openingSectionPreviewSrc}
                    title="Opening home preview"
                    className="h-full w-full border-0"
                  />
                </div>
                <div className="mx-auto mt-1 h-1 w-10 rounded-full bg-[var(--color-primary)]/35" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

