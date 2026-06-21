require("dotenv").config();
const mongoose = require("mongoose");

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    const indexes = await db.collection("users").indexes();
    console.log("Indexes on 'users' collection:");
    console.log(JSON.stringify(indexes, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error("Error inspecting indexes:", err);
    process.exit(1);
  }
};

run();
