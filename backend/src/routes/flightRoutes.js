const express = require("express");
const { search, routeDetails } = require("../controllers/flightController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/search", asyncHandler(search));
router.get("/route/:callsign", asyncHandler(routeDetails));

module.exports = router;
