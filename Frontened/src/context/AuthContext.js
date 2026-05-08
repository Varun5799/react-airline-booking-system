import { createContext, useEffect, useState } from "react";
import api from "../api/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  async function login(formData) {
    const response = await api.post("/auth/login", formData);
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
  }

  async function register(formData) {
    const response = await api.post("/auth/register", formData);
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
