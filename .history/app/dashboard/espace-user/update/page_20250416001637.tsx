"use client";

import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from "@/components/AuthContext";
import { motion } from "framer-motion";
import { updateUser } from "@/utils/actions";
import { Pencil, User, CameraIcon, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Uploader from "@/components/Uploader";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Loader from "@/components/Loader";

const MySwal = withReactContent(Swal);

type UserProfile = {
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
};

const UserProfile = () => {
  const { user } = useContext(AuthContext) ?? {};
  const router = useRouter();
  const [userp, setUser] = useState<UserProfile>({
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
  const [isSaving, setIsSaving] = useState(false);

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
      const timeout = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!userp.name.trim()) {
      MySwal.fire({
        title: "Champ requis",
        text: "Le nom complet est obligatoire",
        icon: "warning",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }

    setIsSaving(true);
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

      await MySwal.fire({
        title: <span className="text-lg">Profil mis à jour</span>,
        html: <p className="text-gray-700">Vos informations ont été enregistrées avec succès</p>,
        icon: "success",
        confirmButtonColor: "#3b82f6",
      });
    } catch (error) {
      await MySwal.fire({
        title: <span className="text-lg">Erreur</span>,
        html: <p className="text-gray-700">Une erreur est survenue lors de la mise à jour</p>,
        icon: "error",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Button
            onClick={() => router.push("/dashboard/espace-user")}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <User className="w-6 h-6 text-blue-600" />
            Modifier le profil
          </h1>
        </div>

        <Card className="shadow-sm border-0 rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                {userp.photo ? (
                  <Image
                    src={userp.photo}
                    alt="Photo de profil"
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-white shadow-md h-28 w-28 object-cover"
                  />
                ) : (
                  <div className="rounded-full border-4 border-white bg-gray-200 shadow-md h-28 w-28 flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                )}

                <div className="relative inline-flex items-center justify-center w-12 h-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all">
                  <Uploader onUpload={(url) => setUser({ ...userp, photo: url })} />
                  <CameraIcon className="absolute h-5 w-5 pointer-events-none " />
                </div>

              </div>

              <div className="flex-1 w-full">
                <input
                  type="text"
                  name="name"
                  className="text-xl sm:text-2xl font-bold bg-transparent border-b border-blue-200 focus:border-blue-500 focus:outline-none w-full py-2 text-gray-800"
                  value={userp.name}
                  onChange={handleChange}
                  placeholder="Nom complet"
                />
                <input
                  type="text"
                  name="nni"
                  className="text-sm text-gray-600 bg-transparent border-b border-blue-200 focus:border-blue-500 focus:outline-none w-full py-2 mt-2"
                  value={userp.nni}
                  onChange={handleChange}
                  placeholder="Numéro de téléphone"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <input
                  type="text"
                  name="address"
                  className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={userp.address}
                  onChange={handleChange}
                  placeholder="Adresse"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emploi</label>
                <input
                  type="text"
                  name="job"
                  className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={userp.job}
                  onChange={handleChange}
                  placeholder="Emploi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domaine</label>
                <input
                  type="text"
                  name="domain"
                  className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={userp.domain}
                  onChange={handleChange}
                  placeholder="Domaine"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CV</label>
              <textarea
                name="cv"
                className="border rounded-lg px-4 py-2 w-full h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={userp.cv}
                onChange={handleChange}
                placeholder="Décrivez votre parcours professionnel..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={() => router.push("/dashboard/espace-user")}
                variant="outline"
                className="gap-2"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Pencil className="h-5 w-5" />
                {isSaving ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UserProfile;