"use client";

import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AuthContext } from "@/components/AuthContext";
import { motion } from "framer-motion";

import { updateUser } from "@/utils/actions"; // Import de l'action de mise à jour
import { Pencil, User, Camera } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
; // Import de l'icône Camera
import Uploader from "@/components/Uploader"; // Assurez-vous que le composant Uploader soit correctement importé

const UserProfile = () => {
  const { user } = useContext(AuthContext) ?? {};
  const { toast } = useToast();
  const router = useRouter();
  const [userp, setUser] = useState<{
    id: string;
    name: string;
    nni: string;
    password: string;
    confirmPassword: string;
    address: string;
    job: string;
    domain: string;
    cv: string;
    photo: string;
  }>({
    id: "",
    name: "",
    nni: "",
    password: "",
    confirmPassword: "",
    address: "",
    job: "",
    domain: "",
    cv: "",
    photo: "",
  });

  useEffect(() => {
    if (user) {
      setUser({
        id: user.id || "",
        name: user.name || "",
        nni: user.nni || "",
        password: "",
        confirmPassword: "",
        address: user.address || "",
        job: user.job || "",
        domain: user.domain || "",
        cv: user.cv || "",
        photo: user.photo || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateUser(userp.id, {
        name: userp.name,
        nni: userp.nni,
        address: userp.address,
        job: userp.job,
        domain: userp.domain,
        cv: userp.cv,
        photo: userp.photo, // La photo est déjà mise à jour ici
      });

      toast({
        title: "Mise à jour réussie",
        description: "Vos informations ont été mises à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos informations.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <p className="text-center text-gray-500">Aucun utilisateur connecté.</p>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <User className="w-6 h-6" /> Modifier le profil
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="shadow-md hover:shadow-lg">
          <CardHeader>
            <CardTitle>
              <input
                type="text"
                name="name"
                className="border p-2 rounded w-full"
                value={userp.name}
                onChange={handleChange}
              />
            </CardTitle>
            <CardDescription>
              Numéro Téléphone :
              <input
                type="text"
                name="nni"
                className="border p-2 rounded w-full"
                value={userp.nni}
                onChange={handleChange}
              />
            </CardDescription>
            <CardDescription>
              Adresse :
              <input
                type="text"
                name="address"
                className="border p-2 rounded w-full"
                value={userp.address}
                onChange={handleChange}
              />
            </CardDescription>
            <CardDescription>
              Emploi :
              <input
                type="text"
                name="job"
                className="border p-2 rounded w-full"
                value={userp.job}
                onChange={handleChange}
              />
            </CardDescription>
            <CardDescription>
              Domaine :
              <input
                type="text"
                name="domain"
                className="border p-2 rounded w-full"
                value={userp.domain}
                onChange={handleChange}
              />
            </CardDescription>

            <CardDescription className="mt-4">
              <strong>CV :</strong>
              <textarea
                name="cv"
                className="border p-2 rounded w-full"
                rows={3}
                value={userp.cv}
                onChange={handleChange}
              />
            </CardDescription>

            {userp.photo && (
              <div className="mt-4 flex justify-center">
                <Image
                  src={userp.photo}
                  alt="Photo de profil"
                  height={80}
                  width={80}
                />
              </div>
            )}

            <div className="relative flex flex-col items-center p-3 border border-gray-300 rounded-lg shadow-sm bg-white w-full max-w-xs mt-4">
              {/* Label avec icône et texte */}
              <label className="flex items-center space-x-2 text-gray-700 font-medium">
                <CameraIcon className="w-5 h-5 text-blue-500" />
                <span>Photo de profil</span>
              </label>

              {/* Composant Uploader */}
              <Uploader
                onUpload={(url) => setUser({ ...userp, photo: url })} // Met à jour la photo de profil
              />
            </div>
          </CardHeader>

          <CardContent className="text-center flex justify-center gap-2">
            <Button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Pencil className="w-5 h-5" /> Modifier
            </Button>
            <Button
              onClick={() => router.push("/dashboard/espace-user")}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Retour
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UserProfile;
