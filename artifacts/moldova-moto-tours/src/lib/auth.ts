import { useState, useEffect } from "react";

export function getAuthToken() {
  return localStorage.getItem("admin_token");
}

export function setAuthToken(token: string) {
  localStorage.setItem("admin_token", token);
}

export function removeAuthToken() {
  localStorage.removeItem("admin_token");
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(getAuthToken());

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(getAuthToken());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  return {
    token,
    isAuthenticated: !!token,
    authHeaders,
    login: (newToken: string) => {
      setAuthToken(newToken);
      setToken(newToken);
    },
    logout: () => {
      removeAuthToken();
      setToken(null);
    }
  };
}
