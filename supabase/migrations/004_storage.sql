-- Storage buckets
insert into storage.buckets (id, name, public) values ('products', 'products', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('categories', 'categories', true) on conflict (id) do nothing;

-- Policies: public read, admin write
create policy "Public read products bucket" on storage.objects for select using (bucket_id = 'products');
create policy "Admin write products bucket" on storage.objects for insert with check (bucket_id = 'products' and is_admin());
create policy "Admin update products bucket" on storage.objects for update using (bucket_id = 'products' and is_admin());
create policy "Admin delete products bucket" on storage.objects for delete using (bucket_id = 'products' and is_admin());

create policy "Public read categories bucket" on storage.objects for select using (bucket_id = 'categories');
create policy "Admin write categories bucket" on storage.objects for insert with check (bucket_id = 'categories' and is_admin());
create policy "Admin delete categories bucket" on storage.objects for delete using (bucket_id = 'categories' and is_admin());
