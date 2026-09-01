-- WordPress-like media handler: every image on site controllable from admin
create table if not exists site_images (
  id uuid primary key default gen_random_uuid(),
  key text unique not null, -- e.g. hero, category_sacs, lookbook_1, instagram_3
  label text not null, -- Display name in admin
  description text,
  recommended_size text not null, -- e.g. 1920x1080, 600x800
  url text not null,
  alt text,
  category text not null, -- hero, category, lookbook, sale, instagram, story, other
  position int default 0,
  updated_at timestamptz default now()
);

alter table site_images enable row level security;
create policy "Public can read site_images" on site_images for select using (true);
create policy "Admin can manage site_images" on site_images for all using (is_admin()) with check (is_admin());
grant all on table site_images to anon, authenticated, service_role;

-- Seed all homepage images with best size guidance (like WordPress media)
insert into site_images (key, label, description, recommended_size, url, alt, category, position) values
  ('hero', 'Hero - Page d''accueil', 'Image principale plein écran, femme avec sac', '1920x1080 - JPG/WebP, <500KB', 'https://picsum.photos/seed/nayro-hero-luxera/1920/1080', 'NAYRO Hero', 'hero', 0),
  ('category_sacs', 'Catégorie - SACS', 'Carte SACS sur homepage', '600x800 - Portrait, <200KB', 'https://picsum.photos/seed/nayro-cat-sacs/600/800', 'SACS', 'category', 1),
  ('category_accessories', 'Catégorie - ACCESSOIRES', 'Carte ACCESSOIRES', '600x800 - Portrait, <200KB', 'https://picsum.photos/seed/nayro-cat-acc/600/800', 'ACCESSOIRES', 'category', 2),
  ('category_new', 'Catégorie - NOUVEAUTÉS', 'Carte NOUVEAUTÉS', '600x800 - Portrait, <200KB', 'https://picsum.photos/seed/nayro-cat-new/600/800', 'NOUVEAUTÉS', 'category', 3),
  ('category_best', 'Catégorie - MEILLEURES VENTES', 'Carte BEST', '600x800 - Portrait, <200KB', 'https://picsum.photos/seed/nayro-cat-best/600/800', 'MEILLEURES VENTES', 'category', 4),
  ('lookbook_1', 'Lookbook - Image 1', 'Lookbook 4 images', '600x800 - Portrait, <200KB', 'https://picsum.photos/seed/nayro-look1/600/800', 'Look 1', 'lookbook', 10),
  ('lookbook_2', 'Lookbook - Image 2', 'Lookbook', '600x800 - Portrait, <200KB', 'https://picsum.photos/seed/nayro-look2/600/800', 'Look 2', 'lookbook', 11),
  ('lookbook_3', 'Lookbook - Image 3', 'Lookbook', '600x800 - Portrait, <200KB', 'https://picsum.photos/seed/nayro-look3/600/800', 'Look 3', 'lookbook', 12),
  ('lookbook_4', 'Lookbook - Image 4', 'Lookbook', '600x800 - Portrait, <200KB', 'https://picsum.photos/seed/nayro-look4/600/800', 'Look 4', 'lookbook', 13),
  ('sale', 'Sale - Image', 'Bannière SALE 40% OFF', '200x200 - Carré, <100KB', 'https://picsum.photos/seed/nayro-sale/200/200', 'Sale', 'sale', 20),
  ('instagram_1', 'Instagram - 1', 'Follow us 6 images', '400x400 - Carré, <150KB', 'https://picsum.photos/seed/nayro-ig1/400/400', 'Instagram 1', 'instagram', 30),
  ('instagram_2', 'Instagram - 2', 'Instagram', '400x400 - Carré, <150KB', 'https://picsum.photos/seed/nayro-ig2/400/400', 'Instagram 2', 'instagram', 31),
  ('instagram_3', 'Instagram - 3', 'Instagram', '400x400 - Carré, <150KB', 'https://picsum.photos/seed/nayro-ig3/400/400', 'Instagram 3', 'instagram', 32),
  ('instagram_4', 'Instagram - 4', 'Instagram', '400x400 - Carré, <150KB', 'https://picsum.photos/seed/nayro-ig4/400/400', 'Instagram 4', 'instagram', 33),
  ('instagram_5', 'Instagram - 5', 'Instagram', '400x400 - Carré, <150KB', 'https://picsum.photos/seed/nayro-ig5/400/400', 'Instagram 5', 'instagram', 34),
  ('instagram_6', 'Instagram - 6', 'Instagram', '400x400 - Carré, <150KB', 'https://picsum.photos/seed/nayro-ig6/400/400', 'Instagram 6', 'instagram', 35),
  ('story', 'Our Story - Image', 'Image Our Story', '200x300 - Portrait, <150KB', 'https://picsum.photos/seed/nayro-story/200/300', 'Our Story', 'story', 40)
on conflict (key) do nothing;
