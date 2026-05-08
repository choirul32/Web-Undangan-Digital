insert into public.invitations (
  slug,
  template_id,
  package,
  status,
  groom_name,
  groom_nickname,
  bride_name,
  bride_nickname,
  quote,
  features,
  published_at
)
values (
  'dimas-salsa',
  'rana-kirana',
  'Premium',
  'published',
  'Dimas Pratama',
  'Dimas',
  'Salsa Kirana',
  'Salsa',
  'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup.',
  '{"rsvp": true, "gift": true, "music": true, "guestName": true}'::jsonb,
  now()
)
on conflict (slug) do update set
  template_id = excluded.template_id,
  package = excluded.package,
  status = excluded.status,
  groom_name = excluded.groom_name,
  groom_nickname = excluded.groom_nickname,
  bride_name = excluded.bride_name,
  bride_nickname = excluded.bride_nickname,
  quote = excluded.quote,
  features = excluded.features,
  published_at = excluded.published_at,
  updated_at = now();

with invitation as (
  select id from public.invitations where slug = 'dimas-salsa'
)
insert into public.invitation_events (
  invitation_id,
  title,
  event_date,
  event_time,
  venue,
  address,
  maps_url,
  sort_order
)
select id, 'Akad Nikah', '2026-06-12', '09.00 WIB', 'Gedung Serbaguna Nusantara', 'Jl. Melati Raya No. 12, Bandung', 'https://maps.google.com', 1
from invitation
union all
select id, 'Resepsi', '2026-06-12', '11.00 - 14.00 WIB', 'Gedung Serbaguna Nusantara', 'Jl. Melati Raya No. 12, Bandung', 'https://maps.google.com', 2
from invitation
on conflict do nothing;

with invitation as (
  select id from public.invitations where slug = 'dimas-salsa'
)
insert into public.invitation_stories (
  invitation_id,
  year,
  title,
  description,
  sort_order
)
select id, '2021', 'Awal Bertemu', 'Berawal dari pertemuan sederhana yang menjadi cerita panjang.', 1
from invitation
union all
select id, '2024', 'Lamaran', 'Keluarga bertemu dan restu menjadi awal langkah baru.', 2
from invitation
union all
select id, '2026', 'Hari Bahagia', 'Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan mendoakan.', 3
from invitation
on conflict do nothing;

with invitation as (
  select id from public.invitations where slug = 'dimas-salsa'
)
insert into public.invitation_media (
  invitation_id,
  media_type,
  title,
  url,
  sort_order
)
select id, 'image', 'Gallery 1', '/assets/nusantara-jawa.svg', 1
from invitation
union all
select id, 'image', 'Gallery 2', '/assets/nusantara-songket.svg', 2
from invitation
union all
select id, 'image', 'Gallery 3', '/assets/nusantara-botanical.svg', 3
from invitation
union all
select id, 'cover', 'Cover', '/assets/nusantara-hero-bg.svg', 0
from invitation
union all
select id, 'music', 'Backsound', '/assets/sample-music.mp3', 4
from invitation
on conflict do nothing;

with invitation as (
  select id from public.invitations where slug = 'dimas-salsa'
)
insert into public.bank_accounts (
  invitation_id,
  bank,
  account_name,
  account_number,
  sort_order
)
select id, 'BCA', 'Dimas Pratama', '1234567890', 1
from invitation
union all
select id, 'Mandiri', 'Salsa Kirana', '9876543210', 2
from invitation
on conflict do nothing;

with invitation as (
  select id from public.invitations where slug = 'dimas-salsa'
)
insert into public.guests (
  invitation_id,
  name,
  slug,
  guest_group,
  rsvp_status,
  pax
)
select id, 'Bapak Andi', 'bapak-andi', 'Keluarga', 'Hadir', 2
from invitation
union all
select id, 'Ibu Maya', 'ibu-maya', 'Keluarga', 'Belum RSVP', 0
from invitation
union all
select id, 'Rina & Partner', 'rina-partner', 'Teman', 'Hadir', 2
from invitation
union all
select id, 'Tim Kantor', 'tim-kantor', 'Kantor', 'Menunggu', 0
from invitation
on conflict (invitation_id, slug) do update set
  name = excluded.name,
  guest_group = excluded.guest_group,
  rsvp_status = excluded.rsvp_status,
  pax = excluded.pax;

insert into public.templates (
  template_id,
  name,
  category,
  price,
  badge,
  status,
  description,
  thumbnail_url,
  preview_url,
  supported_features,
  design_config,
  sort_order
)
values
  (
    'blue-watercolor-muslim',
    'Blue Watercolor Muslim',
    'Muslim',
    'Rp 149.000',
    'New',
    'active',
    'Template muslim watercolor biru dengan ilustrasi couple dan floral frame.',
    '/assets/blue-watercolor-frame.svg',
    '/demo/blue-watercolor-muslim',
    '["rsvp", "gift", "music", "guestName", "gallery", "story"]'::jsonb,
    '{"canvas":{"maxWidth":430,"background":"#fff8ee"},"sections":{"default":{"backgroundImage":"/assets/blue-watercolor-frame.svg","overlayClass":"bg-[#fff8ee]/42"},"soft":{"backgroundImage":"/assets/blue-watercolor-frame.svg","overlayClass":"bg-white/62"}},"ornaments":{"home":[{"id":"home-frame","src":"/assets/blue-watercolor-frame.svg","slot":"fill","width":"100%","height":"100%","x":0,"y":0,"rotate":0,"opacity":1,"zIndex":0,"objectFit":"cover"}],"section":[{"id":"section-frame","src":"/assets/blue-watercolor-frame.svg","slot":"fill","width":"100%","height":"100%","x":0,"y":0,"rotate":0,"opacity":1,"zIndex":0,"objectFit":"cover"}]}}'::jsonb,
    1
  ),
  (
    'watercolor-premium',
    'Watercolor Premium',
    'Premium',
    'Rp 129.000',
    'Premium',
    'active',
    'Template watercolor premium dari blueprint Elementor dengan gallery dan gift.',
    'https://haribahagia.info/wp-content/uploads/2023/05/jfshfcj-3.png',
    '/demo/watercolor-premium',
    '["rsvp", "gift", "music", "guestName", "gallery", "story"]'::jsonb,
    '{}'::jsonb,
    2
  ),
  (
    'adat-jawa-mobile',
    'Adat Jawa Mobile',
    'Adat',
    'Rp 149.000',
    'Adat',
    'active',
    'Template adat Jawa mobile dengan frame batik, ivory gold, dan ornamen melati.',
    '/assets/template-adat-jawa-premium.png',
    '/demo/adat-jawa',
    '["rsvp", "gift", "music", "guestName", "gallery", "story"]'::jsonb,
    '{}'::jsonb,
    3
  ),
  (
    'rana-kirana',
    'Rana Kirana',
    'Adat',
    'Rp 129.000',
    'Best Seller',
    'active',
    'Template songket luxe untuk undangan adat dengan sentuhan premium.',
    '/assets/nusantara-songket.svg',
    '/preview',
    '["rsvp", "gift", "music", "guestName", "gallery", "story"]'::jsonb,
    '{}'::jsonb,
    4
  ),
  (
    'sadajiwa',
    'Sadajiwa',
    'Muslim',
    'Rp 99.000',
    'Favorit',
    'active',
    'Template muslim modern dengan aksen Nusantara dan layout bersih.',
    '/assets/nusantara-muslim.svg',
    '/preview',
    '["rsvp", "gift", "music", "guestName", "gallery", "story"]'::jsonb,
    '{}'::jsonb,
    5
  ),
  (
    'sekar-arum',
    'Sekar Arum',
    'Modern',
    'Rp 90.000',
    'Modern',
    'active',
    'Template modern Jawa dengan warna hangat dan komposisi ringan.',
    '/assets/nusantara-jawa.svg',
    '/preview',
    '["rsvp", "gift", "music", "guestName", "gallery", "story"]'::jsonb,
    '{}'::jsonb,
    6
  ),
  (
    'kidung',
    'Kidung',
    'Non Foto',
    'Rp 89.000',
    'Non Foto',
    'hidden',
    'Template non-foto dengan visual premium minimal dan fokus typography.',
    '/assets/nusantara-premium.svg',
    '/preview',
    '["rsvp", "gift", "music", "guestName", "story"]'::jsonb,
    '{}'::jsonb,
    7
  )
on conflict (template_id) do update set
  name = excluded.name,
  category = excluded.category,
  price = excluded.price,
  badge = excluded.badge,
  status = excluded.status,
  description = excluded.description,
  thumbnail_url = excluded.thumbnail_url,
  preview_url = excluded.preview_url,
  supported_features = excluded.supported_features,
  design_config = excluded.design_config,
  sort_order = excluded.sort_order,
  updated_at = now();
