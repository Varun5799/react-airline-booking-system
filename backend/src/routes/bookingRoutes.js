const express = require("express");
const {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  deleteBooking
} = require("../controllers/bookingController");
const protect = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.use(protect);
router.route("/").post(asyncHandler(createBooking)).get(asyncHandler(getBookings));
router
  .route("/:id")
  .get(asyncHandler(getBooking))
  .put(asyncHandler(updateBooking))
  .delete(asyncHandler(deleteBooking));

module.exports = router;
