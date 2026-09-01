-- Replace random/Zara-like products with real NAYRO bags (Instagram nayro.shop)
-- Delete old Zara-style products and insert real bag products

-- First, clean old product related data
delete from product_images where product_id in (select id from products);
delete from product_variants where product_id in (select id from products);
delete from products;

-- Update categories to real NAYRO categories (SACS, ACCESSOIRES)
delete from categories;
insert into categories (slug, name, position) values
  ('sacs','SACS',1),
  ('accessories','ACCESSOIRES',2),
  ('new','NOUVEAUTÉS',3)
on conflict (slug) do nothing;

-- Insert real products
insert into products (id, slug, name, description, short_description, price, compare_at_price, sku, category_slug, is_active, is_featured, is_new, is_bestseller) values
  ('11111111-1111-1111-1111-111111111111','sac-a-dos-aola-kids-bleu','Sac à dos AOLA KIDS','Sac à dos AOLA KIDS — Style & Confort + Pratique. Compartiment principal spacieux, poches latérales, dos matelassé et bretelles réglables. Idéal pour l''école et les sorties. Matière résistante et légère.','AOLA KIDS • 220 DH • Bleu/Jaune',220,null,'NAY-SAC-AOLA-BLEU','sacs',true,true,true,true),
  ('22222222-2222-2222-2222-222222222222','sac-a-dos-gladly-noir','Sac à dos Gladly Noir','Sac à dos Gladly — design minimal et élégant, tissu déperlant, poche avant zippée, intérieur doublé. Parfait pour le quotidien.','Gladly • Noir • Unisexe',199,249,'NAY-SAC-GLADLY-NOIR','sacs',true,true,true,true),
  ('33333333-3333-3333-3333-333333333333','tote-bag-canvas-trio','Tote Bag Canvas Trio','Lot de tote bags en canvas épais — beige, orange et bleu. Anses longues, impression NAYRO discrète. Parfait pour la plage ou le quotidien.','Tote • Canvas • 3 couleurs',149,null,'NAY-TOTE-TRIO','sacs',true,true,false,true),
  ('44444444-4444-4444-4444-444444444444','sac-bandouliere-cuir-marron','Sac Bandoulière Cuir Marron','Sac bandoulière en cuir grainé marron, bandoulière chaîne dorée, fermeture magnétique, intérieur poche zippée. Porté épaule ou croisé.','Cuir • Marron • Chaîne',249,299,'NAY-BANDOULIERE-MARRON','sacs',true,true,false,false),
  ('55555555-5555-5555-5555-555555555555','sac-cabas-noir-classique','Sac Cabas Noir Classique','Sac cabas noir intemporel, anses longues, grand volume, poche intérieure zippée. Doublure NAYRO, matière résistante à l''eau.','Cabas • Noir • Grand volume',189,null,'NAY-CABAS-NOIR','sacs',true,false,true,false),
  ('66666666-6666-6666-6666-666666666666','sac-a-dos-rose-pastel','Sac à dos Rose Pastel','Sac à dos rose poudré, Collection Pastel NAYRO. Matière douce, compartiments multiples, dos respirant.','Pastel • Rose • Léger',179,null,'NAY-SAC-ROSE','sacs',true,false,true,false),
  ('77777777-7777-7777-7777-777777777777','sac-a-dos-scolaire-noir','Sac à dos Scolaire Noir','Sac à dos scolaire noir, renforcé, grande capacité, poche ordinateur, bretelles ergonomiques.','Scolaire • Noir • Renforcé',189,null,'NAY-SAC-SCOLAIRE-NOIR','sacs',true,false,false,true),
  ('88888888-8888-8888-8888-888888888888','pochette-nayro-minimal','Pochette NAYRO Minimal','Pochette minimaliste NAYRO, fermeture zippée, dragonne, intérieur compartimenté. Parfaite pour soirées.','Pochette • Minimal',99,null,'NAY-POCHETTE','accessories',true,false,false,false),
  ('99999999-9999-9999-9999-999999999999','sac-de-plage-nayro','Sac de Plage NAYRO','Sac de plage XXL, toile résistante, anses longues, poche imperméable. Inspiré du coucher de soleil marocain.','Plage • XXL • Imperméable',129,null,'NAY-PLAGE','sacs',true,true,true,false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','montre-verte-nayro','Montre Verte NAYRO','Montre verte cadran 40mm, bracelet silicone, étanche 50M, mouvement précis. Édition limitée NAYRO.','Montre • Verte • 40mm',299,399,'NAY-MONTRE-VERTE','accessories',true,true,false,true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','sac-fourre-tout-lacoste-style','Sac Fourre-Tout Lacoste Style','Sac fourre-tout style Lacoste, toile épaisse, logo brodé, anses contrastées. Pour un look casual chic.','Fourre-tout • Style Lacoste',159,null,'NAY-FOURRE-TOUT','sacs',true,false,false,false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc','ensemble-nayro-vert-bleu','Ensemble NAYRO Vert/Bleu','Ensemble coordonné: sac à dos bleu + pochette verte. Pour un look NAYRO complet. Remise pack inclus.','Pack • Sac + Pochette',349,399,'NAY-ENSEMBLE','sacs',true,false,true,false)
on conflict (id) do nothing;

-- Insert images (2 per product)
insert into product_images (product_id, url, alt, position) values
  ('11111111-1111-1111-1111-111111111111','https://picsum.photos/seed/nayro-bag-aola1/800/1000','Sac AOLA KIDS bleu',0),
  ('11111111-1111-1111-1111-111111111111','https://picsum.photos/seed/nayro-bag-aola2/800/1000','Sac AOLA KIDS détail',1),
  ('22222222-2222-2222-2222-222222222222','https://picsum.photos/seed/nayro-bag-gladly1/800/1000','Sac Gladly noir',0),
  ('22222222-2222-2222-2222-222222222222','https://picsum.photos/seed/nayro-bag-gladly2/800/1000','Sac Gladly porté',1),
  ('33333333-3333-3333-3333-333333333333','https://picsum.photos/seed/nayro-bag-tote1/800/1000','Tote bags trio',0),
  ('33333333-3333-3333-3333-333333333333','https://picsum.photos/seed/nayro-bag-tote2/800/1000','Tote détail',1),
  ('44444444-4444-4444-4444-444444444444','https://picsum.photos/seed/nayro-bag-bandouliere1/800/1000','Sac bandoulière marron',0),
  ('44444444-4444-4444-4444-444444444444','https://picsum.photos/seed/nayro-bag-bandouliere2/800/1000','Sac bandoulière porté',1),
  ('55555555-5555-5555-5555-555555555555','https://picsum.photos/seed/nayro-bag-cabas1/800/1000','Sac cabas noir',0),
  ('55555555-5555-5555-5555-555555555555','https://picsum.photos/seed/nayro-bag-cabas2/800/1000','Sac cabas porté',1),
  ('66666666-6666-6666-6666-666666666666','https://picsum.photos/seed/nayro-bag-rose1/800/1000','Sac rose pastel',0),
  ('66666666-6666-6666-6666-666666666666','https://picsum.photos/seed/nayro-bag-rose2/800/1000','Sac rose collection',1),
  ('77777777-7777-7777-7777-777777777777','https://picsum.photos/seed/nayro-bag-scolaire1/800/1000','Sac scolaire noir',0),
  ('77777777-7777-7777-7777-777777777777','https://picsum.photos/seed/nayro-bag-scolaire2/800/1000','Sac scolaire dos',1),
  ('88888888-8888-8888-8888-888888888888','https://picsum.photos/seed/nayro-bag-pochette1/800/1000','Pochette NAYRO',0),
  ('88888888-8888-8888-8888-888888888888','https://picsum.photos/seed/nayro-bag-pochette2/800/1000','Pochette intérieur',1),
  ('99999999-9999-9999-9999-999999999999','https://picsum.photos/seed/nayro-bag-plage1/800/1000','Sac plage',0),
  ('99999999-9999-9999-9999-999999999999','https://picsum.photos/seed/nayro-bag-plage2/800/1000','Sac plage détail',1),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','https://picsum.photos/seed/nayro-bag-montre1/800/1000','Montre verte',0),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','https://picsum.photos/seed/nayro-bag-montre2/800/1000','Montre détail',1),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','https://picsum.photos/seed/nayro-bag-fourre1/800/1000','Sac fourre-tout',0),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','https://picsum.photos/seed/nayro-bag-fourre2/800/1000','Sac fourre-tout détail',1),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc','https://picsum.photos/seed/nayro-bag-ensemble1/800/1000','Ensemble NAYRO',0),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc','https://picsum.photos/seed/nayro-bag-ensemble2/800/1000','Ensemble détail',1)
on conflict do nothing;

-- Insert variants (One Size for bags)
insert into product_variants (product_id, size, color, sku, stock) values
  ('11111111-1111-1111-1111-111111111111','One Size','Bleu/Jaune','NAY-SAC-AOLA-BLEU-OS',25),
  ('22222222-2222-2222-2222-222222222222','One Size','Noir','NAY-SAC-GLADLY-NOIR-OS',18),
  ('33333333-3333-3333-3333-333333333333','One Size','Beige','NAY-TOTE-BEIGE',30),
  ('33333333-3333-3333-3333-333333333333','One Size','Orange','NAY-TOTE-ORANGE',20),
  ('33333333-3333-3333-3333-333333333333','One Size','Bleu','NAY-TOTE-BLEU',22),
  ('44444444-4444-4444-4444-444444444444','One Size','Marron','NAY-BANDOULIERE-MARRON-OS',12),
  ('55555555-5555-5555-5555-555555555555','One Size','Noir','NAY-CABAS-NOIR-OS',20),
  ('66666666-6666-6666-6666-666666666666','One Size','Rose','NAY-SAC-ROSE-OS',15),
  ('77777777-7777-7777-7777-777777777777','One Size','Noir','NAY-SAC-SCOLAIRE-NOIR-OS',22),
  ('88888888-8888-8888-8888-888888888888','One Size','Noir','NAY-POCHETTE-NOIR-OS',30),
  ('99999999-9999-9999-9999-999999999999','One Size','Beige','NAY-PLAGE-BEIGE-OS',18),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','One Size','Vert','NAY-MONTRE-VERTE-OS',10),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','One Size','Blanc/Bleu','NAY-FOURRE-TOUT-OS',16),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc','One Size','Vert/Bleu','NAY-ENSEMBLE-OS',8)
on conflict do nothing;

-- Update hero banner to use bag image instead of iPod desk
update banners set image_url='https://picsum.photos/seed/nayro-bag-hero/1920/1080', title='NAYRO', subtitle='NOUVELLE COLLECTION 2026 — Sacs à dos & Totes. Minimal. Moderne. Conçu au Maroc.' where title='NAYRO';
