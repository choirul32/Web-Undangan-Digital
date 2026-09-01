-- ============================================================
-- Tambah dukungan provider image (Replicate) di ai_providers.
-- provider_type: 'chat' (default, OpenAI-compatible) | 'image'
-- ============================================================

alter table public.ai_providers
  add column if not exists provider_type text not null default 'chat';

-- Contoh insert provider Replicate (isi api_key dengan token r8_...):
-- insert into public.ai_providers (provider_id, name, base_url, api_key, model, provider_type, is_active)
-- values ('replicate', 'Replicate (Image)', 'https://api.replicate.com/v1', 'r8_xxx', 'black-forest-labs/flux-schnell', 'image', true);
