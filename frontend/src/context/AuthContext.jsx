/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}:5000/api`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("splitnest_user");
      const savedToken = localStorage.getItem("splitnest_token");
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
    } catch (error) {
      console.error("Load auth session error:", error);
      localStorage.removeItem("splitnest_user");
      localStorage.removeItem("splitnest_token");
      localStorage.removeItem("splitnest_role");
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const saveSession = (userData, authToken) => {
    if (!userData || !authToken) return;
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("splitnest_user", JSON.stringify(userData));
    localStorage.setItem("splitnest_token", authToken);
    if (userData.role) localStorage.setItem("splitnest_role", userData.role);
  };

  const parseResponse = async (response) => {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) return response.json();
    const text = await response.text();
    throw new Error(text || "Server returned an invalid response.");
  };

  const register = async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const result = await parseResponse(response);
    if (!response.ok) throw new Error(result?.message || "Registration failed.");
    return result;
  };

  const login = async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: credentials?.email,
        password: credentials?.password,
        role: credentials?.role,
      }),
    });
    const result = await parseResponse(response);
    if (!response.ok) throw new Error(result?.message || "Login failed.");
    const loggedInUser = result?.data || result?.user;
    if (!loggedInUser || !result?.token) throw new Error("Invalid login response from server.");
    saveSession(loggedInUser, result.token);
    return loggedInUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("splitnest_user");
    localStorage.removeItem("splitnest_token");
    localStorage.removeItem("splitnest_role");
  };

  const openAuthModal = (action = null) => { setPendingAction(action); setAuthModalOpen(true); };
  const closeAuthModal = () => setAuthModalOpen(false);
  const clearPendingAction = () => setPendingAction(null);

  const isLoggedIn = Boolean(user && token);
  const userRole = user?.role || null;
  const isOwner = userRole === "owner";
  const isUser = userRole === "user" || userRole === "tenant";
  const userId = user?.id || user?._id || null;
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const value = useMemo(() => ({
    user, token, userId, authHeaders,
    isLoggedIn, authLoading, userRole, isOwner, isUser,
    register, login, logout,
    authModalOpen, showAuthModal: authModalOpen, pendingAction, openAuthModal, closeAuthModal, clearPendingAction,
  }), [user, token, userId, isLoggedIn, authLoading, userRole, isOwner, isUser, authModalOpen, pendingAction]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}

export default AuthContext;
