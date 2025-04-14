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
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/components/AuthContext";
import Swal from "sweetalert2"; // Import de SweetAlert2
import Uploader from "@/components/Uploader";
import Image from "next/image";

type Activity = {
    id: string;
    title: string;
    description: string;
    date: string | Date;
    imageUrl: string | null | undefined;  // Accepter null et undefined
};



export default function ManageActivitiesPage() {
    const { user } = useContext(AuthContext) ?? {};
    const router = useRouter();

    const [activities, setActivities] = useState<Activity[]>([]);
    const [newActivity, setNewActivity] = useState({
        title: "",
        description: "",
        date: "",
        imageUrl: "", // 👈 Ajout du champ image
    });

    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false); // Ajouter un état de chargement

    useEffect(() => {
        
        if (user?.role !== "ADMIN") {
            router.push("/dashboard");
        }
    }, [user?.role, router]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Lancement du loader avant la récupération des activités
            try {
                const data = await getAllActivities();
                setActivities(data);
            } catch (error) {
                Swal.fire({
                    title: "Erreur",
                    text: "Impossible de récupérer les activités.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            } finally {
                setLoading(false); // Arrêt du loader après la récupération
            }
        };
        fetchData();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setNewActivity({ ...newActivity, [e.target.name]: e.target.value });
    };

    const handleCreate = async () => {
        if (!newActivity.title || !newActivity.date) return;
        setLoading(true);
        try {
            await createActivity(newActivity);
            const updated = await getAllActivities();
            setActivities(updated);
            setNewActivity({ title: "", description: "", date: "", imageUrl:"" });
            Swal.fire({
                title: "Succès",
                text: "L'activité a été ajoutée.",
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (error) {
            Swal.fire({
                title: "Erreur",
                text: "Impossible d'ajouter l'activité.",
                icon: "error",
                confirmButtonText: "OK",
            });
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

            Swal.fire({
                title: "Succès",
                text: "L'activité a été mise à jour.",
                icon: "success",
                confirmButtonText: "OK",
                customClass: {
                    confirmButton: 'swal-button-ok'
                },
            });
        } catch (error) {
            Swal.fire({
                title: "Erreur",
                text: "Impossible de mettre à jour l'activité.",
                icon: "error",
                confirmButtonText: "OK",
                
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            await deleteActivity(id);
            const updated = await getAllActivities();
            setActivities(updated);
            Swal.fire({
                title: "Succès",
                text: "L'activité a été supprimée.",
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (error) {
            Swal.fire({
                title: "Erreur",
                text: "Impossible de supprimer l'activité.",
                icon: "error",
                confirmButtonText: "OK",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 max-w-3xl mx-auto" dir="ltr">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-left text-gray-800">
                Gestion des activités
            </h1>

            {/* Formulaire */}
            <Card className="mb-6 bg-white shadow-md rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-left text-lg sm:text-xl text-purple-700">
                        {editingId ? "Modifier une activité" : "Ajouter une nouvelle activité"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        name="title"
                        placeholder="Titre"
                        value={newActivity.title}
                        onChange={handleChange}
                    />
                    <Textarea
                        name="description"
                        placeholder="Description"
                        value={newActivity.description}
                        onChange={handleChange}
                    />
                    <Input
                        name="date"
                        type="date"
                        value={newActivity.date}
                        onChange={handleChange}
                    />

                    {/* Composant Uploader pour image */}
                    <Uploader
                        onUpload={(url) => setNewActivity({ ...newActivity, imageUrl: url })}
                    />

                    {editingId ? (
                        <Button
                            onClick={() => handleUpdate(editingId)}
                            className="w-full bg-green-600 hover:bg-green-700"
                            disabled={loading}
                        >
                            {loading ? "Chargement..." : "Mettre à jour"}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleCreate}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? "Chargement..." : "Ajouter"}
                        </Button>
                    )}
                </CardContent>

            </Card>

            {/* Liste des activités */}
            <div className="space-y-4">
                {loading ? (
                    <p className="text-center text-gray-500">Chargement des activités...</p>
                ) : activities.length === 0 ? (
                    <p className="text-center text-gray-500">Aucune activité pour le moment.</p>
                ) : (
                    activities.map((activity) => (
                        <Card key={activity.id} className="shadow-sm border rounded-xl">
                            {activity.imageUrl && (
                                <Image
                                    src={activity.imageUrl}
                                    alt="Illustration de l'activité"
                                    className="w-full h-40 object-cover rounded-md border mb-4" // Ajuste la hauteur
                                    width={600} // Largeur maximale
                                    height={240} // Hauteur définie
                                    layout="responsive" // Responsive pour une meilleure gestion de la taille
                                />
                            )}

                            <CardHeader>
                                <CardTitle className="text-left text-purple-800 font-semibold">
                                    {activity.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-left space-y-2 text-sm sm:text-base">
                                <p className="text-gray-700">{activity.description}</p>
                                <p className="text-sm text-gray-600">
                                    📅 Date :{" "}
                                    {new Date(activity.date).toLocaleDateString("fr-FR", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                                <div className="flex gap-2 justify-start mt-3">
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-1"
                                        onClick={() => {
                                            setEditingId(activity.id);
                                            setNewActivity({
                                                title: activity.title,
                                                description: activity.description,
                                                date: new Date(activity.date).toISOString().split("T")[0],
                                                imageUrl: activity.imageUrl ?? "", // 👈 ajoute une valeur par défaut si undefined
                                            });

                                        }}
                                    >
                                        <Pencil className="w-4 h-4" />
                                        Modifier
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="flex items-center gap-1"
                                        onClick={() => handleDelete(activity.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Supprimer
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
