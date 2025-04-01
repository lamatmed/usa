"use client";

import React, { useRef, useContext } from "react";
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
  const cardRef = useRef(null);

  if (!user) {
    return <p className="text-center text-gray-500">Aucun utilisateur connecté.</p>;
  }

  const membershipNumber = `CARTE-${user.id}`;

  const handlePrint = useReactToPrint({
    content: () => cardRef.current,
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 p-4">
      <div ref={cardRef} className="w-80 border shadow-lg rounded-lg bg-white relative overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4 text-center">
          <CardTitle className="text-lg font-bold">Carte d'Adhésion</CardTitle>
          <CardDescription className="text-sm">Union des Sortants d'Algérie</CardDescription>
        </div>
        <CardContent className="p-4 text-center">
          {user.photo && (
            <Image
              src={user.photo}
              alt="Photo de profil"
              height={70}
              width={70}
              className="rounded-full border-2 border-gray-300 mx-auto mb-2"
            />
          )}
          <p className="text-sm font-semibold">N° {user.nni}</p>
          <p className="text-lg font-bold mt-1">{user.name}</p>
          <p className="text-sm text-gray-600 mt-1">{user.job}</p>
          <div className="mt-3">
            <Barcode value={membershipNumber} width={1.5} height={40} displayValue={false} />
          </div>
        </CardContent>
      </div>
      <div className="flex flex-col mt-4 gap-2">
        <Button onClick={handlePrint} className="bg-blue-600 text-white px-4 py-2 rounded">Télécharger PDF</Button>
        <Button onClick={() => router.push("/dashboard")} className="bg-gray-500 text-white px-4 py-2 rounded">Retour</Button>
      </div>
    </div>
  );
};

export default MembershipCard;