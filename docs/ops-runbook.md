# Ops Runbook

## Release Gate
Before production deploy:
1. Run `git diff --check`.
2. Run `node .\node_modules\next\dist\bin\next build`.
3. Run manual smoke test in `docs/testing-plan.md`.
4. Verify `/api/dashboard/health`.
5. Verify public invitation `/u/{slug}`.
6. Verify personal guest link `/u/{slug}/to/{guestSlug}`.
7. Verify RSVP submit appears in dashboard.

## Rollback Playbook
1. Stop deploy rollout.
2. Revert to last known good deployment.
3. Do not run destructive DB rollback automatically.
4. If migration caused issue, apply forward-fix migration after backup.
5. Log incident summary and affected routes.

## Incident Severity
- `SEV1`: public invitation down, RSVP unavailable, data leak, admin login broken.
- `SEV2`: media upload broken, template publish broken, dashboard partially unusable.
- `SEV3`: UI glitch, non-critical preview issue, reporting/KPI issue.

## Alert Policy
- `SEV1`: respond immediately, owner required.
- `SEV2`: respond same business day.
- `SEV3`: schedule in next maintenance window.

## Health Checks
- `/api/dashboard/health` for admin health.
- Public route smoke: `/u/{publishedSlug}`.
- Build route list must include `/demo`, `/preview`, `/dashboard`, `/u/[slug]`.

## Backup / Restore
Minimum:
- Daily Supabase Postgres backup.
- Storage bucket backup for `invitation-media` and `template-assets`.
- Restore drill before production launch.

Targets:
- RPO <= 24h.
- RTO <= 4h.

Restore drill:
1. Restore database backup into staging project.
2. Restore storage backup or validate public storage URLs.
3. Run smoke test.
4. Validate tenant/RLS policies if SaaS mode is active.

## Session and Secret Policy
- Admin session cookie is HTTP-only.
- Cookie secure in production.
- Inactivity timeout target: 7 days max for admin dashboard.
- Service role key only server-side.
- Rotate Supabase service role key after suspected leak.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client components.
