"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {IdCard } from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/components/AuthContext";
import { FaRegUser, FaVoteYea } from "react-icons/fa";
import Loader from "@/components/Loader";

export default function Home() {
  const { user } = useContext(AuthContext) ?? {};
  const [loading, setLoading] = useState(true);
  // Simulate loading state or perform checks
  useEffect(() => {
    // Simule le chargement (ex: attendre Appwrite/Auth)
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000); // ou 500ms, selon ton UX

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (typeof window !== "undefined" && !user) {
    window.location.href = "/"; // ou window.history.back();
    return null; // pour éviter le rendu
  }
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-300 to-green-700 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <div className="container mx-auto px-4 py-12 pb-24 flex-1">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Union des Sortants d&apos;Algérie
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Bienvenue <span className="font-semibold">{user?.name}</span> 👋, gérez efficacement votre espace.
          </p>
        </motion.div>

        {/* Grid Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <motion.div whileHover={{ scale: 1.05 }} className="transition-transform">
            <Card className="hover:shadow-2xl hover:ring-2 hover:ring-blue-400 dark:hover:ring-blue-600 transition-shadow rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaRegUser className="h-6 w-6 text-blue-500" />
                  Modifier le profil
                </CardTitle>
                <CardDescription>Gérer mon profil</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/dashboard/espace-user/update">Accéder</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="transition-transform">
            <Card className="hover:shadow-2xl hover:ring-2 hover:ring-green-400 dark:hover:ring-green-600 transition-shadow rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaVoteYea className="h-6 w-6 text-green-500" />
                  Élections du Bureau
                </CardTitle>
                <CardDescription>Voter aux élections</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/dashboard/espace-user/votes">Accéder</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="transition-transform">
            <Card className="hover:shadow-2xl hover:ring-2 hover:ring-purple-400 dark:hover:ring-purple-600 transition-shadow rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IdCard className="h-6 w-6 text-purple-500" />
                  Carte de Membre
                </CardTitle>
                <CardDescription>Votre carte</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/dashboard/espace-user/carte">Accéder</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
