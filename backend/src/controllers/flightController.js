const { searchFlights } = require("../services/aviationstackService");
const { enrichRoute } = require("../services/adsbdbService");

async function search(req, res) {
  const { from, to, date, passengers } = req.query;

  if (!from || !to || !date) {
    return res.status(400).json({ message: "From, to, and date are required" });
  }

  const flights = await searchFlights({ from, to, date, passengers });
  res.json({ flights });
}

async function routeDetails(req, res) {
  const { callsign } = req.params;
  const route = await enrichRoute(callsign);
  res.json({ route });
}

module.exports = { search, routeDetails };
