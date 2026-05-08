-- Run this after creating your Supabase Auth admin user.
-- Replace the email with the admin email that should access /dashboard.

insert into public.admin_users (email, is_active)
values ('admin@example.com', true)
on conflict (email) do update set is_active = excluded.is_active;
