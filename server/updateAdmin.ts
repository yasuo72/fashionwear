import { config } from "dotenv";

// Load .env from the root directory
config();

import { connectDatabase } from "./config/database";
import User from "./models/User";
import bcrypt from "bcryptjs";

async function updateAdminUser() {
  try {
    await connectDatabase();
    console.log("🔄 Updating admin user...");

    const newEmail = "rs965198@gmail.com";
    const newPassword = "123456@";

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Find and update the admin user
    const adminUser = await User.findOne({ role: "admin" });

    if (!adminUser) {
      console.log("❌ No admin user found. Creating new admin user...");
      await User.create({
        email: newEmail,
        password: hashedPassword,
        firstName: "Admin",
        lastName: "User",
        role: "admin"
      });
      console.log("✅ New admin user created successfully!");
    } else {
      adminUser.email = newEmail;
      adminUser.password = hashedPassword;
      await adminUser.save();
      console.log("✅ Admin user updated successfully!");
    }

    console.log("\n📋 New admin credentials:");
    console.log(`Email: ${newEmail}`);
    console.log(`Password: ${newPassword}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating admin user:", error);
    process.exit(1);
  }
}

updateAdminUser();
