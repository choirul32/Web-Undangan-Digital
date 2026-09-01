-- ============================================================
-- AI Providers — konfigurasi provider LLM untuk AI template
-- generator. Key disimpan di tabel (bukan env) supaya bisa diisi
-- dari UI Pengaturan tanpa restart.
--
-- KEAMANAN: tabel ini TIDAK punya policy public-read (beda dengan
-- platform_settings yang publik). Hanya admin (via service role /
-- requireAdminApiSession) yang bisa membaca & menulis.
-- ============================================================

create table if not exists public.ai_providers (
  id uuid primary key default gen_random_uuid(),
  provider_id text not null unique,          -- "sumopod", "openrouter", "deepseek", dll
  name text not null,                        -- nama tampilan
  base_url text not null,                    -- root API (OpenAI-compatible, biasanya .../v1)
  api_key text not null,                     -- disimpan plaintext di DB (hanya admin yang bisa baca)
  model text not null,                       -- model default (contoh: gpt-4o-mini)
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ai_providers enable row level security;

-- Tidak ada policy SELECT/POST/PUT/DELETE publik.
-- Akses hanya lewat service role (requireAdminApiSession di API route),
-- sehingga key tidak pernah bocor ke anon/public.

-- Optional: biarkan service role akses penuh (default di Supabase).
-- Untuk jaga-jaga, tolak akses anon secara eksplisit:
drop policy if exists "anon cannot read ai_providers" on public.ai_providers;
create policy "anon cannot read ai_providers"
on public.ai_providers for select
using (false);
