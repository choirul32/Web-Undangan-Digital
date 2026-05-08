# Supabase Activation

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Fill:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

4. In Supabase SQL Editor, run:

```text
supabase/schema.sql
supabase/seed.sql
```

5. Create an admin user in Supabase Auth.
6. Run `supabase/admin-seed.example.sql` after changing `admin@example.com` to your admin email.

The dashboard uses Supabase Auth plus the `admin_users` whitelist. A user can sign in only if:

- the email/password exists in Supabase Auth
- the email exists in `public.admin_users`
- `is_active = true`

Admin APIs use `SUPABASE_SERVICE_ROLE_KEY` server-side only. Do not expose it in the browser and do not commit `.env.local`.
