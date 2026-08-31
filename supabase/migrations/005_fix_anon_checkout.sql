-- Fix anon checkout: allow guest COD orders via anon role
-- Previous INSERT policies for public/anon,authenticated with WITH CHECK true were not applying correctly for anon via pooler
-- Use FOR ALL TO anon to ensure anon can INSERT (and SELECT own via order_number via service_role in API)

drop policy if exists "Anyone can create orders" on orders;
drop policy if exists "Allow anon insert" on orders;
drop policy if exists "Allow all anon" on orders;
drop policy if exists "test anon" on orders;
drop policy if exists "Allow anon all" on orders;

-- Allow anon to do all (INSERT/SELECT) via anon, but authenticated also via separate policy
create policy "Allow anon all" on orders for all to anon using (true) with check (true);
create policy "Anyone can create orders" on orders for insert to authenticated with check (true);

drop policy if exists "Anyone can insert order items" on order_items;
drop policy if exists "Allow anon all order_items" on order_items;
drop policy if exists "test anon" on order_items;
create policy "Allow anon all order_items" on order_items for all to anon using (true) with check (true);
create policy "Anyone can insert order items auth" on order_items for insert to authenticated with check (true);

drop policy if exists "Anyone can create customer" on customers;
create policy "Allow anon customers" on customers for all to anon using (true) with check (true);
create policy "Anyone can create customer auth" on customers for insert to authenticated with check (true);

-- Ensure grants
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
