"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { LogIn, Phone, Lock } from "lucide-react"; // Import des icônes
import Swal from "sweetalert2";
import Loader from '@/components/Loader';

const Login = () => {
  const [nni, setNni] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useContext(AuthContext);
  const { user } = auth ?? {};

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);
  

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

        // Affichage de l'alerte SweetAlert en cas de connexion réussie
        Swal.fire({
          title: "Succès",
          text: "Bienvenue dans votre tableau de bord !",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        toast({ title: "Erreur", description: data.message, variant: "destructive" });

        // Affichage de l'alerte SweetAlert en cas d'erreur de connexion
        Swal.fire({
          title: "Erreur",
          text: data.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });

      // Affichage de l'alerte SweetAlert en cas d'exception
      Swal.fire({
        title: "Erreur",
        text: "Une erreur est survenue. Veuillez réessayer.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };
  // 👉 Ici on affiche le loader si en cours de chargement
  if (loading) {
    return <Loader />
    


  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm p-6"
      >
        <Card className="shadow-lg rounded-lg bg-white ">
          <CardHeader>
            <CardTitle className="text-blue-700 text-center flex items-center justify-center gap-2">
              <LogIn className="w-6 h-6 text-blue-700" /> Connexion
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Entrez vos informations pour continuer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-4"
            >
              {/* Input Téléphone */}
              <div className="flex items-center border rounded-md p-2 bg-gray-100">
                <Phone className="w-5 h-5 text-green-500 mr-2" />
                <Input
                  placeholder="Numéro Téléphone"
                  value={nni}
                  onChange={(e) => setNni(e.target.value)}
                  className="border-none bg-transparent focus:ring-0 w-full"
                />
              </div>

              {/* Input Mot de passe */}
              <div className="flex items-center border rounded-md p-2 bg-gray-100">
                <Lock className="w-5 h-5 text-red-500 mr-2" />
                <Input
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="border-none bg-transparent focus:ring-0 w-full"
                />
              </div>

              {/* Bouton Connexion */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <Button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                >
                  {loading ? "Connexion..." : "Se connecter"}
                </Button>
                <p className="text-center text-sm mt-2">
                    Vous n&apos; avez pas un compte ?{" "}
                        <a href="/register" className="text-blue-600 hover:underline">
                             S&apos;inscrire
                        </a>
                 </p>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
