"use client";

import {
  CountdownWidgetPreview,
  StoryWidgetPreview,
  GalleryWidgetPreview,
  EventWidgetPreview,
  MusicPlayerPreview,
  GiftWidgetPreview,
  RSVPWidgetPreview,
} from "../WidgetPreviews";
import {
  Field,
  SelectInput,
  TextInput,
  ToggleField,
} from "../FormControls";

const optionLabels = {
  cards: "Kartu",
  minimal: "Minimal",
  stacked: "Bertumpuk",
  timeline: "Timeline",
  grid: "Grid",
  carousel: "Carousel",
  masonry: "Masonry",
  slider: "Slider",
  floating: "Melayang",
  compact: "Ringkas",
  form: "Formulir",
  card: "Kartu",
  circle: "Lingkaran",
  "flip-clock": "Flip clock",
  ring: "Cincin",
  "neon-glow": "Cahaya neon",
  bar: "Bar bawah",
  "bottom-right": "Kanan bawah",
  "bottom-left": "Kiri bawah",
  "top-right": "Kanan atas",
  "top-left": "Kiri atas",
  subtle: "Halus",
  medium: "Sedang",
  strong: "Kuat",
  "fade-up": "Muncul dari bawah",
  "slide-left": "Geser ke kiri",
  "slide-right": "Geser ke kanan",
  "zoom-in": "Membesar halus",
  "pop-up": "Pop up lembut",
  "photo-album": "Album foto",
  "chapter-scroll": "Bab cerita",
  "chat-style": "Gaya chat",
  color: "Warna",
  image: "Gambar",
};

function optionLabel(value) {
  return optionLabels[value] || value;
}

function MiniInput({ label, value, onChange, type = "text" }) {
  const handleChange = (event) => {
    onChange(type === "number" ? Number(event.target.value) : event.target.value);
  };

  return (
    <Field label={label}>
      <TextInput
        type={type}
        value={value ?? ""}
        onChange={handleChange}
      />
    </Field>
  );
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function CardVisualControls({ config, onChange, labelPrefix = "Card" }) {
  const updateCardImage = async (file) => {
    if (!file) return;
    const previewUrl = await readFileAsDataUrl(file);
    onChange("cardBackgroundImage", previewUrl);
  };

  return (
    <>
      <BooleanToggle
        label={`${labelPrefix} aktif`}
        checked={config.cardEnabled !== false}
        onChange={(checked) => onChange("cardEnabled", checked)}
      />
      {config.cardEnabled !== false ? (
        <>
          <Field label={`Background ${labelPrefix}`}>
            <SelectInput
              value={config.cardBackgroundMode || "color"}
              onChange={(event) => onChange("cardBackgroundMode", event.target.value)}
            >
              <option value="color">{optionLabel("color")}</option>
              <option value="image">{optionLabel("image")}</option>
            </SelectInput>
          </Field>
          {config.cardBackgroundMode === "image" ? (
            <Field label={`Gambar ${labelPrefix}`}>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => updateCardImage(event.target.files?.[0])}
                className="w-full rounded-xl border border-[var(--dash-border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--dash-ink)] outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--dash-ink)] file:px-3 file:py-2 file:text-sm file:font-bold file:text-white"
              />
            </Field>
          ) : (
            <Field label={`Warna ${labelPrefix}`}>
              <input
                type="color"
                value={config.cardBackgroundColor || "#ffffff"}
                onChange={(event) => onChange("cardBackgroundColor", event.target.value)}
                className="h-11 w-full rounded-xl border border-[var(--dash-border)] bg-white p-1 outline-none focus:border-[var(--color-accent)]"
              />
            </Field>
          )}
        </>
      ) : null}
    </>
  );
}

function WidgetPanel({ eyebrow, title, enabled, enabledLabel, enabledDesc, onEnabledChange, children }) {
  return (
    <div className="md:col-span-2">
      <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-fog)]/45 p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--dash-muted)]">
              {eyebrow}
            </p>
            <p className="mt-1 text-base font-semibold text-[var(--dash-ink)]">
              {title}
            </p>
          </div>
          <div className="min-w-[220px]">
            <ToggleField
              checked={Boolean(enabled)}
              label={enabledLabel}
              desc={enabledDesc}
              onChange={onEnabledChange}
            />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function BooleanToggle({ label, desc, checked, onChange }) {
  return (
    <div className="mt-6">
      <ToggleField checked={Boolean(checked)} label={label} desc={desc} onChange={onChange} />
    </div>
  );
}

export default function WidgetsStep({
  visible,
  countdownWidgetConfig,
  storyWidgetConfig,
  galleryWidgetConfig,
  eventWidgetConfig,
  musicWidgetConfig,
  giftWidgetConfig,
  rsvpWidgetConfig,
  countdownVariantOptions,
  storyVariantOptions,
  storyAnimationOptions,
  galleryVariantOptions,
  eventVariantOptions,
  musicVariantOptions,
  musicPositionOptions,
  musicPulseIntensityOptions,
  updateCountdownWidget,
  updateStoryWidget,
  updateGalleryWidget,
  updateEventWidget,
  updateMusicWidget,
  updateGiftWidget,
  updateRsvpWidget,
}) {
  if (!visible) return null;

  return (
    <>
      <div id="template-widgets" className="scroll-mt-24 md:col-span-2">
        <WidgetPanel
          eyebrow="Hitung Mundur"
          title="Atur hitung mundur menuju acara utama."
          enabled={countdownWidgetConfig.enabled}
          enabledLabel="Tampilkan hitung mundur"
          enabledDesc="Timer akan muncul di undangan publik."
          onEnabledChange={(checked) => updateCountdownWidget("enabled", checked)}
        >
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Acuan Acara">
                <SelectInput
                  value={countdownWidgetConfig.eventIndex}
                  onChange={(event) =>
                    updateCountdownWidget("eventIndex", Number(event.target.value))
                  }
                >
                  {[0, 1, 2].map((eventIndex) => (
                    <option key={eventIndex} value={eventIndex}>
                      Acara {eventIndex + 1}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Gaya Tampilan">
                <SelectInput
                  value={countdownWidgetConfig.variant}
                  onChange={(event) => updateCountdownWidget("variant", event.target.value)}
                >
                  {countdownVariantOptions.map((variant) => (
                    <option key={variant} value={variant}>
                      {optionLabel(variant)}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <MiniInput
                label="Teks Selesai"
                value={countdownWidgetConfig.completeText}
                onChange={(value) => updateCountdownWidget("completeText", value)}
              />
            </div>
            <CountdownWidgetPreview
              variant={countdownWidgetConfig.variant}
              enabled={Boolean(countdownWidgetConfig.enabled)}
            />
          </div>
        </WidgetPanel>
      </div>

      <WidgetPanel
        eyebrow="Cerita Cinta"
        title="Atur gaya timeline dan animasi cerita pasangan."
        enabled={storyWidgetConfig.enabled}
        enabledLabel="Tampilkan cerita"
        onEnabledChange={(checked) => updateStoryWidget("enabled", checked)}
      >
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Gaya Tampilan">
                <SelectInput
                  value={storyWidgetConfig.variant}
                  onChange={(event) => updateStoryWidget("variant", event.target.value)}
                >
                  {storyVariantOptions.map((variant) => (
                    <option key={variant} value={variant}>
                      {optionLabel(variant)}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Animasi Item">
                <SelectInput
                  value={storyWidgetConfig.animation}
                  onChange={(event) => updateStoryWidget("animation", event.target.value)}
                >
                  {storyAnimationOptions.map((animation) => (
                    <option key={animation} value={animation}>
                      {optionLabel(animation)}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <CardVisualControls
                config={storyWidgetConfig}
                onChange={updateStoryWidget}
                labelPrefix="Card Story"
              />
            </div>
            <StoryWidgetPreview
              variant={storyWidgetConfig.variant}
              animation={storyWidgetConfig.animation}
              enabled={Boolean(storyWidgetConfig.enabled)}
              cardEnabled={storyWidgetConfig.cardEnabled !== false}
              cardBackgroundMode={storyWidgetConfig.cardBackgroundMode || "color"}
              cardBackgroundColor={storyWidgetConfig.cardBackgroundColor || ""}
              cardBackgroundImage={storyWidgetConfig.cardBackgroundImage || ""}
            />
          </div>
      </WidgetPanel>

      <WidgetPanel
        eyebrow="Galeri Foto"
        title="Atur layout galeri, jumlah foto, cover, dan viewer layar penuh."
        enabled={galleryWidgetConfig.enabled}
        enabledLabel="Tampilkan galeri"
        onEnabledChange={(checked) => updateGalleryWidget("enabled", checked)}
      >
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Gaya Galeri">
                <SelectInput
                  value={galleryWidgetConfig.variant}
                  onChange={(event) => updateGalleryWidget("variant", event.target.value)}
                >
                  {galleryVariantOptions.map((variant) => (
                    <option key={variant} value={variant}>
                      {optionLabel(variant)}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <MiniInput
                label="Jumlah Foto"
                type="number"
                value={galleryWidgetConfig.limit}
                onChange={(value) => updateGalleryWidget("limit", value)}
              />
              <BooleanToggle
                label="Cover sebagai foto pertama"
                checked={galleryWidgetConfig.includeCover}
                onChange={(checked) => updateGalleryWidget("includeCover", checked)}
              />
            </div>
            <GalleryWidgetPreview
              variant={galleryWidgetConfig.variant}
              enabled={Boolean(galleryWidgetConfig.enabled)}
            />
          </div>
      </WidgetPanel>

      <WidgetPanel
        eyebrow="Rangkaian Acara"
        title="Atur tampilan acara, tombol maps, dan ikon section."
        enabled={eventWidgetConfig.enabled}
        enabledLabel="Tampilkan acara"
        onEnabledChange={(checked) => updateEventWidget("enabled", checked)}
      >
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Gaya Tampilan">
                <SelectInput
                  value={eventWidgetConfig.variant}
                  onChange={(event) => updateEventWidget("variant", event.target.value)}
                >
                  {eventVariantOptions.map((variant) => (
                    <option key={variant} value={variant}>
                      {optionLabel(variant)}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <BooleanToggle
                label="Tampilkan tombol maps"
                checked={eventWidgetConfig.showMaps}
                onChange={(checked) => updateEventWidget("showMaps", checked)}
              />
              <BooleanToggle
                label="Tampilkan ikon acara"
                checked={eventWidgetConfig.showIcon}
                onChange={(checked) => updateEventWidget("showIcon", checked)}
              />
              <CardVisualControls
                config={eventWidgetConfig}
                onChange={updateEventWidget}
                labelPrefix="Card Acara"
              />
            </div>
            <EventWidgetPreview
              variant={eventWidgetConfig.variant}
              enabled={Boolean(eventWidgetConfig.enabled)}
              showMaps={Boolean(eventWidgetConfig.showMaps)}
              showIcon={Boolean(eventWidgetConfig.showIcon)}
              cardEnabled={eventWidgetConfig.cardEnabled !== false}
              cardBackgroundMode={eventWidgetConfig.cardBackgroundMode || "color"}
              cardBackgroundColor={eventWidgetConfig.cardBackgroundColor || ""}
              cardBackgroundImage={eventWidgetConfig.cardBackgroundImage || ""}
            />
          </div>
      </WidgetPanel>

      <WidgetPanel
        eyebrow="Musik Latar"
        title="Atur tombol musik dan sinkronisasi ornamen."
        enabled={musicWidgetConfig.enabled}
        enabledLabel="Aktifkan musik"
        onEnabledChange={(checked) => updateMusicWidget("enabled", checked)}
      >
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
            <div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Field label="Gaya Tombol">
                  <SelectInput
                    value={musicWidgetConfig.variant}
                    onChange={(event) => updateMusicWidget("variant", event.target.value)}
                  >
                    {musicVariantOptions.map((variant) => (
                      <option key={variant} value={variant}>
                        {optionLabel(variant)}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Posisi Tombol">
                  <SelectInput
                    value={musicWidgetConfig.position}
                    onChange={(event) => updateMusicWidget("position", event.target.value)}
                  >
                    {musicPositionOptions.map((pos) => (
                      <option key={pos} value={pos}>
                        {optionLabel(pos)}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Kekuatan Efek">
                  <SelectInput
                    value={musicWidgetConfig.pulseIntensity}
                    onChange={(event) => updateMusicWidget("pulseIntensity", event.target.value)}
                  >
                    {musicPulseIntensityOptions.map((intensity) => (
                      <option key={intensity} value={intensity}>
                        {optionLabel(intensity)}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <div className="flex flex-col gap-2 pt-5">
                  <ToggleField
                    checked={Boolean(musicWidgetConfig.showTrackInfo)}
                    label="Info lagu"
                    onChange={(checked) => updateMusicWidget("showTrackInfo", checked)}
                  />
                  <ToggleField
                    checked={Boolean(musicWidgetConfig.showProgress)}
                    label="Progress lagu"
                    onChange={(checked) => updateMusicWidget("showProgress", checked)}
                  />
                </div>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <ToggleField
                  checked={Boolean(musicWidgetConfig.pulseSync)}
                  label="Sinkron ornamen"
                  onChange={(checked) => updateMusicWidget("pulseSync", checked)}
                />
                <ToggleField
                  checked={Boolean(musicWidgetConfig.autoLoop)}
                  label="Putar ulang otomatis"
                  onChange={(checked) => updateMusicWidget("autoLoop", checked)}
                />
                <ToggleField
                  checked={musicWidgetConfig.hasAudio !== false}
                  label="Audio fallback aman"
                  onChange={(checked) => updateMusicWidget("hasAudio", checked)}
                />
              </div>
            </div>
            <MusicPlayerPreview
              variant={musicWidgetConfig.variant}
              position={musicWidgetConfig.position}
              enabled={Boolean(musicWidgetConfig.enabled)}
              showTrackInfo={Boolean(musicWidgetConfig.showTrackInfo)}
              showProgress={Boolean(musicWidgetConfig.showProgress)}
              pulseSync={Boolean(musicWidgetConfig.pulseSync)}
            />
          </div>
      </WidgetPanel>

      <WidgetPanel
        eyebrow="Amplop Digital"
        title="Atur tampilan rekening, tombol salin, dan fallback rekening."
        enabled={giftWidgetConfig.enabled}
        enabledLabel="Tampilkan amplop"
        onEnabledChange={(checked) => updateGiftWidget("enabled", checked)}
      >
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Gaya Tampilan">
                <SelectInput
                  value={giftWidgetConfig.variant}
                  onChange={(event) => updateGiftWidget("variant", event.target.value)}
                >
                  <option value="cards">{optionLabel("cards")}</option>
                  <option value="minimal">{optionLabel("minimal")}</option>
                  <option value="stacked">{optionLabel("stacked")}</option>
                </SelectInput>
              </Field>
              <BooleanToggle
                label="Tombol salin rekening"
                checked={giftWidgetConfig.copyButton}
                onChange={(checked) => updateGiftWidget("copyButton", checked)}
              />
              <BooleanToggle
                label="Fallback rekening aman"
                checked={giftWidgetConfig.hasFallbackAccounts}
                onChange={(checked) => updateGiftWidget("hasFallbackAccounts", checked)}
              />
            </div>
            <GiftWidgetPreview
              variant={giftWidgetConfig.variant}
              enabled={Boolean(giftWidgetConfig.enabled)}
              hasAccounts={Boolean(giftWidgetConfig.hasFallbackAccounts)}
            />
          </div>
      </WidgetPanel>

      <WidgetPanel
        eyebrow="RSVP & Ucapan"
        title="Pastikan ucapan dan konfirmasi hadir masuk ke undangan aktif."
        enabled={rsvpWidgetConfig.enabled}
        enabledLabel="Tampilkan RSVP"
        onEnabledChange={(checked) => updateRsvpWidget("enabled", checked)}
      >
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Gaya Form">
                <SelectInput
                  value={rsvpWidgetConfig.variant}
                  onChange={(event) => updateRsvpWidget("variant", event.target.value)}
                >
                  <option value="form">{optionLabel("form")}</option>
                  <option value="compact">{optionLabel("compact")}</option>
                  <option value="card">{optionLabel("card")}</option>
                </SelectInput>
              </Field>
              <BooleanToggle
                label="Input jumlah tamu"
                checked={rsvpWidgetConfig.showPax}
                onChange={(checked) => updateRsvpWidget("showPax", checked)}
              />
              <BooleanToggle
                label="Slug undangan aman"
                checked={rsvpWidgetConfig.hasInvitationSlug}
                onChange={(checked) => updateRsvpWidget("hasInvitationSlug", checked)}
              />
            </div>
            <RSVPWidgetPreview
              variant={rsvpWidgetConfig.variant}
              enabled={Boolean(rsvpWidgetConfig.enabled)}
              hasInvitationSlug={Boolean(rsvpWidgetConfig.hasInvitationSlug)}
            />
          </div>
      </WidgetPanel>
    </>
  );
}
