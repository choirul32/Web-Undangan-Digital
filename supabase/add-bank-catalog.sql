create table if not exists public.bank_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text not null,
  storage_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bank_accounts
  add column if not exists bank_logo_url text;

alter table public.bank_catalog enable row level security;

update public.bank_accounts as account
set bank_logo_url = catalog.logo_url
from public.bank_catalog as catalog
where account.bank_logo_url is null
  and lower(trim(account.bank)) = lower(trim(catalog.name))
  and catalog.is_active = true;

notify pgrst, 'reload schema';
