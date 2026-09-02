-- NAYRO initial schema
-- Enable UUID
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  image_url text,
  position int default 0,
  created_at timestamptz default now()
);

-- Collections
create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  created_at timestamptz default now()
);

-- Products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  short_description text,
  price int not null,
  compare_at_price int,
  sku text unique,
  brand text default 'NAYRO',
  category_id uuid references categories(id) on delete set null,
  collection_id uuid references collections(id) on delete set null,
  category_slug text,
  is_active boolean default true,
  is_featured boolean default false,
  is_new boolean default false,
  is_bestseller boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_category on products(category_slug);
create index if not exists idx_products_active on products(is_active);

-- Product images
create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade not null,
  url text not null,
  alt text,
  position int default 0,
  created_at timestamptz default now()
);

-- Product variants
create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade not null,
  size text,
  color text,
  sku text,
  stock int default 0,
  price_override int,
  created_at timestamptz default now()
);

-- Profiles (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  role text default 'customer' check (role in ('customer','admin')),
  created_at timestamptz default now()
);

-- Customers (for guest orders)
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  email text,
  full_name text,
  phone text,
  created_at timestamptz default now()
);

-- Addresses
create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  city text not null,
  address text not null,
  is_default boolean default false,
  created_at timestamptz default now()
);

-- Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_id uuid references customers(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  status text default 'pending' check (status in ('pending','confirmed','processing','shipped','delivered','cancelled','returned')),
  payment_method text default 'cod',
  payment_status text default 'pending',
  subtotal int not null,
  delivery_fee int default 0,
  discount int default 0,
  total int not null,
  customer_name text not null,
  phone text not null,
  city text not null,
  address text not null,
  notes text,
  created_at timestamptz default now()
);
create index if not exists idx_orders_number on orders(order_number);
create index if not exists idx_orders_user on orders(user_id);

-- Order items
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  product_slug text,
  image text,
  size text,
  color text,
  quantity int not null,
  price int not null,
  created_at timestamptz default now()
);

-- Wishlists
create table if not exists wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  created_at timestamptz default now()
);

create table if not exists wishlist_items (
  id uuid primary key default gen_random_uuid(),
  wishlist_id uuid references wishlists(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(wishlist_id, product_id)
);

-- Cart items (for authenticated users)
create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  variant_id uuid references product_variants(id) on delete set null,
  quantity int not null default 1,
  created_at timestamptz default now(),
  unique(user_id, product_id, variant_id)
);

-- Reviews
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete set null,
  rating int check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

-- Coupons
create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text check (discount_type in ('percentage','fixed')),
  discount_value int not null,
  min_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Settings (single row)
create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  store_name text default 'NAYRO',
  whatsapp_number text default '212689363596',
  instagram text default 'https://instagram.com/nayro',
  delivery_fee int default 30,
  free_delivery_threshold int default 600,
  cod_enabled boolean default true,
  currency text default 'MAD',
  updated_at timestamptz default now()
);

-- Newsletter
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

-- Inventory view helper: update timestamp
create or replace function update_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated on products;
create trigger trg_products_updated before update on products for each row execute function update_updated_at();

-- Insert default settings
insert into settings (store_name, whatsapp_number, delivery_fee, free_delivery_threshold)
values ('NAYRO', '212689363596', 30, 600)
on conflict do nothing;
