"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Utilisation de useParams
import { getActivityById } from "@/utils/actions"; // Fonction pour récupérer l'activité par ID
import Loader from "@/components/Loader";
import Image from "next/image";
import { FaRegCalendarAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const ActivityPage = () => {
    const [activity, setActivity] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams(); // Utilisation de useParams pour obtenir l'ID depuis l'URL

    useEffect(() => {
        if (id) {
            const fetchActivity = async () => {
                try {
                    const fetchedActivity = await getActivityById(id as string); // Assurez-vous que l'ID est un string
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
            <div className="text-center text-xl text-red-600">
                L'activité n&apos;a pas été trouvée.
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
        <section className="w-full min-h-screen bg-gradient-to-r from-green-600 via-emerald-500 to-lime-400 text-white px-6 py-12" dir="ltr">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-6">
                {activity.title}
            </h1>

            <div className="max-w-6xl mx-auto mb-8">
                {activity.imageUrl && (
                    <Image
                        src={activity.imageUrl}
                        alt={activity.title}
                        className="w-full h-80 object-cover rounded-md mb-4"
                        width={600}
                        height={240}
                        layout="responsive"
                    />
                )}
                <p className="text-xl text-gray-300 mb-6">{activity.description}</p>

                <div className="flex items-center space-x-2 text-gray-500 rtl:space-x-reverse">
                    <FaRegCalendarAlt className="w-5 h-5" />
                    <span>{formattedDate}</span>
                </div>

                {/* Autres informations ou actions supplémentaires */}
                <div className="mt-8">
                    <Buttonutton
                        onClick={() => window.history.back()} // Retour à la page précédente
                        className="py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                        Retour aux activités
                    </Buttonutton>
                </div>
            </div>
        </section>
    );
};

export default ActivityPage;
