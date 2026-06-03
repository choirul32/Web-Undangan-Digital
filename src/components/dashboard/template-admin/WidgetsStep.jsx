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

function MiniInput({ label, value, onChange, type = "text" }) {
  const handleChange = (event) => {
    onChange(type === "number" ? Number(event.target.value) : event.target.value);
  };

  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
        {label}
      </span>
      <input
        type={type}
        value={value ?? ""}
        onChange={handleChange}
        className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
      />
    </label>
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
        <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                Countdown Widget
              </p>
              <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                Atur countdown real-time yang dipakai template ini.
              </p>
            </div>
            <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={Boolean(countdownWidgetConfig.enabled)}
                onChange={(event) => updateCountdownWidget("enabled", event.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm font-black text-[var(--color-primary)]">
                Countdown aktif
              </span>
            </label>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
            <div className="grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                  Target Event
                </span>
                <select
                  value={countdownWidgetConfig.eventIndex}
                  onChange={(event) =>
                    updateCountdownWidget("eventIndex", Number(event.target.value))
                  }
                  className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                >
                  {[0, 1, 2].map((eventIndex) => (
                    <option key={eventIndex} value={eventIndex}>
                      Event {eventIndex + 1}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                  Variant
                </span>
                <select
                  value={countdownWidgetConfig.variant}
                  onChange={(event) => updateCountdownWidget("variant", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                >
                  {countdownVariantOptions.map((variant) => (
                    <option key={variant} value={variant}>
                      {variant}
                    </option>
                  ))}
                </select>
              </label>
              <MiniInput
                label="Complete Text"
                value={countdownWidgetConfig.completeText}
                onChange={(value) => updateCountdownWidget("completeText", value)}
              />
            </div>
            <CountdownWidgetPreview
              variant={countdownWidgetConfig.variant}
              enabled={Boolean(countdownWidgetConfig.enabled)}
            />
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                Love Story Widget
              </p>
              <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                Atur style timeline dan animasi item love story.
              </p>
            </div>
            <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={Boolean(storyWidgetConfig.enabled)}
                onChange={(event) => updateStoryWidget("enabled", event.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm font-black text-[var(--color-primary)]">
                Story aktif
              </span>
            </label>
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                  Variant
                </span>
                <select
                  value={storyWidgetConfig.variant}
                  onChange={(event) => updateStoryWidget("variant", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                >
                  {storyVariantOptions.map((variant) => (
                    <option key={variant} value={variant}>
                      {variant}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                  Animation
                </span>
                <select
                  value={storyWidgetConfig.animation}
                  onChange={(event) => updateStoryWidget("animation", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                >
                  {storyAnimationOptions.map((animation) => (
                    <option key={animation} value={animation}>
                      {animation}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <StoryWidgetPreview
              variant={storyWidgetConfig.variant}
              animation={storyWidgetConfig.animation}
              enabled={Boolean(storyWidgetConfig.enabled)}
            />
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                Gallery Widget
              </p>
              <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                Atur layout gallery, jumlah foto, cover ordering, dan fullscreen viewer.
              </p>
            </div>
            <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={Boolean(galleryWidgetConfig.enabled)}
                onChange={(event) => updateGalleryWidget("enabled", event.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm font-black text-[var(--color-primary)]">
                Gallery aktif
              </span>
            </label>
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
            <div className="grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                  Variant
                </span>
                <select
                  value={galleryWidgetConfig.variant}
                  onChange={(event) => updateGalleryWidget("variant", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                >
                  {galleryVariantOptions.map((variant) => (
                    <option key={variant} value={variant}>
                      {variant}
                    </option>
                  ))}
                </select>
              </label>
              <MiniInput
                label="Limit"
                type="number"
                value={galleryWidgetConfig.limit}
                onChange={(value) => updateGalleryWidget("limit", value)}
              />
              <label className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                <input
                  type="checkbox"
                  checked={Boolean(galleryWidgetConfig.includeCover)}
                  onChange={(event) => updateGalleryWidget("includeCover", event.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm font-black text-[var(--color-primary)]">
                  Cover di awal
                </span>
              </label>
            </div>
            <GalleryWidgetPreview
              variant={galleryWidgetConfig.variant}
              enabled={Boolean(galleryWidgetConfig.enabled)}
            />
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                Event Widget
              </p>
              <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                Atur tampilan multi-event, tombol maps, dan icon section acara.
              </p>
            </div>
            <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={Boolean(eventWidgetConfig.enabled)}
                onChange={(event) => updateEventWidget("enabled", event.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm font-black text-[var(--color-primary)]">
                Event aktif
              </span>
            </label>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
            <div className="grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                  Variant
                </span>
                <select
                  value={eventWidgetConfig.variant}
                  onChange={(event) => updateEventWidget("variant", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                >
                  {eventVariantOptions.map((variant) => (
                    <option key={variant} value={variant}>
                      {variant}
                    </option>
                  ))}
                </select>
              </label>
              <label className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                <input
                  type="checkbox"
                  checked={Boolean(eventWidgetConfig.showMaps)}
                  onChange={(event) => updateEventWidget("showMaps", event.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm font-black text-[var(--color-primary)]">
                  Tampilkan Maps
                </span>
              </label>
              <label className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                <input
                  type="checkbox"
                  checked={Boolean(eventWidgetConfig.showIcon)}
                  onChange={(event) => updateEventWidget("showIcon", event.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm font-black text-[var(--color-primary)]">
                  Tampilkan Icon
                </span>
              </label>
            </div>
            <EventWidgetPreview
              variant={eventWidgetConfig.variant}
              enabled={Boolean(eventWidgetConfig.enabled)}
              showMaps={Boolean(eventWidgetConfig.showMaps)}
              showIcon={Boolean(eventWidgetConfig.showIcon)}
            />
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                Music Player
              </p>
              <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                Atur tampilan music player dan ornament pulse sync.
              </p>
            </div>
            <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={Boolean(musicWidgetConfig.enabled)}
                onChange={(event) => updateMusicWidget("enabled", event.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm font-black text-[var(--color-primary)]">Aktif</span>
            </label>
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
            <div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                    Variant
                  </span>
                  <select
                    value={musicWidgetConfig.variant}
                    onChange={(event) => updateMusicWidget("variant", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                  >
                    {musicVariantOptions.map((variant) => (
                      <option key={variant} value={variant}>
                        {variant}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                    Position
                  </span>
                  <select
                    value={musicWidgetConfig.position}
                    onChange={(event) => updateMusicWidget("position", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                  >
                    {musicPositionOptions.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                    Pulse Intensity
                  </span>
                  <select
                    value={musicWidgetConfig.pulseIntensity}
                    onChange={(event) => updateMusicWidget("pulseIntensity", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                  >
                    {musicPulseIntensityOptions.map((intensity) => (
                      <option key={intensity} value={intensity}>
                        {intensity}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="flex flex-col gap-2 pt-5">
                  <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                    <input
                      type="checkbox"
                      checked={Boolean(musicWidgetConfig.showTrackInfo)}
                      onChange={(event) => updateMusicWidget("showTrackInfo", event.target.checked)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm font-black text-[var(--color-primary)]">Track Info</span>
                  </label>
                  <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                    <input
                      type="checkbox"
                      checked={Boolean(musicWidgetConfig.showProgress)}
                      onChange={(event) => updateMusicWidget("showProgress", event.target.checked)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm font-black text-[var(--color-primary)]">Progress</span>
                  </label>
                </div>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                  <input
                    type="checkbox"
                    checked={Boolean(musicWidgetConfig.pulseSync)}
                    onChange={(event) => updateMusicWidget("pulseSync", event.target.checked)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-black text-[var(--color-primary)]">
                    Ornament Pulse Sync
                  </span>
                </label>
                <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                  <input
                    type="checkbox"
                    checked={Boolean(musicWidgetConfig.autoLoop)}
                    onChange={(event) => updateMusicWidget("autoLoop", event.target.checked)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-black text-[var(--color-primary)]">Auto Loop</span>
                </label>
                <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                  <input
                    type="checkbox"
                    checked={musicWidgetConfig.hasAudio !== false}
                    onChange={(event) => updateMusicWidget("hasAudio", event.target.checked)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-black text-[var(--color-primary)]">
                    Audio fallback aman
                  </span>
                </label>
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
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                Gift Widget
              </p>
              <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                Urutan panel: enable, variant, style preset, behavior, preview, advanced.
              </p>
            </div>
            <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={Boolean(giftWidgetConfig.enabled)}
                onChange={(event) => updateGiftWidget("enabled", event.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm font-black text-[var(--color-primary)]">Gift aktif</span>
            </label>
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
            <div className="grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                  Variant
                </span>
                <select
                  value={giftWidgetConfig.variant}
                  onChange={(event) => updateGiftWidget("variant", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                >
                  <option value="cards">cards</option>
                  <option value="minimal">minimal</option>
                  <option value="stacked">stacked</option>
                </select>
              </label>
              <label className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                <input
                  type="checkbox"
                  checked={Boolean(giftWidgetConfig.copyButton)}
                  onChange={(event) => updateGiftWidget("copyButton", event.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm font-black text-[var(--color-primary)]">Copy Button</span>
              </label>
              <label className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                <input
                  type="checkbox"
                  checked={Boolean(giftWidgetConfig.hasFallbackAccounts)}
                  onChange={(event) => updateGiftWidget("hasFallbackAccounts", event.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm font-black text-[var(--color-primary)]">
                  Fallback rekening aman
                </span>
              </label>
            </div>
            <GiftWidgetPreview
              variant={giftWidgetConfig.variant}
              enabled={Boolean(giftWidgetConfig.enabled)}
              hasAccounts={Boolean(giftWidgetConfig.hasFallbackAccounts)}
            />
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                RSVP Widget
              </p>
              <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                Submit harus terikat invitation aktif agar data tidak masuk global.
              </p>
            </div>
            <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={Boolean(rsvpWidgetConfig.enabled)}
                onChange={(event) => updateRsvpWidget("enabled", event.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm font-black text-[var(--color-primary)]">RSVP aktif</span>
            </label>
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
            <div className="grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                  Variant
                </span>
                <select
                  value={rsvpWidgetConfig.variant}
                  onChange={(event) => updateRsvpWidget("variant", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                >
                  <option value="form">form</option>
                  <option value="compact">compact</option>
                  <option value="card">card</option>
                </select>
              </label>
              <label className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                <input
                  type="checkbox"
                  checked={Boolean(rsvpWidgetConfig.showPax)}
                  onChange={(event) => updateRsvpWidget("showPax", event.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm font-black text-[var(--color-primary)]">Pax Field</span>
              </label>
              <label className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                <input
                  type="checkbox"
                  checked={Boolean(rsvpWidgetConfig.hasInvitationSlug)}
                  onChange={(event) => updateRsvpWidget("hasInvitationSlug", event.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm font-black text-[var(--color-primary)]">
                  Invitation slug aman
                </span>
              </label>
            </div>
            <RSVPWidgetPreview
              variant={rsvpWidgetConfig.variant}
              enabled={Boolean(rsvpWidgetConfig.enabled)}
              hasInvitationSlug={Boolean(rsvpWidgetConfig.hasInvitationSlug)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

