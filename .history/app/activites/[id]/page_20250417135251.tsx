"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getActivityById } from "@/utils/actions";
import Loader from "@/components/Loader";
import Image from "next/image";
import { FaArrowLeft, FaCalendarAlt, FaShareAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const ActivityPage = () => {
    const [activity, setActivity] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        if (id) {
            const fetchActivity = async () => {
                try {
                    const fetchedActivity = await getActivityById(id as string);
                    setActivity(fetchedActivity);
                } catch (error) {
                    console.error("Erreur lors de la récupération de l'activité :", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchActivity();
        }
    }, [id]);

    if (loading) return <Loader />;

    if (!activity) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <p className="text-xl mb-4 text-gray-800">L&apos;activité n&apos;a pas été trouvée</p>
                    <Button
                        onClick={() => router.push('/activites')}
                        className="gap-2"
                    >
                        <FaArrowLeft /> Retour aux activités
                    </Button>
                </div>
            </div>
        );
    }

    const formattedDate = new Date(activity.date).toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: activity.title,
                text: activity.description,
                url: window.location.href,
            }).catch(console.error);
        } else {
            // Fallback pour les navigateurs qui ne supportent pas l'API Share
            navigator.clipboard.writeText(window.location.href);
            alert("Lien copié dans le presse-papiers !");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-white"
        >
            {/* En-tête avec bouton de retour */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 shadow-sm">
                <Button
                    onClick={() => router.back()}
                    variant="ghost"
                    className="gap-2"
                >
                    <FaArrowLeft /> Retour
                </Button>
            </div>

            {/* Contenu principal */}
            <div className="max-w-4xl mx-auto p-4 pb-20">
                {/* Image principale */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative w-full h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden mb-6 shadow-lg"
                >
                    <Image
                        src={activity.imageUrl}
                        alt={activity.title}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                    />
                </motion.div>

                {/* Titre et date */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {activity.title}
                    </h1>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-gray-600">
                            <FaCalendarAlt className="text-green-600" />
                            <span>{formattedDate}</span>
                        </div>

                        <Button
                            onClick={handleShare}
                            size="sm"
                            variant="outline"
                            className="gap-2"
                        >
                            <FaShareAlt /> Partager
                        </Button>
                    </div>
                </motion.div>

                {/* Description */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="prose max-w-none text-gray-700"
                >
                    {activity.description.split('\n').map((paragraph: string, index: number) => (
                        <p key={index} className="mb-4 last:mb-0">
                            {paragraph}
                        </p>
                    ))}
                </motion.div>

                {/* Bouton d'action en bas */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="fixed bottom-4 left-0 right-0 flex justify-center"
                >
                    <Button
                        onClick={() => router.push('/activites')}
                        className="shadow-lg px-8 py-4 text-lg"
                    >
                        Voir toutes nos activités
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ActivityPage;