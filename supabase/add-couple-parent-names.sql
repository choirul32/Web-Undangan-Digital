alter table public.invitations
  add column if not exists groom_parents text,
  add column if not exists bride_parents text;

notify pgrst, 'reload schema';
