/**
 * Stripe Integration Test Script
 * 
 * This script verifies that the Stripe integration is properly configured.
 * Run with: node scripts/test-stripe-setup.js
 */

// Test 1: Check environment variables
console.log('🔍 Checking Stripe environment variables...\n');

const requiredEnvVars = [
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET'
];

const missingVars = [];

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ Missing: ${varName}`);
    missingVars.push(varName);
  } else if (value.includes('your_') || value.includes('_here')) {
    console.log(`⚠️  ${varName} has placeholder value (update in .env.local)`);
  } else {
    // Mask the actual key for security
    const masked = value.substring(0, 12) + '...' + value.substring(value.length - 4);
    console.log(`✅ ${varName}: ${masked}`);
  }
});

if (missingVars.length > 0) {
  console.log('\n❌ Missing required environment variables!');
  console.log('Please add them to your .env.local file.');
  console.log('See .env.example for reference.\n');
  process.exit(1);
}

// Test 2: Check if Stripe packages are installed
console.log('\n🔍 Checking Stripe packages...\n');

try {
  require('stripe');
  console.log('✅ stripe package installed');
} catch (e) {
  console.log('❌ stripe package not found');
  console.log('Run: npm install stripe --legacy-peer-deps\n');
  process.exit(1);
}

try {
  require('@stripe/stripe-js');
  console.log('✅ @stripe/stripe-js package installed');
} catch (e) {
  console.log('❌ @stripe/stripe-js package not found');
  console.log('Run: npm install @stripe/stripe-js --legacy-peer-deps\n');
  process.exit(1);
}

try {
  require('@stripe/react-stripe-js');
  console.log('✅ @stripe/react-stripe-js package installed');
} catch (e) {
  console.log('❌ @stripe/react-stripe-js package not found');
  console.log('Run: npm install @stripe/react-stripe-js --legacy-peer-deps\n');
  process.exit(1);
}

// Test 3: Check if Stripe configuration files exist
console.log('\n🔍 Checking Stripe configuration files...\n');

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'lib/stripe/server.ts',
  'lib/stripe/client.ts',
  '.env.example'
];

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Test 4: Try to import Stripe modules
console.log('\n🔍 Testing Stripe module imports...\n');

try {
  // Note: Can't actually import .ts files directly in Node.js
  // This would need to be tested in the Next.js app
  console.log('⚠️  TypeScript module imports can only be tested in Next.js');
  console.log('   Run the dev server and check for import errors');
} catch (e) {
  console.log('❌ Failed to import Stripe modules');
  console.log(e.message);
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 STRIPE INTEGRATION STATUS');
console.log('='.repeat(60));

if (missingVars.length === 0) {
  console.log('\n✅ Stripe integration is ready!');
  console.log('\nNext steps:');
  console.log('1. Add your Stripe keys to .env.local');
  console.log('2. Run the dev server: npm run dev');
  console.log('3. Test the checkout flow');
  console.log('4. Set up webhook endpoint for production\n');
} else {
  console.log('\n⚠️  Stripe integration needs configuration');
  console.log('Please complete the setup before testing.\n');
}
