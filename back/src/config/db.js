const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Successfully connected to the DB");
  } catch (error) {
    console.log("Could not connect to the DB");
  }
};

module.exports = { connectDB };
