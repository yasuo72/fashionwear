import { config } from "dotenv";
config();

import { connectDatabase } from "./config/database";
import User from "./models/User";
import bcrypt from "bcryptjs";

async function createAdmin() {
  try {
    await connectDatabase();
    console.log("🌱 Creating admin user...");

    const hashedPassword = await bcrypt.hash("1234567", 10);
    
    // Delete existing user with this email if exists
    await User.deleteOne({ email: "rohit@gmail.com" });
    
    await User.create({
      email: "rohit@gmail.com",
      password: hashedPassword,
      firstName: "Rohit",
      lastName: "Singh",
      role: "admin"
    });

    console.log("✅ Admin user created successfully!");
    console.log("\n📋 Login credentials:");
    console.log("Email: rohit@gmail.com");
    console.log("Password: 1234567");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
