"use client";

import React, { useContext } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from "@/components/AuthContext";
import Barcode from "react-barcode";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const MembershipCard = () => {
  const { user } = useContext(AuthContext) ?? {};
  const router = useRouter();

  if (!user) {
    return <p className="text-center text-gray-500">Aucun utilisateur connecté.</p>;
  }

  const membershipNumber = `CS-${user.nni.slice(-4)}-${user.id.slice(0, 4)}`;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Card className="shadow-xl border rounded-lg p-6 bg-white w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-16 bg-blue-600" />
        <CardHeader className="text-center relative z-10">
          <CardTitle className="text-xl font-bold text-white">Carte Professionnelle</CardTitle>
          <CardDescription className="text-white"> Union des Sortants d&apos;Algérie</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center mt-4 relative z-10">
          {user.photo && (
            <Image src={user.photo} alt="Photo de profil" height={100} width={100} className="rounded-full border-4 border-gray-300 mb-4" />
          )}
          <p className="text-lg font-semibold">N° {user.nni}</p>
          <p className="text-gray-700 text-xl font-bold mt-1">{user.name}</p>
          <p className="text-gray-600 mt-2">{user.job}</p>
          <p className="text-gray-500 text-sm">{user.domain}</p>
          <div className="mt-4">
            <Barcode value={membershipNumber} width={2} height={50} />
          </div>
          <Button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded" onClick={() => router.push("/dashboard")}>Retour</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MembershipCard;
