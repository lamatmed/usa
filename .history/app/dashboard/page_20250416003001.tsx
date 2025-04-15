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

export default function AdminDashboard() {
  const { user } = useContext(AuthContext) ?? {};
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) return <Loader />;
  if (!user) return null;

  const adminCards = [
    {
      href: "/dashboard/users",
      icon: <Users className="h-6 w-6" />,
      title: "Utilisateurs",
      description: "Gestion des utilisateurs",
      color: "green"
    },
    {
      href: "/dashboard/config-vote",
      icon: <FiClipboard className="h-6 w-6" />,
      title: "Élection",
      description: "Élections et votes",
      color: "green"
    },
    {
      href: "/activites/config",
      icon: <NotebookPen className="h-6 w-6" />,
      title: "Activités",
      description: "Gérer les activités",
      color: "green"
    }
  ];

  const userCard = {
    href: "/dashboard/espace-user",
    icon: <ComputerIcon className="h-6 w-6" />,
    title: "Espace",
    description: "Gérez mon espace",
    color: "indigo"
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-200 to-green-600 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-3">
            Tableau de bord administratif
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Bienvenue <span className="font-semibold text-green-600 dark:text-green-400">{user.name}</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.role === "ADMIN" && adminCards.map((card, index) => (
            <CardLink
              key={index}
              {...card}
              delay={index * 0.1}
            />
          ))}

          <CardLink
            {...userCard}
            delay={user.role === "ADMIN" ? adminCards.length * 0.1 : 0}
          />
        </div>
      </div>
    </main>
  );
}

function CardLink({
  href,
  icon,
  title,
  description,
  color,
  delay = 0
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={`h-full border-0 shadow-lg hover:shadow-xl transition-all hover:ring-2 hover:ring-${color}-400 dark:hover:ring-${color}-600 rounded-xl`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-3 text-${color}-600 dark:text-${color}-400`}>
            {icon}
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className={`w-full bg-${color}-600 hover:bg-${color}-700`}>
            <Link href={href}>Accéder</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}