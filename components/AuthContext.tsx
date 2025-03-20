"use client";

import { createContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔍 Token récupéré depuis localStorage:", token); // Vérifier si le token est bien stocké
    if (token) {
      fetchUser(token);
    }
  }, [fetchUser]); 
  

  function fetchUser(token: string) {
    console.log("🔍 Envoi du token pour récupération de l'utilisateur..."); // Vérifier si la requête est bien envoyée

    fetch("/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("🔍 Réponse API:", data); // Voir la réponse reçue de l'API
        if (data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          console.log("❌ Utilisateur non trouvé, déconnexion...");
          logout();
        }
      })
      .catch((error) => {
        console.log("❌ Erreur lors de la récupération de l'utilisateur:", error);
        logout();
      });
  }

  function login(token: string) {
    console.log("✅ Connexion réussie, stockage du token...");
    localStorage.setItem("token", token);
    fetchUser(token); // ⬅️ Récupérer l'utilisateur après connexion
  }

  function logout() {
    console.log("🚪 Déconnexion, suppression du token...");
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
