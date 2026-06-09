const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("../model/user");

dotenv.config({
  path: "config/.env",
});

const ADMIN_NAME = process.env.ADMIN_NAME || "Admin User";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@local.test";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@12345";
const ADMIN_AVATAR_URL =
  process.env.ADMIN_AVATAR_URL || "https://ui-avatars.com/api/?name=Admin+User&background=111827&color=ffffff";

const escapeEmailRegex = (email) =>
  email.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    const existingAdmin = await User.findOne({
      email: new RegExp(`^${escapeEmailRegex(ADMIN_EMAIL)}$`, "i"),
    });

    if (existingAdmin) {
      existingAdmin.name = ADMIN_NAME;
      existingAdmin.role = "Admin";
      existingAdmin.password = ADMIN_PASSWORD;
      existingAdmin.avatar = {
        public_id: existingAdmin.avatar?.public_id || "admin_avatar",
        url: ADMIN_AVATAR_URL,
      };

      await existingAdmin.save();
      console.log(`Admin user updated: ${ADMIN_EMAIL}`);
    } else {
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL.toLowerCase(),
        password: ADMIN_PASSWORD,
        role: "Admin",
        avatar: {
          public_id: "admin_avatar",
          url: ADMIN_AVATAR_URL,
        },
      });

      console.log(`Admin user created: ${ADMIN_EMAIL}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`Failed to seed admin user: ${error.message}`);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

seedAdmin();