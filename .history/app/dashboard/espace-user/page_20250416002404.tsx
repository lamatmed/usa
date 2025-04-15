"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IdCard, User, Vote } from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/components/AuthContext";
import Loader from "@/components/Loader";

export default function UserDashboard() {
  const { user } = useContext(AuthContext) ?? {};
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return <Loader  />;
  }

  if (!user) {
    return null;
  }

  const cards = [
    {
      title: "Modifier le profil",
      description: "Gérer vos informations personnelles",
      icon: <User className="h-6 w-6 text-blue-500" />,
      href: "/dashboard/espace-user/update",
      color: "blue"
    },
    {
      title: "Élections du Bureau",
      description: "Participer aux votes",
      icon: <Vote className="h-6 w-6 text-green-500" />,
      href: "/dashboard/espace-user/votes",
      color: "green"
    },
    {
      title: "Carte de Membre",
      description: "Votre carte d'adhérent",
      icon: <IdCard className="h-6 w-6 text-purple-500" />,
      href: "/dashboard/espace-user/carte",
      color: "blue"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header with animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-3">
            Bienvenue, <span className="text-green-600 dark:text-green-400">{user.name}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Espace membre de l'Union des Sortants d'Algérie
          </p>
        </motion.div>

        {/* Cards grid with staggered animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className={`h-full border-0 shadow-lg hover:shadow-xl transition-all hover:ring-2 hover:ring-${card.color}-400 dark:hover:ring-${card.color}-600 rounded-xl`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {card.icon}
                    {card.title}
                  </CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className={`w-full bg-${card.color}-600 hover:bg-${card.color}-700`}>
                    <Link href={card.href}>
                      Accéder
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}