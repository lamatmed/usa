"use client";

import { useState,useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Role } from "@prisma/client";
import { motion } from "framer-motion";
import { AuthContext } from "@/components/AuthContext";
export default function RegisterPage() {
  

  const { user, isAuthenticated } = useContext(AuthContext) ?? {};
  const router = useRouter();
 useEffect(() => {
    if (!isAuthenticated || user?.role !== "ADMIN") {
      router.push("/"); // Redirection vers l'accueil
    }
  }, [user, isAuthenticated, router]);

  const [userp, setUser] = useState({
    nni: "",
    password: "",
    name: "",
    role: Role.USER,
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser({ ...userp, [name]: name === "role" ? (value as Role) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userp),
      });

      if (!res.ok) throw new Error("Inscription échouée");
      const newUser = await res.json();

      toast({
        title: "Inscription réussie",
        description: `Bienvenue ${newUser.name}!`,
      });

      router.push("/login");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-sm shadow-lg bg-white rounded-xl">
        <CardHeader>
          <CardTitle className="text-center text-green-700">Inscription</CardTitle>
          <CardDescription className="text-center text-black">Créez un compte pour accéder à l'application</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="name" placeholder="Nom" onChange={handleChange} required />
            <Input name="nni" placeholder="NNI" onChange={handleChange} required />
            <Input name="password" type="password" placeholder="Mot de passe" onChange={handleChange} required />
            <select name="role" value={userp.role} onChange={handleChange} className="w-full border rounded p-2 bg-gray-100">
              <option value={Role.USER}>Utilisateur</option>
              <option value={Role.ADMIN}>Administrateur</option>
            </select>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
              {loading ? "Inscription..." : "S'inscrire"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
