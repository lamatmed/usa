"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from "@/components/AuthContext";
import Barcode from "react-barcode";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import Loader from "@/components/Loader";
import { motion } from "framer-motion";
import { Download, ArrowLeft } from "lucide-react";

const MembershipCard = () => {
  const { user } = useContext(AuthContext) ?? {};
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  const handlePrint = useReactToPrint({
    contentRef: cardRef,
  });


  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return null;
  }

  const membershipNumber = `USA-${user.nni?.slice(-4) ?? '0000'}-${user.id?.slice(0, 4) ?? '0000'}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-green-600 to-emerald-500 flex flex-col items-center justify-center p-4 sm:p-8"
    >
      {/* Carte de membre */}
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md"
      >
        <Card
          ref={cardRef}
          className="relative overflow-hidden border-0 shadow-2xl rounded-2xl bg-white text-gray-800"
        >
          {/* Fond décoratif */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 opacity-50"></div>

          {/* Bandeau supérieur */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 h-3 w-full"></div>

          <CardHeader className="text-center pt-6 pb-4 relative z-10">
            <div className="flex justify-center mb-2">
              <Image
                src="/union.jpg" // Remplacez par votre logo
                alt="Logo USA"
                width={80}
                height={80}
                className="h-16 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Carte de Membre
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Union des Sortants d&ldquo;Algérie
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center text-center pb-8 relative z-10">
            {/* Photo de profil */}
            {user.photo && (
              <div className="mb-4 relative">
                <div className="absolute inset-0 rounded-full border-4 border-white shadow-md"></div>
                <Image
                  src={user.photo}
                  alt="Photo de profil"
                  width={100}
                  height={100}
                  className="rounded-full object-cover w-24 h-24 border-4 border-emerald-400"
                />
              </div>
            )}

            {/* Informations du membre */}
            <div className="space-y-2 w-full">
              <p className="text-xl font-bold text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-600">{user.job}</p>
              <p className="text-xs text-gray-500">{user.domain}</p>

              <div className="my-4 border-t border-gray-200 w-full"></div>

              <p className="text-sm font-medium text-gray-700">N° Membre: {membershipNumber}</p>
              <p className="text-xs text-gray-500">Tel: {user.nni}</p>
            </div>

            {/* Code-barres */}
            <div className="mt-6 bg-white p-3 rounded-lg shadow-inner border border-gray-200">
              <Barcode
                value={membershipNumber}
                width={1.5}
                height={50}
                fontSize={12}
                background="transparent"
              />
            </div>

            {/* Cachet */}
            <div className="mt-6 flex justify-center">
              <div className="border-2 border-dashed border-gray-300 rounded-full p-2">
                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center text-xs text-center text-gray-400">
                  Cachet et signature
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Boutons d'action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-md"
      >
        <Button
          onClick={() => handlePrint()}
          className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg"
          size="lg"
        >
          <Download className="w-5 h-5" />
          Télécharger PDF
        </Button>
        <Button
          onClick={() => router.push("/dashboard/espace-user")}
          variant="outline"
          className="gap-2 border-gray-300 hover:bg-gray-50 shadow-sm"
          size="lg"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default MembershipCard;