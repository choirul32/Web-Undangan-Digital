import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../lib/auth";
import { createServiceSupabaseClient } from "../../../lib/supabase/server";

function hasServiceEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export async function POST(request) {
  const payload = await request.json();

  if (!payload.slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  if (!payload.theme || typeof payload.theme !== "object") {
    return NextResponse.json({ error: "theme is required" }, { status: 400 });
  }

  if (!hasServiceEnv()) {
    return NextResponse.json({
      source: "sample",
      data: {
        slug: payload.slug,
        theme: payload.theme,
      },
    });
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const { data, error } = await supabase
    .from("invitations")
    .update({ theme_settings: payload.theme })
    .eq("slug", payload.slug)
    .select("id, slug, theme_settings")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    source: "supabase",
    data,
  });
}
