const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, 'config', '.env') });

const Shop = require('./model/shop');

async function run() {
  await mongoose.connect(process.env.DB_URL);

  const marker = Date.now();
  const email = `passwordtest${marker}@test.com`;

  const seller = await Shop.create({
    name: `Password Test ${marker}`,
    email,
    password: 'TestPassword123',
    address: '123 Test St',
    phoneNumber: '03001234567',
    zipCode: '12345',
    avatar: {
      public_id: `test-${marker}`,
      url: 'https://example.com/avatar.png',
    },
  });

  const created = await Shop.findById(seller._id).select('+password');
  const before = await bcrypt.compare('TestPassword123', created.password);
  console.log('Before non-password save:', before ? 'PASS' : 'FAIL');

  created.name = `Updated Name ${marker}`;
  await created.save();

  const afterSave = await Shop.findById(seller._id).select('+password');
  const after = await bcrypt.compare('TestPassword123', afterSave.password);
  console.log('After non-password save:', after ? 'PASS' : 'FAIL');

  await Shop.deleteOne({ _id: seller._id });
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error(error);
  try {
    await mongoose.disconnect();
  } catch (_) {}
  process.exit(1);
});
