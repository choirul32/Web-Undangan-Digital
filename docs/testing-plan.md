# Testing Plan

## 1. Purpose
Testing plan ini memastikan flow admin pesanan dan public invitation tidak rusak saat fitur baru ditambahkan.

## 2. Test Pyramid
### Unit Tests
Target:
- Mapper data invitation.
- Slug generation.
- Validation schemas.
- Publish guard.
- RSVP duplicate policy.

### Integration Tests
Target:
- API invitations.
- API guests.
- API rsvps.
- API media.
- API events/stories/bank-accounts.
- API templates.

### E2E Tests
Target:
- Admin login.
- Create order.
- Edit order detail.
- Add guests.
- Add media/content.
- Preview.
- Publish.
- Open public invitation.
- Submit RSVP.
- Verify RSVP dashboard.

## 3. P0 Manual Smoke Test
Detailed runbook: `docs/p0-smoke-test.md`.

Before every release:
- [ ] Login admin.
- [ ] Create new invitation with unique slug.
- [ ] Add couple data.
- [ ] Add event.
- [ ] Add guest.
- [ ] Copy guest personal link.
- [ ] Upload cover/gallery/music.
- [ ] Add bank account if gift enabled.
- [ ] Preview invitation.
- [ ] Publish invitation.
- [ ] Open `/u/[slug]`.
- [ ] Open `/u/[slug]/to/[guestSlug]`.
- [ ] Submit RSVP.
- [ ] Confirm RSVP appears for same invitation.

## 4. Critical Test Cases
### Invitation
- [ ] Create draft succeeds.
- [ ] Edit draft updates same invitation.
- [ ] Save draft does not duplicate event.
- [ ] Publish fails if required data missing.
- [ ] Publish succeeds if required data complete.
- [ ] Archive disables public access.

### Guest
- [ ] Create guest scoped to invitation.
- [ ] Duplicate guest slug handled.
- [ ] Edit guest works.
- [ ] Delete guest works.
- [ ] Personal link uses correct invitation slug.

### RSVP
- [ ] RSVP submit works for published invitation.
- [ ] RSVP fails for missing invitation.
- [ ] RSVP updates matching guest status.
- [ ] RSVP does not update guest from another invitation.
- [ ] Export CSV only exports active invitation data.

### Media
- [ ] Upload cover works.
- [ ] Upload gallery image works.
- [ ] Upload music works.
- [ ] Replace media works.
- [ ] Delete media removes it from renderer.

### Template Rendering
- [ ] Public page renders with partial data.
- [ ] Opening reveal works.
- [ ] Opening cinematic can be disabled.
- [ ] Reduced motion does not break rendering.

## 5. Tooling Recommendation
Near term:
- Vitest for unit tests.
- Playwright for E2E.
- Next build as release gate.

Package scripts target:
```json
{
  "test": "vitest",
  "test:e2e": "playwright test",
  "check": "npm run test && npm run build"
}
```

## 6. Current Release Gate
Until automated tests are installed, every release must pass:
- `git diff --check`
- `node .\node_modules\next\dist\bin\next build`
- Manual smoke test in this document
- `/api/dashboard/health` check

## 7. Automation Backlog
- Add Vitest for `src/lib/api-validation.js`.
- Add unit tests for `src/lib/plans.js`.
- Add unit tests for `src/lib/tenant-auth.js`.
- Add integration test for `/api/rsvps`.
- Add Playwright flow: login -> create order -> preview -> publish -> RSVP.

## 8. Definition of Done
- Feature has validation.
- Feature has at least unit/integration coverage when touching API/domain.
- User-facing critical flow has smoke or E2E coverage.
- Manual smoke test updated if workflow changes.
