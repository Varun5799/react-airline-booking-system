import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BookingsPage from "./pages/BookingsPage";
import DashboardPage from "./pages/DashboardPage";
import TrackingPage from "./pages/TrackingPage";
import PaymentPage from "./pages/PaymentPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/track" element={<TrackingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <BookingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
