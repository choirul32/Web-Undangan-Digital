# Architecture (Current and Target Production SaaS)

## 1. Current Architecture Summary
Sistem saat ini adalah monolitik Next.js App Router:
- UI publik, UI dashboard admin, dan API route ada dalam satu codebase.
- Supabase dipakai untuk Auth, Postgres, dan Storage.
- Public invitation di-render dari slug, admin mengelola konten dari dashboard.

Ini cocok untuk MVP, tetapi belum sepenuhnya matang untuk full production SaaS multi-tenant.

## 2. Current Component Boundaries
### Presentation
- `src/app/page.jsx` (landing)
- `src/app/dashboard/*` (admin area)
- Target tambahan: `/dashboard/invitations/[slug]` sebagai editor detail per pesanan.
- `src/app/u/[slug]` dan `/u/[slug]/to/[guestSlug]` (public invitation)
- `src/templates/*` (invitation rendering engine)
- Target tambahan: `OpeningSequence` sebagai renderer intro cinematic sebelum cover utama.

### Application/API
- `src/app/api/*` untuk auth, invitations, templates, guests, RSVP, media, stories, events, bank accounts.
- Endpoint admin diamankan dengan `requireAdminApiSession`.

### Data/Domain
- `src/lib/invitations.js` untuk mapping row Supabase ke model UI.
- `src/data/*` untuk fallback sample data.

### Infrastructure
- Supabase Postgres + RLS (`supabase/schema.sql`).
- Supabase Storage buckets: `invitation-media`, `template-assets`.
- Template opening assets memakai bucket `template-assets` dengan namespace khusus:
  `templateId/opening/{video|lottie|image-sequence|poster}/filename`.

## 3. Gaps to Production SaaS
1. Tenant isolation belum eksplisit (masih admin workspace oriented).
2. Belum ada dedicated service layer per domain (logic tersebar di route/component).
3. Validasi payload dan error contract belum standar lintas API.
4. Background jobs/event processing belum ada (notif, optional billing webhook, retry).
5. Observability belum ada (structured log, metrics, alerting).
6. Test pyramid belum ada (unit/integration/e2e).
7. Dashboard data managers belum memiliki active invitation boundary yang konsisten.

## 4. Target Production Architecture
### Target Principle
- Pertahankan monorepo single app untuk kecepatan iterasi.
- Pisahkan boundary logical dengan service/module jelas sebelum memecah jadi microservice.

### Proposed Logical Layers
1. `Web Layer`: page, component, template renderer.
2. `API Layer`: route handlers tipis, hanya orchestration.
3. `Service Layer`: domain service (invitation, template, guest, RSVP, media, billing).
4. `Validation Layer`: schema request/response terpusat.
5. `Data Access Layer`: repository/query functions per table.
6. `Infra Layer`: supabase clients, storage adapters, queue adapter (future).

### Template Rendering Boundary
- `InvitationRenderer` bertugas memilih data undangan dan template.
- `UniversalTemplate` bertugas menyusun section utama.
- `OpeningSequence` bertugas menjalankan intro cinematic berbasis preset/timeline.
- `OrnamentLayer` tetap dipakai untuk ornament section biasa dan fine tuning, bukan sebagai satu-satunya mekanisme opening cinematic.
- `designConfig.widgets.openingReveal` dipertahankan untuk compatibility.
- `designConfig.widgets.openingSequence` menjadi config baru untuk cinematic intro.
- `designConfig.widgets.openingSequence.asset` menyimpan asset opening saja, tidak boleh dipakai untuk gallery/media order.
- Upload opening asset lewat `/api/templates/opening-assets/upload`, bukan endpoint media undangan atau ornament biasa.

### Template Selling Feature Boundary
- Visual experiments seperti opening cinematic, visual presets, smart theme composer, storytelling sections, interactive gallery, dan music ambience harus masuk melalui template renderer/design config.
- Operational experiments seperti WhatsApp share text generator dan RSVP smart summary boleh masuk melalui dashboard components dan API yang sudah ada.
- Setiap experiment harus tetap bisa dimatikan per template atau per invitation agar tidak mengunci seluruh renderer ke satu gaya visual.
- Fitur yang terbukti menjual baru dipromosikan menjadi default template capability.

### Admin Order Workflow Boundary
- `InvitationTable` harus menjadi entry point untuk memilih pesanan.
- `/dashboard/invitations/[slug]` harus menjadi boundary utama untuk editor detail pesanan.
- `GuestManager`, `MediaManager`, `ContentManagers`, dan `RSVPManager` harus menerima `invitationSlug` atau `invitationId` dari parent route.
- API domain data harus selalu resolve invitation dari slug/id request, bukan dari konstanta sample.
- Publish action harus melewati service/domain validation sebelum status berubah ke `published`.

## 5. Target System Boundaries
### Core Runtime
- Next.js app: public web + dashboard + API.
- Supabase Auth: identity/session.
- Supabase DB: transactional data.
- Supabase Storage: media/template assets.

### Planned Extensions
- Optional payment gateway webhook processor jika strategi pasar berubah.
- Job queue/worker untuk async tasks (notifikasi, billing retries, thumbnail processing).
- Observability stack (error tracking + metric dashboard).

## 6. Security and Access Model (Target)
- Role matrix: owner/admin/editor/viewer per tenant.
- RLS policy tenant-aware (semua read/write dibatasi tenant scope).
- Session hardening: rotation, revocation, inactivity timeout.
- API protection tambahan: rate limiting + abuse prevention.

## 7. Reliability and Operations (Target)
- CI pipeline wajib: lint + unit + integration + build.
- Staging parity dengan production config.
- Structured logs untuk semua API critical.
- Incident runbook + rollback checklist.
- Backup/restore verification berkala.

## 8. Migration Strategy (Recommended)
### Phase 1: Stabilize Monolith
- Amankan order-to-publish workflow dan active invitation boundary.
- Standardisasi validation + error response.
- Ekstrak service layer tanpa ubah behavior.
- Tambah testing baseline endpoint kritikal.

### Phase 2: SaaS Core Enablement
- Introduce tenant model dan role matrix.
- Manual billing lifecycle + optional webhook idempotency jika payment gateway dipilih nanti.
- Quota/plan enforcement.

### Phase 3: Scale and Compliance
- Queue worker untuk async processing.
- Observability full stack.
- Security hardening dan audit trail.

## 9. Architecture Decision Rules
- ADR wajib untuk perubahan skema besar.
- Perubahan schema harus backward-compatible minimal 1 release.
- Semua endpoint baru harus punya schema validation dan contract test.
- Perubahan renderer template wajib punya snapshot/e2e coverage minimal.
- Perubahan opening cinematic wajib diuji di mobile viewport dan menghormati reduced-motion preference.
