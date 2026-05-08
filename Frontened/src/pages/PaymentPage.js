import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import useAuth from "../hooks/useAuth";
import BookingForm from "../components/BookingForm";
import AirlineLogo from "../components/AirlineLogo";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedFlight, setSelectedFlight] = useState(
    location.state?.flight || JSON.parse(localStorage.getItem("selectedFlight") || "null")
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.flight) {
      localStorage.setItem("selectedFlight", JSON.stringify(location.state.flight));
      setSelectedFlight(location.state.flight);
    }
  }, [location.state?.flight]);

  async function handleBooking(passenger) {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!selectedFlight) {
      setMessage("Please choose a flight from search first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const orderResponse = await api.post("/payments/order", { amount: selectedFlight.price });
      const paymentResponse = await api.post("/payments/verify", {
        orderId: orderResponse.data.orderId,
        amount: orderResponse.data.amount
      });

      await api.post("/bookings", {
        flight: selectedFlight,
        passenger,
        payment: paymentResponse.data
      });

      localStorage.removeItem("selectedFlight");
      navigate("/bookings");
    } catch (error) {
      setMessage(error.response?.data?.hint || error.response?.data?.message || "Unable to complete payment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="sky-hero">
        <div className="sky-copy">
          <h1>Payment to do</h1>
          <p>Complete payment here on localhost before your booking is confirmed.</p>
        </div>
      </section>

      {message && <p className="alert">{message}</p>}
      {loading && <p className="muted">Processing payment... please wait.</p>}

      {!selectedFlight ? (
        <section className="panel">
          <div className="section-heading">
            <h2>No flight selected</h2>
          </div>
          <p>Please return to search and choose a flight to pay for.</p>
          <button className="primary-button" type="button" onClick={() => navigate("/")}>
            Back to search
          </button>
        </section>
      ) : (
        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="muted">Ready to pay</p>
              <h2>{selectedFlight.flightId}</h2>
            </div>
            <AirlineLogo airline={selectedFlight.airline} code={selectedFlight.airlineCode} />
          </div>

          <div className="flight-route">
            <strong>{selectedFlight.from}</strong>
            <span>{selectedFlight.duration || "Direct"}</span>
            <strong>{selectedFlight.to}</strong>
          </div>
          <p className="muted">{selectedFlight.departureAirport || "Departure airport"} → {selectedFlight.arrivalAirport || "Arrival airport"}</p>
          <p>
            <strong>Rs. {selectedFlight.price}</strong>
          </p>

          <BookingForm selectedFlight={selectedFlight} onSubmit={handleBooking} onCancel={() => navigate("/")} loading={loading} />
        </section>
      )}
    </main>
  );
}
