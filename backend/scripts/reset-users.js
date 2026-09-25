require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");

const collectionsToClear = [
  "users",
  "bookings",
  "notifications",
  "properties",
  "roommatelistings",
];

(async () => {
  try {
    await connectDB();
    const usersCollection = mongoose.connection.db.collection("users");
    const indexes = await usersCollection.indexes().catch(() => []);
    if (indexes.some((index) => index.name === "email_1")) {
      await usersCollection.dropIndex("email_1");
      console.log("Dropped old email_1 unique index.");
    }

    for (const name of collectionsToClear) {
      const exists = await mongoose.connection.db.listCollections({ name }).hasNext();
      if (exists) {
        const result = await mongoose.connection.db.collection(name).deleteMany({});
        console.log(`${name}: deleted ${result.deletedCount}`);
      }
    }
    await usersCollection.createIndex(
      { email: 1, role: 1 },
      { unique: true, name: "email_1_role_1" }
    );
    console.log("Created email + role unique index.");
    console.log("Old SplitNest user/owner data cleared successfully.");
  } catch (error) {
    console.error("Reset failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
