# SaaS Core Plan

## 1. Tenant Workspace Model
Target model:
- `tenants`: workspace bisnis undangan.
- `tenant_members`: user yang menjadi anggota workspace.
- Domain tables wajib punya `tenant_id`.

Minimum columns:
```sql
create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  owner_user_id uuid not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tenant_members (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null,
  email text not null,
  role text not null check (role in ('owner', 'admin', 'editor', 'viewer')),
  status text not null default 'active',
  invited_at timestamptz,
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);
```

## 2. Role Matrix
| Capability | Owner | Admin | Editor | Viewer |
| --- | --- | --- | --- | --- |
| Manage tenant settings | Yes | No | No | No |
| Invite members | Yes | Yes | No | No |
| Create/edit invitations | Yes | Yes | Yes | No |
| Publish/archive invitations | Yes | Yes | No | No |
| Manage templates | Yes | Yes | Yes | View only |
| Manage guests/RSVP export | Yes | Yes | Yes | View only |
| Delete media/content | Yes | Yes | Yes | No |
| Billing/quota settings | Yes | No | No | No |

## 3. Tenant-Scoped Data Model
Add nullable `tenant_id` first, backfill, then enforce `not null`:
- `invitations`
- `templates`
- `guests`
- `rsvps`
- `invitation_events`
- `invitation_stories`
- `invitation_media`
- `bank_accounts`
- `audit_logs`

Migration order:
1. Create `tenants` and `tenant_members`.
2. Create default tenant for current admin-managed workspace.
3. Add nullable `tenant_id` to all domain tables.
4. Backfill current rows to default tenant.
5. Add indexes on `tenant_id`.
6. Update API queries to require tenant context.
7. Enable tenant-aware RLS.
8. Enforce `tenant_id not null`.

Migration draft:
- `supabase/phase2-saas-baseline.sql`

## 4. RLS Direction
Admin write policy:
```sql
exists (
  select 1
  from public.tenant_members tm
  where tm.tenant_id = target_table.tenant_id
    and tm.user_id = auth.uid()
    and tm.status = 'active'
    and tm.role in ('owner', 'admin', 'editor')
)
```

Publish/archive policy requires owner/admin:
```sql
tm.role in ('owner', 'admin')
```

Public read:
```sql
status = 'published'
```

Public RSVP insert:
```sql
exists (
  select 1 from public.invitations i
  where i.id = rsvps.invitation_id
    and i.status = 'published'
)
```

## 5. Manual Billing and Quota
Phase 2 keeps order/payment manual by default because this matches the target market.

Schema is prepared for manual plan tracking and optional future automation:
- `plans`
- `subscriptions`
- `usage_counters`
- `payment_events`

No payment gateway is required for production readiness. Payment gateway/webhook is optional only if the business strategy changes beyond manual WA/payment.

Manual subscription states:
- `trial`
- `active`
- `grace`
- `suspended`
- `canceled`

Quota examples:
- invitations per month
- published invitations active
- storage MB
- templates per tenant

Manual billing rule:
- Admin records plan/subscription state manually.
- Admin confirms payment manually via WA/bank transfer.
- Gateway automation must not block production launch.

## 6. Audit Log
Baseline helper exists at `src/lib/audit-log.js`.

Target table:
```sql
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid null,
  actor_user_id uuid null,
  actor_email text null,
  action text not null,
  entity_type text not null,
  entity_id uuid null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
```

Phase 2 implemented actions:
- `invitation.publish`
- `invitation.archive`

## 7. Current Phase 2 Code Baseline
- Public RSVP in-memory rate limit: `src/lib/rate-limit.js`.
- Audit helper: `src/lib/audit-log.js`.
- Tenant role/capability helper: `src/lib/tenant-auth.js`.
- Plan/quota helper: `src/lib/plans.js`.
- Dashboard health endpoint: `/api/dashboard/health`.
- KPI additions: activation rate, publish conversion, RSVP conversion in `/api/dashboard/stats`.
