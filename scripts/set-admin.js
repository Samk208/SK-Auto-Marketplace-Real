/**
 * Quick script to set admin role for admin@test.com
 * Run: node scripts/set-admin.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
function loadEnv() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    const envFile = fs.readFileSync(envPath, 'utf-8');
    envFile.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...values] = trimmed.split('=');
        if (key && values.length > 0) {
          const value = values.join('=').trim().replace(/^["']|["']$/g, '');
          process.env[key.trim()] = value;
        }
      }
    });
  } catch (error) {
    console.error('⚠️  Could not load .env.local:', error.message);
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing environment variables!');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setAdminRole() {
  try {
    console.log('📋 Looking for admin@test.com...');
    
    // Find user by email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Error fetching users:', listError);
      process.exit(1);
    }

    const user = users.users.find(u => u.email === 'admin@test.com');

    if (!user) {
      console.error('❌ User admin@test.com not found!');
      console.log('Available users:', users.users.map(u => u.email).join(', '));
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.email} (${user.id})`);
    console.log(`🔧 Setting admin role...`);

    // Update user with admin role
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      app_metadata: {
        role: 'admin',
      },
    });

    if (error) {
      console.error('❌ Failed to set admin role:', error);
      process.exit(1);
    }

    console.log('\n✅ Admin role set successfully!');
    console.log(`   User: ${data.user.email}`);
    console.log(`   App Metadata:`, JSON.stringify(data.user.app_metadata, null, 2));
    console.log('\n🎉 User can now access admin routes!');
    console.log('   Test by logging in with: admin@test.com');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

setAdminRole();

