const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'config', '.env') });

const User = require('./model/user');

async function run() {
  await mongoose.connect(process.env.DB_URL);

  const marker = Date.now();
  const email = `LegacyCase${marker}@Test.com`;
  const password = 'TestPassword123';

  const existing = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
  if (existing) {
    await User.deleteOne({ _id: existing._id });
  }

  await User.create({
    name: `Legacy Case ${marker}`,
    email,
    password,
    avatar: {
      public_id: `legacy-${marker}`,
      url: 'https://example.com/avatar.png',
    },
  });

  const response = await fetch('http://localhost:8000/api/v2/user/login-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email.toLowerCase(),
      password,
    }),
  });

  const data = await response.json();
  console.log('Login status:', response.status);
  console.log('Response:', data.message || 'success');

  await User.deleteOne({ email: new RegExp(`^${email}$`, 'i') });
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error(error);
  try {
    await mongoose.disconnect();
  } catch (_) {}
  process.exit(1);
});
