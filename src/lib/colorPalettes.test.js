import { describe, expect, it } from "vitest";
import {
  contrastRatio,
  ensureContrast,
  hexToRgb,
  isHexColor,
  readableTextColor,
  slugifyPaletteId,
} from "./colorUtils";
import { normalizePaletteInput } from "./colorPalettes";

describe("colorUtils", () => {
  it("hexToRgb valid & invalid", () => {
    expect(hexToRgb("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb("abc")).toBeNull();
    expect(hexToRgb("#fff")).toBeNull(); // harus 6 digit
  });

  it("isHexColor hanya 6 digit hex", () => {
    expect(isHexColor("#a1b2c3")).toBe(true);
    expect(isHexColor("#A1B2C3")).toBe(true);
    expect(isHexColor("#fff")).toBe(false);
    expect(isHexColor("red")).toBe(false);
  });

  it("readableTextColor: gelap utk latar terang, putih utk gelap", () => {
    expect(readableTextColor("#ffffff")).toBe("#111827");
    expect(readableTextColor("#000000")).toBe("#ffffff");
  });

  it("contrastRatio hitung & null utk invalid", () => {
    const ratio = contrastRatio("#111827", "#ffffff");
    expect(ratio).toBeGreaterThan(10);
    expect(contrastRatio("#111827", "nope")).toBeNull();
  });

  it("slugifyPaletteId normalisasi label", () => {
    expect(slugifyPaletteId("Jawa Wayang Emas!")).toBe("jawa-wayang-emas");
    expect(slugifyPaletteId("  Royal  Navy  ")).toBe("royal-navy");
    expect(slugifyPaletteId("!!!")).toBe("palet-custom");
  });

  it("ensureContrast ganti text yang kurang kontras", () => {
    // text putih di atas bg putih → kontras rendah → diganti gelap.
    const { colors, warnings } = ensureContrast({
      bg: "#ffffff",
      text: "#ffffff",
      primary: "#0f1f3d",
      accent: "#c8a24a",
      surface: "#ffffff",
    });
    expect(colors.text).toBe("#111827");
    expect(warnings.length).toBeGreaterThan(0);
  });

  it("ensureContrast pertahankan text yang sudah kontras", () => {
    const { colors, warnings } = ensureContrast({
      bg: "#ffffff",
      text: "#1f2937",
      primary: "#0f1f3d",
      accent: "#c8a24a",
      surface: "#ffffff",
    });
    expect(colors.text).toBe("#1f2937");
    expect(warnings).toEqual([]);
  });
});

describe("normalizePaletteInput", () => {
  it("normalisasi input lengkap → palette_id slug", () => {
    const result = normalizePaletteInput({
      label: "Jawa Wayang Emas",
      description: "Palet elegan",
      colors: {
        primary: "#0f1f3d",
        accent: "#c8a24a",
        text: "#374151",
        bg: "#fbf7ef",
        surface: "#ffffff",
      },
    });
    expect(result.error).toBeUndefined();
    expect(result.data.paletteId).toBe("jawa-wayang-emas");
    expect(result.data.label).toBe("Jawa Wayang Emas");
    expect(result.data.colors.bg).toBe("#fbf7ef");
  });

  it("label kosong → error", () => {
    const result = normalizePaletteInput({ label: "", colors: {} });
    expect(result.error).toContain("Label");
  });

  it("warna tidak valid → fallback + warning (bukan error)", () => {
    const result = normalizePaletteInput({
      label: "X",
      colors: { primary: "red" },
    });
    expect(result.error).toBeUndefined();
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.data.colors.primary).toMatch(/^#[0-9a-f]{6}$/i);
  });
});
