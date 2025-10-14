import { config } from "dotenv";
config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User";

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.DATABASE_URL || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error("DATABASE_URL or MONGODB_URI not found in environment variables");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Admin credentials
    const adminEmail = "rohit@gmail.com";
    const adminPassword = "rohit@123456"; // Change this to a secure password
    const adminFirstName = "Admin";
    const adminLastName = "User";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log("Email:", adminEmail);
      console.log("You can login with this email and your password");
      
      // Update to admin role if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log("✅ Updated existing user to admin role");
      }
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // Create admin user
      const adminUser = new User({
        email: adminEmail,
        password: hashedPassword,
        firstName: adminFirstName,
        lastName: adminLastName,
        role: 'admin'
      });

      await adminUser.save();
      console.log("✅ Admin user created successfully!");
      console.log("\n📧 Admin Credentials:");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("Email:    ", adminEmail);
      console.log("Password: ", adminPassword);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("\n⚠️  IMPORTANT: Change this password after first login!");
      console.log("\n🔗 Login at: https://your-app.up.railway.app/login");
      console.log("🔗 Admin Panel: https://your-app.up.railway.app/admin");
    }

    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  }
};

createAdminUser();
