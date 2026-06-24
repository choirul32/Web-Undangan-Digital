import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../lib/auth";
import { createServiceSupabaseClient } from "../../../lib/supabase/server";

const DEFAULT_SETTINGS = {
  brandName: "Nusa Event Organizer",
  adminWhatsapp: "6281234567890",
  contactEmail: "hello@nusaevent.com",
  domain: "nustainvite.com",
  defaultPackage: "Premium",
  defaultTemplateThumbnail: "/assets/CoverPasangan.png",
  defaultGroomPhoto: "/assets/catin_pria.jpg",
  defaultBridePhoto: "/assets/catin_wanita.jpg",
  features: {
    music: "active",
    rsvp: "active",
    gift: "active",
    guestName: "active",
    emailGateway: "active",
    whatsappApi: "active",
  },
  packagePrices: {
    basic: "Rp 45.000",
    premium: "Rp 90.000",
    exclusive: "Rp 149.000",
  },
};

export async function GET() {
  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  try {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from("platform_settings")
      .select("value")
      .eq("key", "platform")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const settings = data?.value || DEFAULT_SETTINGS;
    return NextResponse.json({ data: settings });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  try {
    const body = await request.json();
    const settings = body.settings;
    if (!settings) {
      return NextResponse.json({ error: "settings object is required" }, { status: 400 });
    }

    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from("platform_settings")
      .upsert(
        { key: "platform", value: settings, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      )
      .select("value")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data.value });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
