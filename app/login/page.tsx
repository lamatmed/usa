"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const Login = () => {
  const [nni, setNni] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useContext(AuthContext);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nni, password }),
      });

      const data = await response.json();

      if (response.ok && auth) {
        auth.login(data.token);
        toast({ title: "Connexion réussie", description: "Bienvenue!" });
        router.push("/dashboard");
      } else {
        toast({ title: "Erreur", description: data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm p-6"
      >
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-blue-700 text-center">Connexion</CardTitle>
            <CardDescription className="text-center text-black">Entrez vos informations pour continuer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Numéro Télepnone"
                value={nni}
                onChange={(e) => setNni(e.target.value)}
                className="border-blue-400 focus:ring-blue-500"
              />
              <Input
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="border-blue-400 focus:ring-blue-500"
              />
              <Button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
