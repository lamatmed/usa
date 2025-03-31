"use client";

import React, { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { AuthContext } from "@/components/AuthContext";

const VotePage = () => {
  const { user } = useContext(AuthContext) ?? {};
  const { toast } = useToast();
  const [selectedVote, setSelectedVote] = useState("");

  if (!user) {
    return <p className="text-center text-gray-500">Accès réservé aux utilisateurs connectés.</p>;
  }

  const handleVote = (choice: string) => {
    setSelectedVote(choice);
    toast({ title: "Vote enregistré", description: `Vous avez voté pour ${choice}.` });
  };

  return (
    <div className="max-w-lg mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">Votez pour votre candidat</h1>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="shadow-lg rounded-xl border border-gray-200 p-4">
          <CardHeader>
            <CardTitle>Faites votre choix :</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => handleVote("UDA")}
              className={`w-full py-2 rounded ${selectedVote === "UDA" ? "bg-blue-500 text-white" : "bg-gray-500"}`}
            >
              UDA
            </Button>
            <Button
              onClick={() => handleVote("UDE")}
              className={`w-full py-2 rounded ${selectedVote === "UDE" ? "bg-blue-500 text-white" : "bg-gray-500"}`}
            >
              UDE
            </Button>
            <Button
              onClick={() => handleVote("Naitre")}
              className={`w-full py-2 rounded ${selectedVote === "Naitre" ? "bg-blue-500 text-white" : "bg-gray-500"}`}
            >
              Naitre
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VotePage;