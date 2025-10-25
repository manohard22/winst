import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { getToken, setToken, removeToken, isAuthenticated, isAdmin } from "../utils/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token && isAuthenticated() && isAdmin()) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchProfile();
    } else {
      removeToken();
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/auth/profile");
      const userData = response.data.data.user;
      if (userData.role === "admin") {
        setUser(userData);
      } else {
        removeToken();
        delete api.defaults.headers.common["Authorization"];
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      removeToken();
      delete api.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, token } = response.data.data;

      if (user.role !== "admin") {
        return {
          success: false,
          message: "Access denied. Admin privileges required.",
        };
      }

      setToken(token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    removeToken();
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    fetchProfile,
    isAuthenticated: () => isAuthenticated() && isAdmin() && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
