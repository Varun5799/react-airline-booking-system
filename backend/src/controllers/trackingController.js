const { trackFlight, getLiveFlights } = require("../services/aviationstackService");

async function track(req, res) {
  const { flightNumber } = req.query;

  if (!flightNumber) {
    return res.status(400).json({ message: "Flight number is required" });
  }

  const tracking = await trackFlight(flightNumber);
  res.json({ tracking });
}

async function live(req, res) {
  const { airlineCode, flightNumber } = req.query;
  const flights = await getLiveFlights({ airlineCode, flightNumber });
  res.json({ flights });
}

module.exports = { track, live };
