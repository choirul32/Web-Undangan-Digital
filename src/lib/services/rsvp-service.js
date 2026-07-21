import { findInvitationIdBySlug } from "../repositories/invitation-repository";
import {
  findExistingGuestRsvp,
  insertOrUpdateRsvp,
  updateGuestRsvpStatus,
} from "../repositories/rsvp-repository";

export async function submitRsvp(supabase, payload) {
  const { data: invitation, error: invitationError } = await findInvitationIdBySlug(
    supabase,
    payload.invitationSlug,
  );

  if (invitationError) {
    return { data: null, error: invitationError, status: 404 };
  }

  let guestId = null;
  if (payload.guestSlug) {
    const { data: guest } = await supabase
      .from("guests")
      .select("id")
      .eq("invitation_id", invitation.id)
      .eq("slug", payload.guestSlug)
      .maybeSingle();

    guestId = guest?.id || null;
  }

  const rsvpRow = {
    invitation_id: invitation.id,
    guest_id: guestId,
    guest_name: payload.guestName,
    attendance: payload.attendance,
    pax: payload.pax,
    message: payload.message,
    hidden: false,
  };

  let existingRsvpId = null;
  if (guestId) {
    const { data: existingRsvp } = await findExistingGuestRsvp(
      supabase,
      invitation.id,
      guestId,
    );
    existingRsvpId = existingRsvp?.id || null;
  }

  const { data, error } = await insertOrUpdateRsvp(
    supabase,
    rsvpRow,
    existingRsvpId,
  );

  if (error) {
    return { data: null, error, status: 500 };
  }

  if (guestId) {
    await updateGuestRsvpStatus(supabase, guestId, {
      attendance: payload.attendance,
      pax: payload.pax,
    });
  }

  return { data, error: null, status: 200 };
}
