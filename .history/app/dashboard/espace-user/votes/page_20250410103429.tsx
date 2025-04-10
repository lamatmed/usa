"use client";

import React, { useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { AuthContext } from "@/components/AuthContext";
import { castVote, getVoteResults, getChoices } from "@/utils/actions"; // Import des actions pour récupérer les résultats et les choix
import { useRouter } from "next/navigation";

// Définition du type de données des résultats de vote
type VoteResult = {
  totalVotes: number;
  choices: {
    label: string;
    votes: number;
    percentage: number;
  }[];
};

const VotePage = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext) ?? {};
  const { toast } = useToast();
  const [selectedVote, setSelectedVote] = useState<string>("");
  const [results, setResults] = useState<VoteResult>({
    totalVotes: 0,
    choices: [], // Initialisation avec un tableau vide
  });

  // Récupérer les résultats des votes et les choix de vote au chargement de la page
  useEffect(() => {
  const fetchData = async () => {
    const choices = await getChoices();  // Get the vote choices
    const result = await getVoteResults(); // Get the vote results

    // Map the results into the expected format for 'choices'
    const updatedChoices = Object.keys(result)
      .filter((key) => key !== 'totalVotes')
      .map((choice) => ({
        label: choice,
        votes: result[choice] || 0, // Ensure you have the correct number of votes
        percentage: 0, // We'll calculate the percentage next
      }));

    // Calculate percentages
    const totalVotes = result.totalVotes;
    updatedChoices.forEach((choice) => {
      choice.percentage = (choice.votes / totalVotes) * 100;
    });

    setResults({
      totalVotes,
      choices: updatedChoices,
    });
  };

  fetchData();
}, []);


      // Calculer les pourcentages
      const totalVotes = updatedChoices.reduce((total, choice) => total + choice.votes, 0);
      updatedChoices.forEach((choice) => {
        choice.percentage = (choice.votes / totalVotes) * 100;
      });

      // Mettre à jour l'état
      setResults({
        totalVotes,
        choices: updatedChoices,
      });
    };

    fetchData();
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
          <CardContent className="space-y-4">
            {results.choices.length === 0 ? (
              <p>Aucun choix de vote disponible.</p>
            ) : (
              results.choices.map((choice) => (
                <Button
                  key={choice.label}
                  onClick={() => handleVote(choice.label)}
                  className={`w-full py-2 rounded ${
                    selectedVote === choice.label
                      ? "bg-blue-500 text-white"
                      : "bg-gray-500"
                  }`}
                >
                  {choice.label}
                </Button>
              ))
            )}
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

        {/* Affichage des résultats en bas */}
        <Card className="mt-6 shadow-md border border-gray-200 p-4">
          <CardHeader>
            <CardTitle>Résultats des votes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-6">
              {results.choices.map((choice) => (
                <div key={choice.label} className="bg-blue-100 p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-semibold text-blue-700">
                      <strong>{choice.label}</strong>
                    </div>
                    <div className="text-lg text-blue-500">
                      {choice.votes} votes ({choice.percentage.toFixed(2)}%)
                    </div>
                  </div>
                  <div className="w-full h-2 bg-blue-300 rounded-full mt-2">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${choice.percentage}%` }}
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
