"use client";

import { createContext, useState, useEffect, useCallback, useMemo } from "react";

interface User {
  nni: string;
  id: string;
  name: string;
  role: string;
  isBlocked: boolean;
  photo?: string;
  address?: string;
  job?: string;
  domain?: string;
  cv?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async (token: string) => {
    console.log("🔍 Fetching user with token...");
    setIsLoading(true);

    try {
      const response = await fetch("/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await response.json();

      if (data.user) {
        console.log("✅ User fetched successfully");
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        throw new Error("User not found in response");
      }
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  const login = useCallback((token: string) => {
    console.log("✅ Logging in...");
    localStorage.setItem("token", token);
    fetchUser(token);
  }, [fetchUser]);

  const logout = useCallback(() => {
    console.log("🚪 Logging out...");
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const contextValue = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  }), [user, isAuthenticated, isLoading, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}