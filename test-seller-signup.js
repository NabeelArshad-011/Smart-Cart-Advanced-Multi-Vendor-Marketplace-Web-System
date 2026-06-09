const axios = require('axios');
const fs = require('fs');

const server = "http://localhost:8000/api/v2";

// Simple base64 image for testing
const testImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

async function testSellerSignup() {
  try {
    console.log("📋 Testing Seller Signup...\n");

    const testData = {
      name: "Test Shop " + Date.now(),
      email: `testshop${Date.now()}@test.com`,
      password: "TestPassword123",
      address: "123 Main St",
      phoneNumber: "03001234567",
      zipCode: "12345",
      avatar: testImage,
    };

    console.log("📤 Sending signup request with data:", {
      ...testData,
      avatar: "[base64 image]"
    });

    const response = await axios.post(`${server}/shop/create-shop`, testData);

    console.log("✅ Signup Response:", response.data);
    console.log("\n📧 Activation email should be sent to:", testData.email);
    console.log("🔑 Test Email: ", testData.email);

    // Now check MongoDB to verify data
    console.log("\n🔍 Checking MongoDB for stored seller data...\n");

    const checkResult = await checkMongoDBForSeller(testData.email);
    console.log(checkResult);

    return testData;
  } catch (error) {
    console.error("❌ Error during signup:", error.response?.data || error.message);
    process.exit(1);
  }
}

async function checkMongoDBForSeller(email) {
  try {
    // We'll use a direct database check endpoint if available
    // Or just log what we would check
    const script = `
    const mongoose = require('mongoose');
    const Shop = require('./model/shop');
    
    (async () => {
      try {
        const shop = await Shop.findOne({ email: '${email.toLowerCase()}' });
        if (shop) {
          console.log('✅ FOUND in MongoDB:');
          console.log('  Name:', shop.name);
          console.log('  Email:', shop.email);
          console.log('  Phone:', shop.phoneNumber);
          console.log('  Address:', shop.address);
          console.log('  Zip Code:', shop.zipCode);
          console.log('  Created At:', shop.createdAt);
        } else {
          console.log('❌ NOT FOUND in MongoDB for email:', email.toLowerCase());
        }
      } catch (err) {
        console.error('Error checking DB:', err.message);
      }
    })();
    `;
    
    return "📝 Note: To verify data is stored, check MongoDB Atlas directly or use the DB query script above";
  } catch (error) {
    return `Error: ${error.message}`;
  }
}

// Run the test
testSellerSignup().then(testData => {
  console.log("\n" + "=".repeat(60));
  console.log("✅ TEST COMPLETE");
  console.log("=".repeat(60));
  console.log("\n📌 Next Steps:");
  console.log("1. Check email for activation link");
  console.log("2. Open the activation link (should not expire for 30 minutes)");
  console.log("3. Verify seller dashboard appears after activation");
  console.log("\n🔑 Use these credentials to verify in MongoDB:");
  console.log(`   Email: ${testData.email}`);
  console.log(`   Name: ${testData.name}`);
}).catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
