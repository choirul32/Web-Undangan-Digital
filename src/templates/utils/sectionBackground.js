import { getSectionStyleConfig } from "../designConfigs";
import { getSectionParallaxOffset } from "../ornamentModel";

// ============================================================
// resolveSectionBackground — satu-satunya pemilik aturan
// background section (Seam untuk SectionFrame).
//
// Pure function: designConfig + section -> keputusan render.
// Dipisah dari SectionFrame (templateStyling.js) supaya aturan
// transparan/parallax/overlay testable tanpa DOM, dan tidak
// perlu mantul antara 3 modul saat debug "ikut global tapi
// background ketutup".
//
// Aturan (dipertahankan dari SectionFrame):
// - Section transparan kalau ADA background global, KECUALI:
//   home, section punya backgroundImage sendiri, atau
//   useGlobalBackground=false.
// - Warna efektif: sectionOwn.backgroundColor menang atas warisan
//   global (supaya tidak menutupi bg image global).
// - Gambar lokal selalu gambar MILIK section (bukan warisan global
//   yang sudah dirender sekali di GlobalBackground).
// ============================================================

export function resolveSectionBackground(designConfig, section) {
  const styleConfig = getSectionStyleConfig(designConfig, section);
  const globalBg = designConfig?.sections?.global?.backgroundImage;
  const sectionOwn = designConfig?.sections?.[section] || {};
  const hasOwnImage = Boolean(sectionOwn.backgroundImage);
  const useGlobalBackground = sectionOwn.useGlobalBackground !== false;
  const isTransparentSection =
    Boolean(globalBg) &&
    section !== "home" &&
    useGlobalBackground &&
    !hasOwnImage;

  const parallaxOffset = getSectionParallaxOffset(styleConfig.backgroundParallax || "none");
  const hasOwnBackgroundImage = Boolean(sectionOwn.backgroundImage) && !isTransparentSection;
  const overlayOpacity = Math.min(90, Math.max(0, Number(styleConfig.backgroundOverlay) || 0)) / 100;
  const effectiveBackground = isTransparentSection
    ? "transparent"
    : sectionOwn.backgroundColor || styleConfig.backgroundColor;

  return {
    styleConfig,
    isTransparentSection,
    hasOwnBackgroundImage,
    backgroundImage: sectionOwn.backgroundImage || "",
    effectiveBackground,
    overlayOpacity,
    parallaxOffset,
  };
}
