const axios = require("axios");

function normalizeFr24Flight(item) {
  return {
    flightNumber: item.flight || item.callsign || item.fr24_id,
    callsign: item.callsign,
    fr24Id: item.fr24_id,
    airline: item.operated_as || item.painted_as || "FR24",
    airlineCode: item.operated_as || item.painted_as,
    status: "active",
    departureAirport: item.orig_iata || item.orig_icao,
    arrivalAirport: item.dest_iata || item.dest_icao,
    aircraft: item.type,
    registration: item.reg,
    latitude: item.lat,
    longitude: item.lon,
    heading: item.track,
    altitude: item.alt,
    speed: item.gspeed,
    source: "flightradar24"
  };
}

async function getFr24LiveFlights({ bounds, flightNumber, airlineCode } = {}) {
  const token = process.env.FR24_API_TOKEN || process.env.FLIGHTRADAR_API_KEY;

  if (!token || token.includes("your_") || token === "replace_me") {
    return null;
  }

  try {
    const response = await axios.get(
      `${process.env.FR24_API_BASE_URL || "https://fr24api.flightradar24.com"}/api/live/flight-positions/full`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Version": "v1"
        },
        params: {
          bounds: bounds || process.env.FR24_DEFAULT_BOUNDS || "6.0,68.0,37.5,97.5",
          flights: flightNumber || undefined,
          airlines: airlineCode || undefined
        }
      }
    );

    const data = response.data.data || response.data.flights || [];
    return data.map(normalizeFr24Flight).filter((flight) => flight.latitude && flight.longitude);
  } catch (error) {
    console.warn("FR24 API unavailable, using fallback tracking data:", error.response?.status || error.message);
    return null;
  }
}

module.exports = { getFr24LiveFlights };
