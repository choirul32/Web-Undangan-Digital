# ADR 0001: SaaS Tenant Baseline

## Status
Accepted baseline, not yet executed in production database.

## Context
Project dimulai sebagai admin-managed manual order service untuk undangan digital. Target jangka panjang adalah production SaaS multi-tenant, tetapi order, pembayaran, dan broadcast tetap manual lewat WhatsApp pada fase awal.

Tanpa tenant model, risiko utama saat masuk SaaS adalah data leakage antar workspace, permission yang tidak jelas, dan query domain yang tidak tenant-scoped.

## Decision
Gunakan model tenant workspace dengan tabel:
- `tenants`
- `tenant_members`
- `plans`
- `subscriptions`
- `usage_counters`
- `payment_events`
- `audit_logs`
- `jobs`

Semua domain table utama akan memiliki `tenant_id`:
- `invitations`
- `templates`
- `guests`
- `rsvps`
- `invitation_events`
- `invitation_stories`
- `invitation_media`
- `bank_accounts`

Migration dibuat sebagai draft idempotent di `supabase/phase2-saas-baseline.sql`.

## Consequences
- Existing manual order flow tetap berjalan sebelum migration dieksekusi.
- Tenant isolation baru dianggap selesai setelah SQL dijalankan di Supabase dan RLS diuji.
- Payment gateway tetap future upgrade; baseline billing hanya schema/plan/quota.
- API harus bergerak bertahap ke tenant context sebelum SaaS self-service dibuka.

## Follow-Up
- Jalankan migration di staging Supabase.
- Backfill default tenant.
- Uji RLS untuk owner/admin/editor/viewer.
- Update route handlers agar semua admin query tenant-aware.
- Baru setelah itu centang exit criteria tenant isolation Phase 2.
