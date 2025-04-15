"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getActivityById } from "@/utils/actions";
import Loader from "@/components/Loader";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";

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
                <div className="text-center p-8">
                    <p className="text-xl mb-4">L&apos;activité n&apos;a pas été trouvée</p>
                    <Button onClick={() => router.push('/activities')}>
                        <FaArrowLeft className="mr-2" /> Retour aux activités
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Contenu principal */}
            <div className="flex-grow max-w-7xl mx-auto p-4 w-full">
                {/* Image responsive */}
                <div className="w-full mb-6 flex justify-center">
                    <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
                        <Image
                            src={activity.imageUrl}
                            alt={activity.title}
                            width={1200}
                            height={800}
                            className="w-full h-auto object-contain rounded-lg shadow-lg"
                            priority
                        />
                    </div>
                </div>

                {/* Titre et description */}
                <div className="px-4 max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold mb-4">{activity.title}</h1>
                    <div className="prose max-w-none">
                        {activity.description.split('\n').map((paragraph: string, index: number) => (
                            <p key={index} className="mb-4 last:mb-0">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bouton de retour en bas */}
            <div className="sticky bottom-4 left-0 right-0 flex justify-center p-4 z-10">
                <Button
                    onClick={() => router.back()}
                    className="bg-white/90 shadow-lg border text-black border-gray-200 hover:bg-gray-500 px-6 py-3"
                >
                    <FaArrowLeft className="mr-2 text-green-500" /> Retour
                </Button>
            </div>
        </div>
    );
};

export default ActivityPage;