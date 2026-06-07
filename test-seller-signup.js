const axios = require('axios');

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

    console.log("📤 Sending signup request with data:");
    console.log("  Name:", testData.name);
    console.log("  Email:", testData.email);
    console.log("  Phone:", testData.phoneNumber);
    console.log("  Address:", testData.address);

    const response = await axios.post(`${server}/shop/create-shop`, testData);

    console.log("\n✅ Signup Response:");
    console.log(response.data);
    console.log("\n📧 Activation email should be sent to:", testData.email);

    return testData;
  } catch (error) {
    console.error("❌ Error during signup:", error.response?.data || error.message);
    process.exit(1);
  }
}

// Run the test
testSellerSignup().then(testData => {
  console.log("\n" + "=".repeat(60));
  console.log("✅ SIGNUP REQUEST SUCCESSFUL");
  console.log("=".repeat(60));
  console.log("\n📌 Next Steps:");
  console.log("1. Check the seller's email for activation link");
  console.log("2. The link has 30 minutes validity");
  console.log("3. Click the link to activate the seller account");
  console.log("4. Seller should be able to login after activation");
  console.log("\n🔑 Credentials to verify:");
  console.log(`   Email: ${testData.email}`);
  console.log(`   Password: ${testData.password}`);
  console.log(`   Name: ${testData.name}`);
  console.log("\n" + "=".repeat(60));
}).catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
