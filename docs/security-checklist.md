# Security Checklist

## 1. Scope
Checklist ini mencakup admin dashboard, public invitation, RSVP, media upload, dan target SaaS multi-tenant.

## 2. Authentication
- [ ] Admin login memakai Supabase Auth.
- [ ] Admin email harus whitelist di `admin_users`.
- [ ] Session cookie HTTP-only.
- [ ] Cookie secure di production.
- [ ] Logout clear semua session cookies.
- [ ] Inactivity timeout policy ditentukan.
- [ ] Refresh/revocation policy ditentukan.

## 3. Authorization
- [ ] Semua endpoint admin memakai `requireAdminApiSession`.
- [ ] Endpoint publik hanya mengizinkan operasi yang memang publik.
- [ ] Future SaaS: semua write harus tenant-scoped.
- [ ] Role matrix dibuat untuk owner/admin/editor/viewer.
- [ ] Publish/archive/delete hanya role tertentu.

## 4. Input Validation
- [ ] Semua API punya schema validation.
- [ ] Slug divalidasi dan dinormalisasi.
- [ ] File upload divalidasi berdasarkan type dan size.
- [ ] URL maps/media divalidasi.
- [ ] RSVP public payload divalidasi.
- [ ] Error tidak membocorkan secret/internal stack.

## 5. Public Abuse Protection
- [ ] Rate limit RSVP submit.
- [ ] Rate limit login.
- [ ] Basic bot protection untuk public form.
- [ ] Duplicate RSVP policy jelas.
- [ ] Payload message/ucapan dibatasi panjangnya.

## 6. Storage Security
- [ ] Bucket policy sesuai kebutuhan public/private.
- [ ] Upload path scoped ke invitation/tenant.
- [ ] File extension tidak dipercaya sebagai satu-satunya validasi.
- [ ] Delete/replace media hanya admin authorized.
- [ ] Service role key hanya server-side.

## 7. Database Security
- [ ] RLS aktif pada tabel domain.
- [ ] Public read hanya untuk invitation published.
- [ ] Public RSVP insert hanya untuk invitation published.
- [ ] Future SaaS: tenant-aware RLS.
- [ ] Index unique mencegah slug collision.

## 8. Audit
- [ ] Log publish/archive.
- [ ] Log delete guest/media/template.
- [ ] Log role/billing changes untuk SaaS mode.
- [ ] Audit log menyimpan actor, action, entity, timestamp.

## 9. Secrets
- [ ] `.env.local` tidak di-commit.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` tidak pernah muncul di client.
- [ ] Production secrets dikelola via platform secret manager.
- [ ] Rotation plan ditentukan.

## 10. Production Gate
- [ ] Security review endpoint admin selesai.
- [ ] Public endpoint rate limit aktif.
- [ ] RLS policy diuji.
- [ ] Backup/restore diuji.
- [ ] Error tracking aktif.
- [ ] Smoke test public/private access selesai.
