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
import { AuthContext } from "@/components/AuthContext";
import { motion } from "framer-motion";

import { updateUser } from "@/utils/actions";
import { Pencil, User, CameraIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Uploader from "@/components/Uploader";

import Swal from "sweetalert2"; // Import SweetAlert2

const UserProfile = () => {
  const { user } = useContext(AuthContext) ?? {};
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
 const [loading, setLoading] = useState(true);
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
        photo: userp.photo,
      });

      Swal.fire({
        title: "Mise à jour réussie",
        text: "Vos informations ont été mises à jour avec succès.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          container: 'text-sm',
        }
      });
    } catch (error) {
      Swal.fire({
        title: "Erreur",
        text: "Impossible de mettre à jour vos informations.",
        icon: "error",
        confirmButtonText: "Réessayer",
        customClass: {
          container: 'text-sm',
        }
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
      <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2 text-blue-600">
        <User className="w-6 h-6" /> Modifier le profil
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="shadow-md hover:shadow-lg bg-white rounded-lg">
          <CardHeader>
            <CardTitle>
              <input
                type="text"
                name="name"
                className="border p-2 rounded w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={userp.name}
                onChange={handleChange}
                placeholder="Nom complet"
              />
            </CardTitle>

            <CardDescription>
              Numéro Téléphone :
              <input
                type="text"
                name="nni"
                className="border p-2 rounded w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={userp.nni}
                onChange={handleChange}
                placeholder="Numéro de téléphone"
              />
            </CardDescription>

            <CardDescription>
              Adresse :
              <input
                type="text"
                name="address"
                className="border p-2 rounded w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={userp.address}
                onChange={handleChange}
                placeholder="Adresse"
              />
            </CardDescription>

            <CardDescription>
              Emploi :
              <input
                type="text"
                name="job"
                className="border p-2 rounded w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={userp.job}
                onChange={handleChange}
                placeholder="Emploi"
              />
            </CardDescription>

            <CardDescription>
              Domaine :
              <input
                type="text"
                name="domain"
                className="border p-2 rounded w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={userp.domain}
                onChange={handleChange}
                placeholder="Domaine"
              />
            </CardDescription>

            <CardDescription className="mt-4">
              <strong>CV :</strong>
              <textarea
                name="cv"
                className="border p-2 rounded w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={userp.cv}
                onChange={handleChange}
                placeholder="CV"
              />
            </CardDescription>

            {userp.photo && (
              <div className="mt-4 flex justify-center">
                <Image
                  src={userp.photo}
                  alt="Photo de profil"
                  height={80}
                  width={80}
                  className="rounded-full border-2 border-blue-500"
                />
              </div>
            )}

            <div className="relative flex flex-col items-center p-3 border border-gray-300 rounded-lg shadow-sm bg-white w-full max-w-xs mt-4">
              <label className="flex items-center space-x-2 text-gray-700 font-medium">
                <CameraIcon className="w-5 h-5 text-blue-500" />
                <span>Photo de profil</span>
              </label>

              <Uploader
                onUpload={(url) => setUser({ ...userp, photo: url })}
              />
            </div>
          </CardHeader>

          <CardContent className="text-center flex justify-center gap-4 mt-4">
            <Button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all"
            >
              <Pencil className="w-5 h-5" /> Modifier
            </Button>
            <Button
              onClick={() => router.push("/dashboard/espace-user")}
              className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition-all"
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
