"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Role } from "@prisma/client";
import { motion } from "framer-motion";
import { AuthContext } from "@/components/AuthContext";
import {
  User,
  Lock,
  Phone,
  MapPin,
  Briefcase,
  Globe,
  CameraIcon,
} from "lucide-react";
import Uploader from "@/components/Uploader";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const { user } = useContext(AuthContext) ?? {};
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  // État du formulaire
  const [step, setStep] = useState(1); // Étape actuelle
  const [loading, setLoading] = useState(false);
  const [userp, setUser] = useState({
    name: "",
    nni: "",
    password: "",
    confirmPassword: "",
    role: Role.USER,
    address: "",
    job: "",
    domain: "",
    cv: "",
    photo: "",
  });

  // Gestion des inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUser({ ...userp, [name]: value });
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!userp.nni) {
      Swal.fire({
        title: "Erreur",
        text: "Le numéro de téléphone est obligatoire.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setLoading(false);
      return;
    }

    if (userp.password !== userp.confirmPassword) {
      Swal.fire({
        title: "Erreur",
        text: "Les mots de passe ne correspondent pas.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userp),
      });

      if (!res.ok)
        throw new Error("L'inscription a échoué, utilisateur existant.");

      const newUser = await res.json();

      await Swal.fire({
        title: "Inscription réussie",
        text: `Bienvenue ${newUser.name} !`,
        icon: "success",
        confirmButtonText: "Se connecter",
      });

      router.push("/login");
    } catch (error: any) {
      Swal.fire({
        title: "Erreur",
        text: error.message || "Une erreur est survenue.",
        icon: "error",
        confirmButtonText: "OK",
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
      <Card className="w-full max-w-md shadow-lg bg-white rounded-xl">
        <CardHeader>
          <CardTitle className="text-center text-green-700">
            Inscription
          </CardTitle>
          <CardDescription className="text-center text-black">
            Remplissez toutes les informations pour créer votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Étape 1 : Informations personnelles */}
            {step === 1 && (
              <>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                  <Input
                    name="name"
                    placeholder="Nom Complet"
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                  <Input
                    type="number"
                    name="nni"
                    placeholder="Numéro Téléphone"
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" />
                  <Input
                    name="address"
                    placeholder="Adresse"
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
                <div className="relative flex flex-col items-center p-3 border border-gray-300 rounded-lg shadow-sm bg-white w-full max-w-xs">
                  {/* Label avec icône et texte */}
                  <label className="flex items-center space-x-2 text-gray-700 font-medium">
                    <CameraIcon className="w-5 h-5 text-blue-500" />
                    <span>Photo de profil</span>
                  </label>

                  {/* Composant Uploader */}
                  <Uploader
                    onUpload={(url) => setUser({ ...userp, photo: url })}
                  />
                </div>
              </>
            )}

            {/* Étape 2 : Informations professionnelles */}
            {step === 2 && (
              <>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500" />
                  <Input
                    name="job"
                    placeholder="Métier"
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500" />
                  <Input
                    name="domain"
                    placeholder="Domaine"
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <label className="text-gray-700 font-semibold">
                    Résumé de CV
                  </label>
                  <Textarea
                    name="cv"
                    placeholder="Décrivez brièvement votre parcours professionnel..."
                    onChange={handleChange}
                    className="w-full border-gray-300 focus:border-green-500"
                  />
                </div>
              </>
            )}

            {/* Étape 3 : Sécurité et finalisation */}
            {step === 3 && (
              <>
              

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" />
                  <Input
                    name="password"
                    type="password"
                    placeholder="Mot de passe"
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" />
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
              </>
            )}

            {/* Boutons de navigation */}
            <div className="flex justify-between space-x-2">
              {step > 1 && (
                <Button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="bg-gray-500 hover:bg-gray-600"
                >
                  Précédent
                </Button>
              )}
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Suivant
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={loading}
                >
                  {loading ? "Inscription..." : "S'inscrire"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
