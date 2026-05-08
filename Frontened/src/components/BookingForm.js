import { useState } from "react";

export default function BookingForm({ selectedFlight, onSubmit, onCancel, loading = false }) {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    phoneNumber: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      fullName: formData.fullName,
      age: Number(formData.age),
      phoneNumber: formData.phoneNumber
    });
  }

  if (!selectedFlight) {
    return null;
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="muted">Selected flight</p>
          <h2>{selectedFlight.flightId}</h2>
        </div>
        <button className="secondary-button" onClick={onCancel}>
          Change
        </button>
      </div>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Passenger name
          <input name="fullName" value={formData.fullName} onChange={handleChange} required />
        </label>
        <label>
          Age
          <input name="age" type="number" min="1" value={formData.age} onChange={handleChange} required />
        </label>
        <label>
          Phone number
          <input name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} required />
        </label>
        <button className="primary-button wide" type="submit" disabled={loading}>
          {loading ? "Processing..." : "Pay and Confirm"}
        </button>
      </form>
    </section>
  );
}
