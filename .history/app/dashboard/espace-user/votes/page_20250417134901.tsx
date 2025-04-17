'use client'

import React, { useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AuthContext } from "@/components/AuthContext";
import { castVote, getVoteResults, getChoices } from "@/utils/actions";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Swal from 'sweetalert2';
import Loader from "@/components/Loader";


const VotePage = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext) ?? {};
  const [selectedVote, setSelectedVote] = useState("");
  const [results, setResults] = useState({
    totalVotes: 0,
    choices: [] as { label: string; votes: number; percentage: number }[],
  });
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
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
        customClass: {
          confirmButton: 'swal-button-ok'
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleVote = async (choice: string) => {
    if (!user) return;

    const confirmVote = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous allez voter pour ${choice}. Confirmer ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      customClass: {
        confirmButton: 'swal-button-ok',
        cancelButton: 'swal-button-cancel',
      },
    });

    if (confirmVote.isConfirmed) {
      setSelectedVote(choice);
      setLoading(true);

      try {
        const result = await castVote(user.id, choice);

        if (result.success) {
          // Calcul optimisé des nouveaux résultats
          const newTotalVotes = results.totalVotes + 1;
          const updatedChoices = results.choices.map(item => {
            const newVotes = item.label === choice ? item.votes + 1 : item.votes;
            const newPercentage = parseFloat(((newVotes / newTotalVotes) * 100).toFixed(2));

            return {
              ...item,
              votes: newVotes,
              percentage: newPercentage
            };
          });

          setResults({
            totalVotes: newTotalVotes,
            choices: updatedChoices
          });

          await Swal.fire({
            title: 'Succès',
            text: `Vous avez voté pour ${choice}.`,
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'swal-button-ok',
            },
          });
        } else {
          Swal.fire({
            title: 'Erreur',
            text: result.message,
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'swal-button-ok',
            },
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Erreur',
          text: 'Échec du vote, essayez à nouveau.',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'swal-button-ok',
          },
        });
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!user) return <Racine />;

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
                  className={`w-full py-2 rounded transition-colors ${selectedVote === choice.label
                      ? "bg-blue-500 text-white"
                      : "bg-gray-500 hover:bg-gray-600"
                    }`}
                  disabled={selectedVote !== ""}
                >
                  {choice.label}
                </Button>
              ))
            )}
          </CardContent>
          <Button
            className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition duration-300 w-full sm:w-auto mt-4"
            onClick={() => router.push("/dashboard/espace-user")}
          >
            Retour
          </Button>
        </Card>

        <Card className="mt-6 shadow-md border border-gray-200 p-4">
          <CardHeader>
            <CardTitle>Résultats des votes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-6">
              {results.choices.map((choice) => (
                <motion.div
                  key={choice.label}
                  className="bg-blue-50 p-4 rounded-lg shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
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
                  <motion.div
                    className="w-full h-2 bg-blue-300 rounded-full mt-2"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className="h-full bg-blue-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${choice.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    ></motion.div>
                  </motion.div>
                </motion.div>
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