import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    try {
      await login(formData);
      navigate("/bookings");
    } catch (error) {
      setMessage(error.response?.data?.hint || error.response?.data?.message || "Login failed");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Aeroledger account</p>
        <h1>Login</h1>
        <form className="stack-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input name="email" type="email" value={formData.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input name="password" type="password" value={formData.password} onChange={handleChange} required />
          </label>
          {message && <p className="alert">{message}</p>}
          <button className="primary-button wide" type="submit">
            Login
          </button>
        </form>
        <p className="muted">
          New user? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
