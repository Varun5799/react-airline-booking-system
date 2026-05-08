import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <span className="brand-mark">A</span>
        Aerledger
      </Link>
      <nav>
        <NavLink to="/">Search</NavLink>
        {user && <NavLink to="/dashboard">Dashboard</NavLink>}
        <NavLink to="/track">Track</NavLink>
        {user && <NavLink to="/bookings">Bookings</NavLink>}
      </nav>
      <div className="nav-actions">
        {user ? (
          <>
            <span>{user.name}</span>
            <button className="secondary-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="secondary-button" to="/login">
              Login
            </Link>
            <Link className="primary-button" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
