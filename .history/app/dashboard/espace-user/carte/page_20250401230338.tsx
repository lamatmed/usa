"use client";

import React, { useContext, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from "@/components/AuthContext";
import Barcode from "react-barcode";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";

const MembershipCard = () => {
  const { user } = useContext(AuthContext) ?? {};
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement | null>(null);  // Spécifier le type de la référence
  
  const handlePrint = useReactToPrint({
    contentRef: cardRef,  // Utiliser 'contentRef' au lieu de 'content'
  });

  if (!user) {
    return <p className="text-center text-gray-500">Aucun utilisateur connecté.</p>;
  }

  const membershipNumber = `CS-${user.nni.slice(-4)}-${user.id.slice(0, 4)}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card ref={cardRef} className="shadow-lg border rounded-lg p-4 bg-gradient-to-br from-blue-500 to-blue-700 text-white w-80 relative overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle className="text-lg font-bold">Carte de Membre</CardTitle>
          <CardDescription className="text-sm">Union des Sortants d&apos;Algérie</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center mt-2">
          {user.photo && (
            <Image src={user.photo} alt="Photo de profil" height={70} width={70} className="rounded-full border-2 border-white mb-2" />
          )}
          <p className="text-md font-semibold">N° {user.nni}</p>
          <p className="text-lg font-bold mt-1">{user.name}</p>
          <p className="text-md mt-1">{user.job}</p>
          <p className="text-sm opacity-80">{user.domain}</p>
          <div className="mt-3 bg-white p-2 rounded-lg">
            <Barcode value={membershipNumber} width={1.5} height={40} />
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 flex gap-2">
        <Button className="bg-green-600 text-white px-3 py-2 rounded" onClick={handlePrint}>Télécharger PDF</Button>
        <Button className="bg-gray-600 text-white px-3 py-2 rounded" onClick={() => router.push("/dashboard")}>Retour</Button>
      </div>
    </div>
  );
};

export default MembershipCard;
