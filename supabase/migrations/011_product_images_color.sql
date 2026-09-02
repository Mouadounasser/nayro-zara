-- Multi-images per color: each product image can be tagged with a color
alter table product_images add column if not exists color text;
alter table product_images add column if not exists color_hex text;
create index if not exists idx_product_images_color on product_images(product_id, color);
