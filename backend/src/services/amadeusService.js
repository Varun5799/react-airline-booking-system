const axios = require("axios");

const mockTemplates = [
  { airline: "Air India", airlineCode: "AI", aircraft: "A320", basePrice: 5800 },
  { airline: "IndiGo", airlineCode: "6E", aircraft: "A321", basePrice: 5200 },
  { airline: "Vistara", airlineCode: "UK", aircraft: "B737", basePrice: 6400 },
  { airline: "SpiceJet", airlineCode: "SG", aircraft: "B737", basePrice: 4700 },
  { airline: "GoAir", airlineCode: "G8", aircraft: "A320", basePrice: 4500 }
];

function formatTime(date) {
  return date.toISOString().slice(11, 16);
}

function createMockFlights({ from, to, date, passengers }) {
  const searchDate = new Date(`${date}T06:00:00`);
  const results = mockTemplates.map((template, index) => {
    const departure = new Date(searchDate.getTime() + index * 75 * 60000 + 15 * 60000);
    const durationMinutes = 110 + index * 15;
    const arrival = new Date(departure.getTime() + durationMinutes * 60000);

    return {
      flightId: `${template.airlineCode}-${250 + index}`,
      airline: template.airline,
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      departureTime: formatTime(departure),
      arrivalTime: formatTime(arrival),
      duration: `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`,
      price: Math.max(1200, Math.round(template.basePrice + index * 420 + Math.random() * 300)),
      seatsAvailable: 8 + index * 6,
      aircraft: template.aircraft,
      searchDate: date,
      passengers: Number(passengers)
    };
  });

  return results;
}

async function getAccessToken() {
  const clientId = process.env.AMADEUS_API_KEY || process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_API_SECRET || process.env.AMADEUS_CLIENT_SECRET;

  const response = await axios.post(
    `${process.env.AMADEUS_BASE_URL || "https://test.api.amadeus.com"}/v1/security/oauth2/token`,
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret
    })
  );
  return response.data.access_token;
}

function normalizeAmadeusOffer(offer) {
  const itinerary = offer.itineraries[0];
  const segment = itinerary.segments[0];

  return {
    flightId: `${segment.carrierCode}-${segment.number}`,
    airline: segment.carrierCode,
    from: segment.departure.iataCode,
    to: segment.arrival.iataCode,
    departureTime: segment.departure.at,
    arrivalTime: segment.arrival.at,
    duration: itinerary.duration,
    price: Number(offer.price.total),
    seatsAvailable: offer.numberOfBookableSeats || 0,
    aircraft: segment.aircraft && segment.aircraft.code
  };
}

async function searchFlights({ from, to, date, passengers = 1 }) {
  const useMock = process.env.USE_MOCK_EXTERNALS !== "false";
  const clientId = process.env.AMADEUS_API_KEY || process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_API_SECRET || process.env.AMADEUS_CLIENT_SECRET;

  if (useMock || !clientId || !clientSecret) {
    return createMockFlights({ from, to, date, passengers });
  }

  const token = await getAccessToken();
  const response = await axios.get(`${process.env.AMADEUS_BASE_URL || "https://test.api.amadeus.com"}/v2/shopping/flight-offers`, {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      originLocationCode: from.toUpperCase(),
      destinationLocationCode: to.toUpperCase(),
      departureDate: date,
      adults: passengers,
      currencyCode: "INR",
      max: 8
    }
  });

  return response.data.data.map(normalizeAmadeusOffer);
}

module.exports = { searchFlights };
