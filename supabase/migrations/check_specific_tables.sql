SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('dealer_applications', 'payment_escrow', 'orders', 'dealer_earnings');
