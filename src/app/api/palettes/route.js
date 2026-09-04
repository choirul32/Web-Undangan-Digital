import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../lib/auth";
import {
  deleteCustomPalette,
  getCustomColorPalettes,
  normalizePaletteInput,
  persistCustomPalette,
} from "../../../lib/colorPalettes";

export async function GET() {
  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const palettes = await getCustomColorPalettes();

  return NextResponse.json({
    source: "supabase",
    data: palettes,
  });
}

export async function POST(request) {
  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const normalized = normalizePaletteInput(payload);
  if (normalized.error) {
    return NextResponse.json({ error: normalized.error }, { status: 400 });
  }

  const { data, error } = await persistCustomPalette(normalized.data);
  if (error) {
    const isConfigError = error === "Production database is not configured";
    return NextResponse.json({ error }, { status: isConfigError ? 503 : 500 });
  }

  return NextResponse.json({
    source: "supabase",
    data,
    warnings: normalized.warnings || [],
  });
}

export async function DELETE(request) {
  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const paletteId = String(payload.paletteId || payload.id || "").trim();
  if (!paletteId) {
    return NextResponse.json({ error: "paletteId is required" }, { status: 400 });
  }

  const { error } = await deleteCustomPalette(paletteId);
  if (error) {
    const isConfigError = error === "Production database is not configured";
    return NextResponse.json({ error }, { status: isConfigError ? 503 : 500 });
  }

  return NextResponse.json({ source: "supabase", data: { id: paletteId } });
}
