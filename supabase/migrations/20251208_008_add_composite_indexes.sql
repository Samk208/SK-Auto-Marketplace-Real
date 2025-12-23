-- Add missing composite indexes for performance optimization

-- Audit logs timeline queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_created 
ON audit_logs(action, created_at DESC);

-- Vehicle search optimization
CREATE INDEX IF NOT EXISTS idx_car_listings_search 
ON car_listings(brand, model, year, price);
