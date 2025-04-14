"use client";

import { createContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  nni: string;
  id: string;
  name: string;
  role: string;
  photo: string | undefined;
  address: string | undefined;
  job: string | undefined;
  domain: string | undefined;
  cv: string | undefined;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => { },
  logout: () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // `fetchUser` est stable grâce à `useCallback`
  const fetchUser = useCallback((token: string) => {
    console.log("🔍 Envoi du token pour récupération de l'utilisateur...");

    fetch("/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("🔍 Réponse API:", data);
        if (data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          throw new Error("Utilisateur non trouvé");
        }
      })
      .catch((error) => {
        console.log("❌ Erreur lors de la récupération de l'utilisateur:", error);
        logout(); // Un seul appel ici en cas d'erreur
      });
  }, []);

  // Vérifie le token dans le localStorage et récupère l'utilisateur au montage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token); // Appel pour récupérer l'utilisateur si le token existe
    }

    // Réinitialisation du timer d'inactivité
    const resetInactivityTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      setInactivityTimer(setTimeout(() => logout(), 15 * 60 * 1000)); // 15 minutes en ms
    };

    // Écouter les événements d'activité pour réinitialiser le timer
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetInactivityTimer));

    // Nettoyage des écouteurs d'événements et du timer
    return () => {
      events.forEach((event) => window.removeEventListener(event, resetInactivityTimer));
      if (inactivityTimer) clearTimeout(inactivityTimer);
    };
  }, [fetchUser, inactivityTimer]);

  function login(token: string) {
    console.log("✅ Connexion réussie, stockage du token...");
    localStorage.setItem("token", token);
    fetchUser(token);
  }

  function logout() {
    console.log("🚪 Déconnexion, suppression du token...");
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    router.push("/"); // Redirige vers la page d'accueil après déconnexion
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
