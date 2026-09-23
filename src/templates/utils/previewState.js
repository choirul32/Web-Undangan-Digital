import {
  getCoupleSectionConfig,
  getCountdownWidgetConfig,
  getCoverSectionConfig,
  getDesignConfig,
  getEventWidgetConfig,
  getGalleryWidgetConfig,
  getMusicWidgetConfig,
  getOpeningRevealConfig,
  getOpeningSequenceConfig,
  getStoryWidgetConfig,
} from "../designConfigs";
import { getSectionsOrder } from "../sectionsOrder";

// ============================================================
// previewState — satu-satunya pemilik keputusan render
// UniversalTemplate (Seam untuk overlay + section + tamu).
//
// Pure function: flags + invitation -> keputusan render.
// Dipisah dari UniversalTemplate supaya 8x pengulangan
// `!shouldDelay && shouldRenderSection(x)` dan aturan overlay
// (previewOpening vs disableOpeningOverlay vs previewSectionOnly)
// testable tanpa DOM. Hook usePreviewSectionFilter TETAP dipakai
// untuk scroll-into-view + state; modul ini hanya merumuskan
// keputusan murni dari state yang sudah ada.
//
// Semua getter config impor dari Facade designConfigs (ADR-0004),
// bukan dari modul dalam designConfig/* maupun shim perantara.
// ============================================================

export function resolveOpeningOverlayConfig({
  openingRevealConfig,
  openingSequenceConfig,
  previewOpening = false,
  disableOpeningOverlay = false,
  previewSectionOnly = false,
}) {
  const shouldDisableOpeningOverlay = disableOpeningOverlay || previewSectionOnly;

  return {
    ...openingRevealConfig,
    enabled: previewOpening
      ? true
      : shouldDisableOpeningOverlay
        ? false
        : openingRevealConfig.enabled,
    sequencePreset: openingSequenceConfig.preset,
    asset: openingSequenceConfig.asset,
  };
}

export function resolvePersonalizedGuestName(invitation, guestName) {
  return invitation?.features?.guestName === false ? "" : guestName;
}

export function shouldRenderWishesSection({
  invitation,
  previewFocusSection,
  shouldRenderSection,
}) {
  return (
    shouldRenderSection("doa-ucapan") &&
    (!invitation?.features?.rsvp || previewFocusSection === "doa-ucapan")
  );
}

export function shouldRenderGiftSection({ invitation, shouldRenderSection }) {
  return Boolean(shouldRenderSection("gift") && invitation?.features?.gift);
}

export function shouldRenderMusicPlayer({ invitation, musicConfig, previewSectionOnly }) {
  return Boolean(!previewSectionOnly && (invitation?.features?.music || musicConfig.enabled));
}

export function resolvePreviewState({
  invitation,
  guestName,
  previewOpening = false,
  disableOpeningOverlay = false,
  previewSectionOnly = false,
  previewFocusSection = null,
  shouldRenderSection = () => true,
}) {
  const designConfig = getDesignConfig(invitation?.templateId, invitation?.designConfig);
  const openingRevealConfig = getOpeningRevealConfig(designConfig);
  const openingSequenceConfig = getOpeningSequenceConfig(designConfig);
  const openingOverlayConfig = resolveOpeningOverlayConfig({
    openingRevealConfig,
    openingSequenceConfig,
    previewOpening,
    disableOpeningOverlay,
    previewSectionOnly,
  });
  const musicConfig = getMusicWidgetConfig(designConfig);

  return {
    designConfig,
    sectionsOrder: getSectionsOrder(designConfig),
    globalStyleConfig: designConfig?.sections?.global || {},
    coverConfig: getCoverSectionConfig(designConfig),
    openingOverlayConfig,
    personalizedGuestName: resolvePersonalizedGuestName(invitation, guestName),
    coupleConfig: getCoupleSectionConfig(designConfig),
    countdownConfig: getCountdownWidgetConfig(designConfig),
    eventConfig: getEventWidgetConfig(designConfig),
    galleryConfig: getGalleryWidgetConfig(designConfig),
    storyConfig: getStoryWidgetConfig(designConfig),
    musicConfig,
    shouldDelayInvitationContent: Boolean(openingOverlayConfig.enabled),
    showHomeGuestGreeting: !openingOverlayConfig.enabled,
    shouldRenderWishes: shouldRenderWishesSection({
      invitation,
      previewFocusSection,
      shouldRenderSection,
    }),
    shouldRenderGift: shouldRenderGiftSection({ invitation, shouldRenderSection }),
    shouldRenderMusic: shouldRenderMusicPlayer({
      invitation,
      musicConfig,
      previewSectionOnly,
    }),
  };
}
