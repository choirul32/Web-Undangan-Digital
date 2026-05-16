import { createServerSupabaseClient } from "./supabase/server";
import { sampleInvitation } from "../data/sampleInvitation";

function sortByOrder(items = []) {
  return [...items].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
}

export function mapSupabaseInvitation(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    slug: row.slug,
    templateId: row.template_id,
    status: row.status,
    package: row.package,
    order: {
      status: row.order_status || "inquiry",
      paymentStatus: row.payment_status || "unpaid",
      customerName: row.customer_name,
      customerWhatsapp: row.customer_whatsapp,
      amount: row.order_amount,
      deadline: row.order_deadline,
      conceptNotes: row.concept_notes,
      paymentNotes: row.payment_notes,
      paidAt: row.paid_at,
    },
    couple: {
      groomName: row.groom_name,
      groomNickname: row.groom_nickname,
      brideName: row.bride_name,
      brideNickname: row.bride_nickname,
      quote: row.quote,
    },
    events: sortByOrder(row.invitation_events || []).map((event) => ({
      title: event.title,
      date: event.event_date,
      time: event.event_time,
      venue: event.venue,
      address: event.address,
      mapsUrl: event.maps_url,
    })),
    story: sortByOrder(row.invitation_stories || []).map((story) => ({
      year: story.year,
      title: story.title,
      desc: story.description,
    })),
    gallery: sortByOrder(row.invitation_media || [])
      .filter((media) => media.media_type === "image")
      .map((media) => media.url),
    coverImage:
      sortByOrder(row.invitation_media || []).find((media) => media.media_type === "cover")
        ?.url || null,
    musicUrl:
      sortByOrder(row.invitation_media || []).find((media) => media.media_type === "music")
        ?.url || null,
    bankAccounts: sortByOrder(row.bank_accounts || []).map((account) => ({
      bank: account.bank,
      name: account.account_name,
      number: account.account_number,
    })),
    guests: (row.guests || []).map((guest) => ({
      id: guest.id,
      name: guest.name,
      slug: guest.slug,
      group: guest.guest_group,
      phone: guest.phone,
      rsvpStatus: guest.rsvp_status,
      pax: guest.pax,
    })),
    features: row.features || {},
  };
}

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function getInvitationBySlug(slug) {
  if (!hasSupabaseEnv()) {
    return sampleInvitation.slug === slug ? sampleInvitation : null;
  }

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("invitations")
    .select(
      `
      *,
      invitation_events (*),
      invitation_stories (*),
      invitation_media (*),
      bank_accounts (*),
      guests (*)
    `,
    )
    .eq("slug", slug)
    .single();

  if (error) {
    return sampleInvitation.slug === slug ? sampleInvitation : null;
  }

  return mapSupabaseInvitation(data);
}

export async function getInvitationAndGuest(slug, guestSlug) {
  const invitation = await getInvitationBySlug(slug);

  if (!invitation) {
    return { invitation: null, guest: null };
  }

  const guest = invitation.guests?.find((item) => item.slug === guestSlug) || null;

  return { invitation, guest };
}

export function mapInvitationListItem(row) {
  return {
    id: row.id,
    couple: `${row.groom_nickname || row.groom_name || "Mempelai"} & ${
      row.bride_nickname || row.bride_name || "Mempelai"
    }`,
    slug: row.slug,
    template: row.template_id,
    category: row.template_id,
    status: row.status,
    orderStatus: row.order_status || "inquiry",
    paymentStatus: row.payment_status || "unpaid",
    customerName: row.customer_name,
    customerWhatsapp: row.customer_whatsapp,
    date: row.created_at ? new Date(row.created_at).toLocaleDateString("id-ID") : "-",
    rsvp: 0,
    package: row.package,
  };
}

export function formPayloadToInvitationRow(payload) {
  return {
    slug: payload.slug,
    template_id: payload.templateId || "standard",
    package: payload.package || "Premium",
    status: payload.status || "draft",
    order_status: payload.orderStatus || "inquiry",
    payment_status: payload.paymentStatus || "unpaid",
    customer_name: payload.customerName || null,
    customer_whatsapp: payload.customerWhatsapp || null,
    order_amount: payload.orderAmount ? Number(payload.orderAmount) : null,
    order_deadline: payload.orderDeadline || null,
    concept_notes: payload.conceptNotes || null,
    payment_notes: payload.paymentNotes || null,
    paid_at:
      payload.paymentStatus === "paid"
        ? payload.paidAt || new Date().toISOString()
        : null,
    groom_name: payload.groomName,
    groom_nickname: payload.groomNickname,
    bride_name: payload.brideName,
    bride_nickname: payload.brideNickname,
    quote: payload.quote,
    features: {
      rsvp: Boolean(payload.rsvp),
      gift: Boolean(payload.gift),
      music: Boolean(payload.music),
      guestName: Boolean(payload.guestName),
    },
  };
}
