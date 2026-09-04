import { useEffect, useRef } from "react";
import {
  DashboardButton,
  Field,
  SelectInput,
  TextInput,
  ToggleField,
} from "../FormControls";
import { buildSnapshotMessage } from "../../../templates/previewProtocol";
import VisualChoiceControl from "./VisualChoiceControl";
import {
  previewPositionTop,
  previewPositionCenter,
  previewPositionBottom,
} from "./choicePreviews";

const openingAssetTypeOptions = ["motion", "lottie", "video", "image-sequence"];

const optionLabels = {
  fade: "Fade",
  curtain: "Tirai",
  gate: "Gerbang",
  paper: "Kartu kertas",
  motion: "Motion ringan",
  lottie: "Lottie",
  video: "Video",
  "image-sequence": "Rangkaian gambar",
  auto: "Otomatis",
  "cinematic-soft": "Sinematik lembut",
  simple: "Sederhana",
  "floral-bloom": "Bunga mekar",
  "falling-petals": "Kelopak jatuh",
  "royal-gate": "Royal",
  "paper-reveal": "Kertas lembut",
  "wayang-shadow": "Bayangan wayang",
  color: "Warna tema",
  cover: "Foto cover",
  image: "Upload gambar",
  "with-content": "Bersama konten",
  "before-content": "Sebelum konten",
  "background-only": "Background saja",
};

const speedOptions = [
  { id: "fast", label: "Cepat", duration: 2.5 },
  { id: "normal", label: "Normal", duration: 4 },
  { id: "slow", label: "Lambat", duration: 6 },
];

function optionLabel(value) {
  return optionLabels[value] || value;
}

function currentSpeed(duration = 4) {
  const rounded = Number(duration || 4);
  return speedOptions.find((option) => option.duration === rounded)?.id || "custom";
}

function Panel({ eyebrow, title, description, children }) {
  return (
    <section className="rounded-[14px] border border-[var(--dash-border)] bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--dash-muted)]">
        {eyebrow}
      </p>
      <h3 className="mt-1 text-lg font-semibold text-[var(--dash-ink)]">
        {title}
      </h3>
      {description ? (
        <p className="mt-1 text-sm font-medium leading-6 text-[var(--dash-muted)]">
          {description}
        </p>
      ) : null}
      <div className="mt-4 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function MiniInput({ label, type = "text", step, placeholder, value, onChange }) {
  if (type === "color") {
    const safeValue =
      typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value : "#ffffff";
    return (
      <Field label={label}>
        <input
          type="color"
          value={safeValue}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full rounded-xl border border-[var(--dash-border)] bg-white p-1 outline-none focus:border-[var(--color-accent)]"
        />
      </Field>
    );
  }

  return (
    <Field label={label}>
      <TextInput
        type={type}
        step={step}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  );
}

// Posisi vertikal + offset halus untuk satu elemen konten pembuka.
function PositionField({ label, position, offsetY, onPositionChange, onOffsetChange }) {
  return (
    <div className="rounded-xl border border-[var(--dash-border)] bg-white p-3">
      <p className="mb-2 text-sm font-bold text-[var(--dash-ink)]">{label}</p>
      <VisualChoiceControl
        value={position || ""}
        options={[
          { value: "", label: "Otomatis", preview: previewPositionCenter() },
          { value: "top", label: "Atas", preview: previewPositionTop() },
          { value: "center", label: "Tengah", preview: previewPositionCenter() },
          { value: "bottom", label: "Bawah", preview: previewPositionBottom() },
        ]}
        onChange={onPositionChange}
        columns={4}
        size="sm"
        ariaLabel={`Posisi ${label}`}
      />
      <div className="mt-2">
        <MiniInput
          label="Geser (px, minus = naik)"
          type="number"
          step="4"
          value={offsetY ?? 0}
          onChange={onOffsetChange}
        />
      </div>
    </div>
  );
}

function FileInput({ label, accept, onChange }) {
  return (
    <Field label={label}>
      <input
        type="file"
        accept={accept}
        onChange={(event) => onChange(event.target.files?.[0])}
        className="w-full rounded-xl border border-[var(--dash-border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--dash-ink)] outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--dash-ink)] file:px-3 file:py-2 file:text-sm file:font-bold file:text-white focus:border-[var(--color-accent)]"
      />
    </Field>
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
  previewSnapshot,
  onReplayPreview,
}) {
  const iframeRef = useRef(null);

  // Kirim snapshot config ke iframe preview via postMessage — update konten
  // tanpa reload. src iframe distabilkan (buang previewTick) supaya iframe
  // tidak remount tiap perubahan warna/font.
  useEffect(() => {
    if (!previewSnapshot || !iframeRef.current?.contentWindow) {
      return;
    }
    iframeRef.current.contentWindow.postMessage(
      buildSnapshotMessage(previewSnapshot),
      window.location.origin,
    );
  }, [previewSnapshot]);

  const stablePreviewSrc =
    typeof openingSectionPreviewSrc === "string"
      ? openingSectionPreviewSrc.split("?")[0] +
        "?" +
        new URLSearchParams(
          Array.from(
            new URLSearchParams(openingSectionPreviewSrc.split("?")[1] || "").entries(),
          ).filter(([key]) => key !== "previewTick"),
        ).toString()
      : openingSectionPreviewSrc;

  if (!visible) {
    return null;
  }

  const assetConfig = openingSequenceWidgetConfig.asset || {};
  const speedValue = currentSpeed(assetConfig.duration);

  const updateSpeed = (speedId) => {
    const selectedSpeed = speedOptions.find((option) => option.id === speedId);
    if (!selectedSpeed) return;
    updateOpeningSequenceAsset("duration", selectedSpeed.duration);
  };

  return (
    <div id="template-opening-reveal" className="scroll-mt-24 md:col-span-2">
      <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-fog)]/45 p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--dash-muted)]">
              Pembuka Undangan
            </p>
            <p className="mt-1 text-base font-semibold text-[var(--dash-ink)]">
              Atur layar pertama sebelum tamu masuk ke undangan.
            </p>
            <p className="mt-1 max-w-2xl text-sm font-medium leading-6 text-[var(--dash-muted)]">
              Gunakan pengaturan utama untuk kebutuhan harian. Detail aset video/Lottie tersedia di pengaturan lanjutan.
            </p>
          </div>
          <div className="min-w-[260px]">
            <ToggleField
              checked={Boolean(openingRevealWidgetConfig.enabled)}
              label="Tampilkan pembuka"
              desc="Jika aktif, tamu melihat halaman pembuka sebelum undangan."
              onChange={(checked) => updateOpeningRevealWidget("enabled", checked)}
            />
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-4">
            <Panel
              eyebrow="Mode"
              title="Gaya isi pembuka"
              description="Mengatur animasi konten di dalam pembuka: teks, nama pasangan, tombol, dan efek atmosfer."
            >
              <Field label="Gaya Isi">
                <SelectInput
                  value={openingSequenceWidgetConfig.preset || "auto"}
                  onChange={(event) => updateOpeningSequenceWidget("preset", event.target.value)}
                >
                  {openingSequencePresetOptions.map((preset) => (
                    <option key={preset} value={preset}>
                      {optionLabel(preset)}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <MiniInput
                label="Teks Tombol"
                value={openingRevealWidgetConfig.buttonText}
                onChange={(value) => updateOpeningRevealWidget("buttonText", value)}
              />
            </Panel>

            <Panel
              eyebrow="Tampilan"
              title="Visual pembuka"
              description="Pilih background layar dan apakah foto cover juga ditampilkan sebagai foto tengah."
            >
              <ToggleField
                checked={openingRevealWidgetConfig.coverImageEnabled !== false}
                label="Foto cover di tengah"
                desc="Aktifkan jika cover perlu tampil sebagai foto/kartu di tengah layar."
                onChange={(checked) => updateOpeningRevealWidget("coverImageEnabled", checked)}
              />
              <Field label="Visual Background">
                <SelectInput
                  value={openingRevealWidgetConfig.backgroundMode}
                  onChange={(event) => updateOpeningRevealWidget("backgroundMode", event.target.value)}
                >
                  {openingRevealBackgroundModeOptions.map((mode) => (
                    <option key={mode} value={mode}>
                      {optionLabel(mode)}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              {openingRevealWidgetConfig.backgroundMode === "image" ? (
                <div className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-fog)] px-3 py-2 text-sm font-semibold leading-5 text-[var(--dash-muted)]">
                  Background gambar memakai default dari Pengaturan. Upload foto asli dilakukan di order/media undangan.
                </div>
              ) : openingRevealWidgetConfig.backgroundMode === "cover" ? (
                <div className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-fog)] px-3 py-2 text-sm font-semibold leading-5 text-[var(--dash-muted)]">
                  Memakai foto cover undangan sebagai background layar.
                </div>
              ) : (
                <Field label="Warna Background">
                  <input
                    type="color"
                    value={openingRevealWidgetConfig.backgroundColor || "#fbf7ef"}
                    onChange={(event) => updateOpeningRevealWidget("backgroundColor", event.target.value)}
                    className="h-11 w-full rounded-xl border border-[var(--dash-border)] bg-white p-1 outline-none focus:border-[var(--color-accent)]"
                  />
                </Field>
              )}
            </Panel>

            <Panel
              eyebrow="Animasi & Musik"
              title="Efek layar pembuka"
              description="Mengatur bentuk layar pembuka seperti fade, tirai, gerbang, atau kartu kertas."
            >
              <Field label="Efek Layar">
                <SelectInput
                  value={openingRevealWidgetConfig.animation}
                  onChange={(event) => updateOpeningRevealWidget("animation", event.target.value)}
                >
                  {openingRevealAnimationOptions.map((animation) => (
                    <option key={animation} value={animation}>
                      {optionLabel(animation)}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Kecepatan">
                <SelectInput
                  value={speedValue}
                  onChange={(event) => updateSpeed(event.target.value)}
                >
                  {speedOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                  {speedValue === "custom" ? <option value="custom">Custom</option> : null}
                </SelectInput>
              </Field>
              <div className="md:col-span-2">
                <ToggleField
                  checked={Boolean(openingRevealWidgetConfig.autoPlayMusic)}
                  label="Putar musik otomatis"
                  desc="Musik diputar setelah tamu menekan tombol buka undangan."
                  onChange={(checked) => updateOpeningRevealWidget("autoPlayMusic", checked)}
                />
              </div>
            </Panel>

            <details className="rounded-[14px] border border-dashed border-[var(--dash-border)] bg-white">
              <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-[var(--dash-ink)]">
                Pengaturan lanjutan aset pembuka
              </summary>
              <div className="border-t border-[var(--dash-border)] p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--dash-muted)]">
                      Aset sinematik
                    </p>
                    <p className="mt-1 text-sm font-medium leading-6 text-[var(--dash-muted)]">
                      Pakai ini hanya jika pembuka butuh video, Lottie, atau rangkaian gambar khusus.
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--dash-fog)] px-3 py-1 text-xs font-black text-[var(--dash-ink)]">
                    {optionLabel(assetConfig.type || "motion")}
                  </span>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <Field label="Tipe Aset">
                    <SelectInput
                      value={assetConfig.type || "motion"}
                      onChange={(event) => updateOpeningSequenceAsset("type", event.target.value)}
                    >
                      {openingAssetTypeOptions.map((type) => (
                        <option key={type} value={type}>
                          {optionLabel(type)}
                        </option>
                      ))}
                    </SelectInput>
                  </Field>
                  <MiniInput
                    label="Durasi"
                    type="number"
                    step="0.5"
                    value={assetConfig.duration ?? 4}
                    onChange={(value) => updateOpeningSequenceAsset("duration", Number(value))}
                  />
                  <MiniInput
                    label="Delay"
                    type="number"
                    step="0.1"
                    value={assetConfig.delay ?? 0}
                    onChange={(value) => updateOpeningSequenceAsset("delay", Number(value))}
                  />
                  <FileInput
                    label="File Aset"
                    accept="video/*,image/*,.json,application/json"
                    onChange={(file) => updateOpeningSequenceAssetFile("src", file)}
                  />
                  <FileInput
                    label="Poster Cadangan"
                    accept="image/*"
                    onChange={(file) => updateOpeningSequenceAssetFile("poster", file)}
                  />
                  <Field label="Preset Cadangan">
                    <SelectInput
                      value={assetConfig.fallbackPreset || "auto"}
                      onChange={(event) => updateOpeningSequenceAsset("fallbackPreset", event.target.value)}
                    >
                      {openingSequencePresetOptions.map((preset) => (
                        <option key={preset} value={preset}>
                          {optionLabel(preset)}
                        </option>
                      ))}
                    </SelectInput>
                  </Field>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <ToggleField
                    checked={Boolean(assetConfig.loop)}
                    label="Ulangi aset"
                    desc="Cocok untuk animasi pendek."
                    onChange={(checked) => updateOpeningSequenceAsset("loop", checked)}
                  />
                  <ToggleField
                    checked={assetConfig.skippable !== false}
                    label="Tombol lewati"
                    desc="Tamu bisa langsung masuk jika animasi terasa lama."
                    onChange={(checked) => updateOpeningSequenceAsset("skippable", checked)}
                  />
                  <Field label="Timing Masuk">
                    <SelectInput
                      value={assetConfig.entranceTiming || "with-content"}
                      onChange={(event) => updateOpeningSequenceAsset("entranceTiming", event.target.value)}
                    >
                      <option value="with-content">{optionLabel("with-content")}</option>
                      <option value="before-content">{optionLabel("before-content")}</option>
                      <option value="background-only">{optionLabel("background-only")}</option>
                    </SelectInput>
                  </Field>
                </div>
              </div>
            </details>

            <Panel
              eyebrow="Ukuran & Posisi"
              title="Personalisasi layar pembuka"
              description="Atur ukuran font, lebar foto, dan posisi konten. Kosongkan ukuran untuk memakai default."
            >
              <MiniInput
                label="Ukuran Nama (px)"
                type="number"
                placeholder="22 (default mobile)"
                value={openingRevealWidgetConfig.titleFontSize ?? ""}
                onChange={(value) => updateOpeningRevealWidget("titleFontSize", value)}
              />
              <MiniInput
                label="Ukuran Nama Tamu (px)"
                type="number"
                placeholder="13 (default mobile)"
                value={openingRevealWidgetConfig.guestFontSize ?? ""}
                onChange={(value) => updateOpeningRevealWidget("guestFontSize", value)}
              />
              <MiniInput
                label="Ukuran Tombol (px)"
                type="number"
                placeholder="14 (default mobile)"
                value={openingRevealWidgetConfig.buttonFontSize ?? ""}
                onChange={(value) => updateOpeningRevealWidget("buttonFontSize", value)}
              />
              <MiniInput
                label="Lebar Foto Tengah (px)"
                type="number"
                placeholder="144 (default mobile)"
                value={openingRevealWidgetConfig.photoWidth ?? ""}
                onChange={(value) => updateOpeningRevealWidget("photoWidth", value)}
              />
              <Field label="Posisi Konten">
                <SelectInput
                  value={openingRevealWidgetConfig.contentPosition || "center"}
                  onChange={(event) =>
                    updateOpeningRevealWidget("contentPosition", event.target.value)
                  }
                >
                  <option value="center">Tengah</option>
                  <option value="top">Atas</option>
                  <option value="bottom">Bawah</option>
                  <option value="split">Nama Atas, Tamu Bawah</option>
                </SelectInput>
              </Field>
              <MiniInput
                label="Jarak Card Tamu (px)"
                type="number"
                step="4"
                placeholder="0 (default)"
                value={openingRevealWidgetConfig.guestOffsetY ?? 0}
                onChange={(value) => updateOpeningRevealWidget("guestOffsetY", Number(value))}
              />
              <MiniInput
                label="Warna Card Tamu"
                type="color"
                value={openingRevealWidgetConfig.guestCardBgColor || "#ffffff"}
                onChange={(value) => updateOpeningRevealWidget("guestCardBgColor", value)}
              />
              <MiniInput
                label="Warna Teks Tamu"
                type="color"
                value={openingRevealWidgetConfig.guestCardTextColor || "#1e293b"}
                onChange={(value) => updateOpeningRevealWidget("guestCardTextColor", value)}
              />
              <MiniInput
                label="Warna Tombol"
                type="color"
                value={openingRevealWidgetConfig.buttonBgColor || "#0f766e"}
                onChange={(value) => updateOpeningRevealWidget("buttonBgColor", value)}
              />
              <MiniInput
                label="Warna Teks Tombol"
                type="color"
                value={openingRevealWidgetConfig.buttonTextColor || "#ffffff"}
                onChange={(value) => updateOpeningRevealWidget("buttonTextColor", value)}
              />
              <MiniInput
                label="Geser Konten (px, minus = naik)"
                type="number"
                step="4"
                value={openingRevealWidgetConfig.contentOffsetY ?? 0}
                onChange={(value) => updateOpeningRevealWidget("contentOffsetY", Number(value))}
              />
            </Panel>

            <Panel
              eyebrow="Posisi & Jarak"
              title="Atur posisi tiap elemen"
              description="Pilih posisi vertikal untuk foto, nama, card tamu, dan tombol. 'Otomatis' mengikuti Posisi Konten di atas. Geser halus untuk koreksi presisi."
            >
              <div className="grid gap-3 md:grid-cols-2">
                <PositionField
                  label="Foto Tengah"
                  position={openingRevealWidgetConfig.photoPosition}
                  offsetY={openingRevealWidgetConfig.photoOffsetY}
                  onPositionChange={(value) => updateOpeningRevealWidget("photoPosition", value)}
                  onOffsetChange={(value) => updateOpeningRevealWidget("photoOffsetY", Number(value))}
                />
                <PositionField
                  label="Nama Mempelai"
                  position={openingRevealWidgetConfig.titlePosition}
                  offsetY={openingRevealWidgetConfig.titleOffsetY}
                  onPositionChange={(value) => updateOpeningRevealWidget("titlePosition", value)}
                  onOffsetChange={(value) => updateOpeningRevealWidget("titleOffsetY", Number(value))}
                />
                <PositionField
                  label="Card Tamu"
                  position={openingRevealWidgetConfig.guestPosition}
                  offsetY={openingRevealWidgetConfig.guestOffsetY}
                  onPositionChange={(value) => updateOpeningRevealWidget("guestPosition", value)}
                  onOffsetChange={(value) => updateOpeningRevealWidget("guestOffsetY", Number(value))}
                />
                <PositionField
                  label="Tombol Buka Undangan"
                  position={openingRevealWidgetConfig.buttonPosition}
                  offsetY={openingRevealWidgetConfig.buttonOffsetY}
                  onPositionChange={(value) => updateOpeningRevealWidget("buttonPosition", value)}
                  onOffsetChange={(value) => updateOpeningRevealWidget("buttonOffsetY", Number(value))}
                />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <MiniInput
                  label="Jarak Antar Elemen (px)"
                  type="number"
                  step="4"
                  placeholder="0 (pakai jarak bawaan)"
                  value={openingRevealWidgetConfig.elementGap ?? ""}
                  onChange={(value) => updateOpeningRevealWidget("elementGap", value ? Number(value) : "")}
                />
                <MiniInput
                  label="Lebar Maks Konten (px)"
                  type="number"
                  step="4"
                  placeholder="0 (pakai bawaan)"
                  value={openingRevealWidgetConfig.contentMaxWidth ?? ""}
                  onChange={(value) => updateOpeningRevealWidget("contentMaxWidth", value ? Number(value) : "")}
                />
                <MiniInput
                  label="Jarak dari Atas Layar (px)"
                  type="number"
                  step="4"
                  placeholder="0 (otomatis)"
                  value={openingRevealWidgetConfig.contentPaddingTop ?? ""}
                  onChange={(value) => updateOpeningRevealWidget("contentPaddingTop", value ? Number(value) : "")}
                />
                <MiniInput
                  label="Jarak dari Bawah Layar (px)"
                  type="number"
                  step="4"
                  placeholder="0 (otomatis)"
                  value={openingRevealWidgetConfig.contentPaddingBottom ?? ""}
                  onChange={(value) => updateOpeningRevealWidget("contentPaddingBottom", value ? Number(value) : "")}
                />
              </div>
            </Panel>
          </div>

          <div className="rounded-[14px] border border-[var(--dash-border)] bg-white p-3 lg:sticky lg:top-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--dash-muted)]">
                Pratinjau Pembuka
              </p>
              <DashboardButton
                type="button"
                onClick={onReplayPreview}
                variant="secondary"
                size="sm"
              >
                Putar ulang
              </DashboardButton>
            </div>
            <div className="mx-auto w-fit">
              <div className="relative rounded-[24px] border-[3px] border-[var(--color-primary)]/65 bg-[var(--color-primary)]/10 p-1.5 shadow-[0_10px_24px_rgba(15,23,42,0.16)]">
                <div className="absolute left-1/2 top-0 z-20 h-4 w-16 -translate-x-1/2 rounded-b-2xl bg-[var(--color-primary)]/70" />
                {/* Match the 412px phone viewport used by other section previews. */}
                <div
                  className="relative overflow-hidden rounded-[18px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)]"
                  style={{ width: 218, height: 388 }}
                >
                  <iframe
                    ref={iframeRef}
                    src={stablePreviewSrc}
                    title="Pratinjau pembuka home"
                    className="absolute left-0 top-0 origin-top-left border-0"
                    style={{ width: 412, height: 732, transform: "scale(0.529)" }}
                    onLoad={() => {
                      if (previewSnapshot && iframeRef.current?.contentWindow) {
                        iframeRef.current.contentWindow.postMessage(
                          buildSnapshotMessage(previewSnapshot),
                          window.location.origin,
                        );
                      }
                    }}
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
