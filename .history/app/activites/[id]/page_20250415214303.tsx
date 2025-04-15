"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getActivityById } from "@/utils/actions";
import Loader from "@/components/Loader";
import Image from "next/image";
import { FaRegCalendarAlt, FaArrowLeft } from "react-icons/fa";
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
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-600 via-emerald-500 to-lime-400">
                <div className="text-center text-xl text-white bg-white/10 p-8 rounded-xl backdrop-blur-sm">
                    L'activité n'a pas été trouvée.
                    <Button
                        onClick={() => router.push('/activities')}
                        className="mt-4 flex items-center gap-2"
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

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full min-h-screen bg-gradient-to-r from-green-600 via-emerald-500 to-lime-400 text-white px-4 sm:px-6 py-12"
        >
            <div className="max-w-6xl mx-auto">
                {/* Bouton de retour */}
                <Button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                >
                    <FaArrowLeft /> Retour
                </Button>

                {/* Titre */}
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 drop-shadow-md"
                >
                    {activity.title}
                </motion.h1>

                {/* Image */}
                {activity.imageUrl && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative w-full h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden shadow-xl mb-8"
                    >
                        <Image
                            src={activity.imageUrl}
                            alt={activity.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                )}

                {/* Date */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-center gap-2 text-lg mb-8 bg-white/10 p-3 rounded-full w-fit mx-auto px-6 backdrop-blur-sm"
                >
                    <FaRegCalendarAlt className="text-emerald-200" />
                    <span className="font-medium">{formattedDate}</span>
                </motion.div>

                {/* Description */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="prose prose-invert max-w-3xl mx-auto text-lg leading-relaxed mb-12"
                >
                    {activity.description.split('\n').map((paragraph: string, index: number) => (
                        <p key={index} className="mb-4 last:mb-0">
                            {paragraph}
                        </p>
                    ))}
                </motion.div>

                {/* Bouton d'action */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex justify-center"
                >
                    <Button
                        onClick={() => router.push('/activities')}
                        className="bg-white text-emerald-600 hover:bg-white/90 hover:text-emerald-700 px-8 py-6 text-lg font-semibold rounded-full shadow-lg transition-all"
                    >
                        Voir toutes nos activités
                    </Button>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default ActivityPage;