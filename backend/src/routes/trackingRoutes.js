const express = require("express");
const { track, live } = require("../controllers/trackingController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(track));
router.get("/live", asyncHandler(live));

module.exports = router;
