const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'config', '.env') });

const Shop = require('./model/shop');

async function verifySeller() {
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.DB_URL);
    console.log('✅ Connected to MongoDB\n');

    // Find the test seller we just created
    const testEmail = 'testshop20260513163518@test.com';
    console.log(`🔍 Looking for seller with email: ${testEmail}\n`);

    const seller = await Shop.findOne({ email: testEmail });

    if (seller) {
      console.log('✅ SELLER FOUND IN DATABASE!\n');
      console.log('📊 Seller Details:');
      console.log('  Name:', seller.name);
      console.log('  Email:', seller.email);
      console.log('  Phone:', seller.phoneNumber);
      console.log('  Address:', seller.address);
      console.log('  Zip Code:', seller.zipCode);
      console.log('  Avatar URL:', seller.avatar?.url ? '✅ Stored' : '❌ Not stored');
      console.log('  Password Hash:', seller.password ? '✅ Stored' : '❌ Not stored');
      console.log('  Created At:', seller.createdAt);
      console.log('  Updated At:', seller.updatedAt);
      console.log('\n✅ DATA IS BEING STORED CORRECTLY!');
    } else {
      console.log('❌ SELLER NOT FOUND IN DATABASE');
      console.log('\n📋 Checking all sellers in database...');
      const allSellers = await Shop.find().select('email name createdAt');
      if (allSellers.length > 0) {
        console.log('Recent sellers:');
        allSellers.slice(-5).forEach(s => {
          console.log(`  - ${s.email} (${s.name}) - ${s.createdAt}`);
        });
      } else {
        console.log('  No sellers found in database');
      }
    }

    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifySeller();
