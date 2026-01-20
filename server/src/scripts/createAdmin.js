require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/admin");

(async () => {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || "Admin";
  if (!email || !password) {
    console.log("Usage: node scripts/createAdmin.js email password [name]");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.updateOne(
    { email: email.toLowerCase() },
    {
      $set: { email: email.toLowerCase(), passwordHash, name, isActive: true },
    },
    { upsert: true },
  );

  console.log("Admin created/updated:", email);
  process.exit(0);
})();
