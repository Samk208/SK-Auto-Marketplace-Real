const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function validate() {
    console.log('🔍 Validating Deployment...\n');
    let errors = 0;

    // 1. Check Dealer Verification Fields
    try {
        const { error } = await supabase.from('dealers').select('business_license_url, verification_status').limit(1);
        if (error) throw error;
        console.log('✅ Dealer Verification Schema: OK');
    } catch (e) {
        console.error('❌ Dealer Verification Schema Failed:', e.message);
        errors++;
    }

    // 2. Check Escrow Tables
    try {
        const { error } = await supabase.from('payment_escrow').select('id, status').limit(1);
        if (error) throw error;
        console.log('✅ Escrow System Schema: OK');
    } catch (e) {
        console.error('❌ Escrow System Schema Failed:', e.message);
        errors++;
    }

    // 3. Check Notification Tables
    try {
        const { error } = await supabase.from('notifications').select('id').limit(1);
        if (error) throw error;
        console.log('✅ Notification System Schema: OK');
    } catch (e) {
        console.error('❌ Notification System Schema Failed:', e.message);
        errors++;
    }

    // 4. Check Full Text Search
    try {
        const { error } = await supabase.from('car_listings').select('search_vector').limit(1);
        if (error) throw error;
        console.log('✅ Advanced Search Schema: OK');
    } catch (e) {
        console.error('❌ Advanced Search Schema Failed:', e.message);
        console.log('   -> Migration 20251208_014_full_text_search.sql needs to be applied.');
        errors++;
    }

    // 5. Check AI Reports
    try {
        const { error } = await supabase.from('ai_condition_reports').select('id').limit(1);
        if (error) throw error;
        console.log('✅ AI Damage Detection Schema: OK');
    } catch (e) {
        console.error('❌ AI Damage Detection Schema Failed:', e.message);
        errors++;
    }

    console.log(`\nValidation Complete. ${errors} errors found.`);
    if (errors > 0) process.exit(1);
}

validate();
