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

  useEffect(() => {
    // Simule le chargement
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000); // ou 500ms, selon ton UX

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (typeof window !== "undefined" || !user) {
    window.location.href = "/"; // ou window.history.back();
    return null; // pour éviter le rendu
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
            Bienvenue <span className="font-semibold">{user.name}</span> 👋,
            gérez efficacement votre espace.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {user.role === "ADMIN" && (
            <>
              <CardLink
                href="/dashboard/users"
                icon={<Users className="h-6 w-6 text-blue-500" />}
                title="Utilisateurs"
                description="Gestion des utilisateurs"
                ringColor="ring-blue-300 dark:ring-blue-500"
              />
              <CardLink
                href="/dashboard/config-vote"
                icon={<FiClipboard className="h-6 w-6 text-green-500" />}
                title="Élection"
                description="Élections et votes"
                ringColor="ring-green-300 dark:ring-green-500"
              />
              <CardLink
                href="/activites/config"
                icon={<NotebookPen className="h-6 w-6 text-purple-500" />}
                title="Activités"
                description="Ajouter et modifier les activités"
                ringColor="ring-purple-300 dark:ring-purple-500"
              />
            </>
          )}

          <CardLink
            href="/dashboard/espace-user"
            icon={<ComputerIcon className="h-6 w-6 text-indigo-500" />}
            title="Espace"
            description="Gérez mon espace"
            ringColor="ring-gray-300 dark:ring-gray-600"
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
  ringColor,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  ringColor: string;
}) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="transition-transform">
      <Card className={`hover:shadow-2xl hover:ring-2 ${ringColor} transition-shadow rounded-2xl`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">{icon}{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href={href}>Accéder</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
