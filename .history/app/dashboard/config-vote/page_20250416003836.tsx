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
import { Trash2, PlusCircle, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Loader from "@/components/Loader";
import { motion } from "framer-motion";

const MySwal = withReactContent(Swal);

const ConfigVotePage = () => {
    const { user } = useContext(AuthContext) ?? {};
    const { toast } = useToast();
    const router = useRouter();

    const [newChoice, setNewChoice] = useState("");
    const [choices, setChoices] = useState<{ id: string; label: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user?.role !== "ADMIN") {
            router.push("/dashboard");
            return;
        }

        const fetchChoices = async () => {
            try {
                const data = await getChoices();
                setChoices(data);
            } catch (error) {
                toast({
                    title: "Erreur",
                    description: "Impossible de charger les choix de vote",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchChoices();
    }, [user, router, toast]);

    const handleAddChoice = async () => {
        if (!newChoice.trim()) {
            toast({
                title: "Champ vide",
                description: "Veuillez entrer un choix valide",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await addChoice(newChoice.trim());
            if (result.success) {
                toast({
                    title: "Succès",
                    description: "Choix ajouté avec succès",
                    className: "bg-green-500 text-white",
                });

                if (result.choice) {
                    setChoices((prev) => [...prev, result.choice]);
                }
                setNewChoice("");
            } else {
                toast({
                    title: "Erreur",
                    description: result.message || "Échec de l'ajout du choix",
                    variant: "destructive",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteChoice = async (choiceId: string) => {
        const choice = choices.find((c) => c.id === choiceId);
        if (!choice) return;

        const result = await MySwal.fire({
            title: <span className="text-lg">Confirmer la suppression</span>,
            html: <p>Voulez-vous vraiment supprimer "<b>{choice.label}</b>" ?</p>,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Supprimer",
            cancelButtonText: "Annuler",
            customClass: {
                confirmButton: "bg-red-500 hover:bg-red-600",
            },
        });

        if (result.isConfirmed) {
            try {
                const res = await deleteChoice(choiceId);
                if (res.success) {
                    toast({
                        title: "Supprimé",
                        description: `"${choice.label}" a été supprimé`,
                        className: "bg-green-500 text-white",
                    });
                    setChoices((prev) => prev.filter((c) => c.id !== choiceId));
                } else {
                    throw new Error(res.message);
                }
            } catch (error) {
                toast({
                    title: "Erreur",
                    description: "Échec de la suppression du choix",
                    variant: "destructive",
                });
            }
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (!user || user.role !== "ADMIN") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="max-w-md w-full text-center p-6">
                    <p className="text-gray-700">Accès réservé aux administrateurs</p>
                    <Button
                        onClick={() => router.push("/")}
                        className="mt-4 gap-2"
                        variant="outline"
                    >
                        <ArrowLeft size={16} /> Retour à l&ldquo;accueil
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 ">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-green-600 via-emerald-500 to-lime-400 text-white">
                        <CardTitle className="text-xl sm:text-2xl">
                            Configuration des options de vote
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-6 space-y-6">
                        {/* Formulaire d'ajout */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Input
                                value={newChoice}
                                onChange={(e) => setNewChoice(e.target.value)}
                                placeholder="Nouvelle option (ex: USA)"
                                className="flex-grow"
                                onKeyDown={(e) => e.key === "Enter" && handleAddChoice()}
                            />
                            <Button
                                onClick={handleAddChoice}
                                disabled={isSubmitting}
                                className="gap-2 bg-green-600 hover:bg-green-700"
                            >
                                <PlusCircle size={18} />
                                {isSubmitting ? "Ajout..." : "Ajouter"}
                            </Button>
                        </div>

                        {/* Liste des choix */}
                        <div className="space-y-3">
                            {choices.length === 0 ? (
                                <p className="text-center text-gray-500 py-6">
                                    Aucune option configurée
                                </p>
                            ) : (
                                <motion.div layout className="space-y-3">
                                    {choices.map((choice) => (
                                        <motion.div
                                            key={choice.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <span className="font-medium text-gray-800">
                                                {choice.label}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteChoice(choice.id)}
                                                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </div>

                        {/* Bouton de retour */}
                        <div className="pt-4">
                            <Button
                                onClick={() => router.push("/dashboard")}
                                variant="outline"
                                className="gap-2 w-full sm:w-auto"
                            >
                                <ArrowLeft size={16} /> Retour au tableau de bord
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default ConfigVotePage;