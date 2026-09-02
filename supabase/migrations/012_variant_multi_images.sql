-- Each variant can have its own gallery (e.g., Brown = 3 images)
alter table product_variants add column if not exists image_urls jsonb default '[]'::jsonb;
-- Migrate existing single image_url into image_urls array
update product_variants set image_urls = to_jsonb(array[image_url]) where image_url is not null and (image_urls is null or image_urls = '[]'::jsonb);
-- Keep image_url for backward compat (primary image), but new code will use image_urls
