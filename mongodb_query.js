// MongoDB Query Script
// Run this in MongoDB Atlas or MongoDB Compass

// Check if seller data was stored
db.shops.find({ email: "testshop20260513163518@test.com" }).pretty()

// If the above returns data, the seller was stored correctly!
// You should see:
// - name
// - email (lowercase)
// - password (hashed)
// - phoneNumber
// - address
// - zipCode
// - avatar (with public_id and url)
// - createdAt timestamp
