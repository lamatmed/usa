"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComputerIcon, NotebookPen, Users } from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/components/AuthContext";

import { FiClipboard } from "react-icons/fi";
import Loader from "@/components/Loader";

export default function Home() {
  const { user } = useContext(AuthContext) ?? {};
  const [loading, setLoading] = useState(true);

  // Simulate loading state or perform checks
  useEffect(() => {
    if (user) {
      setLoading(false); // Data is ready, stop loading
    }
  }, [user]);
  
  if (loading) {
    return <Loader/>;
  }
 
 


  return (
    <main className="min-h-screen bg-gradient-to-b from-green-300 to-green-700 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Union des Sortants d&apos;Algérie
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Bienvenue {user.name && <span className="font-semibold">{user.name}</span>} 👋,
            gérez efficacement votre espace.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {user?.role === "ADMIN" && (
            <>
              <motion.div whileHover={{ scale: 1.05 }} className="transition-transform">
                <Card className="hover:shadow-2xl hover:ring-2 hover:ring-blue-300 dark:hover:ring-blue-500 transition-shadow rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-6 w-6 text-blue-500" />
                      Utilisateurs
                    </CardTitle>
                    <CardDescription>Gestion des utilisateurs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link href="/dashboard/users">Accéder</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="transition-transform">
                <Card className="hover:shadow-2xl hover:ring-2 hover:ring-green-300 dark:hover:ring-green-500 transition-shadow rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FiClipboard className="h-6 w-6 text-green-500" />
                      Election
                    </CardTitle>
                    <CardDescription>Elections et votes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link href="/dashboard/config-vote">Accéder</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="transition-transform">
                <Card className="hover:shadow-2xl hover:ring-2 hover:ring-purple-300 dark:hover:ring-purple-500 transition-shadow rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <NotebookPen className="h-6 w-6 text-purple-500" />
                      Activités
                    </CardTitle>
                    <CardDescription>Ajouter et modifier les activités publiques</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link href="/activites/config">Accéder</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}

          {/* Carte accessible à tous les rôles */}
          <motion.div whileHover={{ scale: 1.05 }} className="transition-transform">
            <Card className="hover:shadow-2xl hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600 transition-shadow rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ComputerIcon className="h-6 w-6 text-indigo-500" />
                  Espace
                </CardTitle>
                <CardDescription>Gérez mon espace</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/dashboard/espace-user">Accéder</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
