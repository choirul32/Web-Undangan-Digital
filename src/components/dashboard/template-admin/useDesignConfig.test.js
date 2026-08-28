import { describe, expect, it } from "vitest";
import {
  applyPatchOpeningSequenceAsset,
  applyPatchOrnament,
  applyPatchOrnamentAtIndex,
  applyPatchOrnaments,
  applyPatchSection,
  applyPatchSectionAnimation,
  applyPatchWidget,
  applyToggleGlobalOrnamentExclusion,
} from "./useDesignConfig";

describe("applyPatchWidget", () => {
  it("menggabungkan patch ke widget tanpa menimpa key lain", () => {
    const next = applyPatchWidget(
      { widgets: { countdown: { enabled: true, variant: "cards" } } },
      "countdown",
      { variant: "circle" },
    );
    expect(next.widgets.countdown).toEqual({ enabled: true, variant: "circle" });
  });

  it("membuat widget baru jika belum ada", () => {
    const next = applyPatchWidget({}, "music", { enabled: true });
    expect(next.widgets.music).toEqual({ enabled: true });
  });
});

describe("applyPatchSection", () => {
  it("menggabungkan patch ke section", () => {
    const next = applyPatchSection(
      { sections: { home: { backgroundColor: "#fff" } } },
      "home",
      { textColor: "#000" },
    );
    expect(next.sections.home).toEqual({ backgroundColor: "#fff", textColor: "#000" });
  });
});

describe("applyPatchSectionAnimation", () => {
  it("menggabungkan patch ke animasi section spesifik", () => {
    const next = applyPatchSectionAnimation(
      { animations: { sections: { home: { enabled: true } } } },
      "home",
      { entrancePreset: "fade-in" },
    );
    expect(next.animations.sections.home).toEqual({
      enabled: true,
      entrancePreset: "fade-in",
    });
  });
});

describe("applyPatchOrnament", () => {
  it("mengubah ornament pada index (dibatasi panjang array)", () => {
    const next = applyPatchOrnament(
      {
        ornaments: {
          home: [
            { id: "a", src: "/a.svg", zIndex: 0 },
            { id: "b", src: "/b.svg", zIndex: 0 },
          ],
        },
      },
      "home",
      1,
      "zIndex",
      10,
    );
    expect(next.ornaments.home[1].zIndex).toBe(10);
    expect(next.ornaments.home[0].zIndex).toBe(0);
  });
});

describe("applyPatchOrnamentAtIndex", () => {
  it("mengubah ornament pada index spesifik", () => {
    const next = applyPatchOrnamentAtIndex(
      {
        ornaments: {
          home: [
            { id: "a", src: "/a.svg" },
            { id: "b", src: "/b.svg" },
          ],
        },
      },
      "home",
      0,
      { slot: "top-right" },
    );
    expect(next.ornaments.home[0].slot).toBe("top-right");
    expect(next.ornaments.home[1].slot).toBeUndefined();
  });

  it("mengembalikan config sama jika index di luar range", () => {
    const config = { ornaments: { home: [{ id: "a" }] } };
    const next = applyPatchOrnamentAtIndex(config, "home", 5, { slot: "center" });
    expect(next).toBe(config);
  });
});

describe("applyPatchOrnaments", () => {
  it("menerima array langsung", () => {
    const next = applyPatchOrnaments(
      { ornaments: { home: [{ id: "a" }] } },
      "home",
      [{ id: "b" }],
    );
    expect(next.ornaments.home).toEqual([{ id: "b" }]);
  });

  it("menerima updater function", () => {
    const next = applyPatchOrnaments(
      { ornaments: { home: [{ id: "a" }, { id: "b" }] } },
      "home",
      (list) => list.filter((item) => item.id !== "a"),
    );
    expect(next.ornaments.home).toEqual([{ id: "b" }]);
  });
});

describe("applyToggleGlobalOrnamentExclusion", () => {
  it("menambah section jika belum ada", () => {
    const next = applyToggleGlobalOrnamentExclusion(
      { ornamentExclusions: { global: ["home"] } },
      "couple",
    );
    expect(next.ornamentExclusions.global).toEqual(["home", "couple"]);
  });

  it("menghapus section jika sudah ada", () => {
    const next = applyToggleGlobalOrnamentExclusion(
      { ornamentExclusions: { global: ["home", "couple"] } },
      "home",
    );
    expect(next.ornamentExclusions.global).toEqual(["couple"]);
  });
});

describe("applyPatchOpeningSequenceAsset", () => {
  it("menggabungkan field asset", () => {
    const next = applyPatchOpeningSequenceAsset(
      { widgets: { openingSequence: { asset: { type: "motion" } } } },
      { src: "/opening.mp4", duration: 5 },
    );
    expect(next.widgets.openingSequence.asset).toEqual({
      type: "motion",
      src: "/opening.mp4",
      duration: 5,
    });
  });
});
