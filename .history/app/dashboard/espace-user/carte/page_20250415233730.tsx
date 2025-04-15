"use client";

import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
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

  // Correction: Utilisation correcte de useReactToPrint
  const handlePrint = useReactToPrint({
    content: () => cardRef.current,
    pageStyle: `
      @page { size: auto; margin: 0mm; }
      @media print { 
        body { -webkit-print-color-adjust: exact; } 
      }
    `,
  });

  // Création d'un gestionnaire de clic pour le bouton
  const handleDownloadClick = useCallback(() => {
    handlePrint();
  }, [handlePrint]);

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
          {/* ... (le reste de votre code de carte reste inchangé) ... */}
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
          onClick={handleDownloadClick} // Utilisation du gestionnaire corrigé
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