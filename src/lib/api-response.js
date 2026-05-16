import { NextResponse } from "next/server";

export function ok(data, { source = "supabase", status = 200, meta } = {}) {
  return NextResponse.json(
    {
      success: true,
      source,
      data,
      ...(meta ? { meta } : {}),
    },
    { status },
  );
}

export function fail(error, { status = 400, code = "bad_request", details } = {}) {
  return NextResponse.json(
    {
      success: false,
      error,
      code,
      ...(details ? { details } : {}),
    },
    { status },
  );
}
