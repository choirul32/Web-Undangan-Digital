import { describe, expect, it } from "vitest";
import {
  defaultCountdownWidgetConfig,
  defaultEventWidgetConfig,
  defaultGalleryWidgetConfig,
  defaultGiftWidgetConfig,
  defaultRsvpWidgetConfig,
  defaultStoryWidgetConfig,
  getCountdownWidgetConfig,
  getEventWidgetConfig,
  getGalleryWidgetConfig,
  getStoryWidgetConfig,
  mergeDesignConfigs,
  normalizeDesignConfig,
} from "./designConfigs";
import {
  countdownClasses,
  eventClasses,
  galleryClasses,
  storyClasses,
} from "./utils/templateSectionClasses";
import {
  countdownVariantOptions,
  eventVariantOptions,
  galleryVariantOptions,
  storyVariantOptions,
} from "../components/dashboard/config";

describe("designConfig widget defaults", () => {
  it("getter countdown mengembalikan default + override", () => {
    const config = getCountdownWidgetConfig({
      widgets: { countdown: { variant: "circle" } },
    });
    expect(config).toEqual({ ...defaultCountdownWidgetConfig, variant: "circle" });
  });

  it("getter event mengembalikan default + override", () => {
    const config = getEventWidgetConfig({
      widgets: { events: { showMaps: false } },
    });
    expect(config).toEqual({ ...defaultEventWidgetConfig, showMaps: false });
  });

  it("getter gallery mengembalikan default + override", () => {
    const config = getGalleryWidgetConfig({
      widgets: { gallery: { limit: 3 } },
    });
    expect(config).toEqual({ ...defaultGalleryWidgetConfig, limit: 3 });
  });

  it("getter story mengembalikan default + override", () => {
    const config = getStoryWidgetConfig({
      widgets: { story: { animation: "zoom-in" } },
    });
    expect(config).toEqual({ ...defaultStoryWidgetConfig, animation: "zoom-in" });
  });

  it("getter mengabaikan override yang bukan object", () => {
    const config = getCountdownWidgetConfig({ widgets: { countdown: null } });
    expect(config).toEqual(defaultCountdownWidgetConfig);
  });
});

describe("mergeDesignConfigs", () => {
  it("deep-merge widgets tanpa menimpa key lain", () => {
    const merged = mergeDesignConfigs(
      {
        widgets: {
          countdown: { enabled: true, eventIndex: 0, variant: "cards" },
        },
      },
      {
        widgets: {
          countdown: { variant: "circle" },
          gallery: { limit: 3 },
        },
      },
    );
    expect(merged.widgets.countdown).toEqual({
      enabled: true,
      eventIndex: 0,
      variant: "circle",
    });
    expect(merged.widgets.gallery).toEqual({ limit: 3 });
  });

  it("normalizeDesignConfig mengisi semua grup kosong", () => {
    const normalized = normalizeDesignConfig({ widgets: { music: {} } });
    expect(normalized).toMatchObject({
      canvas: {},
      sections: {},
      ornaments: {},
      ornamentExclusions: {},
      widgets: { music: {} },
      animations: {},
    });
  });
});

describe("variant contract: config.js vs implementasi widget", () => {
  const implementedCountdown = ["cards", "minimal", "circle", "flip-clock", "ring", "neon-glow"];

  it("setiap varian countdown di config.js punya implementasi class", () => {
    countdownVariantOptions.forEach((variant) => {
      const classes = countdownClasses(variant);
      expect(classes.container, `countdown variant "${variant}"`).toBeTruthy();
    });
    expect(implementedCountdown.sort()).toEqual([...countdownVariantOptions].sort());
  });

  it("setiap varian event di config.js punya implementasi", () => {
    // EventWidget TIDAK branching varian — renderer hanya mendukung "cards" (default) dan "list" (di classes).
    // config.js harus tidak menawarkan varian yang renderer tidak implementasikan.
    const implemented = ["cards", "list"];
    expect(implemented.sort()).toEqual([...eventVariantOptions].sort());
  });

  it("setiap varian story di config.js punya implementasi di StoryWidget", () => {
    // StoryWidget branching: chapter-scroll, chat-style, sisanya default (card/timeline via classes)
    const implemented = ["card", "timeline", "stacked", "chapter-scroll", "chat-style"];
    storyVariantOptions.forEach((variant) => {
      expect(implemented, `story variant "${variant}"`).toContain(variant);
    });
    expect(implemented.sort()).toEqual([...storyVariantOptions].sort());
  });

  it("setiap varian gallery di config.js punya implementasi di GalleryWidget", () => {
    // GalleryWidget branching: carousel, cinematic-slideshow, sisanya default (grid/masonry via classes)
    const implemented = ["grid", "carousel", "masonry", "cinematic-slideshow"];
    galleryVariantOptions.forEach((variant) => {
      expect(implemented, `gallery variant "${variant}"`).toContain(variant);
    });
    expect(implemented.sort()).toEqual([...galleryVariantOptions].sort());
  });
});

describe("editor-only defaults", () => {
  it("defaultGiftWidgetConfig punya key yang dipakai panel validasi", () => {
    expect(defaultGiftWidgetConfig).toMatchObject({
      enabled: true,
      hasFallbackAccounts: true,
    });
  });

  it("defaultRsvpWidgetConfig punya key yang dipakai panel validasi", () => {
    expect(defaultRsvpWidgetConfig).toMatchObject({
      enabled: true,
      hasInvitationSlug: true,
    });
  });
});
