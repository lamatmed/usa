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
import { ComputerIcon, IdCard, Users } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/components/AuthContext";
import { FaRegUser, FaVoteYea } from "react-icons/fa";

export default function Home() {
  const { user } = useContext(AuthContext) ?? {};
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-300 to-green-700 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1">
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
            Gérez efficacement votre espace.
          </p>
        </motion.div>

        {/* Grid Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {user && (
            <>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FaRegUser className="h-6 w-6" />
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

              <motion.div whileHover={{ scale: 1.05 }}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FaVoteYea className="h-6 w-6" />
                      Eléctions du Bureau
                    </CardTitle>
                    <CardDescription>Voter aux élections </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link href="/dashboard/espace-user/votes">Accéder</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                     
                      <IdCard className="h-6 w-6"  />
                      Carte de Membre
                    </CardTitle>
                    <CardDescription>Votre carte  </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link href="/dashboard/espace-user/carte">Accéder</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
