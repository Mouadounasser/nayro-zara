-- Row Level Security

-- Enable RLS
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;
alter table categories enable row level security;
alter table collections enable row level security;
alter table profiles enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table wishlists enable row level security;
alter table wishlist_items enable row level security;
alter table cart_items enable row level security;
alter table addresses enable row level security;
alter table reviews enable row level security;
alter table settings enable row level security;
alter table customers enable row level security;

-- Public read for products
create policy "Public can read active products" on products for select using (is_active = true);
create policy "Public can read product images" on product_images for select using (true);
create policy "Public can read product variants" on product_variants for select using (true);
create policy "Public can read categories" on categories for select using (true);
create policy "Public can read collections" on collections for select using (true);
create policy "Public can read settings" on settings for select using (true);
create policy "Public can read reviews" on reviews for select using (true);

-- Admin full access (requires auth and role=admin)
-- For simplicity, allow authenticated to manage if they are admin via JWT. We use helper function is_admin()
create or replace function is_admin() returns boolean as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$ language sql security definer;

-- Admin policies
create policy "Admin can manage products" on products for all using (is_admin()) with check (is_admin());
create policy "Admin can manage images" on product_images for all using (is_admin()) with check (is_admin());
create policy "Admin can manage variants" on product_variants for all using (is_admin()) with check (is_admin());
create policy "Admin can manage categories" on categories for all using (is_admin()) with check (is_admin());
create policy "Admin can manage settings" on settings for all using (is_admin()) with check (is_admin());
create policy "Admin can view all orders" on orders for select using (is_admin());
create policy "Admin can update orders" on orders for update using (is_admin());

-- Customers policies
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

create policy "Users can manage own addresses" on addresses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can view own orders" on orders for select using (auth.uid() = user_id);
create policy "Users can create orders" on orders for insert with check (true);
create policy "Users can view own order items" on order_items for select using (exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));
create policy "Anyone can insert order items" on order_items for insert with check (true);

create policy "Users manage own wishlist" on wishlists for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage wishlist items" on wishlist_items for all using (
  exists (select 1 from wishlists where wishlists.id = wishlist_items.wishlist_id and wishlists.user_id = auth.uid())
) with check (
  exists (select 1 from wishlists where wishlists.id = wishlist_items.wishlist_id and wishlists.user_id = auth.uid())
);

create policy "Users manage own cart" on cart_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Customers table: allow insert for guest orders
create policy "Anyone can create customer" on customers for insert with check (true);
create policy "Admin can read customers" on customers for select using (is_admin());

-- Storage policies will be created separately
