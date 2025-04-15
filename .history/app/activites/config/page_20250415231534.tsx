"use client";

import {
    getAllActivities,
    createActivity,
    updateActivity,
    deleteActivity,
} from "@/utils/actions";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/components/AuthContext";
import Swal from "sweetalert2";
import Uploader from "@/components/Uploader";
import Image from "next/image";
import { motion } from "framer-motion";

type Activity = {
    id: string;
    title: string;
    description: string;
    date: string | Date;
    imageUrl: string | null | undefined;
};

export default function ManageActivitiesPage() {
    const { user } = useContext(AuthContext) ?? {};
    const router = useRouter();

    const [activities, setActivities] = useState<Activity[]>([]);
    const [newActivity, setNewActivity] = useState({
        title: "",
        description: "",
        date: "",
        imageUrl: "",
    });

    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        if (user?.role !== "ADMIN") {
            router.push("/dashboard");
        }
    }, [user?.role, router]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getAllActivities();
                setActivities(data);
            } catch (error) {
                showError("Impossible de récupérer les activités.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const showError = (message: string) => {
        Swal.fire({
            title: "Erreur",
            text: message,
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#6b7280",
        });
    };

    const showSuccess = (message: string) => {
        Swal.fire({
            title: "Succès",
            text: message,
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#10b981",
        });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setNewActivity({ ...newActivity, [e.target.name]: e.target.value });
    };

    const handleCreate = async () => {
        if (!newActivity.title || !newActivity.date) {
            showError("Le titre et la date sont obligatoires");
            return;
        }

        setLoading(true);
        try {
            await createActivity(newActivity);
            const updated = await getAllActivities();
            setActivities(updated);
            setNewActivity({ title: "", description: "", date: "", imageUrl: "" });
            setIsFormOpen(false);
            showSuccess("L'activité a été ajoutée.");
        } catch (error) {
            showError("Impossible d'ajouter l'activité.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id: string) => {
        setLoading(true);
        try {
            await updateActivity(id, newActivity);
            const updated = await getAllActivities();
            setActivities(updated);
            setEditingId(null);
            setNewActivity({ title: "", description: "", date: "", imageUrl: "" });
            setIsFormOpen(false);
            showSuccess("L'activité a été mise à jour.");
        } catch (error) {
            showError("Impossible de mettre à jour l'activité.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "Êtes-vous sûr?",
            text: "Cette action est irréversible!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Oui, supprimer!",
            cancelButtonText: "Annuler",
        });

        if (result.isConfirmed) {
            setLoading(true);
            try {
                await deleteActivity(id);
                const updated = await getAllActivities();
                setActivities(updated);
                showSuccess("L'activité a été supprimée.");
            } catch (error) {
                showError("Impossible de supprimer l'activité.");
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setNewActivity({ title: "", description: "", date: "", imageUrl: "" });
    };

    return (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Gestion des activités
                </h1>
                <Button
                    onClick={() => {
                        resetForm();
                        setIsFormOpen(!isFormOpen);
                    }}
                    className="gap-2"
                >
                    <PlusCircle className="w-4 h-4" />
                    {isFormOpen ? "Fermer" : "Nouvelle activité"}
                </Button>
            </div>

            {/* Formulaire */}
            {isFormOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="mb-8 bg-white shadow-lg rounded-xl border-0">
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl text-emerald-600">
                                {editingId ? "Modifier l'activité" : "Nouvelle activité"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                name="title"
                                placeholder="Titre de l'activité"
                                value={newActivity.title}
                                onChange={handleChange}
                                className="border-gray-300 focus:border-emerald-500"
                            />
                            <Textarea
                                name="description"
                                placeholder="Description détaillée"
                                value={newActivity.description}
                                onChange={handleChange}
                                className="border-gray-300 focus:border-emerald-500 min-h-[120px]"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    name="date"
                                    type="date"
                                    value={newActivity.date}
                                    onChange={handleChange}
                                    className="border-gray-300 focus:border-emerald-500"
                                />
                                <Uploader
                                    onUpload={(url) => setNewActivity({ ...newActivity, imageUrl: url })}
                                   
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    onClick={editingId ? () => handleUpdate(editingId) : handleCreate}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                    disabled={loading}
                                >
                                    {loading ? "En cours..." : editingId ? "Mettre à jour" : "Ajouter"}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        resetForm();
                                        setIsFormOpen(false);
                                    }}
                                    className="flex-1"
                                >
                                    Annuler
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Liste des activités */}
            {loading && !isFormOpen ? (
               
            ) : activities.length === 0 ? (
                <Card className="text-center py-12 bg-white/50">
                    <p className="text-gray-500">Aucune activité disponible</p>
                </Card>
            ) : (
                <motion.div
                    layout
                    className="grid gap-4 sm:grid-cols-1 md:grid-cols-2"
                >
                    {activities.map((activity) => (
                        <motion.div
                            key={activity.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="h-full flex flex-col shadow-sm hover:shadow-md transition-shadow border-gray-200">
                                {activity.imageUrl && (
                                    <div className="relative h-48 w-full">
                                        <Image
                                            src={activity.imageUrl}
                                            alt={activity.title}
                                            fill
                                            className="object-cover rounded-t-lg"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-lg text-gray-800">
                                        {activity.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                                        {activity.description}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-4">
                                        <span className="font-medium">Date :</span>{" "}
                                        {new Date(activity.date).toLocaleDateString("fr-FR", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </CardContent>
                                <div className="p-4 border-t border-gray-100">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 gap-2"
                                            onClick={() => {
                                                setEditingId(activity.id);
                                                setNewActivity({
                                                    title: activity.title,
                                                    description: activity.description,
                                                    date: new Date(activity.date).toISOString().split("T")[0],
                                                    imageUrl: activity.imageUrl ?? "",
                                                });
                                                setIsFormOpen(true);
                                            }}
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Modifier
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="flex-1 gap-2"
                                            onClick={() => handleDelete(activity.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Supprimer
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}