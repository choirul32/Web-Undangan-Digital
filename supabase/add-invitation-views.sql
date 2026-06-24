-- Per-visit event log for invitation analytics (daily trend, peak hours, guest open tracking).
-- The aggregate columns invitations.view_count / last_viewed_at are kept for backward compatibility;
-- this table powers the richer "Statistik" dashboard.

create table if not exists public.invitation_views (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  guest_id uuid references public.guests(id) on delete set null,
  guest_slug text,
  viewed_at timestamptz not null default now()
);

create index if not exists invitation_views_invitation_idx
  on public.invitation_views (invitation_id, viewed_at desc);

create index if not exists invitation_views_guest_idx
  on public.invitation_views (guest_id);

-- Rows are written and read exclusively via the service-role key on the server,
-- so RLS stays enabled with no public policy (no anon access).
alter table public.invitation_views enable row level security;
