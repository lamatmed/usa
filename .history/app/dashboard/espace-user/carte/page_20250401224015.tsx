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

  const membershipNumber = `CARTE-${user.id}`;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Card className="shadow-xl border rounded-lg p-6 bg-white w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">Carte d'Adhésion</CardTitle>
          <CardDescription>Union des Travailleurs</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center">
          {user.photo && (
            <Image src={user.photo} alt="Photo de profil" height={80} width={80} className="rounded-full mb-4" />
          )}
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-gray-600">Numéro : {membershipNumber}</p>
          <div className="mt-4">
            <Barcode value={membershipNumber} width={2} height={50} />
          </div>
          <Button className="mt-4" onClick={() => router.push("/dashboard")}>Retour</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MembershipCard;
