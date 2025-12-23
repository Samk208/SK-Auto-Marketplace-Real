/**
 * Database Status Check Script
 * Directly queries Supabase to verify actual implementation status
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#][^=]*)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

console.log('\n🔍 Checking environment variables...');
console.log('Supabase URL:', env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Found' : '❌ Missing');
console.log('Service Role Key:', env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Found' : '❌ Missing');

if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('\n❌ ERROR: Required environment variables not found in .env.local');
  process.exit(1);
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDatabaseStatus() {
  console.log('\n🔍 SK AutoSphere - Database Status Check\n');
  console.log('='.repeat(60));

  try {
    // Check tables existence and count
    console.log('\n📊 TABLE STATUS:');
    console.log('-'.repeat(60));

    // Users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, role, verified', { count: 'exact' });
    
    if (usersError) {
      console.log('❌ users table:', usersError.message);
    } else {
      console.log(`✅ users table: ${users?.length || 0} records`);
      users?.forEach(u => console.log(`   - ${u.email} (${u.role})`));
    }

    // Dealers table
    const { data: dealers, error: dealersError } = await supabase
      .from('dealers')
      .select('id, business_name, verified, active_listings', { count: 'exact' });
    
    if (dealersError) {
      console.log('❌ dealers table:', dealersError.message);
    } else {
      console.log(`✅ dealers table: ${dealers?.length || 0} records`);
      dealers?.forEach(d => console.log(`   - ${d.business_name} (Active: ${d.active_listings})`));
    }

    // Car listings table
    const { data: listings, error: listingsError } = await supabase
      .from('car_listings')
      .select('id, title, status, price, dealer_id', { count: 'exact' });
    
    if (listingsError) {
      console.log('❌ car_listings table:', listingsError.message);
    } else {
      console.log(`✅ car_listings table: ${listings?.length || 0} records`);
      
      // Group by status
      const statusCounts = listings?.reduce((acc, l) => {
        acc[l.status] = (acc[l.status] || 0) + 1;
        return acc;
      }, {});
      
      console.log('   Status breakdown:', statusCounts);
      
      // Calculate total value
      const totalValue = listings?.reduce((sum, l) => sum + parseFloat(l.price), 0);
      console.log(`   Total inventory value: $${totalValue?.toLocaleString()}`);
    }

    // Check for audit_logs table
    const { data: auditLogs, error: auditError } = await supabase
      .from('audit_logs')
      .select('id, action', { count: 'exact' })
      .limit(5);
    
    if (auditError) {
      console.log('❌ audit_logs table: NOT FOUND or error -', auditError.message);
    } else {
      console.log(`✅ audit_logs table: ${auditLogs?.length || 0} recent records`);
    }

    // Check for transactions table
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('id', { count: 'exact' });
    
    if (transactionsError) {
      console.log('❌ transactions table: NOT FOUND or error');
    } else {
      console.log(`✅ transactions table: ${transactions?.length || 0} records`);
    }

    // Check storage buckets
    console.log('\n📦 STORAGE STATUS:');
    console.log('-'.repeat(60));
    
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      console.log('❌ Storage buckets error:', bucketsError.message);
    } else {
      console.log(`✅ Storage buckets: ${buckets?.length || 0}`);
      buckets?.forEach(b => console.log(`   - ${b.name} (${b.public ? 'public' : 'private'})`));
      
      // Check files in listings bucket
      const { data: files, error: filesError } = await supabase
        .storage
        .from('listings')
        .list('', { limit: 10 });
      
      if (!filesError && files) {
        console.log(`   Files in 'listings': ${files.length}`);
      }
    }

    // Check RLS policies
    console.log('\n🔒 SECURITY STATUS:');
    console.log('-'.repeat(60));
    
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies_info')
      .catch(() => null);
    
    // Check if we can query as anon user
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    const { data: anonListings } = await anonClient
      .from('car_listings')
      .select('id')
      .eq('status', 'active')
      .limit(1);
    
    console.log(anonListings ? '✅ RLS: Public can view active listings' : '❌ RLS: Public access blocked');

    // Check admin functionality
    console.log('\n👤 ADMIN STATUS:');
    console.log('-'.repeat(60));
    
    const { data: adminUsers } = await supabase.auth.admin.listUsers();
    const admins = adminUsers?.users?.filter(u => 
      u.app_metadata?.role === 'admin' || u.email?.includes('@skautosphere.com')
    );
    
    console.log(`✅ Admin users found: ${admins?.length || 0}`);
    admins?.forEach(a => console.log(`   - ${a.email}`));

    // Check migrations
    console.log('\n📋 MIGRATIONS STATUS:');
    console.log('-'.repeat(60));
    
    const { data: migrations, error: migrationsError } = await supabase
      .from('schema_migrations')
      .select('version')
      .catch(() => ({ data: null }));
    
    if (migrations) {
      console.log(`✅ Applied migrations: ${migrations.length}`);
      migrations.forEach(m => console.log(`   - ${m.version}`));
    } else {
      console.log('⚠️  Cannot read migrations table (may not exist)');
    }

  } catch (error) {
    console.error('\n❌ Error during database check:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Database status check complete\n');
}

checkDatabaseStatus();
