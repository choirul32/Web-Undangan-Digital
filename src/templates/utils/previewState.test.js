import { describe, expect, it } from "vitest";
import {
  resolveOpeningOverlayConfig,
  resolvePersonalizedGuestName,
  resolvePreviewState,
  shouldRenderGiftSection,
  shouldRenderMusicPlayer,
  shouldRenderWishesSection,
} from "./previewState";

const baseInvitation = {
  templateId: "basic",
  designConfig: {},
  features: {},
};

describe("resolveOpeningOverlayConfig", () => {
  const base = {
    openingRevealConfig: { enabled: true, buttonText: "Buka" },
    openingSequenceConfig: { preset: "auto", asset: { type: "motion" } },
  };

  it("previewOpening memaksa overlay nyala", () => {
    const resolved = resolveOpeningOverlayConfig({
      ...base,
      previewOpening: true,
      disableOpeningOverlay: true,
      previewSectionOnly: true,
    });
    expect(resolved.enabled).toBe(true);
  });

  it("previewSectionOnly mematikan overlay", () => {
    const resolved = resolveOpeningOverlayConfig({
      ...base,
      previewSectionOnly: true,
    });
    expect(resolved.enabled).toBe(false);
  });

  it("disableOpeningOverlay mematikan overlay", () => {
    const resolved = resolveOpeningOverlayConfig({
      ...base,
      disableOpeningOverlay: true,
    });
    expect(resolved.enabled).toBe(false);
  });

  it("mode normal mengikuti config template", () => {
    const resolved = resolveOpeningOverlayConfig(base);
    expect(resolved.enabled).toBe(true);
    expect(resolved.sequencePreset).toBe("auto");
  });
});

describe("resolvePersonalizedGuestName", () => {
  it("fitur guestName mati -> nama dikosongkan", () => {
    expect(
      resolvePersonalizedGuestName({ features: { guestName: false } }, "Budi"),
    ).toBe("");
  });

  it("default -> nama diteruskan", () => {
    expect(resolvePersonalizedGuestName(baseInvitation, "Budi")).toBe("Budi");
  });
});

describe("shouldRenderWishesSection", () => {
  const renderAll = () => true;

  it("tanpa fitur rsvp -> wishes tampil", () => {
    expect(
      shouldRenderWishesSection({
        invitation: { features: {} },
        previewFocusSection: null,
        shouldRenderSection: renderAll,
      }),
    ).toBe(true);
  });

  it("dengan fitur rsvp -> wishes disembunyikan kecuali focus doa-ucapan", () => {
    expect(
      shouldRenderWishesSection({
        invitation: { features: { rsvp: true } },
        previewFocusSection: "rsvp",
        shouldRenderSection: renderAll,
      }),
    ).toBe(false);
    expect(
      shouldRenderWishesSection({
        invitation: { features: { rsvp: true } },
        previewFocusSection: "doa-ucapan",
        shouldRenderSection: renderAll,
      }),
    ).toBe(true);
  });
});

describe("shouldRenderGiftSection / shouldRenderMusicPlayer", () => {
  it("gift butuh section render + fitur gift", () => {
    expect(
      shouldRenderGiftSection({
        invitation: { features: { gift: true } },
        shouldRenderSection: () => true,
      }),
    ).toBe(true);
    expect(
      shouldRenderGiftSection({
        invitation: { features: {} },
        shouldRenderSection: () => true,
      }),
    ).toBe(false);
  });

  it("musik mati di previewSectionOnly", () => {
    expect(
      shouldRenderMusicPlayer({
        invitation: { features: { music: true } },
        musicConfig: { enabled: false },
        previewSectionOnly: true,
      }),
    ).toBe(false);
  });
});

describe("resolvePreviewState", () => {
  it("merumuskan keputusan render ujung-ke-ujung", () => {
    const resolved = resolvePreviewState({
      invitation: {
        ...baseInvitation,
        features: { gift: true, music: true },
      },
      guestName: "Budi",
      previewSectionOnly: false,
      previewFocusSection: null,
      shouldRenderSection: () => true,
    });

    expect(resolved.designConfig).toBeDefined();
    expect(resolved.personalizedGuestName).toBe("Budi");
    expect(resolved.shouldRenderGift).toBe(true);
    expect(resolved.shouldRenderMusic).toBe(true);
    expect(resolved.shouldRenderWishes).toBe(true);
  });
});
