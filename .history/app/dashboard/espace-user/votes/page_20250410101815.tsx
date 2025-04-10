"use client";

import React, { useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { AuthContext } from "@/components/AuthContext";
import { castVote, getVoteResults, getChoices } from "@/utils/actions"; // Import de l'action pour récupérer les choix et les résultats
import { useRouter } from "next/navigation";

const VotePage = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext) ?? {};
  const { toast } = useToast();
  const [selectedVote, setSelectedVote] = useState("");
  const [results, setResults] = useState({
    totalVotes: 0,
    choices: [] as { label: string; votes: number; percentage: number }[], // Tableau pour stocker les résultats dynamiques
  });
  const [choices, setChoices] = useState<{ label: string }[]>([]); // Tableau des choix récupérés

  // Récupérer les choix dynamiques et les résultats au chargement de la page
  useEffect(() => {
    const fetchChoicesAndResults = async () => {
      const choicesData = await getChoices(); // Récupérer les choix
      setChoices(choicesData); // Mettre à jour l'état avec les choix
      const result = await getVoteResults(); // Action pour récupérer les résultats
      setResults(result);
    };

    fetchChoicesAndResults();
  }, []);

  if (!user) {
    return (
      <p className="text-center text-gray-500">
        Accès réservé aux utilisateurs connectés.
      </p>
    );
  }

  const handleVote = async (choice: string) => {
    setSelectedVote(choice);

    // Enregistrer le vote dans la base de données
    const result = await castVote(user.id, choice);

    if (result.success) {
      toast({ title: "Succès", description: `Vous avez voté pour ${choice}.` });
      // Rafraîchir les résultats après chaque vote
      const updatedResults = await getVoteResults();
      setResults(updatedResults);
    } else {
      toast({
        title: "Erreur",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  // Calculer le pourcentage
  const calculatePercentage = (votes: number) => {
    if (results.totalVotes === 0) return 0;
    return ((votes / results.totalVotes) * 100).toFixed(2);
  };

  return (
    <div className="max-w-lg mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">Votez pour votre candidat</h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="shadow-lg rounded-xl border border-gray-200 p-4">
          <CardHeader>
            <CardTitle>Faites votre choix :</CardTitle>
          </CardHeader>
          <CardContent>
  <div className="space-y-4 mt-6">
    {results.choices && results.choices.length > 0 ? (
      results.choices.map((choice) => (
        <div
          key={choice.label}
          className={`bg-${choice.label}-100 p-4 rounded-lg shadow-md`}
        >
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold text-${choice.label}-700">
              <strong>{choice.label}</strong>
            </div>
            <div className="text-lg text-${choice.label}-500">
              {choice.votes} votes ({choice.percentage}%)
            </div>
          </div>
          <div className="w-full h-2 bg-${choice.label}-300 rounded-full mt-2">
            <div
              className={`h-full bg-${choice.label}-500 rounded-full`}
              style={{
                width: `${choice.percentage}%`,
              }}
            ></div>
          </div>
        </div>
      ))
    ) : (
      <p>Aucun choix de vote disponible.</p>
    )}
    <div className="text-lg font-medium text-gray-800 mt-4">
      <strong>Total des votes:</strong> {results.totalVotes}
    </div>
  </div>
</CardContent>

        </Card>
        <CardContent className="text-center flex justify-center gap-2">
          <Button
            onClick={() => router.push("/dashboard/espace-user")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Retour
          </Button>
        </CardContent>

        {/* Affichage des résultats dynamiques */}
        <Card className="mt-6 shadow-md border border-gray-200 p-4">
          <CardHeader>
            <CardTitle>Résultats des votes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-6">
              {results.choices.map((choice) => (
                <div
                  key={choice.label}
                  className={`bg-${choice.label}-100 p-4 rounded-lg shadow-md`}
                >
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-semibold text-${choice.label}-700">
                      <strong>{choice.label}</strong>
                    </div>
                    <div className="text-lg text-${choice.label}-500">
                      {choice.votes} votes ({choice.percentage}%)
                    </div>
                  </div>
                  <div className="w-full h-2 bg-${choice.label}-300 rounded-full mt-2">
                    <div
                      className={`h-full bg-${choice.label}-500 rounded-full`}
                      style={{
                        width: `${choice.percentage}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}

              <div className="text-lg font-medium text-gray-800 mt-4">
                <strong>Total des votes:</strong> {results.totalVotes}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VotePage;
