-- Banners / Hero management for NAYRO homepage
create table if not exists banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text not null,
  link text,
  position int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Enable RLS
alter table banners enable row level security;

-- Public can read active banners
create policy "Public can read active banners" on banners for select using (is_active = true);
create policy "Admin can manage banners" on banners for all using (is_admin()) with check (is_admin());
-- Allow service_role to manage (bypasses RLS anyway), but also allow anon insert via service_role in API
-- For direct anon read, public policy above covers

-- Grant
grant all on table banners to anon, authenticated, service_role;
grant usage on schema public to anon, authenticated, service_role;

-- Seed default hero banner
insert into banners (title, subtitle, image_url, link, position, is_active)
values (
  'NAYRO',
  'NOUVELLE COLLECTION 2026 — Discover the latest collection. Minimal. Modern. Crafted for Morocco.',
  'https://picsum.photos/seed/nayro-hero/1920/1080',
  '/shop',
  0,
  true
) on conflict do nothing;

-- Editorial banners
insert into banners (title, subtitle, image_url, link, position, is_active)
values (
  'L''ESSENCE DE L''HIVER',
  'EDITORIAL',
  'https://picsum.photos/seed/nayro-editorial1/800/1000',
  '/shop?filter=new',
  1,
  true
) on conflict do nothing;
