const axios = require("axios");

async function health(req, res) {
  const useMock = process.env.USE_MOCK_EXTERNALS !== "false";
  const amadeusConfigured = Boolean(
    process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET && !useMock
  );
  const aviationstackConfigured = Boolean(process.env.AVIATIONSTACK_KEY && !useMock);
  const fr24Configured = Boolean(process.env.FR24_API_TOKEN && !useMock);

  const status = {
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    database: Boolean(process.env.MONGO_URI),
    useMockExternalServices: useMock,
    realServiceConfiguration: {
      amadeus: amadeusConfigured,
      aviationstack: aviationstackConfigured,
      flightradar24: fr24Configured
    }
  };

  if (useMock) {
    status.message =
      "Mock external services are enabled. Set USE_MOCK_EXTERNALS=false and provide API keys to use real flight APIs.";
  } else {
    status.message = "Real external service mode is enabled. API keys should be configured.";
  }

  return res.json({ status });
}

module.exports = { health };
