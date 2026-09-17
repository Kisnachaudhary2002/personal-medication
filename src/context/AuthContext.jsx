import React, { createContext, useState, useEffect, useContext } from "react";
import { loginUser, registerUser, fetchMe } from "../api/auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("pm_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // On first load, verify the saved token is still valid
  useEffect(() => {
    const token = localStorage.getItem("pm_token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem("pm_token");
        localStorage.removeItem("pm_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password, role) => {
    const res = await loginUser({ email, password, role });
    localStorage.setItem("pm_token", res.data.token);
    localStorage.setItem("pm_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (payload) => {
    const res = await registerUser(payload);
    localStorage.setItem("pm_token", res.data.token);
    localStorage.setItem("pm_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("pm_token");
    localStorage.removeItem("pm_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
