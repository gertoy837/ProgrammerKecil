import { createContext, useState, useContext, useEffect } from "react";
import apiClient from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load auth data dari localStorage saat init
 useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        // Jika data user rusak, hapus sekalian agar tidak error
        console.error("Gagal membaca data user dari storage");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post("/auth/login", { email, password });

      const { token, user, message } = response.data;

      if (!token || !user) {
        return {
          success: false,
          error: message || "Email atau password salah",
        };
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);

      return {
        success: true,
        user,
      };
    } catch (error) {
      const data = error.response?.data;

      let errorMessage = "Email atau password salah";

      if (Array.isArray(data?.errors)) {
        errorMessage = data.errors.map((err) => err.message).join("\n");
      } else if (data?.message) {
        errorMessage = data.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await apiClient.post("/auth/register", {
        name,
        email,
        password,
      });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Register failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
