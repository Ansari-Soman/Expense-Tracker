require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");
    const users = await User.find({});
    console.log(`Total users in DB: ${users.length}`);
    users.forEach(u => {
      console.log(`- ID: ${u._id}, Name: ${u.fullName}, Email: "${u.email}", Verified: ${u.isVerified}`);
    });
    process.exit(0);
  } catch (err) {
    console.error("Error inspecting database:", err);
    process.exit(1);
  }
};

run();
