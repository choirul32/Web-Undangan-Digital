import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../lib/auth";
import { createServiceSupabaseClient } from "../../../lib/supabase/server";

function hasServiceEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

async function getInvitation(supabase, slug) {
  const { data } = await supabase
    .from("invitations")
    .select("id")
    .eq("slug", slug)
    .single();

  return data;
}

function mapAccount(account) {
  return {
    id: account.id,
    bank: account.bank,
    accountName: account.account_name,
    accountNumber: account.account_number,
    name: account.account_name,
    number: account.account_number,
    sortOrder: account.sort_order,
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const invitationSlug = searchParams.get("invitationSlug") || "";

  if (!invitationSlug) {
    return NextResponse.json({ error: "invitationSlug is required" }, { status: 400 });
  }

  if (!hasServiceEnv()) {
    return NextResponse.json(
      { error: "Production database is not configured" },
      { status: 503 },
    );
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const invitation = await getInvitation(supabase, invitationSlug);

  if (!invitation) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("bank_accounts")
    .select("*")
    .eq("invitation_id", invitation.id)
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ source: "supabase", data: data.map(mapAccount) });
}

export async function POST(request) {
  const payload = await request.json();

  if (!payload.invitationSlug || !payload.bank || !payload.accountName || !payload.accountNumber) {
    return NextResponse.json(
      { error: "invitationSlug, bank, accountName, and accountNumber are required" },
      { status: 400 },
    );
  }

  if (!hasServiceEnv()) {
    return NextResponse.json(
      { error: "Production database is not configured" },
      { status: 503 },
    );
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const invitation = await getInvitation(supabase, payload.invitationSlug);

  if (!invitation) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("bank_accounts")
    .insert({
      invitation_id: invitation.id,
      bank: payload.bank,
      account_name: payload.accountName,
      account_number: payload.accountNumber,
      sort_order: payload.sortOrder || Math.floor(Date.now() / 1000),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ source: "supabase", data: mapAccount(data) });
}

export async function PUT(request) {
  const payload = await request.json();

  if (!payload.invitationSlug || !payload.id || !payload.bank || !payload.accountName || !payload.accountNumber) {
    return NextResponse.json(
      { error: "invitationSlug, id, bank, accountName, and accountNumber are required" },
      { status: 400 },
    );
  }

  if (!hasServiceEnv()) {
    return NextResponse.json(
      { error: "Production database is not configured" },
      { status: 503 },
    );
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const invitation = await getInvitation(supabase, payload.invitationSlug);

  if (!invitation) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("bank_accounts")
    .update({
      bank: payload.bank,
      account_name: payload.accountName,
      account_number: payload.accountNumber,
      sort_order: payload.sortOrder || 0,
    })
    .eq("id", payload.id)
    .eq("invitation_id", invitation.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ source: "supabase", data: mapAccount(data) });
}

export async function DELETE(request) {
  const payload = await request.json();

  if (!payload.invitationSlug || !payload.id) {
    return NextResponse.json({ error: "invitationSlug and id are required" }, { status: 400 });
  }

  if (!hasServiceEnv()) {
    return NextResponse.json(
      { error: "Production database is not configured" },
      { status: 503 },
    );
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const invitation = await getInvitation(supabase, payload.invitationSlug);

  if (!invitation) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("bank_accounts")
    .delete()
    .eq("id", payload.id)
    .eq("invitation_id", invitation.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ source: "supabase", data: { id: payload.id } });
}
