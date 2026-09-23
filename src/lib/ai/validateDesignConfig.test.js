import { describe, expect, it } from "vitest";
import { sanitizeDesignConfig } from "./validateDesignConfig";

describe("sanitizeDesignConfig", () => {
  it("menjaga config kosong tetap punya shape inti", () => {
    const { config, warnings } = sanitizeDesignConfig({});

    expect(config.canvas).toEqual({});
    expect(config.sections).toEqual({});
    expect(config.ornaments).toEqual({});
    expect(config.widgets).toEqual({});
    expect(config.animations).toEqual({});
    expect(warnings.join(" ")).toContain("Widget countdown tidak memiliki variant");
  });

  it("membuang ornament dengan src tidak dikenal", () => {
    const { config } = sanitizeDesignConfig({
      ornaments: {
        home: [{ id: "x", src: "javascript:alert(1)", slot: "top-left" }],
      },
    });

    expect(config.ornaments.home).toEqual([]);
  });

  it("membuang slot yang tidak ada di vocabulary", () => {
    const { config } = sanitizeDesignConfig({
      ornaments: {
        home: [
          { id: "a", src: "/assets/nusantara-songket.svg", slot: "di-langit" },
        ],
      },
    });

    expect(config.ornaments.home[0].slot).toBeUndefined();
  });

  it("membuang section ornaments yang tidak dikenal", () => {
    const { config, warnings } = sanitizeDesignConfig({
      ornaments: {
        "section-tidak-ada": [
          { id: "a", src: "/assets/nusantara-songket.svg", slot: "top-left" },
        ],
      },
    });

    expect(config.ornaments["section-tidak-ada"]).toBeUndefined();
    expect(warnings.some((w) => w.includes("section-tidak-ada"))).toBe(true);
  });

  it("memvalidasi nilai widget terhadap enumerasi", () => {
    const { config } = sanitizeDesignConfig({
      widgets: {
        countdown: { variant: "nuklir" },
        gallery: { variant: "grid", limit: 4 },
      },
    });

    expect(config.widgets.countdown.variant).toBeUndefined();
    expect(config.widgets.gallery.variant).toBe("grid");
  });

  it("memvalidasi font preset section", () => {
    const { config } = sanitizeDesignConfig({
      sections: {
        global: { fontPreset: "comic-sans", backgroundColor: "#fff" },
      },
    });

    expect(config.sections.global.fontPreset).toBeUndefined();
    expect(config.sections.global.backgroundColor).toBe("#fff");
  });

  it("menjaga ornament valid dengan semua properti inti", () => {
    const { config } = sanitizeDesignConfig({
      ornaments: {
        global: [
          {
            id: "songket",
            src: "/assets/nusantara-songket.svg",
            slot: "top-left",
            width: 150,
            opacity: 0.4,
            zIndex: 1,
            animation: "float",
            entrance: "fade-up",
          },
        ],
      },
    });

    expect(config.ornaments.global).toHaveLength(1);
    expect(config.ornaments.global[0].slot).toBe("top-left");
    expect(config.ornaments.global[0].width).toBe(150);
  });

  it("membersihkan canvas.sectionsOrder dari id tak dikenal, sisanya dilengkapi", () => {
    const { config, warnings } = sanitizeDesignConfig({
      canvas: { sectionsOrder: ["gallery", "home", "ngaco", "gallery"] },
    });

    expect(config.canvas.sectionsOrder).not.toContain("ngaco");
    expect(config.canvas.sectionsOrder[0]).toBe("gallery");
    expect(config.canvas.sectionsOrder[1]).toBe("home");
    expect(config.canvas.sectionsOrder).toHaveLength(9);
    expect(warnings.some((w) => w.includes("sectionsOrder"))).toBe(true);
  });

  it("canvas non-object tetap jadi object kosong", () => {
    const { config } = sanitizeDesignConfig({ canvas: "ngaco" });
    expect(config.canvas).toEqual({});
  });
});
