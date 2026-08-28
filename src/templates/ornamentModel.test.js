import { describe, expect, it } from "vitest";
import {
  getOrnamentLayerPresetId,
  getParallaxSpeed,
  isForegroundLayer,
  mirrorSlotMap,
  ornamentLayerPresets,
  ornamentParallaxOptions,
  ornamentSlots,
  PARALLAX_SPEEDS,
  sizeValue,
  slotClasses,
  slotTransforms,
} from "./ornamentModel";

describe("ornamentModel slots", () => {
  it("semua slot punya class; slot centering punya transform", () => {
    // Slot yang butuh centering punya transform; slot pojok/tengah penuh tidak.
    const centeringSlots = ["center-top", "center-bottom", "side-left", "side-right", "middle-left", "middle-right", "center"];
    ornamentSlots.forEach((slot) => {
      expect(slotClasses[slot], `slotClasses[${slot}]`).toBeTruthy();
      if (centeringSlots.includes(slot)) {
        expect(slotTransforms[slot], `slotTransforms[${slot}]`).toBeTruthy();
      }
    });
  });

  it("semua slot punya pasangan mirror", () => {
    ornamentSlots.forEach((slot) => {
      expect(mirrorSlotMap[slot], `mirrorSlotMap[${slot}]`).toBeTruthy();
    });
  });

  it("slot yang dipakai renderer (middle-*) ada di list", () => {
    expect(ornamentSlots).toContain("middle-left");
    expect(ornamentSlots).toContain("middle-right");
    expect(ornamentSlots).toContain("fill");
  });
});

describe("ornamentModel parallax", () => {
  it("preset parallax konsisten antara options dan speeds", () => {
    ornamentParallaxOptions.forEach((option) => {
      expect(PARALLAX_SPEEDS[option], `PARALLAX_SPEEDS[${option}]`).toBeDefined();
    });
  });

  it("getParallaxSpeed mengembalikan nilai renderer untuk preset", () => {
    expect(getParallaxSpeed("none")).toBe(0);
    expect(getParallaxSpeed("slow")).toBe(0.15);
    expect(getParallaxSpeed("medium")).toBe(0.3);
    expect(getParallaxSpeed("fast")).toBe(0.5);
  });

  it("getParallaxSpeed menerima angka langsung", () => {
    expect(getParallaxSpeed(0.42)).toBe(0.42);
    expect(getParallaxSpeed("bogus")).toBe(0);
  });
});

describe("ornamentModel layer", () => {
  it("isForegroundLayer memakai threshold renderer (>= 0)", () => {
    expect(isForegroundLayer(-1)).toBe(false);
    expect(isForegroundLayer(0)).toBe(true);
    expect(isForegroundLayer(1)).toBe(true);
    expect(isForegroundLayer(10)).toBe(true);
  });

  it("preset layer konsisten dengan threshold", () => {
    expect(ornamentLayerPresets.find((p) => p.id === "behind").zIndex).toBe(-1);
    expect(ornamentLayerPresets.find((p) => p.id === "front").zIndex).toBe(1);
    expect(ornamentLayerPresets.find((p) => p.id === "top").zIndex).toBe(10);
  });

  it("getOrnamentLayerPresetId mengklasifikasikan zIndex dengan benar", () => {
    expect(getOrnamentLayerPresetId(-5)).toBe("behind");
    expect(getOrnamentLayerPresetId(-1)).toBe("behind");
    expect(getOrnamentLayerPresetId(0)).toBe("front");
    expect(getOrnamentLayerPresetId(1)).toBe("front");
    expect(getOrnamentLayerPresetId(9)).toBe("front");
    expect(getOrnamentLayerPresetId(10)).toBe("top");
    expect(getOrnamentLayerPresetId(50)).toBe("top");
  });
});

describe("ornamentModel sizeValue", () => {
  it("angka menjadi px", () => {
    expect(sizeValue(100)).toBe("100px");
  });

  it("string ber-unit dipakai apa adanya", () => {
    expect(sizeValue("50%")).toBe("50%");
    expect(sizeValue("2rem")).toBe("2rem");
  });

  it("string numerik tanpa unit menjadi px", () => {
    expect(sizeValue("120")).toBe("120px");
  });

  it("nilai kosong undefined", () => {
    expect(sizeValue("")).toBeUndefined();
    expect(sizeValue(null)).toBeUndefined();
    expect(sizeValue(undefined)).toBeUndefined();
  });
});
