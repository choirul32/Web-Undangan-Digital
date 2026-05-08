import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAIL_COOKIE = "nusa_admin_email";
const ACCESS_TOKEN_COOKIE = "nusa_admin_access_token";
const REFRESH_TOKEN_COOKIE = "nusa_admin_refresh_token";

export function isAuthConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function isServiceConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

function createAnonClient(accessToken) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: accessToken
        ? {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        : undefined,
    },
  );
}

function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

export async function isAdminEmail(email) {
  if (!isServiceConfigured()) {
    return false;
  }

  const service = createServiceClient();
  const { data, error } = await service
    .from("admin_users")
    .select("id")
    .eq("email", email)
    .eq("is_active", true)
    .maybeSingle();

  return !error && Boolean(data);
}

export async function getAdminSession() {
  if (!isAuthConfigured()) {
    return {
      mode: "dev",
      email: "dev-admin@nustainvite.local",
    };
  }

  if (!isServiceConfigured()) {
    return null;
  }

  const cookieStore = cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const emailCookie = cookieStore.get(ADMIN_EMAIL_COOKIE)?.value;

  if (!accessToken || !emailCookie) {
    return null;
  }

  const supabase = createAnonClient(accessToken);
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user?.email) {
    return null;
  }

  const allowed = await isAdminEmail(data.user.email);

  if (!allowed) {
    return null;
  }

  return {
    mode: "supabase",
    email: data.user.email,
    userId: data.user.id,
  };
}

export function setAdminSession({ email, accessToken, refreshToken }) {
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };

  cookies().set(ADMIN_EMAIL_COOKIE, email, cookieOptions);

  if (accessToken) {
    cookies().set(ACCESS_TOKEN_COOKIE, accessToken, cookieOptions);
  }

  if (refreshToken) {
    cookies().set(REFRESH_TOKEN_COOKIE, refreshToken, cookieOptions);
  }
}

export function clearAdminSession() {
  cookies().delete(ADMIN_EMAIL_COOKIE);
  cookies().delete(ACCESS_TOKEN_COOKIE);
  cookies().delete(REFRESH_TOKEN_COOKIE);
}

export async function requireAdminApiSession() {
  const session = await getAdminSession();

  if (!session) {
    return {
      session: null,
      error: { error: "Unauthorized admin session" },
    };
  }

  return { session, error: null };
}
