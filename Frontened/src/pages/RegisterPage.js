import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    try {
      await register(formData);
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.hint || error.response?.data?.message || "Registration failed");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Create Aerledger access</p>
        <h1>Register</h1>
        <form className="stack-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={formData.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input name="password" type="password" minLength="6" value={formData.password} onChange={handleChange} required />
          </label>
          {message && <p className="alert">{message}</p>}
          <button className="primary-button wide" type="submit">
            Create Account
          </button>
        </form>
        <p className="muted">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}
