const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("../model/user");
const Shop = require("../model/shop");

dotenv.config({
  path: "config/.env",
});

const normalizeEmail = (email) => email.trim().toLowerCase();

const collectDuplicates = (documents) => {
  const seen = new Map();
  const duplicates = [];

  for (const document of documents) {
    const normalizedEmail = normalizeEmail(document.email);
    if (seen.has(normalizedEmail)) {
      duplicates.push({
        normalizedEmail,
        ids: [seen.get(normalizedEmail), document._id],
      });
    } else {
      seen.set(normalizedEmail, document._id);
    }
  }

  return duplicates;
};

const lowerCaseCollectionEmails = async (model, label) => {
  const documents = await model.find({ email: { $type: "string" } }).select("email");
  const updates = [];

  for (const document of documents) {
    const normalizedEmail = normalizeEmail(document.email);
    if (document.email !== normalizedEmail) {
      updates.push({
        updateOne: {
          filter: { _id: document._id },
          update: { $set: { email: normalizedEmail } },
        },
      });
    }
  }

  if (updates.length > 0) {
    await model.bulkWrite(updates, { ordered: false });
  }

  const normalizedDocuments = await model.find({ email: { $type: "string" } }).select("email");
  const duplicates = collectDuplicates(normalizedDocuments);

  console.log(`${label}:`);
  console.log(`  scanned: ${documents.length}`);
  console.log(`  updated: ${updates.length}`);

  if (duplicates.length > 0) {
    console.log(`  duplicate groups after normalization:`);
    for (const duplicate of duplicates) {
      console.log(`    - ${duplicate.normalizedEmail} (${duplicate.ids.join(", ")})`);
    }
  } else {
    console.log(`  duplicate groups after normalization: none`);
  }
};

const run = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    await lowerCaseCollectionEmails(User, "Users");
    await lowerCaseCollectionEmails(Shop, "Shops");

    await mongoose.disconnect();
    console.log("Migration complete.");
  } catch (error) {
    console.error(`Migration failed: ${error.message}`);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

run();