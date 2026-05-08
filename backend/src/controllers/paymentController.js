const crypto = require("crypto");

function createOrder(req, res) {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Valid amount is required" });
  }

  res.status(201).json({
    orderId: `order_${crypto.randomBytes(8).toString("hex")}`,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || "rzp_test_local_clone",
    amount,
    currency: "INR",
    status: "created"
  });
}

function verifyPayment(req, res) {
  const { orderId, amount } = req.body;

  if (!orderId || !amount) {
    return res.status(400).json({ message: "Order ID and amount are required" });
  }

  res.json({
    paymentId: `pay_${crypto.randomBytes(8).toString("hex")}`,
    orderId,
    amount,
    status: "paid"
  });
}

module.exports = { createOrder, verifyPayment };
