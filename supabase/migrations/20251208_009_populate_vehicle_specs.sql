-- Populate vehicle_specifications table for existing vehicles
-- Currently the table has 0 rows, so we insert default/sample specs for existing listings

INSERT INTO vehicle_specifications (
  listing_id, length_mm, width_mm, height_mm, weight_kg,
  fuel_tank_capacity, trunk_capacity_liters
) 
SELECT id, 4500, 1850, 1650, 1600, 55, 420
FROM car_listings
WHERE NOT EXISTS (
  SELECT 1 FROM vehicle_specifications WHERE listing_id = car_listings.id
);
