-- Phase 2 SaaS baseline migration.
-- Safe pattern: create new tables, add nullable tenant_id, backfill to a default tenant,
-- then enable tenant-aware policies. Review before running in production.

create extension if not exists "pgcrypto";

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  owner_user_id uuid,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tenant_members (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid,
  email text not null,
  role text not null check (role in ('owner', 'admin', 'editor', 'viewer')),
  status text not null default 'active',
  invited_at timestamptz,
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tenant_id, email)
);

create table if not exists public.plans (
  id text primary key,
  name text not null,
  price_monthly numeric(12,2) not null default 0,
  quotas jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  plan_id text not null references public.plans(id),
  state text not null check (state in ('trial', 'active', 'grace', 'suspended', 'canceled')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.usage_counters (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  metric text not null,
  period_key text not null,
  value int not null default 0,
  updated_at timestamptz not null default now(),
  unique (tenant_id, metric, period_key)
);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete set null,
  provider text not null,
  event_id text not null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (provider, event_id)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete set null,
  actor_user_id uuid,
  actor_email text,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  status text not null default 'queued' check (status in ('queued', 'running', 'succeeded', 'failed', 'cancelled')),
  priority int not null default 5,
  payload jsonb not null default '{}'::jsonb,
  run_after timestamptz not null default now(),
  attempts int not null default 0,
  last_error text,
  locked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.plans (id, name, price_monthly, quotas)
values
  ('manual-starter', 'Manual Starter', 0, '{"invitationsPerMonth":20,"activePublishedInvitations":20,"storageMb":512,"templates":10}'::jsonb),
  ('studio', 'Studio', 149000, '{"invitationsPerMonth":100,"activePublishedInvitations":100,"storageMb":5120,"templates":50}'::jsonb)
on conflict (id) do update
set name = excluded.name,
    price_monthly = excluded.price_monthly,
    quotas = excluded.quotas;

insert into public.tenants (name, slug, status)
values ('Default Workspace', 'default-workspace', 'active')
on conflict (slug) do nothing;

alter table public.invitations add column if not exists tenant_id uuid references public.tenants(id);
alter table public.templates add column if not exists tenant_id uuid references public.tenants(id);
alter table public.guests add column if not exists tenant_id uuid references public.tenants(id);
alter table public.rsvps add column if not exists tenant_id uuid references public.tenants(id);
alter table public.invitation_events add column if not exists tenant_id uuid references public.tenants(id);
alter table public.invitation_stories add column if not exists tenant_id uuid references public.tenants(id);
alter table public.invitation_media add column if not exists tenant_id uuid references public.tenants(id);
alter table public.bank_accounts add column if not exists tenant_id uuid references public.tenants(id);

update public.invitations
set tenant_id = (select id from public.tenants where slug = 'default-workspace')
where tenant_id is null;

update public.templates
set tenant_id = (select id from public.tenants where slug = 'default-workspace')
where tenant_id is null;

update public.guests g
set tenant_id = i.tenant_id
from public.invitations i
where g.invitation_id = i.id and g.tenant_id is null;

update public.rsvps r
set tenant_id = i.tenant_id
from public.invitations i
where r.invitation_id = i.id and r.tenant_id is null;

update public.invitation_events e
set tenant_id = i.tenant_id
from public.invitations i
where e.invitation_id = i.id and e.tenant_id is null;

update public.invitation_stories s
set tenant_id = i.tenant_id
from public.invitations i
where s.invitation_id = i.id and s.tenant_id is null;

update public.invitation_media m
set tenant_id = i.tenant_id
from public.invitations i
where m.invitation_id = i.id and m.tenant_id is null;

update public.bank_accounts b
set tenant_id = i.tenant_id
from public.invitations i
where b.invitation_id = i.id and b.tenant_id is null;

create index if not exists tenants_slug_idx on public.tenants(slug);
create index if not exists tenant_members_tenant_user_idx on public.tenant_members(tenant_id, user_id);
create index if not exists invitations_tenant_id_idx on public.invitations(tenant_id);
create index if not exists templates_tenant_id_idx on public.templates(tenant_id);
create index if not exists guests_tenant_id_idx on public.guests(tenant_id);
create index if not exists rsvps_tenant_id_idx on public.rsvps(tenant_id);
create index if not exists audit_logs_tenant_created_idx on public.audit_logs(tenant_id, created_at desc);

alter table public.tenants enable row level security;
alter table public.tenant_members enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage_counters enable row level security;
alter table public.payment_events enable row level security;
alter table public.audit_logs enable row level security;
alter table public.jobs enable row level security;

create policy "Members can read their tenants"
on public.tenants for select
using (
  exists (
    select 1 from public.tenant_members tm
    where tm.tenant_id = tenants.id
      and tm.user_id = auth.uid()
      and tm.status = 'active'
  )
);

create policy "Members can read tenant membership"
on public.tenant_members for select
using (
  user_id = auth.uid()
  or exists (
    select 1 from public.tenant_members tm
    where tm.tenant_id = tenant_members.tenant_id
      and tm.user_id = auth.uid()
      and tm.status = 'active'
      and tm.role in ('owner', 'admin')
  )
);

create policy "Public can read active plans"
on public.plans for select
using (is_active = true);

create policy "Members can read subscriptions"
on public.subscriptions for select
using (
  exists (
    select 1 from public.tenant_members tm
    where tm.tenant_id = subscriptions.tenant_id
      and tm.user_id = auth.uid()
      and tm.status = 'active'
      and tm.role in ('owner', 'admin')
  )
);

create policy "Owners and admins can read audit logs"
on public.audit_logs for select
using (
  exists (
    select 1 from public.tenant_members tm
    where tm.tenant_id = audit_logs.tenant_id
      and tm.user_id = auth.uid()
      and tm.status = 'active'
      and tm.role in ('owner', 'admin')
  )
);

create index if not exists jobs_status_run_after_idx
on public.jobs(status, run_after, priority);
