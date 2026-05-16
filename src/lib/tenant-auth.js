export const tenantRoles = ["owner", "admin", "editor", "viewer"];

export const roleCapabilities = {
  owner: [
    "tenant.manage",
    "member.invite",
    "invitation.write",
    "invitation.publish",
    "template.write",
    "guest.export",
    "billing.manage",
  ],
  admin: [
    "member.invite",
    "invitation.write",
    "invitation.publish",
    "template.write",
    "guest.export",
  ],
  editor: ["invitation.write", "template.write", "guest.export"],
  viewer: ["invitation.read", "template.read", "guest.read"],
};

export function canRole(role, capability) {
  return Boolean(roleCapabilities[role]?.includes(capability));
}

export async function getTenantMembership(supabase, { tenantId, userId, email }) {
  if (!tenantId || (!userId && !email)) {
    return { data: null, error: new Error("tenantId and user identity are required") };
  }

  let query = supabase
    .from("tenant_members")
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("status", "active");

  query = userId ? query.eq("user_id", userId) : query.eq("email", email);

  return query.maybeSingle();
}

export async function requireTenantCapability(
  supabase,
  { tenantId, userId, email, capability },
) {
  const { data, error } = await getTenantMembership(supabase, {
    tenantId,
    userId,
    email,
  });

  if (error || !data || !canRole(data.role, capability)) {
    return {
      allowed: false,
      membership: data || null,
      error: error || new Error("Forbidden tenant capability"),
    };
  }

  return { allowed: true, membership: data, error: null };
}
