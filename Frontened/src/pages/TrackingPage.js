import { useState } from "react";
import api from "../api/api";
import AirlineLogo from "../components/AirlineLogo";
import FlightRadarMap from "../components/FlightRadarMap";

export default function TrackingPage() {
  const [flightNumber, setFlightNumber] = useState("AI202");
  const [airlineCode, setAirlineCode] = useState("AI");
  const [tracking, setTracking] = useState(null);
  const [liveFlights, setLiveFlights] = useState([]);
  const [route, setRoute] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const trackingResponse = await api.get("/tracking", { params: { flightNumber } });
      const liveResponse = await api.get("/tracking/live", { params: { flightNumber, airlineCode } });
      const routeResponse = await api.get(`/flights/route/${flightNumber}`);

      setTracking(trackingResponse.data.tracking);
      setLiveFlights(liveResponse.data.flights);
      setRoute(routeResponse.data.route);
    } catch (error) {
      setMessage(error.response?.data?.hint || error.response?.data?.message || "Unable to track flight");
    } finally {
      setLoading(false);
    }
  }

  function selectLiveFlight(flight) {
    setTracking(flight);
    setFlightNumber(flight.flightNumber || flightNumber);
    setAirlineCode(flight.airlineCode || airlineCode);
  }

  const displayedFlights = liveFlights.length > 0 ? liveFlights : tracking ? [tracking] : [];

  return (
    <main className="page">
      <section className="tracker-hero">
        <div>
          <p className="eyebrow">Real-time flight tracking</p>
          <h1>Track aircraft position, heading, and altitude</h1>
          <p>Aviationstack provides live status where available; Aerledger shows reliable demo traffic in mock mode.</p>
        </div>
        <form className="search-form compact" onSubmit={handleSubmit}>
          <label className="sky-field">
            <span>Flight number</span>
            <input value={flightNumber} onChange={(event) => setFlightNumber(event.target.value.toUpperCase())} required />
          </label>
          <label className="sky-field">
            <span>Airline code</span>
            <input value={airlineCode} onChange={(event) => setAirlineCode(event.target.value.toUpperCase())} maxLength="3" />
          </label>
          <button className="primary-button" type="submit">
            {loading ? "Tracking..." : "Track"}
          </button>
        </form>
      </section>

      {message && <p className="alert">{message}</p>}

      {tracking && (
        <section className="tracker-shell">
          <div className="tracker-sequence">
            <span>1</span>
            <div>
              <strong>Locate live aircraft</strong>
              <p>Choose a flight from the radar map or the nearby aircraft list.</p>
            </div>
          </div>

          <div className="tracker-grid">
            <article className="flight-map">
              <div className="map-topbar">
                <strong>Flightradar24-style live map</strong>
                <span>{displayedFlights.length} aircraft</span>
              </div>
              <FlightRadarMap flights={displayedFlights} selectedFlight={tracking} onSelectFlight={selectLiveFlight} />
              <div className="map-overlay">
                <AirlineLogo airline={tracking.airline} code={tracking.airlineCode} />
                <div>
                  <strong>{tracking.flightNumber}</strong>
                  <p>{tracking.airline} {tracking.source === "flightradar24" ? "via FR24 API" : ""}</p>
                </div>
              </div>
            </article>

            <article className="tracker-summary">
              <AirlineLogo airline={tracking.airline} code={tracking.airlineCode} />
              <div>
                <p className="eyebrow">Selected aircraft</p>
                <h2>{tracking.flightNumber}</h2>
                <span className="status">{tracking.status}</span>
              </div>
            </article>

            <article className="telemetry-panel">
              <div className="tracker-panel-heading">
                <span>2</span>
                <div>
                  <p className="eyebrow">Telemetry</p>
                  <h2>Current movement</h2>
                </div>
              </div>
              <div className="telemetry-grid">
                <div>
                  <span>Heading</span>
                  <strong>{tracking.heading ? `${tracking.heading} deg` : "N/A"}</strong>
                </div>
                <div>
                  <span>Altitude</span>
                  <strong>{tracking.altitude ? `${tracking.altitude} ft` : "N/A"}</strong>
                </div>
                <div>
                  <span>Speed</span>
                  <strong>{tracking.speed ? `${tracking.speed} km/h` : "N/A"}</strong>
                </div>
                <div>
                  <span>Gate</span>
                  <strong>{tracking.gate || "N/A"}</strong>
                </div>
              </div>
              <div className="position-card">
                <span>Position</span>
                <strong>
                  {tracking.latitude || "N/A"}, {tracking.longitude || "N/A"}
                </strong>
              </div>
            </article>
          </div>

          <section className="tracker-bottom-grid">
            <article className="panel">
              <div className="tracker-panel-heading">
                <span>3</span>
                <div>
                  <p className="eyebrow">Nearby aircraft</p>
                  <h2>Tap to inspect</h2>
                </div>
              </div>
              <div className="live-list">
                {displayedFlights.map((flight) => (
                  <button className="live-flight-row" key={flight.flightNumber} onClick={() => selectLiveFlight(flight)} type="button">
                    <AirlineLogo airline={flight.airline} code={flight.airlineCode} />
                    <span>
                      <strong>{flight.flightNumber}</strong>
                      <small>
                        {flight.airline} - {flight.altitude || "N/A"} ft - {flight.heading || "N/A"} deg
                      </small>
                    </span>
                  </button>
                ))}
              </div>
            </article>

            <article className="panel route-panel">
              <div className="tracker-panel-heading">
                <span>4</span>
                <div>
                  <p className="eyebrow">Route information</p>
                  <h2>Flight path details</h2>
                </div>
              </div>
              <div>
                <p>Departure: {tracking.departureAirport}</p>
                <p>Arrival: {tracking.arrivalAirport}</p>
                {route && (
                  <>
                    <p>Callsign: {route.callsign}</p>
                    <p>Aircraft: {route.aircraft}</p>
                    <p>Registration: {route.registration}</p>
                    <p>
                      Route: {route.origin} to {route.destination}
                    </p>
                  </>
                )}
              </div>
            </article>
          </section>
        </section>
      )}
    </main>
  );
}
