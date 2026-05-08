const mongoose = require("mongoose");

async function connectDB() {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/flight_booking_system";
    const connection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB connected: ${connection.connection.host}/${connection.connection.name}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.error("Start MongoDB locally or update MONGO_URI in backend/.env.");
  }
}

module.exports = connectDB;
