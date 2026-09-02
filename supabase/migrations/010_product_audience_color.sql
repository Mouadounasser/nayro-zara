-- Pro product fields: audience (men/women/unisex) + primary color
alter table products add column if not exists audience text default 'unisex' check (audience in ('women','men','unisex','kids'));
alter table products add column if not exists primary_color text;
alter table products add column if not exists primary_color_name text;

-- Variants: allow is_active per variant (if 0 stock = inactive, but explicit toggle)
alter table product_variants add column if not exists is_active boolean default true;
alter table product_variants add column if not exists color_hex text;

-- Index for filtering
create index if not exists idx_products_audience on products(audience);
create index if not exists idx_products_active_audience on products(is_active, audience);
