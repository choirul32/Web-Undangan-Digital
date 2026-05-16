export async function findExistingGuestRsvp(supabase, invitationId, guestId) {
  return supabase
    .from("rsvps")
    .select("id")
    .eq("invitation_id", invitationId)
    .eq("guest_id", guestId)
    .maybeSingle();
}

export async function insertOrUpdateRsvp(supabase, rsvpRow, existingRsvpId) {
  const query = existingRsvpId
    ? supabase.from("rsvps").update(rsvpRow).eq("id", existingRsvpId)
    : supabase.from("rsvps").insert(rsvpRow);

  return query.select().single();
}

export async function updateGuestRsvpStatus(supabase, guestId, { attendance, pax }) {
  return supabase
    .from("guests")
    .update({
      rsvp_status: attendance === "hadir" ? "Hadir" : "Tidak Hadir",
      pax,
    })
    .eq("id", guestId);
}
