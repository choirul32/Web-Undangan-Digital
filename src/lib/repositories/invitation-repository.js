export async function findInvitationIdBySlug(supabase, slug) {
  return supabase
    .from("invitations")
    .select("id")
    .eq("slug", slug)
    .single();
}

export async function findInvitationBySlug(supabase, slug, select = "*") {
  return supabase
    .from("invitations")
    .select(select)
    .eq("slug", slug)
    .single();
}
