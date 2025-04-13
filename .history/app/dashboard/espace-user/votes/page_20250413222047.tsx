'use client'

import React, { useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AuthContext } from "@/components/AuthContext";
import { castVote, getVoteResults, getChoices } from "@/utils/actions";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Swal from 'sweetalert2';  // Import de SweetAlert2
import Loader from "@/components/Loader";

const VotePage = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext) ?? {};
  const [selectedVote, setSelectedVote] = useState("");
  const [results, setResults] = useState({
    totalVotes: 0,
    choices: [] as { label: string; votes: number; percentage: number }[],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const choices = await getChoices();
        const result = await getVoteResults();

        const updatedChoices = choices.map((choice: any) => {
          const choiceVotes = result.choices.find((res: any) => res.label === choice.label)?.votes || 0;
          const percentage = result.totalVotes > 0 ? (choiceVotes / result.totalVotes) * 100 : 0;

          return {
            label: choice.label,
            votes: choiceVotes,
            percentage: parseFloat(percentage.toFixed(2)),
          };
        });

        setResults({
          totalVotes: result.totalVotes,
          choices: updatedChoices,
        });
      } catch (error) {
        Swal.fire({
          title: 'Erreur',
          text: 'Impossible de charger les données de vote.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  if (loading) {
    return <Loader />;
  }
  if (!user) {
    return (
      <p className="text-center text-gray-500">
        Accès réservé aux utilisateurs connectés.
      </p>
    );
  }

  const handleVote = async (choice: string) => {
    setSelectedVote(choice);
    setLoading(true);

    try {
      const result = await castVote(user.id, choice);

      if (result.success) {
        Swal.fire({
          title: 'Succès',
          text: `Vous avez voté pour ${choice}.`,
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'swal-button-ok'
          },
        });

        const updatedChoices = results.choices.map((item) =>
          item.label === choice ? { ...item, votes: item.votes + 1, percentage: ((item.votes + 1) / (results.totalVotes + 1)) * 100 } : item
        );

        setResults({ ...results, totalVotes: results.totalVotes + 1, choices: updatedChoices });
      } else {
        Swal.fire({
          title: 'Erreur',
          text: result.message,
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'swal-button-ok'
          },
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Erreur',
        text: 'Échec du vote, essayez à nouveau.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
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
                  disabled={selectedVote !== ""} // Désactive les autres boutons après le vote
                >
                  {choice.label}
                </Button>
              ))
            )}
          </CardContent>
           <Button
                    className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition duration-300 w-full sm:w-auto"
                    onClick={() => router.push("/dashboard")}
                  >
                    Retour
                  </Button>
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
