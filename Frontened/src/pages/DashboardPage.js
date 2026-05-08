import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import AirlineLogo from "../components/AirlineLogo";

export default function DashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await api.get("/bookings");
        setBookings(response.data.bookings);
      } catch (error) {
        setMessage(error.response?.data?.hint || error.response?.data?.message || "Unable to load dashboard");
      }
    }

    loadDashboard();
  }, []);

  const activeBookings = bookings.filter((booking) => booking.status !== "cancelled");
  const paidBookings = bookings.filter((booking) => booking.payment?.status === "paid");

  return (
    <main className="page">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Aeroledger dashboard</p>
          <h1>Your flight ledger at a glance</h1>
          <p>Review bookings, jump back into search, or track a flight already in motion.</p>
        </div>
        <div className="dashboard-actions">
          <Link className="primary-button" to="/">
            Search Flights
          </Link>
          <Link className="secondary-button" to="/track">
            Track Flight
          </Link>
        </div>
      </section>

      {message && <p className="alert">{message}</p>}

      <section className="metric-grid">
        <article className="metric-card">
          <span>Total bookings</span>
          <strong>{bookings.length}</strong>
        </article>
        <article className="metric-card">
          <span>Active trips</span>
          <strong>{activeBookings.length}</strong>
        </article>
        <article className="metric-card">
          <span>Paid tickets</span>
          <strong>{paidBookings.length}</strong>
        </article>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Recent activity</p>
            <h2>Latest bookings</h2>
          </div>
          <Link className="secondary-button" to="/bookings">
            Manage
          </Link>
        </div>
        <div className="dashboard-list">
          {bookings.length === 0 && <p className="page-message">No bookings yet.</p>}
          {bookings.slice(0, 4).map((booking) => (
            <article className="dashboard-row" key={booking._id}>
              <AirlineLogo airline={booking.flight.airline} />
              <div>
                <strong>{booking.flight.flightId}</strong>
                <p className="muted">
                  {booking.flight.from} to {booking.flight.to} for {booking.passenger.fullName}
                </p>
              </div>
              <span className={booking.status === "cancelled" ? "status cancelled" : "status"}>{booking.status}</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
