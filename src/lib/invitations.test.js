import { describe, expect, it } from "vitest";
import { mapGuest, mapInvitationListItem, mapSupabaseInvitation } from "./invitations";

describe("mapGuest", () => {
  it("memetakan row snake_case ke model UI camelCase", () => {
    const guest = mapGuest({
      id: "g1",
      name: "Budi",
      slug: "budi",
      guest_group: "teman",
      phone: "0812",
      rsvp_status: "Hadir",
      pax: 2,
    });
    expect(guest).toEqual({
      id: "g1",
      name: "Budi",
      slug: "budi",
      group: "teman",
      phone: "0812",
      rsvpStatus: "Hadir",
      pax: 2,
    });
  });

  it("menangani row tanpa field optional", () => {
    const guest = mapGuest({ id: "g2", name: "Siti", slug: "siti" });
    expect(guest).toEqual({
      id: "g2",
      name: "Siti",
      slug: "siti",
      group: undefined,
      phone: undefined,
      rsvpStatus: undefined,
      pax: undefined,
    });
  });
});

describe("mapInvitationListItem", () => {
  const row = {
    id: "inv-1",
    slug: "dimas-salsa",
    template_id: "royal-emerald",
    groom_name: "Dimas",
    groom_nickname: "Dimas",
    bride_name: "Salsa",
    bride_nickname: "Salsa",
    status: "published",
    order_status: "paid",
    payment_status: "paid",
    customer_name: "Dimas",
    customer_whatsapp: "0812",
    created_at: "2026-01-01T00:00:00Z",
    package: "Premium",
    view_count: 5,
    last_viewed_at: "2026-01-02T00:00:00Z",
  };

  it("memetakan row ke list item tanpa field rsvp palsu", () => {
    const item = mapInvitationListItem(row, new Map());
    expect(item).toMatchObject({
      id: "inv-1",
      slug: "dimas-salsa",
      templateId: "royal-emerald",
      status: "published",
      orderStatus: "paid",
      paymentStatus: "paid",
      viewCount: 5,
    });
    expect(item).not.toHaveProperty("rsvp");
  });

  it("memakai nama template dari lookup", () => {
    const templateLookup = new Map([
      ["royal-emerald", { name: "Royal Emerald", category: "Premium" }],
    ]);
    const item = mapInvitationListItem(row, templateLookup);
    expect(item.template).toBe("Royal Emerald");
    expect(item.category).toBe("Premium");
  });

  it("menangani row tanpa created_at", () => {
    const item = mapInvitationListItem({ ...row, created_at: null }, new Map());
    expect(item.date).toBe("-");
  });
});

describe("mapSupabaseInvitation", () => {
  it("memetakan nested relasi dengan benar", () => {
    const row = {
      id: "inv-1",
      slug: "dimas-salsa",
      template_id: "royal-emerald",
      status: "published",
      package: "Premium",
      order_status: "paid",
      payment_status: "paid",
      customer_name: "Dimas",
      couple_name: "test",
      groom_name: "Dimas",
      groom_nickname: "Dimas",
      bride_name: "Salsa",
      bride_nickname: "Salsa",
      features: { rsvp: true, gift: true, music: true },
      invitation_media: [
        { media_type: "cover", url: "/cover.jpg", sort_order: 1 },
        { media_type: "image", url: "/g1.jpg", sort_order: 2 },
        { media_type: "image", url: "/g2.jpg", sort_order: 1 },
        { media_type: "music", url: "/music.mp3", sort_order: 1 },
      ],
      invitation_events: [{ title: "Akad", event_date: "2026-01-01", sort_order: 1 }],
      invitation_stories: [{ year: "2021", title: "Awal", description: "desc", sort_order: 1 }],
      bank_accounts: [{ bank: "BCA", account_name: "Dimas", account_number: "123", sort_order: 1 }],
      guests: [
        { id: "g1", name: "Budi", slug: "budi", guest_group: "teman", rsvp_status: "Hadir", pax: 2 },
      ],
    };

    const invitation = mapSupabaseInvitation(row, null, new Map(), {});
    expect(invitation.gallery).toEqual(["/g2.jpg", "/g1.jpg"]);
    expect(invitation.coverImage).toBe("/cover.jpg");
    expect(invitation.musicUrl).toBe("/music.mp3");
    expect(invitation.guests[0]).toEqual(
      mapGuest({
        id: "g1",
        name: "Budi",
        slug: "budi",
        guest_group: "teman",
        rsvp_status: "Hadir",
        pax: 2,
      }),
    );
    expect(invitation.features).toEqual({ rsvp: true, gift: true, music: true });
  });

  it("mengembalikan null untuk row kosong", () => {
    expect(mapSupabaseInvitation(null)).toBeNull();
  });
});
