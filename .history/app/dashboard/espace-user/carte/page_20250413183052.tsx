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

const MembershipCard = () => {
  const { user } = useContext(AuthContext) ?? {};
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = useReactToPrint({
    contentRef: cardRef,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <p className="text-center text-gray-500">Aucun utilisateur connecté.</p>;
  }

  const membershipNumber = `CS-${user.nni.slice(-4)}-${user.id.slice(0, 4)}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-teal-400 to-blue-500 p-4 sm:p-8">
      <Card
        ref={cardRef}
        className="shadow-2xl border rounded-xl p-4 sm:p-6 bg-white text-black w-full max-w-sm sm:max-w-md relative overflow-hidden"
      >
        <CardHeader className="text-center">
          <CardTitle className="text-xl sm:text-2xl font-bold text-blue-800">
            Carte de Membre
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-black">
            Union des Sortants d&apos;Algérie
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center text-center mt-2 sm:mt-4">
          {user.photo && (
            <Image
              src={user.photo}
              alt="Photo de profil"
              height={70}
              width={70}
              className="rounded-full border-4 border-blue-400 mb-3"
            />
          )}
          <p className="text-base font-semibold text-blue-700">N° {user.nni}</p>
          <p className="text-lg sm:text-xl font-bold text-blue-800 mt-1">{user.name}</p>
          <p className="text-sm text-gray-900 mt-1">{user.job}</p>
          <p className="text-xs text-gray-700 mt-1">{user.domain}</p>
          <div className="mt-4 bg-white p-2 rounded-lg shadow-md w-full">
            <Barcode
              value={membershipNumber}
              width={1.2}
              height={40}
              fontSize={12}
              displayValue={false}
            />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <Button
          className="bg-teal-700 text-white py-3 rounded-lg hover:bg-teal-900 transition duration-300 w-full"
          onClick={() => handlePrint()}
        >
          Télécharger PDF
        </Button>
        <Button
          className="bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 transition duration-300 w-full"
          onClick={() => router.push("/dashboard")}
        >
          Retour
        </Button>
      </div>
    </div>
  );
};

export default MembershipCard;
