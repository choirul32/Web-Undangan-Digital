import { describe, expect, it } from "vitest";
import { getSectionsOrder, moveSectionInOrder } from "./sectionsOrder";

const DEFAULT_ORDER = [
  "home",
  "couple",
  "acara",
  "countdown",
  "story",
  "gallery",
  "gift",
  "rsvp",
  "doa-ucapan",
];

describe("getSectionsOrder", () => {
  it("config kosong -> urutan default registry", () => {
    expect(getSectionsOrder({})).toEqual(DEFAULT_ORDER);
  });

  it("custom order valid dipakai apa adanya", () => {
    const custom = [
      "home",
      "acara",
      "couple",
      "gallery",
      "countdown",
      "story",
      "gift",
      "rsvp",
      "doa-ucapan",
    ];
    expect(getSectionsOrder({ canvas: { sectionsOrder: custom } })).toEqual(custom);
  });

  it("id tidak dikenal dibuang, duplikat digabung, yang hilang ditambah di belakang", () => {
    const order = getSectionsOrder({
      canvas: { sectionsOrder: ["gallery", "home", "ngaco", "gallery"] },
    });
    expect(order).not.toContain("ngaco");
    expect(order[0]).toBe("gallery");
    expect(order[1]).toBe("home");
    expect([...order].sort()).toEqual([...DEFAULT_ORDER].sort());
  });
});

describe("moveSectionInOrder", () => {
  it("pindah gallery ke depan", () => {
    const next = moveSectionInOrder(DEFAULT_ORDER, "gallery", 0);
    expect(next[0]).toBe("gallery");
    expect(next.length).toBe(DEFAULT_ORDER.length);
  });

  it("index di luar range -> dijepit ke ujung", () => {
    const next = moveSectionInOrder(DEFAULT_ORDER, "home", 99);
    expect(next[next.length - 1]).toBe("home");
  });

  it("section tidak dikenal -> order tidak berubah", () => {
    const next = moveSectionInOrder(DEFAULT_ORDER, "ngaco", 0);
    expect(next).toEqual(DEFAULT_ORDER);
  });
});
