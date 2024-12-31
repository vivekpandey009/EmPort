import User from "./models/User.js";
import connectDB from "./db/db.js";
import dotenv from "dotenv";

dotenv.config();

const userRegister = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log("Connected to MongoDB");

    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Use a simple password for testing
    const plainPassword = "test123";
    console.log("\nTest credentials:");
    console.log("Email: akash.singh@emport.com");
    console.log("Password:", plainPassword);

    // Create employee user without hashing the password
    // (the model's pre-save hook will handle the hashing)
    const employeeUser = new User({
      firstname: "Akash",
      middlename: "Kmr",
      lastname: "Singh",
      email: "akash.singh@emport.com",
      empCode: "EAKSSIN",
      password: plainPassword, // Plain password - will be hashed by pre-save hook
      role: "employee",
      status: "active",
    });

    // Save user (password will be automatically hashed by the pre-save hook)
    const savedUser = await employeeUser.save();
    console.log("\nUser saved successfully");

    // Verify the saved user
    const fetchedUser = await User.findOne({ email: "akash.singh@emport.com" });

    // Use the model's comparePassword method
    const verificationTest = await fetchedUser.comparePassword(plainPassword);

    console.log("\nVerification Results:");
    console.log("- User found:", !!fetchedUser);
    console.log("- Password verification:", verificationTest);

    if (verificationTest) {
      console.log("\n✅ SUCCESS: User created and verified successfully!");
      console.log("You can now log in with:");
      console.log("Email: akash.singh@emport.com");
      console.log("Password: test123");
    } else {
      console.log("\n❌ ERROR: Password verification failed!");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
};

// Execute seeding
userRegister().catch(console.error);
