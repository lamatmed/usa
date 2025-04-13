"use client";

import React, { useState, useEffect, useContext } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/components/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getChoices, addChoice, deleteChoice } from "@/utils/actions";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

const ConfigVotePage = () => {
    const { user } = useContext(AuthContext) ?? {};
    const { toast } = useToast();
    const router = useRouter();

    const [newChoice, setNewChoice] = useState("");
    const [choices, setChoices] = useState<{ id: string; label: string }[]>([]);

    useEffect(() => {
        const fetchChoices = async () => {
            const data = await getChoices();
            setChoices(data);
        };
        fetchChoices();
    }, []);

    const handleAddChoice = async () => {
        if (!newChoice.trim()) return;

        const result = await addChoice(newChoice.trim());
        if (result.success) {
            toast({
                title: "Succès",
                description: "Choix ajouté avec succès.",
            });

            if (result.choice) {
                setChoices((prev) => [...prev, result.choice]);
            }

            setNewChoice("");
        } else {
            toast({
                title: "Erreur",
                description: result.message,
                variant: "destructive",
            });
        }
    };

    const handleDeleteChoice = async (choiceId: string) => {
        const confirmed = confirm("Êtes-vous sûr de vouloir supprimer ce choix ?");
        if (!confirmed) return;

        const result = await deleteChoice(choiceId);
        if (result.success) {
            toast({
                title: "Supprimé",
                description: "Choix supprimé.",
            });

            setChoices((prev) => prev.filter((choice) => choice.id !== choiceId));
        } else {
            toast({
                title: "Erreur",
                description: result.message,
                variant: "destructive",
            });
        }
    };

    if (!user || user.role !== "ADMIN") {
        toast({
            title: "Accès refusé",
            description: "Vous devez être administrateur pour accéder à cette page.",
            variant: "destructive",
        });

        return (
            <p className="text-center text-gray-500 mt-10">
                Accès réservé aux administrateurs.
            </p>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Configurer les choix de vote</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Formulaire d'ajout */}
                    <div className="flex items-center gap-2">
                        <Input
                            value={newChoice}
                            onChange={(e) => setNewChoice(e.target.value)}
                            placeholder="Ajouter un choix (ex: USA)"
                        />
                        <Button onClick={handleAddChoice}>Ajouter</Button>
                    </div>

                    {/* Liste des choix */}
                    <div className="space-y-2 mt-4">
                        {choices.length === 0 ? (
                            <p className="text-gray-500 italic">Aucun choix pour l’instant.</p>
                        ) : (
                            choices.map((choice) => (
                                <div
                                    key={choice.id}
                                    className="flex justify-between items-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-3 rounded-lg"
                                >
                                    <span>{choice.label}</span>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDeleteChoice(choice.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Retour */}
                    <div className="flex justify-center mt-6">
                        <Button onClick={() => router.push("/dashboard")}>Retour</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ConfigVotePage;
