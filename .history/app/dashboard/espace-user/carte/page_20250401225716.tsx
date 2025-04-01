"use client";

import React, { useRef, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from "@/components/AuthContext";
import Barcode from "react-barcode";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";

const MembershipCard = () => {
  const { user } = useContext(AuthContext) ?? {};
  const router = useRouter();
  const cardRef = useRef(null);

  if (!user) {
    return <p className="text-center text-gray-500">Aucun utilisateur connecté.</p>;
  }

  const membershipNumber = `CARTE-${user.id}`;

  const handlePrint = useReactToPrint({
    content: () => cardRef.current, // Référence pour imprimer en PDF
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Carte d'adhésion */}
      <div ref={cardRef} className="shadow-lg border rounded-md p-4 bg-white w-72 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-r from-blue-700 to-blue-500" />
        <CardHeader className="text-center relative z-10 text-white">
          <CardTitle className="text-lg font-bold">Carte de Membre</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center mt-6 relative z-10">
          {user.photo && (
            <Image src={user.photo} alt="Photo de profil" height={60} width={60} className="rounded-full border-2 border-gray-300 mb-2" />
          )}
          <p className="text-sm font-semibold">N° {user.nni}</p>
          <p className="text-lg font-bold text-gray-800 mt-1">{user.name}</p>
          <div className="mt-2">
            <Barcode value={membershipNumber} width={1.5} height={40} />
          </div>
        </CardContent>
      </div>

      {/* Boutons */}
      <div className="mt-4 flex gap-2">
        <Button onClick={handlePrint} className="bg-blue-600 text-white px-4 py-2 rounded">Télécharger PDF</Button>
        <Button onClick={() => router.push("/dashboard")} className="bg-gray-600 text-white px-4 py-2 rounded">Retour</Button>
      </div>
    </div>
  );
};

export default MembershipCard;
