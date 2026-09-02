-- Update contact info to 06 89 36 35 96 / contact@nayro.ma
update settings set whatsapp_number = '212689363596' where whatsapp_number = '212600000000';
-- Ensure at least one row has correct number
insert into settings (store_name, whatsapp_number, delivery_fee, free_delivery_threshold)
select 'NAYRO', '212689363596', 30, 600
where not exists (select 1 from settings where whatsapp_number = '212689363596');
