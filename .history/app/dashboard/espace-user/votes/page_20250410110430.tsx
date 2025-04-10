'use client'

import React, { useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { AuthContext } from "@/components/AuthContext";
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'; // Import de l'action pour récupérer les résultats et les choix
import { useRouter } from "next/navigation";


const VotePage = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext) ?? {};
  const { toast } = useToast();
  const [selectedVote, setSelectedVote] = useState("");
  const [results, setResults] = useState({
    totalVotes: 0,
    choices: [] as { label: string; votes: number; percentage: number }[], // Nouveau champ pour les choix
  });

  // Récupérer les résultats des votes et les choix disponibles au chargement de la page
  useEffect(() => {
    const fetchData = async () => {
      const choices = await getChoices();  // Récupérer les choix
      const result = await getVoteResults(); // Récupérer les résultats

      // Mettre à jour les résultats avec les votes réels
      const updatedChoices = choices.map((choice: any) => {
        const choiceVotes = result.choices.find((res: any) => res.label === choice.label)?.votes || 0;
        const percentage = result.totalVotes > 0 ? (choiceVotes / result.totalVotes) * 100 : 0;

        return {
          label: choice.label,
          votes: choiceVotes,
          percentage: parseFloat(percentage.toFixed(2)), // Assure-toi que c'est un nombre
        };
      });


      setResults({
        totalVotes: result.totalVotes,
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
                  className={`w-full py-2 rounded ${selectedVote === choice.label
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

        {/* Affichage des résultats */}
        <Card className="mt-6 shadow-md border border-gray-200 p-4">
          <CardHeader>
            <CardTitle>Résultats des votes</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="space-y-4 mt-6">
      {results.choices.map((choice) => (
        <div key={choice.label} className="bg-blue-50 p-4 rounded-lg shadow-lg transition duration-300 ease-in-out hover:scale-105">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="text-xl font-semibold text-blue-700">
                <strong>{choice.label}</strong>
              </div>
              {/* Ajout d'icônes */}
              {choice.votes > 0 ? (
                <FiCheckCircle className="text-green-500" />
              ) : (
                <FiXCircle className="text-red-500" />
              )}
            </div>
            <div className="text-lg text-blue-500">
            {choice.votes} votes ({choice.percentage}%)
            </div>
          </div>
          {/* Barre de progression dynamique */}
          <div className="w-full h-2 bg-blue-300 rounded-full mt-2">
            <div
              className="h-full bg-blue-600 rounded-full"
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
