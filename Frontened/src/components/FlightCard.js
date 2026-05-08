import AirlineLogo from "./AirlineLogo";

export default function FlightCard({ flight, onBook }) {
  return (
    <article className="flight-card">
      <div className="airline-cell">
        <AirlineLogo airline={flight.airline} />
        <div>
          <p className="muted">{flight.airline}</p>
          <h3>{flight.flightId}</h3>
        </div>
      </div>
      <div className="flight-route">
        <strong>{flight.from}</strong>
        <span>{flight.duration || "Direct"}</span>
        <strong>{flight.to}</strong>
      </div>
      <div>
        <p>{flight.departureTime}</p>
        <p className="muted">to {flight.arrivalTime}</p>
      </div>
      <div>
        <strong>Rs. {flight.price}</strong>
        <p className="muted">{flight.seatsAvailable} seats</p>
      </div>
      <div>
        <p className="muted">Aircraft</p>
        <strong>{flight.aircraft || "Standard"}</strong>
      </div>
      <button className="primary-button" onClick={() => onBook(flight)}>
        Book
      </button>
    </article>
  );
}
