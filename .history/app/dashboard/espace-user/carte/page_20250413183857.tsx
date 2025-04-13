"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => cardRef.current,
    documentTitle: "Carte de Membre",
    removeAfterPrint: true,
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-teal-400 to-blue-500 p-8">
      <Card
        ref={cardRef}
        className="shadow-2xl border rounded-xl p-6 bg-white text-black w-full max-w-md relative overflow-hidden"
      >
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-800">Carte de Membre</CardTitle>
          <CardDescription className="text-sm text-black">Union des Sortants d&apos;Algérie</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center mt-4">
          {user.photo && (
            <Image
              src={user.photo}
              alt="Photo de profil"
              height={80}
              width={80}
              className="rounded-full border-4 border-blue-400 mb-4"
            />
          )}
          <p className="text-lg font-semibold text-blue-700">N° {user.nni}</p>
          <p className="text-xl font-bold text-blue-800 mt-2">{user.name}</p>
          <p className="text-md text-gray-900 mt-1">{user.job}</p>
          <p className="text-sm text-gray-700 mt-1">{user.domain}</p>
          <div className="mt-4 bg-white p-3 rounded-lg shadow-md">
            <Barcode value={membershipNumber} width={1.5} height={50} />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-4 flex-col sm:flex-row w-full max-w-md">
        <Button
          className="bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-900 transition duration-300 w-full sm:w-auto"
          onClick={handlePrint}
        >
          Télécharger PDF
        </Button>
        <Button
          className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition duration-300 w-full sm:w-auto"
          onClick={() => router.push("/dashboard")}
        >
          Retour
        </Button>
      </div>
    </div>
  );
};

export default MembershipCard;
