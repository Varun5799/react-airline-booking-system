import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import FlightCard from "../components/FlightCard";

export default function SearchPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState({
    from: "DEL",
    to: "BOM",
    date: new Date().toISOString().slice(0, 10),
    passengers: 1
  });
  const [flights, setFlights] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setSearch((current) => ({ ...current, [name]: value }));
  }

  async function handleSearch(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.get("/flights/search", { params: search });
      setFlights(response.data.flights);
    } catch (error) {
      setMessage(error.response?.data?.hint || error.response?.data?.message || "Unable to search flights");
    } finally {
      setLoading(false);
    }
  }

  function openPaymentPage(flight) {
    localStorage.setItem("selectedFlight", JSON.stringify(flight));
    navigate("/payment", { state: { flight } });
  }

  return (
    <main className="page">
      <section className="sky-hero">
        <div className="sky-tabs" aria-label="Travel modes">
          <Link className="sky-tab active" to="/">
            Flights
          </Link>
          <Link className="sky-tab" to="/dashboard">
            Dashboard
          </Link>
          <Link className="sky-tab" to="/track">
            Track Flight
          </Link>
        </div>

        <div className="sky-copy">
          <h1>Millions of routes. One Aerledger search.</h1>
          <p>Book flights, pay safely, and keep every ticket in your own MongoDB-backed dashboard.</p>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <div className="trip-row">
            <button className="trip-type" type="button">
              Return
            </button>
          </div>
          <div className="sky-search-grid">
            <label className="sky-field">
              <span>From</span>
              <input name="from" value={search.from} onChange={handleChange} required maxLength="3" list="airports" />
            </label>
            <button
              className="swap-button"
              type="button"
              onClick={() => setSearch((current) => ({ ...current, from: current.to, to: current.from }))}
              aria-label="Swap airports"
            >
              ⇄
            </button>
            <label className="sky-field">
              <span>To</span>
              <input name="to" value={search.to} onChange={handleChange} required maxLength="3" list="airports" />
            </label>
            <label className="sky-field">
              <span>Depart</span>
              <input name="date" type="date" value={search.date} onChange={handleChange} required />
            </label>
            <label className="sky-field">
              <span>Travellers and cabin class</span>
              <input
                name="passengers"
                type="number"
                min="1"
                value={search.passengers}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <button className="primary-button" type="submit">
            {loading ? "Searching..." : "Search Flights"}
          </button>
          <datalist id="airports">
            <option value="DEL" />
            <option value="BOM" />
            <option value="BLR" />
            <option value="MAA" />
            <option value="HYD" />
            <option value="CCU" />
          </datalist>
          <div className="sky-options">
            <label className="check-option">
              <input type="checkbox" />
              Add nearby airports
            </label>
            <label className="check-option">
              <input type="checkbox" />
              Direct flights
            </label>
            <label className="check-option">
              <input type="checkbox" defaultChecked />
              Add booking to dashboard
            </label>
          </div>
        </form>
      </section>

      {message && <p className="alert">{message}</p>}

      {flights.length > 0 && (
        <div className="section-heading results-heading">
          <div>
            <p className="eyebrow">Available inventory</p>
            <h2>{flights.length} flights found</h2>
          </div>
        </div>
      )}

      <section className="results">
        {flights.map((flight) => (
          <FlightCard key={flight.flightId} flight={flight} onBook={openPaymentPage} />
        ))}
      </section>
    </main>
  );
}
