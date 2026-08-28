import { describe, expect, it } from "vitest";
import {
  buildGuestUrl,
  createGuestSlug,
  fallbackGuestFromSlug,
  guestNameFromQuery,
} from "./guestLinks";

describe("createGuestSlug", () => {
  it("mengubah nama jadi slug lowercase dengan dash", () => {
    expect(createGuestSlug("Bapak Andi Wijaya")).toBe("bapak-andi-wijaya");
    expect(createGuestSlug("  Irul  ")).toBe("irul");
  });

  it("mengganti & dengan 'dan'", () => {
    expect(createGuestSlug("Budi & Sari")).toBe("budi-dan-sari");
  });

  it("membuang karakter non alfanumerik", () => {
    expect(createGuestSlug("Dewi's Family")).toBe("dewi-s-family");
    expect(createGuestSlug("Ayu, SE")).toBe("ayu-se");
  });

  it("menghasilkan slug kosong untuk nama kosong", () => {
    expect(createGuestSlug("")).toBe("");
    expect(createGuestSlug(undefined)).toBe("");
  });
});

describe("buildGuestUrl", () => {
  it("membangun URL slug-based tanpa origin", () => {
    expect(buildGuestUrl("dimas-salsa", "bapak-andi")).toBe(
      "/dimas-salsa/to/bapak-andi",
    );
  });

  it("encode guestSlug", () => {
    expect(buildGuestUrl("dimas-salsa", "bapak andi")).toBe(
      "/dimas-salsa/to/bapak%20andi",
    );
  });
});

describe("guestNameFromQuery", () => {
  it("decode nilai ?to= dengan benar", () => {
    expect(guestNameFromQuery("Bapak%20Andi")).toBe("Bapak Andi");
  });

  it("mengganti + dengan spasi", () => {
    expect(guestNameFromQuery("Bapak+Andi")).toBe("Bapak Andi");
  });

  it("menangani array (searchParams bisa array)", () => {
    expect(guestNameFromQuery(["Andi", "Budi"])).toBe("Andi");
  });

  it("menangani string tak ter-decode", () => {
    expect(guestNameFromQuery("100%25")).toBe("100%");
  });
});

describe("fallbackGuestFromSlug", () => {
  it("mengubah slug jadi nama Title Case", () => {
    expect(fallbackGuestFromSlug("bapak-andi-wijaya")).toEqual({
      name: "Bapak Andi Wijaya",
      slug: "bapak-andi-wijaya",
    });
  });

  it("menangani underscore juga", () => {
    expect(fallbackGuestFromSlug("budi_sari")).toEqual({
      name: "Budi Sari",
      slug: "budi_sari",
    });
  });

  it("mengembalikan null untuk slug kosong", () => {
    expect(fallbackGuestFromSlug("")).toBeNull();
    expect(fallbackGuestFromSlug(undefined)).toBeNull();
  });
});
