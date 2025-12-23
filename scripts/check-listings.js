const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkData() {
    const { count, error } = await supabase
        .from('car_listings')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error checking listings:', error.message);
    } else {
        console.log('Total Listings in DB:', count);
    }
}

checkData();
