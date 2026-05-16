import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../../lib/auth";
import { createServiceSupabaseClient } from "../../../../lib/supabase/server";

export const dynamic = "force-dynamic";

function hasServiceEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export async function GET() {
  if (!hasServiceEnv()) {
    return NextResponse.json({
      source: "sample",
      data: {
        status: "degraded",
        database: "not_configured",
        auth: "dev",
        checkedAt: new Date().toISOString(),
      },
    });
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const startedAt = Date.now();
  const supabase = createServiceSupabaseClient();
  const { error } = await supabase
    .from("invitations")
    .select("id", { count: "exact", head: true })
    .limit(1);

  const latencyMs = Date.now() - startedAt;

  return NextResponse.json({
    source: "supabase",
    data: {
      status: error ? "degraded" : "ok",
      database: error ? "error" : "ok",
      auth: "ok",
      latencyMs,
      error: error?.message,
      checkedAt: new Date().toISOString(),
    },
  }, { status: error ? 500 : 200 });
}
