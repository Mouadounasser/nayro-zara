-- Seed categories
insert into categories (slug, name, position) values
  ('women','Women',1),
  ('men','Men',2),
  ('shoes','Shoes',3),
  ('accessories','Accessories',4)
on conflict (slug) do nothing;

-- Helper to get category ids
-- Seed products (12)
-- Note: images use picsum for placeholders, replace via admin

insert into products (slug, name, description, short_description, price, compare_at_price, sku, category_slug, is_active, is_featured, is_new, is_bestseller)
values
  ('robe-chemise-linen-belted','Robe Chemise Linen Belted','Robe chemise en lin mélangé, coupe fluide et ceinture à nouer. Finitions soignées, fente discrète et boutons en corozo.','Robe chemise lin • Ceinture incluse',649,null,'NAY-W-001','women',true,true,true,true),
  ('blazer-structured-wool','Blazer Structured Wool','Blazer structuré en laine froide, épaule douce et coupe droite. Doublure viscose, poches passepoilées et boutons recouverts.', 'Blazer laine froide • Coupe droite',899,1199,'NAY-W-002','women',true,true,false,true),
  ('trousers-wide-leg-wool','Trousers Wide Leg Wool','Pantalon large taille haute, jambe fluide et pli creux. Laine mélangée et finitions main.', 'Pantalon large • Laine mélangée',549,null,'NAY-W-003','women',true,true,true,false),
  ('chemise-overshirt-cotton','Overshirt Cotton Canvas','Surchemise en canvas de coton lourd, coupe boxy et poches plaquées. Patte boutonnée et lavage garment-dyed.', 'Surchemise canvas • Coton lourd',599,null,'NAY-M-001','men',true,false,true,false),
  ('knit-merino-crew','Knit Merino Crew','Pull ras-du-cou en mérinos extra-fin, maille fine jauge 14. Encolure côtelée et finitions bord-côte.', 'Pull mérinos • Maille fine',479,null,'NAY-M-002','men',true,true,false,true),
  ('coat-long-wool-blend','Coat Long Wool Blend','Manteau long en drap de laine mélangée, col tailleur et ceinture détachable. Ligne épurée, fente au dos.', 'Manteau long • Drap laine',1299,null,'NAY-M-003','men',true,true,true,false),
  ('loafer-leather-penny','Loafer Leather Penny','Mocassin penny en cuir de veau lisse, cousu Blake et semelle cuir. Patine naturelle et confort immédiat.', 'Mocassin cuir • Cousu Blake',749,949,'NAY-S-001','shoes',true,false,false,true),
  ('ballet-flat-soft-leather','Ballet Flat Soft Leather','Ballerine en agneau souple, bout amande et élastique invisible. Semelle fine et confort enveloppant.', 'Ballerine agneau • Bout amande',529,null,'NAY-S-002','shoes',true,true,true,false),
  ('bag-leather-tote','Bag Leather Tote','Cabas en cuir grainé, anses longues et poche intérieure zippée. Doublure canvas et fermeture aimantée.', 'Cabas cuir grainé • Anses longues',689,null,'NAY-A-001','accessories',true,false,false,false),
  ('scarf-wool-cashmere','Scarf Wool Cashmere','Écharpe en laine et cachemire, tissage sergé et franges roulottées main. Douceur et chaleur incomparables.', 'Écharpe laine-cachemire • Franges main',329,null,'NAY-A-002','accessories',true,true,false,true),
  ('dress-slip-satin','Dress Slip Satin','Robe nuisette en satin de viscose, bretelles fines réglables et biais contrasté. Coupe fluide et tombé irréprochable.', 'Robe satin • Bretelles fines',579,749,'NAY-W-004','women',true,false,false,false),
  ('shirt-poplin-oversized','Shirt Poplin Oversized','Chemise oversize en popeline de coton biologique, col français et poignets mousquetaires.', 'Chemise popeline • Coton bio',429,null,'NAY-M-004','men',true,false,true,false)
on conflict (slug) do nothing;

-- Seed images and variants for each product (using subquery)
-- For brevity, insert with product slug reference via join
insert into product_images (product_id, url, alt, position)
select p.id, 'https://picsum.photos/seed/nayro'||p.id||'/800/1000', p.name, 0 from products p
on conflict do nothing;

insert into product_images (product_id, url, alt, position)
select p.id, 'https://picsum.photos/seed/nayro'||p.id||'b/800/1000', p.name, 1 from products p
on conflict do nothing;

-- Variants: generic sizes per category
insert into product_variants (product_id, size, color, sku, stock)
select p.id, s.size, 'Black', p.sku||'-'||s.size, 5
from products p cross join (values ('XS'),('S'),('M'),('L')) as s(size)
where p.category_slug = 'women' on conflict do nothing;

insert into product_variants (product_id, size, color, sku, stock)
select p.id, s.size, 'Stone', p.sku||'-'||s.size, 6
from products p cross join (values ('M'),('L'),('XL')) as s(size)
where p.category_slug = 'men' on conflict do nothing;

insert into product_variants (product_id, size, color, sku, stock)
select p.id, s.size, 'Black', p.sku||'-'||s.size, 4
from products p cross join (values ('39'),('40'),('41'),('42')) as s(size)
where p.category_slug = 'shoes' on conflict do nothing;

insert into product_variants (product_id, size, color, sku, stock)
select p.id, 'One Size', 'Camel', p.sku||'-OS', 12
from products p where p.category_slug = 'accessories' on conflict do nothing;
