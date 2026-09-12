import { describe, expect, it } from "vitest";
import { resolveSectionBackground } from "./sectionBackground";

const baseConfig = {
  sections: {
    global: {
      backgroundColor: "#101a2f",
      backgroundImage: "/bg-global.jpg",
      textColor: "#ffffff",
    },
  },
};

describe("resolveSectionBackground", () => {
  it("section ikut global jadi transparan dan tanpa gambar lokal", () => {
    const resolved = resolveSectionBackground(baseConfig, "acara");
    expect(resolved.isTransparentSection).toBe(true);
    expect(resolved.hasOwnBackgroundImage).toBe(false);
    expect(resolved.effectiveBackground).toBe("transparent");
  });

  it("home tidak pernah transparan walau ada background global", () => {
    const resolved = resolveSectionBackground(baseConfig, "home");
    expect(resolved.isTransparentSection).toBe(false);
  });

  it("section dengan gambar sendiri tidak transparan dan render gambarnya", () => {
    const resolved = resolveSectionBackground(
      {
        sections: {
          ...baseConfig.sections,
          acara: { backgroundImage: "/bg-acara.jpg" },
        },
      },
      "acara",
    );
    expect(resolved.isTransparentSection).toBe(false);
    expect(resolved.hasOwnBackgroundImage).toBe(true);
    expect(resolved.backgroundImage).toBe("/bg-acara.jpg");
  });

  it("useGlobalBackground=false menonaktifkan transparansi", () => {
    const resolved = resolveSectionBackground(
      {
        sections: {
          ...baseConfig.sections,
          acara: { useGlobalBackground: false },
        },
      },
      "acara",
    );
    expect(resolved.isTransparentSection).toBe(false);
  });

  it("warna section sendiri menang atas warisan global (section kustom)", () => {
    const resolved = resolveSectionBackground(
      {
        sections: {
          ...baseConfig.sections,
          acara: {
            useGlobal: false,
            useGlobalBackground: false,
            backgroundColor: "#00ff00",
          },
        },
      },
      "acara",
    );
    expect(resolved.isTransparentSection).toBe(false);
    expect(resolved.effectiveBackground).toBe("#00ff00");
  });

  it("section ikut global tetap transparan walau set backgroundColor", () => {
    const resolved = resolveSectionBackground(
      {
        sections: {
          ...baseConfig.sections,
          acara: { backgroundColor: "#00ff00" },
        },
      },
      "acara",
    );
    expect(resolved.isTransparentSection).toBe(true);
    expect(resolved.effectiveBackground).toBe("transparent");
  });

  it("parallax memakai skala px yang sama dengan SectionFrame lama", () => {
    expect(resolveSectionBackground(baseConfig, "acara").parallaxOffset).toBe(0);
    const withParallax = {
      sections: {
        ...baseConfig.sections,
        acara: { useGlobal: false, backgroundParallax: "slow" },
      },
    };
    expect(resolveSectionBackground(withParallax, "acara").parallaxOffset).toBe(12);
    expect(
      resolveSectionBackground(
        {
          sections: {
            ...baseConfig.sections,
            acara: { useGlobal: false, backgroundParallax: "medium" },
          },
        },
        "acara",
      ).parallaxOffset,
    ).toBe(24);
    expect(
      resolveSectionBackground(
        {
          sections: {
            ...baseConfig.sections,
            acara: { useGlobal: false, backgroundParallax: "fast" },
          },
        },
        "acara",
      ).parallaxOffset,
    ).toBe(40);
  });

  it("overlay di-clamp 0-90 seperti renderer", () => {
    const resolved = resolveSectionBackground(
      {
        sections: {
          ...baseConfig.sections,
          acara: {
            useGlobal: false,
            useGlobalBackground: false,
            backgroundImage: "/bg.jpg",
            backgroundOverlay: 120,
          },
        },
      },
      "acara",
    );
    expect(resolved.overlayOpacity).toBe(0.9);
  });
});
