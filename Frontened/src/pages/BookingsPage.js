import { useEffect, useState } from "react";
import api from "../api/api";
import AirlineLogo from "../components/AirlineLogo";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  async function loadBookings() {
    try {
      const response = await api.get("/bookings");
      setBookings(response.data.bookings);
    } catch (error) {
      setMessage(error.response?.data?.hint || error.response?.data?.message || "Unable to load bookings");
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function cancelBooking(id) {
    try {
      await api.put(`/bookings/${id}`, { status: "cancelled" });
      loadBookings();
    } catch (error) {
      setMessage(error.response?.data?.hint || error.response?.data?.message || "Unable to cancel booking");
    }
  }

  async function deleteBooking(id) {
    try {
      await api.delete(`/bookings/${id}`);
      loadBookings();
    } catch (error) {
      setMessage(error.response?.data?.hint || error.response?.data?.message || "Unable to delete booking");
    }
  }

  return (
    <main className="page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">CRUD operations</p>
          <h1>Aeroledger Bookings</h1>
        </div>
      </div>

      {message && <p className="alert">{message}</p>}

      <section className="booking-list">
        {bookings.length === 0 && <p className="page-message">No bookings yet.</p>}
        {bookings.map((booking) => (
          <article className="booking-card" key={booking._id}>
            <div className="airline-cell">
              <AirlineLogo airline={booking.flight.airline} />
              <div>
                <p className="muted">{booking.flight.airline}</p>
                <h3>{booking.flight.flightId}</h3>
              </div>
            </div>
            <p>
              {booking.flight.from} to {booking.flight.to}
            </p>
            <p>{booking.passenger.fullName}</p>
            <p>{booking.passenger.phoneNumber}</p>
            <p className={booking.status === "cancelled" ? "status cancelled" : "status"}>{booking.status}</p>
            <div className="button-row">
              <button className="secondary-button" onClick={() => cancelBooking(booking._id)}>
                Cancel
              </button>
              <button className="danger-button" onClick={() => deleteBooking(booking._id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
