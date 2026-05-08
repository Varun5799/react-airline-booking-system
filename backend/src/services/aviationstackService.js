const axios = require("axios");
const { getFr24LiveFlights } = require("./flightradar24Service");

const airportLocations = {
  DEL: { name: "Delhi Indira Gandhi International", latitude: 28.5562, longitude: 77.1000 },
  BOM: { name: "Mumbai Chhatrapati Shivaji Maharaj", latitude: 19.0896, longitude: 72.8656 },
  DXB: { name: "Dubai International", latitude: 25.2532, longitude: 55.3657 },
  DOH: { name: "Hamad International", latitude: 25.2736, longitude: 51.6080 },
  JFK: { name: "John F. Kennedy International", latitude: 40.6413, longitude: -73.7781 },
  BLR: { name: "Bengaluru Kempegowda", latitude: 13.1986, longitude: 77.7066 },
  COK: { name: "Cochin International", latitude: 9.9699, longitude: 76.2999 },
  SHJ: { name: "Sharjah International", latitude: 25.3286, longitude: 55.5170 },
  MAA: { name: "Chennai International", latitude: 12.9941, longitude: 80.1709 },
  HYD: { name: "Rajiv Gandhi International", latitude: 17.2403, longitude: 78.4294 },
  CCU: { name: "Netaji Subhas Chandra Bose International", latitude: 22.6517, longitude: 88.4467 }
};

const mockFlightTemplates = [
  {
    flightId: "AI-202",
    airline: "Air India",
    airlineCode: "AI",
    from: "DEL",
    to: "BOM",
    departureTime: "09:30",
    arrivalTime: "11:45",
    duration: "2h 15m",
    price: 5800,
    seatsAvailable: 18,
    aircraft: "A320"
  },
  {
    flightId: "6E-531",
    airline: "IndiGo",
    airlineCode: "6E",
    from: "DEL",
    to: "BOM",
    departureTime: "13:20",
    arrivalTime: "15:30",
    duration: "2h 10m",
    price: 5200,
    seatsAvailable: 24,
    aircraft: "A321"
  },
  {
    flightId: "UK-955",
    airline: "Vistara",
    airlineCode: "UK",
    from: "DEL",
    to: "BOM",
    departureTime: "19:10",
    arrivalTime: "21:25",
    duration: "2h 15m",
    price: 6400,
    seatsAvailable: 9,
    aircraft: "B737"
  },
  {
    flightId: "SG-789",
    airline: "SpiceJet",
    airlineCode: "SG",
    from: "BOM",
    to: "BLR",
    departureTime: "08:15",
    arrivalTime: "10:30",
    duration: "2h 15m",
    price: 5000,
    seatsAvailable: 22,
    aircraft: "B737"
  },
  {
    flightId: "QP-121",
    airline: "Akasa Air",
    airlineCode: "QP",
    from: "DEL",
    to: "BLR",
    departureTime: "11:00",
    arrivalTime: "13:20",
    duration: "2h 20m",
    price: 5400,
    seatsAvailable: 16,
    aircraft: "A320"
  },
  {
    flightId: "EK-561",
    airline: "Emirates",
    airlineCode: "EK",
    from: "DEL",
    to: "DXB",
    departureTime: "02:45",
    arrivalTime: "05:15",
    duration: "3h 30m",
    price: 28500,
    seatsAvailable: 12,
    aircraft: "B777"
  },
  {
    flightId: "I5-321",
    airline: "AirAsia",
    airlineCode: "I5",
    from: "MAA",
    to: "DXB",
    departureTime: "14:50",
    arrivalTime: "17:20",
    duration: "2h 30m",
    price: 4700,
    seatsAvailable: 20,
    aircraft: "A320"
  },
  {
    flightId: "9W-101",
    airline: "Jet Airways",
    airlineCode: "9W",
    from: "BLR",
    to: "DEL",
    departureTime: "18:00",
    arrivalTime: "20:10",
    duration: "2h 10m",
    price: 6100,
    seatsAvailable: 7,
    aircraft: "B737"
  },
  {
    flightId: "IX-408",
    airline: "Air India Express",
    airlineCode: "IX",
    from: "DEL",
    to: "COK",
    departureTime: "15:10",
    arrivalTime: "18:25",
    duration: "3h 15m",
    price: 6500,
    seatsAvailable: 14,
    aircraft: "B737"
  },
  {
    flightId: "G9-254",
    airline: "Air Arabia",
    airlineCode: "G9",
    from: "DEL",
    to: "SHJ",
    departureTime: "07:40",
    arrivalTime: "10:20",
    duration: "2h 40m",
    price: 17000,
    seatsAvailable: 10,
    aircraft: "A320"
  },
  {
    flightId: "QR-601",
    airline: "Qatar Airways",
    airlineCode: "QR",
    from: "DOH",
    to: "JFK",
    departureTime: "03:15",
    arrivalTime: "11:45",
    duration: "14h 30m",
    price: 82000,
    seatsAvailable: 8,
    aircraft: "A350"
  }
];

function getAirportInfo(code) {
  const location = airportLocations[code?.trim()?.toUpperCase()];
  return location || { name: code || "Unknown airport", latitude: 0, longitude: 0 };
}

function interpolatePosition(origin, destination, progress) {
  return {
    latitude: origin.latitude + (destination.latitude - origin.latitude) * progress,
    longitude: origin.longitude + (destination.longitude - origin.longitude) * progress
  };
}

function buildMockFlight(flight, progress = 0.5, dayOffset = 0, overrideFrom, overrideTo) {
  const originCode = overrideFrom || flight.from;
  const destinationCode = overrideTo || flight.to;
  const origin = getAirportInfo(originCode);
  const destination = getAirportInfo(destinationCode);
  const position = interpolatePosition(origin, destination, progress);

  return {
    ...flight,
    from: originCode,
    to: destinationCode,
    departureAirport: origin.name,
    arrivalAirport: destination.name,
    departureCoordinates: origin,
    arrivalCoordinates: destination,
    latitude: position.latitude,
    longitude: position.longitude,
    price: Math.max(1800, flight.price + dayOffset * 25),
    seatsAvailable: 3 + ((dayOffset + 5) % 12)
  };
}

function formatFlightTime(timestamp) {
  if (!timestamp) {
    return "N/A";
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return String(timestamp).slice(11, 16);
  }

  return date.toISOString().slice(11, 16);
}

function formatFlightDuration(start, end) {
  const startDate = start ? new Date(start) : null;
  const endDate = end ? new Date(end) : null;

  if (!startDate || !endDate || Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return "N/A";
  }

  const diffMinutes = Math.round(Math.abs(endDate - startDate) / 60000);
  return `${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}m`;
}

function normalizeSearchFlight(item) {
  const departureTime = item.departure?.scheduled || item.departure?.actual || item.departure?.estimated;
  const arrivalTime = item.arrival?.scheduled || item.arrival?.actual || item.arrival?.estimated;
  const flightId = item.flight?.iata || item.flight?.number || item.flight?.icao || `${item.airline?.iata || "XX"}${item.flight?.number || ""}`;
  const airline = item.airline?.name || item.airline?.iata || item.airline?.icao || "Unknown";

  return {
    flightId,
    airline,
    airlineCode: item.airline?.iata || item.airline?.icao || "--",
    from: item.departure?.iata || item.departure?.icao || "",
    to: item.arrival?.iata || item.arrival?.icao || "",
    departureTime: formatFlightTime(departureTime),
    arrivalTime: formatFlightTime(arrivalTime),
    duration: formatFlightDuration(departureTime, arrivalTime),
    price: Math.max(1800, 2500 + Math.floor(Math.random() * 2400)),
    seatsAvailable: 5 + Math.floor(Math.random() * 22),
    aircraft: item.aircraft?.iata || item.aircraft?.icao || item.aircraft?.registration || "Standard"
  };
}

async function searchFlights({ from, to, date, passengers = 1 }) {
  const useMock = process.env.USE_MOCK_EXTERNALS !== "false";
  const apiKey = process.env.AVIATIONSTACK_KEY || process.env.AVIATIONSTACK_API_KEY;
  const requestedFrom = from.toUpperCase();
  const requestedTo = to.toUpperCase();
  const dayNumber = Number(date.slice(-2)) || 1;
  const flightCount = dayNumber % 5 === 4 ? 5 : 2 + ((dayNumber % 3) || 1);

  if (useMock || !apiKey) {
    const routeMatches = mockFlightTemplates.filter(
      (flight) =>
        (flight.from === requestedFrom && flight.to === requestedTo) ||
        (flight.from === requestedTo && flight.to === requestedFrom)
    );

    const extras = mockFlightTemplates.filter(
      (flight) =>
        !routeMatches.includes(flight) &&
        (flight.from === requestedFrom ||
          flight.to === requestedTo ||
          flight.from === requestedTo ||
          flight.to === requestedFrom)
    );

    const candidates = routeMatches.length ? [...routeMatches, ...extras] : [...extras];

    const flights = candidates.slice(0, Math.min(flightCount, candidates.length)).map((flight, index) => {
      const progress = 0.25 + ((index * 0.18) % 0.55);
      const dayOffset = dayNumber + index;
      const overrideFrom = !routeMatches.includes(flight) ? requestedFrom : undefined;
      const overrideTo = !routeMatches.includes(flight) ? requestedTo : undefined;
      return buildMockFlight(flight, progress, dayOffset, overrideFrom, overrideTo);
    });

    if (flights.length === 0) {
      const origin = getAirportInfo(requestedFrom);
      const destination = getAirportInfo(requestedTo);
      const fallbackFlight = {
        flightId: `${requestedFrom}${requestedTo}${dayNumber}`,
        airline: "Aeroledger",
        airlineCode: "AL",
        from: requestedFrom,
        to: requestedTo,
        departureTime: "08:00",
        arrivalTime: "12:00",
        duration: "4h 00m",
        price: 5200 + dayNumber * 50,
        seatsAvailable: 10,
        aircraft: "A320"
      };
      return [buildMockFlight(fallbackFlight, 0.45, dayNumber)];
    }

    return flights;
  }

  const response = await axios.get(`${process.env.AVIATIONSTACK_BASE_URL || "https://api.aviationstack.com/v1"}/flights`, {
    params: {
      access_key: apiKey,
      dep_iata: requestedFrom,
      arr_iata: requestedTo,
      flight_date: date,
      limit: 12
    }
  });

  return (response.data?.data || []).map(normalizeSearchFlight).filter((flight) => flight.flightId && flight.from && flight.to);
}

const mockLiveFlights = [
  {
    flightNumber: "AI202",
    airline: "Air India",
    airlineCode: "AI",
    status: "active",
    departureAirport: "Delhi Indira Gandhi International",
    arrivalAirport: "Mumbai Chhatrapati Shivaji Maharaj",
    latitude: 25.0,
    longitude: 76.0,
    heading: 242,
    altitude: 33000,
    speed: 785
  },
  {
    flightNumber: "6E531",
    airline: "IndiGo",
    airlineCode: "6E",
    status: "active",
    departureAirport: "Delhi Indira Gandhi International",
    arrivalAirport: "Mumbai Chhatrapati Shivaji Maharaj",
    latitude: 23.5,
    longitude: 75.0,
    heading: 250,
    altitude: 35000,
    speed: 812
  },
  {
    flightNumber: "UK955",
    airline: "Vistara",
    airlineCode: "UK",
    status: "active",
    departureAirport: "Delhi Indira Gandhi International",
    arrivalAirport: "Mumbai Chhatrapati Shivaji Maharaj",
    latitude: 24.8,
    longitude: 77.3,
    heading: 235,
    altitude: 31000,
    speed: 768
  },
  {
    flightNumber: "SG789",
    airline: "SpiceJet",
    airlineCode: "SG",
    status: "active",
    departureAirport: "Mumbai Chhatrapati Shivaji Maharaj",
    arrivalAirport: "Bengaluru Kempegowda",
    latitude: 20.2,
    longitude: 74.3,
    heading: 210,
    altitude: 32000,
    speed: 760
  },
  {
    flightNumber: "G9254",
    airline: "Air Arabia",
    airlineCode: "G9",
    status: "active",
    departureAirport: "Delhi Indira Gandhi International",
    arrivalAirport: "Sharjah International",
    latitude: 26.0,
    longitude: 55.7,
    heading: 220,
    altitude: 34000,
    speed: 820
  },
  {
    flightNumber: "JA701",
    airline: "Jet Airways",
    airlineCode: "9W",
    status: "active",
    departureAirport: "Chennai International",
    arrivalAirport: "Ahmedabad",
    latitude: 18.5,
    longitude: 75.5,
    heading: 195,
    altitude: 34000,
    speed: 790
  },
  {
    flightNumber: "EK561",
    airline: "Emirates",
    airlineCode: "EK",
    status: "active",
    departureAirport: "Delhi Indira Gandhi International",
    arrivalAirport: "Dubai International",
    latitude: 25.1,
    longitude: 55.2,
    heading: 270,
    altitude: 36000,
    speed: 890
  },
  {
    flightNumber: "QR601",
    airline: "Qatar Airways",
    airlineCode: "QR",
    status: "active",
    departureAirport: "Hamad International",
    arrivalAirport: "John F. Kennedy International",
    latitude: 25.0,
    longitude: 55.3,
    heading: 290,
    altitude: 39000,
    speed: 930
  },
  {
    flightNumber: "IX408",
    airline: "Air India Express",
    airlineCode: "IX",
    status: "active",
    departureAirport: "Delhi Indira Gandhi International",
    arrivalAirport: "Cochin International",
    latitude: 17.5,
    longitude: 76.2,
    heading: 225,
    altitude: 33000,
    speed: 780
  },
  {
    flightNumber: "I5321",
    airline: "AirAsia",
    airlineCode: "I5",
    status: "active",
    departureAirport: "Chennai International",
    arrivalAirport: "Dubai International",
    latitude: 19.2,
    longitude: 60.5,
    heading: 250,
    altitude: 35000,
    speed: 810
  }
];

function normalizeLiveFlight(item) {
  return {
    flightNumber: item.flight && item.flight.iata,
    airline: item.airline && item.airline.name,
    airlineCode: item.airline && item.airline.iata,
    status: item.flight_status,
    departureAirport: item.departure && item.departure.airport,
    arrivalAirport: item.arrival && item.arrival.airport,
    scheduledDeparture: item.departure && item.departure.scheduled,
    scheduledArrival: item.arrival && item.arrival.scheduled,
    terminal: item.departure && item.departure.terminal,
    gate: item.departure && item.departure.gate,
    latitude: item.live && item.live.latitude,
    longitude: item.live && item.live.longitude,
    heading: item.live && item.live.direction,
    altitude: item.live && item.live.altitude,
    speed: item.live && item.live.speed_horizontal
  };
}

async function trackFlight(flightNumber) {
  const useMock = process.env.USE_MOCK_EXTERNALS !== "false";
  const apiKey = process.env.AVIATIONSTACK_KEY || process.env.AVIATIONSTACK_API_KEY;
  const fr24Flights = await getFr24LiveFlights({ flightNumber });

  if (fr24Flights && fr24Flights.length > 0) {
    return fr24Flights[0];
  }

  if (useMock || !apiKey) {
    const normalizedFlightNumber = flightNumber.replace("-", "").toUpperCase();
    return (
      mockLiveFlights.find((flight) => flight.flightNumber.replace("-", "").toUpperCase() === normalizedFlightNumber) ||
      mockLiveFlights[0]
    );
  }

  const response = await axios.get(`${process.env.AVIATIONSTACK_BASE_URL || "https://api.aviationstack.com/v1"}/flights`, {
    params: {
      access_key: apiKey,
      flight_iata: flightNumber
    }
  });

  const item = response.data.data[0];
  if (!item) {
    return { flightNumber, status: "not_found" };
  }

  return normalizeLiveFlight(item);
}

async function getLiveFlights({ airlineCode, flightNumber } = {}) {
  const useMock = process.env.USE_MOCK_EXTERNALS !== "false";
  const apiKey = process.env.AVIATIONSTACK_KEY || process.env.AVIATIONSTACK_API_KEY;
  const fr24Flights = await getFr24LiveFlights({ airlineCode, flightNumber });

  if (fr24Flights && fr24Flights.length > 0) {
    return fr24Flights;
  }

  if (useMock || !apiKey) {
    const normalizedFlightNumber = flightNumber && flightNumber.replace("-", "").toUpperCase();
    const normalizedAirline = airlineCode && airlineCode.toUpperCase();

    return mockLiveFlights.filter((flight) => {
      const matchesFlight = normalizedFlightNumber
        ? flight.flightNumber.replace("-", "").toUpperCase().includes(normalizedFlightNumber)
        : true;
      const matchesAirline = normalizedAirline ? flight.airlineCode === normalizedAirline : true;
      return matchesFlight && matchesAirline;
    });
  }

  const response = await axios.get(`${process.env.AVIATIONSTACK_BASE_URL || "https://api.aviationstack.com/v1"}/flights`, {
    params: {
      access_key: apiKey,
      airline_iata: airlineCode || undefined,
      flight_iata: flightNumber || undefined,
      flight_status: "active",
      limit: 20
    }
  });

  return response.data.data.map(normalizeLiveFlight).filter((flight) => flight.latitude && flight.longitude);
}

module.exports = { trackFlight, getLiveFlights, searchFlights };
