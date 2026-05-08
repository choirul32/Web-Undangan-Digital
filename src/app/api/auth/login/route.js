import { NextResponse } from "next/server";
import { isAdminEmail, isAuthConfigured, setAdminSession } from "../../../../lib/auth";
import { createServerSupabaseClient } from "../../../../lib/supabase/server";

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
  }

  if (!isAuthConfigured()) {
    setAdminSession({ email });
    return NextResponse.json({ source: "dev", email });
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  const allowed = await isAdminEmail(data.user.email);

  if (!allowed) {
    return NextResponse.json(
      { error: "Akun ini belum terdaftar sebagai admin aktif" },
      { status: 403 },
    );
  }

  setAdminSession({
    email: data.user.email,
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
  });

  return NextResponse.json({ source: "supabase", email: data.user.email });
}
