import React, { useMemo, useState } from "react";
import {
  getOrnamentLayerPresetId,
  getParallaxSpeed,
  ornamentLayerPresets,
} from "../../../templates/ornamentModel";

function MiniInput({ label, value, onChange, type = "text", step }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold text-[var(--color-text)]/70">{label}</span>
      <input
        type={type}
        step={step}
        value={value ?? ""}
        onChange={(event) => {
          if (type === "number") {
            const raw = event.target.value;
            onChange(raw === "" ? 0 : Number(raw));
            return;
          }
          onChange(event.target.value);
        }}
        className="mt-1 h-8 w-full rounded-md border border-[var(--color-accent-pale)] bg-white px-2.5 text-xs font-semibold text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
      />
    </label>
  );
}

export default function OrnamentPropertiesPanel({
  selectedOrnament,
  updateOrnament,
  reorderSelectedOrnament,
  updateSelectedOrnamentFile,
  dynamicOrnamentAssets,
  applyOrnamentAsset,
  ornamentEntranceOptions,
  ornamentLoopModeOptions,
  ornamentExitAnimationOptions,
  ornamentParallaxDirectionOptions,
}) {
  const [showAllAssets, setShowAllAssets] = useState(false);
  const parallaxNumeric = useMemo(() => {
    if (!selectedOrnament) return 0;
    return getParallaxSpeed(selectedOrnament.parallax || 0);
  }, [selectedOrnament]);

  if (!selectedOrnament) {
    return (
      <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-4 text-center xl:sticky xl:top-4">
        <p className="text-sm font-black text-[var(--color-primary)]">Pilih atau tambah ornament dulu.</p>
      </div>
    );
  }

  const displayedAssets = showAllAssets
    ? dynamicOrnamentAssets
    : dynamicOrnamentAssets.slice(0, 6);
  const activeLayerPreset = getOrnamentLayerPresetId(selectedOrnament.zIndex ?? 0);
  const activeLayer = ornamentLayerPresets.find((preset) => preset.id === activeLayerPreset);

  return (
    <div className="rounded-[10px] border border-[var(--color-accent-pale)] bg-white p-3 xl:sticky xl:top-4 xl:max-h-[calc(100vh-6.5rem)] xl:overflow-y-auto">
      <div className="sticky -top-3 z-10 -mx-3 -mt-3 mb-3 border-b border-[var(--color-accent-pale)] bg-white px-3 py-2.5">
        <p className="text-xs font-black text-[var(--color-text)]">Properti Ornamen</p>
      </div>

      <div className="grid gap-2 md:grid-cols-[1fr_112px]">
        <label className="block">
          <span className="text-[11px] font-bold text-[var(--color-text)]/70">ID Ornamen</span>
          <input
            value={selectedOrnament.id || ""}
            onChange={(e) => updateOrnament("id", e.target.value)}
            className="mt-1 h-8 w-full rounded-md border border-[var(--color-accent-pale)] bg-white px-2.5 text-xs font-semibold text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
          />
        </label>
        <div>
          <span className="text-[11px] font-bold text-[var(--color-text)]/70">Slot Posisi</span>
          <div className="mt-1 grid grid-cols-3 gap-1 rounded-md border border-[var(--color-accent-pale)] p-1">
            {["top-left", "center-top", "top-right", "side-left", "center", "side-right", "bottom-left", "center-bottom", "bottom-right"].map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => updateOrnament("slot", slot)}
                className={`h-5 rounded text-[9px] font-bold ${
                  selectedOrnament.slot === slot
                    ? "bg-[var(--color-accent)] text-white"
                    : "bg-[var(--color-bg)] text-[var(--color-text)]/70"
                }`}
              >
                {slot === "center"
                  ? "C"
                  : slot
                      .split("-")
                      .map((p) => p[0]?.toUpperCase())
                      .join("")}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <MiniInput
          label="Lebar (W)"
          type="number"
          value={parseInt(selectedOrnament.width, 10) || 0}
          onChange={(v) => updateOrnament("width", `${v || 0}px`)}
        />
        <MiniInput
          label="Tinggi (H)"
          type="number"
          value={parseInt(selectedOrnament.height, 10) || 0}
          onChange={(v) => updateOrnament("height", `${v || 0}px`)}
        />
        <MiniInput
          label="Posisi X"
          type="number"
          value={selectedOrnament.x || 0}
          onChange={(v) => updateOrnament("x", v)}
        />
        <MiniInput
          label="Posisi Y"
          type="number"
          value={selectedOrnament.y || 0}
          onChange={(v) => updateOrnament("y", v)}
        />
        <MiniInput
          label="Rotate (°)"
          type="number"
          value={selectedOrnament.rotate || 0}
          onChange={(v) => updateOrnament("rotate", v)}
        />
      </div>

      <div className="mt-3 rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)]/55 p-2.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
              Layer Tampilan
            </p>
            <p className="mt-1 text-[11px] font-semibold leading-4 text-[var(--color-text)]/65">
              {activeLayer?.description}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[10px] font-black text-[var(--color-text)]/70">
            {activeLayer?.label}
          </span>
        </div>
        <div className="mt-2 grid gap-1.5">
          {ornamentLayerPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => updateOrnament("zIndex", preset.zIndex)}
              className={`flex items-center justify-between gap-2 rounded-md border px-2.5 py-2 text-left transition-colors ${
                activeLayerPreset === preset.id
                  ? "border-[var(--color-accent)] bg-white text-[var(--color-primary)]"
                  : "border-transparent bg-white/55 text-[var(--color-text)] hover:bg-white"
              }`}
            >
              <span className="min-w-0">
                <span className="block text-xs font-black">{preset.label}</span>
                <span className="mt-0.5 block text-[10px] font-semibold leading-4 text-[var(--color-text)]/58">
                  {preset.description}
                </span>
              </span>
              <span className={`h-3 w-3 shrink-0 rounded-full border ${
                activeLayerPreset === preset.id
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                  : "border-[var(--color-accent-pale)] bg-white"
              }`} />
            </button>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {[
            ["back", "Ke belakang"],
            ["down", "Mundur"],
            ["up", "Maju"],
            ["front", "Ke depan"],
          ].map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              onClick={() => reorderSelectedOrnament?.(mode)}
              className="min-h-8 rounded-md border border-[var(--color-accent-pale)] bg-white px-2 text-[10px] font-black text-[var(--color-text)] hover:bg-[var(--color-bg)]"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2.5">
        <span className="text-[11px] font-bold text-[var(--color-text)]/70">Opacity (%)</span>
        <div className="mt-1 flex items-center gap-2">
          <span className="w-7 text-xs font-bold text-[var(--color-text)]">
            {Math.round((selectedOrnament.opacity ?? 1) * 100)}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round((selectedOrnament.opacity ?? 1) * 100)}
            onChange={(e) => updateOrnament("opacity", Number(e.target.value) / 100)}
            className="h-1.5 w-full accent-[var(--color-accent)]"
          />
        </div>
      </div>

      <div className="mt-3 border-t border-[var(--color-accent-pale)] pt-3">
        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[var(--color-text)]">Animasi</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <label>
            <span className="text-[11px] font-bold text-[var(--color-text)]/70">Entrance</span>
            <select
              value={selectedOrnament.entrance || "none"}
              onChange={(e) => updateOrnament("entrance", e.target.value)}
              className="mt-1 h-8 w-full rounded-md border border-[var(--color-accent-pale)] bg-white px-2 text-xs font-semibold text-[var(--color-text)]"
            >
              {ornamentEntranceOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-[11px] font-bold text-[var(--color-text)]/70">Loop Mode</span>
            <select
              value={selectedOrnament.loopMode || "infinite"}
              onChange={(e) => updateOrnament("loopMode", e.target.value)}
              className="mt-1 h-8 w-full rounded-md border border-[var(--color-accent-pale)] bg-white px-2 text-xs font-semibold text-[var(--color-text)]"
            >
              {ornamentLoopModeOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-[11px] font-bold text-[var(--color-text)]/70">Exit Animation</span>
            <select
              value={selectedOrnament.exitAnimation || "fade-out"}
              onChange={(e) => updateOrnament("exitAnimation", e.target.value)}
              className="mt-1 h-8 w-full rounded-md border border-[var(--color-accent-pale)] bg-white px-2 text-xs font-semibold text-[var(--color-text)]"
            >
              {ornamentExitAnimationOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <MiniInput
            label="Durasi (s)"
            type="number"
            step="0.1"
            value={selectedOrnament.entranceDuration ?? 0.8}
            onChange={(v) => updateOrnament("entranceDuration", Math.max(0.1, Number(v || 0.1)))}
          />
          <MiniInput
            label="Delay (s)"
            type="number"
            step="0.1"
            value={selectedOrnament.entranceDelay ?? 0}
            onChange={(v) => updateOrnament("entranceDelay", Math.max(0, Number(v || 0)))}
          />
          <label>
            <span className="text-[11px] font-bold text-[var(--color-text)]/70">Easing</span>
            <select
              value={selectedOrnament.easing || "ease-out"}
              onChange={(e) => updateOrnament("easing", e.target.value)}
              className="mt-1 h-8 w-full rounded-md border border-[var(--color-accent-pale)] bg-white px-2 text-xs font-semibold text-[var(--color-text)]"
            >
              <option value="linear">Linear</option>
              <option value="ease-in-out">Ease In Out</option>
              <option value="ease-out">Ease Out</option>
              <option value="cubic-bezier(.2,.8,.2,1)">Ease Out Cubic</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-3 border-t border-[var(--color-accent-pale)] pt-3">
        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[var(--color-text)]">Efek</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <label className="flex h-8 items-center justify-between rounded-md border border-[var(--color-accent-pale)] px-2.5 text-xs font-semibold text-[var(--color-text)]">
            Flip
            <input
              type="checkbox"
              checked={Boolean(selectedOrnament.flip)}
              onChange={(e) => updateOrnament("flip", e.target.checked)}
            />
          </label>
          <label className="flex h-8 items-center justify-between rounded-md border border-[var(--color-accent-pale)] px-2.5 text-xs font-semibold text-[var(--color-text)]">
            Mirror
            <input
              type="checkbox"
              checked={Boolean(selectedOrnament.mirrorDuplicate)}
              onChange={(e) => updateOrnament("mirrorDuplicate", e.target.checked)}
            />
          </label>
          <MiniInput
            label="Parallax Speed"
            type="number"
            step="0.01"
            value={parallaxNumeric}
            onChange={(v) => updateOrnament("parallax", Math.max(0, Number(v || 0)))}
          />
          <label>
            <span className="text-[11px] font-bold text-[var(--color-text)]/70">Arah</span>
            <select
              value={selectedOrnament.parallaxDirection || "vertical"}
              onChange={(e) => updateOrnament("parallaxDirection", e.target.value)}
              className="mt-1 h-8 w-full rounded-md border border-[var(--color-accent-pale)] bg-white px-2 text-xs font-semibold text-[var(--color-text)]"
            >
              {ornamentParallaxDirectionOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-3 border-t border-[var(--color-accent-pale)] pt-3">
        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[var(--color-text)]">Aset Ornamen</p>
        <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
          <label className="flex min-h-[76px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-[var(--color-accent-pale)] bg-[var(--color-bg)] px-2 py-2 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={(event) => updateSelectedOrnamentFile(event.target.files?.[0])}
              className="hidden"
            />
            <span className="text-[11px] font-bold text-[var(--color-text)]">Drag & drop file di sini</span>
            <span className="mt-1 text-[10px] font-medium text-[var(--color-text)]/65">
              atau klik untuk upload PNG, WEBP, SVG
            </span>
          </label>
          <button
            type="button"
            onClick={() => setShowAllAssets((current) => !current)}
            className="flex min-h-[76px] w-14 flex-col items-center justify-center rounded-md border border-[var(--color-accent-pale)] bg-white text-[var(--color-text)] hover:bg-[var(--color-bg)]"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="5.5" height="5.5" rx="1" />
              <rect x="11.5" y="3" width="5.5" height="5.5" rx="1" />
              <rect x="3" y="11.5" width="5.5" height="5.5" rx="1" />
              <rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1" />
            </svg>
            <span className="mt-1 text-[11px] font-bold">{showAllAssets ? "Tutup" : "Lihat"}</span>
            <span className="text-[11px] font-bold">{showAllAssets ? "Ringkas" : "Semua"}</span>
          </button>
        </div>
        {dynamicOrnamentAssets.length > 0 ? (
          <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-1">
            {displayedAssets.map((asset) => (
              <button
                key={asset.storagePath || asset.id}
                type="button"
                onClick={() => applyOrnamentAsset(asset)}
                className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-[var(--color-accent-pale)] bg-white"
                title={asset.templateId ? `${asset.name} • ${asset.templateId}` : asset.name}
              >
                <img src={asset.src} alt="" className="h-full w-full object-cover" />
                {asset.templateId ? (
                  <span className="absolute bottom-1 left-1 max-w-[3.3rem] truncate rounded bg-black/60 px-1.5 py-0.5 text-[8px] font-black uppercase text-white">
                    {asset.isCurrentTemplate ? "Aktif" : asset.templateId}
                  </span>
                ) : null}
                <span className="absolute right-1 top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-black/55 text-[10px] font-black text-white opacity-0 transition-opacity group-hover:opacity-100">
                  ×
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

