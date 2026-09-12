import { describe, expect, it } from "vitest";
import { applyPaletteToDesignConfig, paletteToSectionColors } from "./applyPalette";

const palette = {
  id: "royal-navy-gold",
  label: "Royal Navy Gold",
  colors: {
    primary: "#0f1f3d",
    accent: "#c8a24a",
    text: "#374151",
    bg: "#fbf7ef",
    surface: "#fffaf2",
  },
};

describe("paletteToSectionColors", () => {
  it("memetakan 5 kunci palet ke kunci section", () => {
    const { colors, warnings } = paletteToSectionColors(palette);
    expect(colors).toEqual({
      backgroundColor: "#fbf7ef",
      primaryColor: "#0f1f3d",
      textColor: "#374151",
      accentColor: "#c8a24a",
      surfaceColor: "#fffaf2",
    });
    expect(warnings).toEqual([]);
  });

  it("palet berkontras buruk dikoreksi sebelum ditempel", () => {
    const { colors, warnings } = paletteToSectionColors({
      id: "bad",
      colors: { primary: "#0f1f3d", accent: "#c8a24a", text: "#ffffff", bg: "#ffffff", surface: "#ffffff" },
    });
    expect(colors.textColor).toBe("#111827");
    expect(warnings.length).toBeGreaterThan(0);
  });
});

describe("applyPaletteToDesignConfig", () => {
  it("global + section non-global diisi warna palet, non-global di-reset ikut global", () => {
    const next = applyPaletteToDesignConfig(
      {
        sections: {
          global: { fontPreset: "serif" },
          acara: { useGlobal: false, backgroundColor: "#000000" },
        },
      },
      palette,
    );

    expect(next.palette).toBe("royal-navy-gold");
    expect(next.sections.global).toMatchObject({
      fontPreset: "serif",
      backgroundColor: "#fbf7ef",
      textColor: "#374151",
    });
    expect(next.sections.acara).toMatchObject({
      useGlobal: true,
      backgroundColor: "#fbf7ef",
      textColor: "#374151",
      accentColor: "#c8a24a",
      surfaceColor: "#fffaf2",
    });
  });

  it("tanpa palet -> config dikembalikan apa adanya", () => {
    const config = { sections: {} };
    expect(applyPaletteToDesignConfig(config, null)).toBe(config);
  });

  it("tidak memutasi config lama", () => {
    const config = { sections: { global: { fontPreset: "serif" } } };
    applyPaletteToDesignConfig(config, palette);
    expect(config.sections.global.backgroundColor).toBeUndefined();
  });
});
