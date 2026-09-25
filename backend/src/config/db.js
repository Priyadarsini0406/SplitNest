const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoURI =
    process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error(
      "MongoDB URI is missing. Add MONGO_URI or MONGODB_URI in backend/.env"
    );
  }

  try {
    const connection = await mongoose.connect(mongoURI);

    console.log(
      `MongoDB Connected: ${connection.connection.host}`
    );

    return connection;
  } catch (error) {
    console.error(
      "MongoDB Connection Error:",
      error.message
    );

    throw error;
  }
};

module.exports = connectDB;
