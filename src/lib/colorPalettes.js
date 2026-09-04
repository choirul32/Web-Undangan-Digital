// ============================================================
// Color Palettes — helper server: daftar palet = preset statis
// (config.js) + palet custom dari tabel Supabase `color_palettes`.
// Dipakai route API palet & AI template generator (system prompt).
// ============================================================

import { colorPalettePresets } from "../components/dashboard/config";
import { createServiceSupabaseClient } from "./supabase/server";
import { ensureContrast, isHexColor, slugifyPaletteId } from "./colorUtils";

const COLOR_KEYS = ["primary", "accent", "text", "bg", "surface"];

function hasServiceEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

function mapPaletteRow(row) {
  return {
    id: row.palette_id,
    label: row.label,
    description: row.description || "",
    colors: row.colors || {},
    source: "custom",
    createdAt: row.created_at,
  };
}

// ---- Baca palet custom dari DB ----
export async function getCustomColorPalettes() {
  if (!hasServiceEnv()) {
    return [];
  }

  try {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from("color_palettes")
      .select("palette_id, label, description, colors, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[color-palettes] query failed:", error.message);
      return [];
    }

    return (data || []).map(mapPaletteRow);
  } catch {
    return [];
  }
}

// ---- Daftar lengkap: preset statis + custom ----
export async function getAllColorPalettes() {
  const custom = await getCustomColorPalettes();
  const presets = colorPalettePresets.map((palette) => ({
    id: palette.id,
    label: palette.label,
    description: palette.description || "",
    colors: palette.colors || {},
    source: "preset",
  }));

  return [...presets, ...custom];
}

// ---- Ambil satu palet (preset atau custom) by id ----
export async function getColorPaletteById(paletteId) {
  const all = await getAllColorPalettes();
  return all.find((palette) => palette.id === paletteId) || null;
}

// ---- Validasi + normalisasi input palet (client & AI) ----
export function normalizePaletteInput(input = {}) {
  const label = String(input.label || "").trim();
  if (!label) {
    return { error: "Label palet wajib diisi." };
  }

  const rawColors = input.colors && typeof input.colors === "object" ? input.colors : {};
  const { colors, warnings } = ensureContrast(rawColors);

  // Semua 5 warna inti wajib valid hex.
  const missing = COLOR_KEYS.filter((key) => !isHexColor(colors[key]));
  if (missing.length) {
    return { error: `Warna ${missing.join(", ")} belum valid (format hex #rrggbb).` };
  }

  return {
    data: {
      paletteId: slugifyPaletteId(input.paletteId || input.id || label),
      label,
      description: String(input.description || "").trim(),
      colors,
    },
    warnings,
  };
}

// ---- Simpan palet custom (upsert by palette_id) ----
export async function persistCustomPalette({ paletteId, label, description, colors }) {
  if (!hasServiceEnv()) {
    return { data: null, error: "Production database is not configured" };
  }

  const supabase = createServiceSupabaseClient();
  const { data, error } = await supabase
    .from("color_palettes")
    .upsert(
      {
        palette_id: paletteId,
        label,
        description: description || "",
        colors,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "palette_id" },
    )
    .select("palette_id, label, description, colors, created_at")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: mapPaletteRow(data), error: null };
}

// ---- Hapus palet custom by palette_id ----
export async function deleteCustomPalette(paletteId) {
  if (!hasServiceEnv()) {
    return { error: "Production database is not configured" };
  }

  const supabase = createServiceSupabaseClient();
  const { error } = await supabase
    .from("color_palettes")
    .delete()
    .eq("palette_id", paletteId);

  return { error: error?.message || null };
}
