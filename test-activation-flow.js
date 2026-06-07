const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'config', '.env') });

const Shop = require('./model/shop');

async function testFullActivationFlow() {
  try {
    console.log('════════════════════════════════════════');
    console.log('  TESTING FULL SELLER ACTIVATION FLOW');
    console.log('════════════════════════════════════════\n');

    // Connect to MongoDB
    console.log('🔗 Step 1: Connecting to MongoDB...');
    await mongoose.connect(process.env.DB_URL);
    console.log('✅ Connected\n');

    // Step 1: Create seller object (what signup endpoint creates)
    console.log('📝 Step 2: Creating seller object (before DB)...');
    const sellerData = {
      name: 'Test Activation Shop ' + Date.now(),
      email: `activationtest${Date.now()}@test.com`,
      password: 'TestPassword123',
      phoneNumber: '03001234567',
      address: '123 Test St',
      zipCode: '12345',
      avatar: {
        public_id: 'test-avatar',
        url: 'https://example.com/avatar.jpg'
      }
    };
    console.log('✅ Created seller object');
    console.log(`   Email: ${sellerData.email}\n`);

    // Step 2: Create activation token (what signup endpoint creates)
    console.log('🔑 Step 3: Creating activation token...');
    const activationToken = jwt.sign(sellerData, process.env.ACTIVATION_SECRET, {
      expiresIn: '30m'
    });
    console.log('✅ Token created');
    console.log(`   Token length: ${activationToken.length} chars\n`);

    // Step 3: Verify token can be decoded
    console.log('🔍 Step 4: Verifying token...');
    const decoded = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);
    console.log('✅ Token verified');
    console.log(`   Seller name from token: ${decoded.name}\n`);

    // Step 4: Check before activation (should not exist)
    console.log('📊 Step 5: Checking database BEFORE activation...');
    let seller = await Shop.findOne({ email: sellerData.email.toLowerCase() });
    if (seller) {
      console.log('❌ ERROR: Seller already exists before activation!');
    } else {
      console.log('✅ Seller not in database (correct)\n');
    }

    // Step 5: Simulate activation endpoint
    console.log('🚀 Step 6: Simulating activation endpoint call...');
    try {
      const newSeller = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);
      const { name, email, password, avatar, zipCode, address, phoneNumber } = newSeller;

      const existingSeller = await Shop.findOne({ email: email.toLowerCase() });
      if (existingSeller) {
        console.log('❌ ERROR: Seller already exists!');
        await mongoose.disconnect();
        return;
      }

      // Create seller in database
      seller = await Shop.create({
        name,
        email: email.toLowerCase(),
        avatar,
        password,
        zipCode,
        address,
        phoneNumber,
      });

      console.log('✅ Seller created in database\n');

      // Step 6: Verify seller is now in database
      console.log('📊 Step 7: Checking database AFTER activation...');
      const savedSeller = await Shop.findOne({ email: sellerData.email.toLowerCase() });
      if (savedSeller) {
        console.log('✅ SELLER FOUND IN DATABASE!\n');
        console.log('📋 Saved Seller Details:');
        console.log(`   Name: ${savedSeller.name}`);
        console.log(`   Email: ${savedSeller.email}`);
        console.log(`   Phone: ${savedSeller.phoneNumber}`);
        console.log(`   Address: ${savedSeller.address}`);
        console.log(`   Password stored: ${savedSeller.password ? '✅' : '❌'}`);
        console.log(`   Avatar stored: ${savedSeller.avatar?.url ? '✅' : '❌'}\n`);
        console.log('✅ ACTIVATION FLOW WORKING CORRECTLY!');
      } else {
        console.log('❌ ERROR: Seller not found after creation!');
      }
    } catch (error) {
      console.log('❌ Error during activation:', error.message);
    }

    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    console.log('════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testFullActivationFlow();
