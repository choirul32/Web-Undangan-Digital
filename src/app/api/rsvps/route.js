import { NextResponse } from "next/server";
import { sampleInvitation } from "../../../data/sampleInvitation";
import { requireAdminApiSession } from "../../../lib/auth";
import { createServiceSupabaseClient } from "../../../lib/supabase/server";
import { fail, ok } from "../../../lib/api-response";
import { logApiError } from "../../../lib/api-logger";
import { validateRsvpPayload } from "../../../lib/api-validation";
import { checkRateLimit, getClientIp } from "../../../lib/rate-limit";
import { submitRsvp } from "../../../lib/services/rsvp-service";

function hasServiceEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

function mapRsvp(item) {
  return {
    id: item.id,
    guestId: item.guest_id,
    guestName: item.guest_name,
    attendance: item.attendance,
    pax: item.pax,
    message: item.message,
    createdAt: item.created_at,
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const invitationSlug = searchParams.get("invitationSlug") || "dimas-salsa";

  if (!hasServiceEnv()) {
    return NextResponse.json({
      source: "sample",
      data: sampleInvitation.slug === invitationSlug ? sampleInvitation.rsvps : [],
    });
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const { data: invitation, error: invitationError } = await supabase
    .from("invitations")
    .select("id")
    .eq("slug", invitationSlug)
    .single();

  if (invitationError) {
    return NextResponse.json({ error: invitationError.message }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("rsvps")
    .select("*")
    .eq("invitation_id", invitation.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    data: data.map(mapRsvp),
  });
}

export async function POST(request) {
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`rsvp:${clientIp}`, {
    limit: 12,
    windowMs: 60_000,
  });

  if (!rateLimit.allowed) {
    return fail("Terlalu banyak percobaan RSVP. Coba lagi sebentar.", {
      status: 429,
      code: "rate_limited",
      details: [`Reset at ${new Date(rateLimit.resetAt).toISOString()}`],
    });
  }

  let payload = {};

  try {
    payload = await request.json();
  } catch (error) {
    logApiError("rsvps.post.parse", error);
    return fail("Body JSON tidak valid.", {
      status: 400,
      code: "invalid_json",
    });
  }

  const validation = validateRsvpPayload(payload);

  if (!validation.valid) {
    return fail("Payload RSVP tidak valid.", {
      status: 400,
      code: "validation_error",
      details: validation.errors,
    });
  }

  const safePayload = validation.value;

  if (!hasServiceEnv()) {
    return ok(
      {
        guestName: safePayload.guestName,
        attendance: safePayload.attendance,
        pax: safePayload.pax,
        message: safePayload.message,
        createdAt: new Date().toISOString(),
      },
      { source: "sample" },
    );
  }

  try {
    const supabase = createServiceSupabaseClient();
    const { data, error, status } = await submitRsvp(supabase, safePayload);

    if (error) {
      logApiError("rsvps.post.persist", error, {
        invitationSlug: safePayload.invitationSlug,
        guestSlug: safePayload.guestSlug,
      });
      return fail(error.message, {
        status,
        code: status === 404 ? "not_found" : "database_error",
      });
    }

    return ok(mapRsvp(data));
  } catch (error) {
    logApiError("rsvps.post.unhandled", error, {
      invitationSlug: safePayload.invitationSlug,
      guestSlug: safePayload.guestSlug,
    });
    return fail("RSVP gagal diproses.", { status: 500, code: "internal_error" });
  }
}
