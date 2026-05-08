const Booking = require("../models/Booking");

async function createBooking(req, res) {
  const { flight, passenger, payment } = req.body;

  if (!flight || !passenger) {
    return res.status(400).json({ message: "Flight and passenger details are required" });
  }

  const booking = await Booking.create({
    user: req.user._id,
    flight,
    passenger,
    payment: payment || { status: "pending" }
  });

  res.status(201).json({ booking });
}

async function getBookings(req, res) {
  const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ bookings });
}

async function getBooking(req, res) {
  const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }
  res.json({ booking });
}

async function updateBooking(req, res) {
  const booking = await Booking.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  res.json({ booking });
}

async function deleteBooking(req, res) {
  const booking = await Booking.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }
  res.json({ message: "Booking deleted" });
}

module.exports = {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  deleteBooking
};
