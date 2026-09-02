-- Fix delivery threshold inconsistency: single source 299 MAD
update settings set delivery_fee = 35, free_delivery_threshold = 299 where free_delivery_threshold in (50, 600) or delivery_fee = 30;
-- Ensure at least one row correct
insert into settings (store_name, whatsapp_number, delivery_fee, free_delivery_threshold)
select 'NAYRO', '212689363596', 35, 299 where not exists (select 1 from settings);
select pg_notify('pgrst','reload schema');
