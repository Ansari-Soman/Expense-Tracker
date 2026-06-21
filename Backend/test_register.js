require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const test = async () => {
  const email = "newuser_" + Date.now() + "@gmail.com";
  console.log(`Testing with email: ${email}`);

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    console.log("existingUser:", existingUser);

    if (existingUser) {
      console.log("existingUser.isVerified:", existingUser.isVerified);
      if (existingUser.isVerified) {
        console.log("RESULT: Email already in use");
        process.exit(0);
      }
    }

    const user = new User({
      fullName: "Test User",
      email: email,
      password: "password123",
      isVerified: false,
      otp: "123456",
      otpExpires: new Date(Date.now() + 15 * 60 * 1000)
    });

    await user.save();
    console.log("RESULT: User saved successfully!");
    process.exit(0);
  } catch (err) {
    console.error("RESULT: Error occurred during registration simulation:", err);
    process.exit(1);
  }
};

test();
