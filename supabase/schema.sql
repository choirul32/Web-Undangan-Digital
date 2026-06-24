create extension if not exists "pgcrypto";

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  template_id text not null default 'rana-kirana',
  package text not null default 'Premium',
  status text not null default 'draft',
  order_status text not null default 'inquiry',
  payment_status text not null default 'unpaid',
  customer_name text,
  customer_whatsapp text,
  order_amount numeric(12,2),
  order_deadline date,
  concept_notes text,
  payment_notes text,
  paid_at timestamptz,
  groom_name text,
  groom_nickname text,
  groom_parents text,
  bride_name text,
  bride_nickname text,
  bride_parents text,
  quote text,
  features jsonb not null default '{}'::jsonb,
  theme_settings jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  expires_at timestamptz,
  view_count integer not null default 0,
  last_viewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.invitations
  add column if not exists order_status text not null default 'inquiry',
  add column if not exists payment_status text not null default 'unpaid',
  add column if not exists customer_name text,
  add column if not exists customer_whatsapp text,
  add column if not exists order_amount numeric(12,2),
  add column if not exists order_deadline date,
  add column if not exists concept_notes text,
  add column if not exists payment_notes text,
  add column if not exists paid_at timestamptz,
  add column if not exists groom_parents text,
  add column if not exists bride_parents text;

create table if not exists public.invitation_events (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  title text not null,
  event_date date,
  event_time text,
  venue text,
  address text,
  maps_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.invitation_stories (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  year text,
  title text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.invitation_media (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  media_type text not null default 'image',
  title text,
  url text not null,
  storage_path text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.bank_accounts (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  bank text not null,
  account_name text not null,
  account_number text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  name text not null,
  slug text not null,
  guest_group text,
  phone text,
  rsvp_status text not null default 'Belum RSVP',
  pax int not null default 0,
  checked_in_at timestamptz,
  created_at timestamptz not null default now(),
  unique(invitation_id, slug)
);

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  guest_id uuid references public.guests(id) on delete set null,
  guest_name text not null,
  attendance text not null,
  pax int not null default 1,
  message text,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  template_id text not null unique,
  name text not null,
  category text not null,
  price text,
  badge text,
  status text not null default 'active',
  description text,
  thumbnail_url text,
  preview_url text,
  supported_features jsonb not null default '[]'::jsonb,
  design_config jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.invitations enable row level security;
alter table public.invitation_events enable row level security;
alter table public.invitation_stories enable row level security;
alter table public.invitation_media enable row level security;
alter table public.bank_accounts enable row level security;
alter table public.guests enable row level security;
alter table public.rsvps enable row level security;
alter table public.admin_users enable row level security;
alter table public.templates enable row level security;

create policy "Public can read published invitations"
on public.invitations for select
using (status = 'published');

create policy "Public can read invitation events"
on public.invitation_events for select
using (
  exists (
    select 1 from public.invitations
    where invitations.id = invitation_events.invitation_id
    and invitations.status = 'published'
  )
);

create policy "Public can read invitation stories"
on public.invitation_stories for select
using (
  exists (
    select 1 from public.invitations
    where invitations.id = invitation_stories.invitation_id
    and invitations.status = 'published'
  )
);

create policy "Public can read invitation media"
on public.invitation_media for select
using (
  exists (
    select 1 from public.invitations
    where invitations.id = invitation_media.invitation_id
    and invitations.status = 'published'
  )
);

create policy "Public can read bank accounts"
on public.bank_accounts for select
using (
  exists (
    select 1 from public.invitations
    where invitations.id = bank_accounts.invitation_id
    and invitations.status = 'published'
  )
);

create policy "Public can read guests for personal links"
on public.guests for select
using (
  exists (
    select 1 from public.invitations
    where invitations.id = guests.invitation_id
    and invitations.status = 'published'
  )
);

create policy "Public can submit RSVP"
on public.rsvps for insert
with check (
  exists (
    select 1 from public.invitations
    where invitations.id = rsvps.invitation_id
    and invitations.status = 'published'
  )
);

create policy "Admins are not publicly readable"
on public.admin_users for select
using (false);

create policy "Public can read active templates"
on public.templates for select
using (status = 'active');

insert into storage.buckets (id, name, public)
values ('invitation-media', 'invitation-media', true)
on conflict (id) do update set public = excluded.public;

insert into storage.buckets (id, name, public)
values ('template-assets', 'template-assets', true)
on conflict (id) do update set public = excluded.public;

create policy "Public can read invitation media bucket"
on storage.objects for select
using (bucket_id = 'invitation-media');

create policy "Public can read template assets bucket"
on storage.objects for select
using (bucket_id = 'template-assets');
