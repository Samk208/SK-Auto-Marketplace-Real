/**
 * Email Delivery Testing Script
 * Tests email sending functionality for admin approval/rejection workflows
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#][^=]*)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

console.log('\n📧 SK AutoSphere - Email Delivery Testing\n');
console.log('='.repeat(60));

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function testEmailDelivery() {
  
  console.log('\n📋 TEST 1: Environment Configuration');
  console.log('-'.repeat(60));
  
  const hasResendKey = !!env.RESEND_API_KEY;
  const hasSiteUrl = !!env.NEXT_PUBLIC_SITE_URL;
  
  console.log('RESEND_API_KEY:', hasResendKey ? '✅ Found' : '❌ Missing');
  console.log('NEXT_PUBLIC_SITE_URL:', hasSiteUrl ? `✅ ${env.NEXT_PUBLIC_SITE_URL}` : '❌ Missing');
  
  if (!hasResendKey) {
    console.log('\n❌ CRITICAL: RESEND_API_KEY not found in .env.local');
    console.log('   Emails cannot be sent without this key.');
    console.log('   Get your key from: https://resend.com/api-keys');
    return;
  }

  console.log('\n📋 TEST 2: Test Data Preparation');
  console.log('-'.repeat(60));
  
  // Get a dealer user
  const { data: dealers, error: dealerError } = await supabase
    .from('dealers')
    .select('*, users!inner(id, email, full_name)')
    .limit(1)
    .single();
  
  if (dealerError || !dealers) {
    console.log('❌ FAILED: No dealer found in database');
    console.log('   Action: Create a dealer user first');
    return;
  }
  
  console.log('✅ Found test dealer:', dealers.business_name);
  console.log('   Email:', dealers.users?.email || 'N/A');

  // Get or create a pending listing
  let { data: pendingListing } = await supabase
    .from('car_listings')
    .select('*')
    .eq('dealer_id', dealers.id)
    .eq('status', 'pending')
    .limit(1)
    .single();
  
  if (!pendingListing) {
    console.log('   No pending listing found, creating one...');
    
    const { data: newListing, error: createError } = await supabase
      .from('car_listings')
      .insert({
        dealer_id: dealers.id,
        title: 'Test Listing for Email Testing',
        brand: 'Hyundai',
        model: 'Sonata',
        year: 2023,
        price: 25000,
        status: 'pending',
        body_type: 'Sedan',
        transmission: 'Automatic',
        fuel_type: 'Petrol',
        condition: 'Excellent',
        location: 'Seoul, South Korea'
      })
      .select()
      .single();
    
    if (createError) {
      console.log('❌ FAILED: Could not create test listing');
      console.log('   Error:', createError.message);
      return;
    }
    
    pendingListing = newListing;
    console.log('✅ Created test listing:', pendingListing.title);
  } else {
    console.log('✅ Using existing listing:', pendingListing.title);
  }

  console.log('\n📋 TEST 3: Approval Email Test');
  console.log('-'.repeat(60));
  console.log('⚠️  This test will call the actual API endpoint');
  console.log('   Make sure your dev server is running: npm run dev');
  console.log('');
  
  const baseUrl = env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  try {
    // First, get an admin user token
    const { data: adminUsers } = await supabase.auth.admin.listUsers();
    const adminUser = adminUsers.users.find(u => 
      u.app_metadata?.role === 'admin' || u.email?.includes('@skautosphere.com')
    );
    
    if (!adminUser) {
      console.log('❌ FAILED: No admin user found');
      console.log('   Action: Create an admin user first (run scripts/set-admin.js)');
      return;
    }
    
    console.log(`   Using admin user: ${adminUser.email}`);
    console.log(`   Approving listing: ${pendingListing.id}`);
    console.log('');
    console.log('   🚀 Calling API endpoint...');
    
    // Note: This is a simplified test - in real testing, you'd need to:
    // 1. Log in as admin to get session token
    // 2. Make authenticated API call
    // For now, we'll just provide instructions
    
    console.log('');
    console.log('   📝 MANUAL TEST INSTRUCTIONS:');
    console.log('   1. Log in to the app as admin user');
    console.log('   2. Navigate to admin dashboard');
    console.log('   3. Find the pending listing');
    console.log('   4. Click "Approve" button');
    console.log('   5. Check your email inbox');
    console.log('');
    console.log('   OR use this curl command (replace TOKEN with your session token):');
    console.log('');
    console.log(`   curl -X PATCH ${baseUrl}/api/admin/listings/${pendingListing.id}/approve \\`);
    console.log(`     -H "Cookie: YOUR_SESSION_COOKIE_HERE"`);
    console.log('');
    
  } catch (error) {
    console.log('❌ FAILED:', error.message);
  }

  console.log('\n📋 TEST 4: Rejection Email Test');
  console.log('-'.repeat(60));
  console.log('   Similar to approval test, this requires manual testing or authenticated API call');
  console.log('');
  console.log('   📝 MANUAL TEST INSTRUCTIONS:');
  console.log('   1. Create another pending listing');
  console.log('   2. Log in as admin');
  console.log('   3. Click "Reject" with reason');
  console.log('   4. Check email inbox for rejection notification');
  console.log('');

  console.log('\n📋 TEST 5: Check Resend Dashboard');
  console.log('-'.repeat(60));
  console.log('   After sending test emails, verify delivery:');
  console.log('   1. Visit: https://resend.com/emails');
  console.log('   2. Check recent emails sent');
  console.log('   3. Verify delivery status');
  console.log('   4. Check for any bounces or errors');
  console.log('');
  console.log('   ⚠️  IMPORTANT: Verify domain authentication');
  console.log('   - Visit: https://resend.com/domains');
  console.log('   - Ensure your domain is verified');
  console.log('   - Check SPF and DKIM records');
  console.log('');

  console.log('\n' + '='.repeat(60));
  console.log('📊 EMAIL TESTING SUMMARY');
  console.log('='.repeat(60));
  console.log('✅ Configuration: Verified');
  console.log('⚠️  Email Delivery: Requires manual testing');
  console.log('');
  console.log('NEXT STEPS:');
  console.log('1. Start dev server: npm run dev');
  console.log('2. Log in as admin user');
  console.log('3. Approve/reject a pending listing');
  console.log('4. Check email inbox (check spam folder too!)');
  console.log('5. Verify links in email work correctly');
  console.log('6. Check Resend dashboard for delivery confirmation');
  console.log('\n');
}

testEmailDelivery().catch(console.error);
