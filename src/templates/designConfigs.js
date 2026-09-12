// ============================================================
// designConfigs — FACADE. Interface publik tetap di sini agar
// semua import lama (UniversalTemplate, TemplateAdmin, API,
// templateStyling, tests) tidak perlu diubah.
//
// Implementation sudah dipecah (codebase-design: deep modules
// di balik satu Seam):
//   designConfig/core.js     — normalize/merge/getDesignConfig
//   designConfig/opening.js  — cover, reveal, sequence + legacy map (frozen)
//   designConfig/sections.js — couple, section style
//   designConfig/ornaments.js — getSectionOrnaments
//
// Widget defaults tetap di-re-export dari sini (keputusan grill:
// biarkan di facade agar diff review fokus ke core/opening/sections).
// ============================================================

import { defaultCountdownWidgetConfig, getCountdownWidgetConfig } from "./components/CountdownTimer";
import { defaultEventWidgetConfig, getEventWidgetConfig } from "./components/EventWidget";
import { defaultGalleryWidgetConfig, getGalleryWidgetConfig } from "./components/GalleryWidget";
import { defaultStoryWidgetConfig, getStoryWidgetConfig } from "./components/StoryWidget";
import { getMusicWidgetConfig } from "./components/MusicPlayer";

export {
  defaultCountdownWidgetConfig,
  getCountdownWidgetConfig,
  defaultEventWidgetConfig,
  getEventWidgetConfig,
  defaultGalleryWidgetConfig,
  getGalleryWidgetConfig,
  defaultStoryWidgetConfig,
  getStoryWidgetConfig,
};

export { getMusicWidgetConfig };

export {
  defaultDesignConfigs,
  normalizeDesignConfig,
  mergeDesignConfigs,
  getDesignConfig,
} from "./designConfig/core";

export {
  defaultCoverSectionConfig,
  defaultOpeningRevealConfig,
  defaultOpeningSequenceConfig,
  getCoverSectionConfig,
  getOpeningRevealConfig,
  getOpeningSequenceConfig,
} from "./designConfig/opening";

export {
  defaultCoupleSectionConfig,
  defaultSectionStyleConfig,
  getCoupleSectionConfig,
  getSectionStyleConfig,
} from "./designConfig/sections";

export { getSectionOrnaments } from "./designConfig/ornaments";

// Editor-only defaults: key ini TIDAK dibaca oleh renderer public —
// cuma dipakai panel editor untuk validasi/pra-isi. Tetap ditaruh di sini
// agar semua default widget berada di satu tempat.
export const defaultGiftWidgetConfig = {
  enabled: true,
  variant: "cards",
  copyButton: true,
  showQr: false,
  hasFallbackAccounts: true,
};

export const defaultRsvpWidgetConfig = {
  enabled: true,
  variant: "form",
  showPax: true,
  showMessage: true,
  requireGuestName: false,
  hasInvitationSlug: true,
};
