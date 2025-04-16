"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ComputerIcon, NotebookPen, Users, User, LogOut, Vote , MessageSquare, IdCard } from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/components/AuthContext";
import { FiClipboard } from "react-icons/fi";
import Loader from "@/components/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BsRobot } from "react-icons/bs";

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext) ?? {};
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

  const userActions = [
    {
      href: "/dashboard/espace-user/update",
      icon: <User className="h-4 w-4" />,
      text: "Profil"
    },
    {
      href: "/dashboard/espace-user/votes",
      icon: <Vote className="h-4 w-4" />,
      text: "Élections"
    },
    {
      href: "/dashboard/espace-user/carte",
      icon: <IdCard className="h-4 w-4" />,
      text: "Carte "
    },
    {
      href: "/dashboard/messages",
      icon: <BsRobot className="h-4 w-4" />,
      text: "Assistant IA"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-3">
            Tableau de bord
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

          {/* Carte Utilisateur améliorée */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: user.role === "ADMIN" ? adminCards.length * 0.1 : 0, duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all hover:ring-2 hover:ring-green-400 dark:hover:ring-green-600 rounded-xl">
              <CardHeader className="flex flex-row items-center gap-4 pb-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.photo} />
                  <AvatarFallback className="bg-green-100 text-green-800">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-gray-800 dark:text-white">
                    {user.name}
                  </CardTitle>
                  <CardDescription className="text-green-600 dark:text-green-400">
                    {user.role === "ADMIN" ? "Administrateur" : "Utilisateur"}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="grid grid-cols-2 gap-2 py-2">
                {userActions.map((action, i) => (
                  <Button
                    key={i}
                    asChild
                    variant="ghost"
                    className="justify-start gap-2 text-sm h-10"
                  >
                    <Link href={action.href}>
                      {action.icon}
                      {action.text}
                    </Link>
                  </Button>
                ))}
              </CardContent>

              <CardFooter className="flex flex-col gap-2 pt-4">
                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <Link href="/dashboard/espace-user">
                    <ComputerIcon className="h-4 w-4 mr-2" />
                    Mon espace
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
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
          <CardTitle className={`flex items-center gap-3 text-black-600 dark:text-${color}-400`}>
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