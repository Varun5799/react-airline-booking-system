const express = require("express");
const { createOrder, verifyPayment } = require("../controllers/paymentController");
const protect = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/order", protect, asyncHandler(createOrder));
router.post("/verify", protect, asyncHandler(verifyPayment));

module.exports = router;
