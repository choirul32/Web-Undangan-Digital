import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../lib/auth";
import { createServiceSupabaseClient } from "../../../lib/supabase/server";

const BUCKET_NAME = "template-assets";
const MAX_LOGO_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

function hasServiceEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

function mapBank(bank) {
  return {
    id: bank.id,
    name: bank.name,
    logoUrl: bank.logo_url,
    storagePath: bank.storage_path,
  };
}

async function getAdminClient() {
  if (!hasServiceEnv()) {
    return {
      error: NextResponse.json(
        { error: "Production database is not configured" },
        { status: 503 },
      ),
    };
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return {
      error: NextResponse.json(admin.error, { status: 401 }),
    };
  }

  return { supabase: createServiceSupabaseClient() };
}

function validateLogo(file) {
  if (!file || typeof file === "string") {
    return "Logo bank wajib dipilih.";
  }

  if (file.size > MAX_LOGO_SIZE) {
    return "Ukuran logo maksimal 2MB.";
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Logo harus berupa PNG, JPG, WEBP, atau SVG.";
  }

  return "";
}

export async function GET() {
  const client = await getAdminClient();
  if (client.error) {
    return client.error;
  }

  const { data, error } = await client.supabase
    .from("bank_catalog")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ source: "supabase", data: data.map(mapBank) });
}

export async function POST(request) {
  const formData = await request.formData();
  const name = String(formData.get("name") || "").trim();
  const file = formData.get("logo");

  if (!name) {
    return NextResponse.json({ error: "Nama bank wajib diisi." }, { status: 400 });
  }

  const validationError = validateLogo(file);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const client = await getAdminClient();
  if (client.error) {
    return client.error;
  }

  const extension = file.name?.split(".").pop()?.toLowerCase() || "png";
  const storagePath = `platform/banks/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await client.supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrlData } = client.supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath);

  const { data, error } = await client.supabase
    .from("bank_catalog")
    .insert({
      name,
      logo_url: publicUrlData.publicUrl,
      storage_path: storagePath,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ source: "supabase", data: mapBank(data) });
}

export async function DELETE(request) {
  const payload = await request.json();

  if (!payload.id) {
    return NextResponse.json({ error: "Bank id is required" }, { status: 400 });
  }

  const client = await getAdminClient();
  if (client.error) {
    return client.error;
  }

  const { error } = await client.supabase
    .from("bank_catalog")
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", payload.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ source: "supabase", data: { id: payload.id } });
}
