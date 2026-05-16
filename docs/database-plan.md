# Database Plan

## 1. Purpose
Dokumen ini mendefinisikan arah data model untuk order-to-publish workflow dan target SaaS multi-tenant.

## 2. Current Tables
- `invitations`
- `invitation_events`
- `invitation_stories`
- `invitation_media`
- `bank_accounts`
- `guests`
- `rsvps`
- `templates`
- `admin_users`

## 3. Immediate P0 Fixes
### Invitation Context
Semua child table harus selalu resolve ke `invitation_id`.

Required:
- Guest manager tidak boleh memakai sample slug.
- Media manager tidak boleh memakai sample slug.
- Event/story/bank manager tidak boleh memakai sample slug.

### Publish Safety
Tambahkan field bila dibutuhkan:
- `status`
- `published_at`
- `archived_at`
- `updated_at`

### Manual Order and Payment
Kolom fase P0 pada `invitations`:
- `order_status`
- `payment_status`
- `customer_name`
- `customer_whatsapp`
- `order_amount`
- `order_deadline`
- `concept_notes`
- `payment_notes`
- `paid_at`

### Indexes
Recommended:
```sql
create index if not exists invitations_slug_idx on public.invitations(slug);
create index if not exists guests_invitation_slug_idx on public.guests(invitation_id, slug);
create index if not exists rsvps_invitation_id_idx on public.rsvps(invitation_id);
create index if not exists invitation_media_invitation_id_idx on public.invitation_media(invitation_id);
```

## 4. Target SaaS Tables
### Tenancy
Target tables:
- `tenants`
- `tenant_members`
- `tenant_roles` or enum-based roles

Add to domain tables:
- `tenant_id uuid not null`

Affected tables:
- `invitations`
- `templates`
- `guests`
- `rsvps`
- `invitation_events`
- `invitation_stories`
- `invitation_media`
- `bank_accounts`

### Billing
Future tables:
- `plans`
- `subscriptions`
- `invoices`
- `payment_events`
- `usage_counters`

### Audit
Target table:
- `audit_logs`

Fields:
- `id`
- `tenant_id`
- `actor_user_id`
- `action`
- `entity_type`
- `entity_id`
- `metadata`
- `created_at`

## 5. RLS Direction
Current public read:
- Published invitations readable by public.
- RSVP insert allowed for published invitation.

Target:
- Admin writes scoped by tenant membership.
- Public reads only published invitation.
- Public RSVP insert only for published invitation.
- Guests only readable for their invitation public route.

## 6. Migration Rules
- Every migration must be backward-compatible for at least one release.
- Add nullable columns first, backfill, then enforce `not null`.
- Avoid destructive table changes without backup.
- Add indexes concurrently where possible in production.
- Phase 2 baseline migration draft: `supabase/phase2-saas-baseline.sql`.

## 7. Data Integrity Rules
- `invitations.slug` unique.
- `guests(invitation_id, slug)` unique.
- RSVP duplicate policy must be explicit.
- Delete invitation cascades child records.
- Media storage delete should follow DB delete or be handled by cleanup job.
- Opening asset storage path must stay under `template-assets/{templateId}/opening/{assetType}/...`.
- Opening asset config stores public URL plus optional `storagePath`; gallery/order media must remain under `invitation-media`.

## 8. Storage Policy
Current buckets:
- `invitation-media`: order-specific cover, gallery, music, and video media.
- `template-assets`: reusable template assets, ornaments, thumbnails, and opening cinematic assets.

Opening asset namespace:
```text
template-assets/{templateId}/opening/video/{timestamp}-{uuid}.mp4
template-assets/{templateId}/opening/lottie/{timestamp}-{uuid}.json
template-assets/{templateId}/opening/image-sequence/{timestamp}-{uuid}.webp
template-assets/{templateId}/opening/poster/{timestamp}-{uuid}.webp
```

Production limits:
- Lottie JSON max 500 KB.
- Opening video max 8 MB and target max 8 seconds.
- Poster fallback required for video and Lottie.
- Public renderer must fallback to poster/reduced-motion mode if asset fails.

## 9. Backup and Recovery
Minimum production target:
- Daily database backup.
- Storage backup strategy documented.
- RPO <= 24h.
- RTO <= 4h.
- Restore drill before production launch.

## 10. Open Decisions
- Tenant model timing: documented in `docs/saas-core-plan.md`; implement migration after manual order flow is stable in production-like data.
- RSVP duplicate policy.
- Soft delete vs hard delete for guests/media/content.
- Whether templates are global, tenant-owned, or both.
