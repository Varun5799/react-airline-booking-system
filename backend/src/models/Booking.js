const mongoose = require("mongoose");

const passengerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    phoneNumber: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    flight: {
      flightId: { type: String, required: true },
      airline: { type: String, required: true },
      from: { type: String, required: true },
      to: { type: String, required: true },
      departureTime: { type: String, required: true },
      arrivalTime: { type: String, required: true },
      price: { type: Number, required: true }
    },
    passenger: {
      type: passengerSchema,
      required: true
    },
    payment: {
      paymentId: { type: String },
      orderId: { type: String },
      amount: { type: Number },
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
      }
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
