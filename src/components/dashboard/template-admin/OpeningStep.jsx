import {
  DashboardButton,
  Field,
  SelectInput,
  TextInput,
  ToggleField,
} from "../FormControls";

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

function MiniInput({ label, type = "text", step, value, onChange }) {
  return (
    <Field label={label}>
      <TextInput
        type={type}
        step={step}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
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
  onReplayPreview,
}) {
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
                    key={openingSectionPreviewSrc}
                    src={openingSectionPreviewSrc}
                    title="Pratinjau pembuka home"
                    className="absolute left-0 top-0 origin-top-left border-0"
                    style={{ width: 412, height: 732, transform: "scale(0.529)" }}
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
