"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Ajout du champ texte
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
import { User, Lock, Phone, MapPin, Briefcase, Globe, CameraIcon } from "lucide-react";
import Uploader from "@/components/Uploader";


export default function RegisterPage() {
  const { user } = useContext(AuthContext) ?? {};
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const [userp, setUser] = useState({
    name: "",
    nni: "",
    password: "",
    confirmPassword: "",
    role: Role.USER,
    address: "",
    job: "",
    domain: "",
    cv: "", // Texte au lieu d'un fichier
    photo: "",
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUser({ ...userp, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (userp.password !== userp.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
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

      if (!res.ok) throw new Error("L'inscription a échoué, utilisateur existant.");
      const newUser = await res.json();

      toast({
        title: "Inscription réussie",
        description: `Bienvenue ${newUser.name}!`,
      });

      router.push("/dashboard");

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
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
              <Input name="name" placeholder="Nom" onChange={handleChange} required className="pl-10" />
            </div>

            {/* Téléphone (NNI) */}
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
              <Input name="nni" placeholder="Numéro NNI" onChange={handleChange} required className="pl-10" />
            </div>

            {/* Adresse */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" />
              <Input name="address" placeholder="Adresse" onChange={handleChange} required className="pl-10" />
            </div>

            {/* Job */}
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500" />
              <Input name="job" placeholder="Métier" onChange={handleChange} required className="pl-10" />
            </div>

            {/* Domaine */}
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500" />
              <Input name="domain" placeholder="Domaine" onChange={handleChange} required className="pl-10" />
            </div>

            {/* Photo de profil */}
            <div className="relative">
              <label className="flex items-center space-x-2">
                <CameraIcon className="text-gray-500" />
                <span>Photo de profil</span>
              </label>
              <Uploader onUpload={(url) => setUser({ ...userp, photo: url })} />
            </div>

            {/* CV (Texte) */}
            <div className="relative">
              <label className="text-gray-700 font-semibold">Résumé de CV</label>
              <Textarea
                name="cv"
                placeholder="Décrivez brièvement votre parcours professionnel..."
                onChange={handleChange}
                className="w-full border-gray-300 focus:border-green-500"
              />
            </div>

            {/* Mot de passe */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" />
              <Input name="password" type="password" placeholder="Mot de passe" onChange={handleChange} required className="pl-10" />
            </div>

            {/* Confirmation du mot de passe */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" />
              <Input name="confirmPassword" type="password" placeholder="Confirmer le mot de passe" onChange={handleChange} required className="pl-10" />
            </div>

            {/* Bouton d'inscription */}
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
              {loading ? "Inscription..." : "S'inscrire"}
            </Button>

            <p className="text-center text-sm mt-2">
              Vous avez déjà un compte ?{" "}
              <a href="/login" className="text-blue-600 hover:underline">Se connecter</a>
            </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
