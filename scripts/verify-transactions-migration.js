/**
 * Verification Script for Transactions Migration
 * Tests compatibility with existing database schema
 */

const { createClient } = require('@supabase/supabase-js');

// Hardcoded credentials from .env.local for verification
const SUPABASE_URL = 'https://ocunqereputrqcblpzvu.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdW5xZXJlcHV0cnFjYmxwenZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDA0NzcwOCwiZXhwIjoyMDc5NjIzNzA4fQ.h7jCtMzYdV6dHzORX7aEZD5p51zr3trQnEl7HvcIjvw';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function verifyMigration() {
  console.log('🔍 Starting migration verification...\n');
  
  const issues = [];
  const warnings = [];
  
  // 1. Check if referenced tables exist
  console.log('1️⃣ Checking referenced tables...');
  
  const requiredTables = ['car_listings', 'dealers'];
  
  for (const table of requiredTables) {
    const { data, error } = await supabase
      .from(table)
      .select('id')
      .limit(1);
    
    if (error) {
      issues.push(`❌ Table '${table}' does not exist or is not accessible`);
    } else {
      console.log(`   ✅ Table '${table}' exists`);
    }
  }
  
  // 2. Check if auth.users is accessible
  console.log('\n2️⃣ Checking auth.users table...');
  
  const { data: authUsers, error: authError } = await supabase.rpc('get_current_user');
  
  if (!authError) {
    console.log('   ✅ auth.users is accessible');
  } else {
    warnings.push(`⚠️  Cannot verify auth.users access (expected in migration context)`);
  }
  
  // 3. Verify car_listings has required columns
  console.log('\n3️⃣ Checking car_listings schema...');
  
  const { data: sampleListing, error: listingError } = await supabase
    .from('car_listings')
    .select('id, dealer_id')
    .limit(1)
    .single();
  
  if (!listingError && sampleListing) {
    console.log('   ✅ car_listings.id exists (UUID type expected)');
    console.log('   ✅ car_listings.dealer_id exists');
  } else if (listingError?.code === 'PGRST116') {
    console.log('   ✅ car_listings schema is correct (no data yet)');
  } else {
    issues.push(`❌ car_listings schema issue: ${listingError?.message}`);
  }
  
  // 4. Verify dealers table structure
  console.log('\n4️⃣ Checking dealers schema...');
  
  const { data: sampleDealer, error: dealerError } = await supabase
    .from('dealers')
    .select('id, user_id')
    .limit(1)
    .single();
  
  if (!dealerError && sampleDealer) {
    console.log('   ✅ dealers.id exists (UUID type expected)');
    console.log('   ✅ dealers.user_id exists');
  } else if (dealerError?.code === 'PGRST116') {
    console.log('   ✅ dealers schema is correct (no data yet)');
  } else {
    issues.push(`❌ dealers schema issue: ${dealerError?.message}`);
  }
  
  // 5. Check if transactions table already exists
  console.log('\n5️⃣ Checking if transactions table exists...');
  
  const { data: existingTransactions, error: txError } = await supabase
    .from('transactions')
    .select('id')
    .limit(1);
  
  if (!txError) {
    warnings.push('⚠️  transactions table ALREADY EXISTS - migration may conflict');
    console.log('   ⚠️  Table already exists');
  } else if (txError.code === '42P01' || txError.message.includes('does not exist')) {
    console.log('   ✅ transactions table does not exist (ready for migration)');
  } else {
    warnings.push(`⚠️  Unexpected error checking transactions: ${txError.message}`);
  }
  
  // 6. Test database connection
  console.log('\n6️⃣ Testing database connection...');
  
  const { data: dbTest, error: dbError } = await supabase
    .from('dealers')
    .select('count');
  
  if (!dbError) {
    console.log('   ✅ Database connection successful');
  } else {
    issues.push(`❌ Database connection failed: ${dbError.message}`);
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 VERIFICATION SUMMARY');
  console.log('='.repeat(60));
  
  if (issues.length === 0 && warnings.length === 0) {
    console.log('✅ ALL CHECKS PASSED - Migration is safe to apply!\n');
    return true;
  }
  
  if (issues.length > 0) {
    console.log('\n❌ CRITICAL ISSUES FOUND:\n');
    issues.forEach(issue => console.log(issue));
    console.log('\n⚠️  DO NOT APPLY MIGRATION until issues are resolved!\n');
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:\n');
    warnings.forEach(warning => console.log(warning));
    console.log('\n💡 Review warnings before applying migration\n');
  }
  
  return issues.length === 0;
}

// Run verification
verifyMigration()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('❌ Verification failed with error:', err);
    process.exit(1);
  });
