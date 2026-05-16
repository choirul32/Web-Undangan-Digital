# Release Checklist

## 1. Release Goal
Checklist ini dipakai sebelum deploy ke production atau staging yang dipakai untuk client review.

## 2. Pre-Release
- [ ] PRD/todo updated for shipped scope.
- [ ] Environment variables checked.
- [ ] Database migration reviewed.
- [ ] Storage bucket policy reviewed.
- [ ] API contract changes documented.
- [ ] Breaking changes identified.

## 3. Build and Test
- [ ] Dependencies installed cleanly.
- [ ] `npm run build` succeeds.
- [ ] Unit tests pass.
- [ ] Integration tests pass.
- [ ] E2E critical flow passes.
- [ ] Manual smoke test passes.

## 4. Manual Smoke Test
- [ ] Admin login.
- [ ] Create manual order from WhatsApp inquiry.
- [ ] Mark manual payment as paid/confirmed.
- [ ] Create invitation.
- [ ] Edit invitation.
- [ ] Add event.
- [ ] Add guest.
- [ ] Upload media.
- [ ] Preview invitation.
- [ ] Publish invitation.
- [ ] Open public URL.
- [ ] Open guest personal URL.
- [ ] Copy WhatsApp broadcast text/link manually.
- [ ] Submit RSVP.
- [ ] Confirm RSVP appears in dashboard.

## 5. Security Gate
- [ ] Admin endpoints require session.
- [ ] Public endpoints validate payload.
- [ ] No service role key in client bundle.
- [ ] RLS policy checked.
- [ ] Rate limit active for public forms in production.
- [ ] Upload limits enforced.

## 6. Data Gate
- [ ] Migration has rollback/mitigation plan.
- [ ] Backup is available.
- [ ] Restore process known.
- [ ] No test/sample data leaked to production.
- [ ] No hardcoded `dimas-salsa` in production workflow.

## 7. Observability Gate
- [ ] Error tracking active.
- [ ] API errors logged.
- [ ] Deployment version identifiable.
- [ ] Alert contacts known.

## 8. Post-Release
- [ ] Open landing page.
- [ ] Open dashboard.
- [ ] Verify latest deployed version.
- [ ] Run one public RSVP test on staging/production-safe test invitation.
- [ ] Check error tracker for new errors.
- [ ] Check Supabase logs for failed queries.

## 9. Rollback
Rollback trigger:
- Critical auth failure.
- Public invitation cannot render.
- RSVP submit broken.
- Data writes going to wrong invitation.
- Manual payment/order status broken.
- Payment/billing webhook duplicate or data corruption in future SaaS mode.

Rollback steps:
- [ ] Revert deployment.
- [ ] Disable affected feature flag/config if available.
- [ ] Restore data only if corruption confirmed.
- [ ] Document incident and fix follow-up task.

## 10. Production Launch Criteria
- [ ] Manual WhatsApp order flow documented.
- [ ] Manual payment confirmation works.
- [ ] Order-to-publish flow stable.
- [ ] Manual broadcast copy/link generator works.
- [ ] No hardcoded sample slug in production admin flow.
- [ ] Public routes read only published invitations.
- [ ] Dashboard data scoped to active invitation.
- [ ] Backup and restore plan documented.
- [ ] Error tracking and logs active.
