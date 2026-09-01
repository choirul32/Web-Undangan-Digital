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
import VisualChoiceControl from "./VisualChoiceControl";
import {
  previewLayoutCards,
  previewLayoutMinimal,
  previewLayoutStacked,
  previewLayoutTimeline,
  previewLayoutGrid,
  previewLayoutCarousel,
  previewLayoutMasonry,
  previewLayoutSlider,
  previewLayoutChat,
  previewLayoutCircle,
  previewLayoutFlipClock,
  previewLayoutRing,
  previewLayoutNeon,
  previewLayoutBar,
  previewLayoutFloating,
  previewLayoutForm,
  previewLayoutCard,
  previewPosition,
} from "./choicePreviews";
import { prepareImageForUpload } from "../../../lib/imageUpload";

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

const variantPreviewMap = {
  cards: previewLayoutCards,
  minimal: previewLayoutMinimal,
  stacked: previewLayoutStacked,
  timeline: previewLayoutTimeline,
  grid: previewLayoutGrid,
  carousel: previewLayoutCarousel,
  masonry: previewLayoutMasonry,
  slider: previewLayoutSlider,
  "chat-style": previewLayoutChat,
  "chapter-scroll": previewLayoutTimeline,
  card: previewLayoutCard,
  circle: previewLayoutCircle,
  "flip-clock": previewLayoutFlipClock,
  ring: previewLayoutRing,
  "neon-glow": previewLayoutNeon,
  bar: previewLayoutBar,
  floating: previewLayoutFloating,
  form: previewLayoutForm,
  compact: previewLayoutMinimal,
};

function buildVisualOptions(values, extraPreviews = {}) {
  return values.map((value) => {
    const previewBuilder = extraPreviews[value] || variantPreviewMap[value];
    return {
      value,
      label: optionLabel(value),
      preview: previewBuilder ? previewBuilder(value) : null,
    };
  });
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
    const prepared = await prepareImageForUpload(file, "default");
    const previewUrl = await readFileAsDataUrl(prepared.file);
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
    <div className="scroll-mt-24 md:col-span-2">
      <div className="space-y-5">
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
                <VisualChoiceControl
                  value={countdownWidgetConfig.variant}
                  options={buildVisualOptions(countdownVariantOptions)}
                  onChange={(value) => updateCountdownWidget("variant", value)}
                  columns={3}
                  ariaLabel="Gaya tampilan hitung mundur"
                />
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
                <VisualChoiceControl
                  value={storyWidgetConfig.variant}
                  options={buildVisualOptions(storyVariantOptions)}
                  onChange={(value) => updateStoryWidget("variant", value)}
                  columns={3}
                  ariaLabel="Gaya tampilan cerita"
                />
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
                <VisualChoiceControl
                  value={galleryWidgetConfig.variant}
                  options={buildVisualOptions(galleryVariantOptions)}
                  onChange={(value) => updateGalleryWidget("variant", value)}
                  columns={3}
                  ariaLabel="Gaya tampilan galeri"
                />
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
                <VisualChoiceControl
                  value={eventWidgetConfig.variant}
                  options={buildVisualOptions(eventVariantOptions)}
                  onChange={(value) => updateEventWidget("variant", value)}
                  columns={3}
                  ariaLabel="Gaya tampilan acara"
                />
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
                  <VisualChoiceControl
                    value={musicWidgetConfig.variant}
                    options={buildVisualOptions(musicVariantOptions)}
                    onChange={(value) => updateMusicWidget("variant", value)}
                    columns={3}
                    ariaLabel="Gaya tombol musik"
                  />
                </Field>
                <Field label="Posisi Tombol">
                  <VisualChoiceControl
                    value={musicWidgetConfig.position}
                    options={buildVisualOptions(musicPositionOptions, {
                      "bottom-right": previewPosition,
                      "bottom-left": previewPosition,
                      "top-right": previewPosition,
                      "top-left": previewPosition,
                    })}
                    onChange={(value) => updateMusicWidget("position", value)}
                    columns={4}
                    ariaLabel="Posisi tombol musik"
                  />
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
                <VisualChoiceControl
                  value={giftWidgetConfig.variant}
                  options={buildVisualOptions(["cards", "minimal", "stacked"])}
                  onChange={(value) => updateGiftWidget("variant", value)}
                  columns={3}
                  ariaLabel="Gaya tampilan amplop digital"
                />
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
                <VisualChoiceControl
                  value={rsvpWidgetConfig.variant}
                  options={buildVisualOptions(["form", "compact", "card"])}
                  onChange={(value) => updateRsvpWidget("variant", value)}
                  columns={3}
                  ariaLabel="Gaya form RSVP"
                />
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
      </div>
    </div>
  );
}
