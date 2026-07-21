import { NextResponse } from "next/server";
import { getInvitationBySlug } from "../../../../../lib/invitations";

// Always reflect the latest published data.
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(_request, { params }) {
  const invitation = await getInvitationBySlug(params.slug);

  if (!invitation) {
    return NextResponse.json(
      { error: "Published invitation not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    source: "supabase",
    data: invitation,
  });
}
