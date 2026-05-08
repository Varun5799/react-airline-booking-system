const axios = require("axios");

async function enrichRoute(callsign) {
  const useMock = process.env.USE_MOCK_EXTERNALS !== "false";

  if (useMock) {
    return {
      callsign,
      aircraft: "Airbus A320",
      registration: "VT-DEMO",
      origin: "DEL",
      destination: "BOM",
      routeQuality: "mocked"
    };
  }

  const response = await axios.get(`${process.env.ADSBDB_BASE_URL || "https://api.adsbdb.com/v1"}/callsign/${callsign}`);
  const aircraft = response.data.response && response.data.response.aircraft;

  return {
    callsign,
    aircraft: aircraft && aircraft.type,
    registration: aircraft && aircraft.registration,
    origin: response.data.response && response.data.response.flightroute && response.data.response.flightroute.origin,
    destination:
      response.data.response && response.data.response.flightroute && response.data.response.flightroute.destination,
    routeQuality: "live"
  };
}

module.exports = { enrichRoute };
