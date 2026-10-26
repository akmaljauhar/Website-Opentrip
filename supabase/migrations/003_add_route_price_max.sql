-- Add optional price range support to event_routes
-- price = minimum, price_max = upper bound (null = fixed price)
alter table event_routes add column if not exists price_max numeric;
