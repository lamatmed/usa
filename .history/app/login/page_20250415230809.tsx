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
import { isUserBlocked } from "@/utils/actions";

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
    // Vérification si l'utilisateur existe et son statut
    const blocked = await isUserBlocked(nni); // si `nni` = `id`, sinon adapte l'argument

    if (blocked) {
      throw new Error("Votre compte est bloqué. Contactez l'administrateur.");
    }

    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nni, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Identifiants incorrects");
    }

    if (auth) {
      auth.login(data.token);
      
      // Toast de succès
      toast({
        title: "Connexion réussie",
        description: "Bienvenue!",
        duration: 3000,
      });
      Swal.fire({
        title: "نجاح",
        text: "مرحبًا بك في لوحة التحكم الخاصة بك",
        icon: "success",
        confirmButtonText: "موافق",
        customClass: {
          confirmButton: 'swal-button-ok'
        },
      });
      // Redirection après un court délai
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
    
    // Toast d'erreur
    toast({
      title: "Erreur de connexion",
      description: errorMessage,
      variant: "destructive",
      duration: 5000,
    });

    // Alert SweetAlert2 seulement pour les erreurs importantes
    if (errorMessage.includes("bloqué")) {
      await Swal.fire({
        title: "Compte bloqué",
        text: errorMessage,
        icon: "warning",
        confirmButtonText: "Compris",
        confirmButtonColor: "#3b82f6",
      });
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r  from-green-600 via-emerald-500 to-lime-400">
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
                  className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
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
