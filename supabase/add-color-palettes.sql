-- ============================================================
-- Color Palettes — palet custom hasil AI generator / simpan manual.
-- Tersimpan di DB (bukan config.js) supaya bisa dibuat dari UI
-- tanpa restart & bisa dipakai lintas template.
--
-- KEAMANAN: tabel ini TIDAK punya policy public-read (sama seperti
-- ai_providers). Hanya admin (service role / requireAdminApiSession)
-- yang bisa membaca & menulis.
-- ============================================================

create table if not exists public.color_palettes (
  id uuid primary key default gen_random_uuid(),
  palette_id text not null unique,           -- slug unik (contoh: jawa-wayang-emas)
  label text not null,                       -- nama tampilan palet
  description text,                          -- keterangan / prompt asal
  colors jsonb not null default '{}'::jsonb, -- { primary, accent, text, bg, surface }
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.color_palettes enable row level security;

-- Tidak ada policy SELECT/POST/PUT/DELETE publik.
-- Akses hanya lewat service role (requireAdminApiSession di API route).
drop policy if exists "anon cannot read color_palettes" on public.color_palettes;
create policy "anon cannot read color_palettes"
on public.color_palettes for select
using (false);
