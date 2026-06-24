-- Guestbook moderation: lets the admin hide an RSVP message from the public
-- "Doa & Ucapan" wall without deleting the RSVP record itself.
-- Messages are shown publicly by default (opt-out moderation).

alter table public.rsvps
  add column if not exists hidden boolean not null default false;
