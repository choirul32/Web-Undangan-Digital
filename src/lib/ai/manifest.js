// ============================================================
// Ornament manifest — baca/tulis _ornament_manifest.json di
// Supabase Storage (bucket template-assets). Dipakai bersama oleh
// route upload ornamen dan AI template generator.
// ============================================================

import { createServiceSupabaseClient } from "../supabase/server";

export const ORNAMENT_BUCKET = "template-assets";
export const ORNAMENT_MANIFEST_PATH = "_ornament_manifest.json";

export function hasServiceEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export async function readOrnamentManifest(supabase = null) {
  if (!hasServiceEnv()) {
    return {};
  }

  const client = supabase || createServiceSupabaseClient();
  const { data, error } = await client.storage
    .from(ORNAMENT_BUCKET)
    .download(ORNAMENT_MANIFEST_PATH);

  if (error || !data) {
    return {};
  }

  try {
    return JSON.parse(await data.text());
  } catch {
    return {};
  }
}

export async function writeOrnamentManifest(supabase, manifest) {
  const body = JSON.stringify(manifest, null, 2);
  const { error } = await supabase.storage
    .from(ORNAMENT_BUCKET)
    .upload(ORNAMENT_MANIFEST_PATH, body, {
      contentType: "application/json",
      upsert: true,
    });

  return error;
}

export async function updateOrnamentManifest(supabase, storagePath, data) {
  const manifest = await readOrnamentManifest(supabase);
  manifest[storagePath] = {
    ...(manifest[storagePath] || {}),
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return writeOrnamentManifest(supabase, manifest);
}
