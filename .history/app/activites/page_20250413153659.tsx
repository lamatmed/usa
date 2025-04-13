'use client';

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaRegCalendarAlt } from "react-icons/fa";
import { getAllActivities } from "@/utils/actions";
import Loader from "@/components/Loader";

const ActivitiesPage = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const fetchedActivities = await getAllActivities();
        setActivities(fetchedActivities);
      } catch (error) {
        console.error("Erreur lors de la récupération des activités:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) return <Loader />;

  return (
    <section
      className="w-full min-h-screen bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 md:px-10 py-12"
      dir="rtl"
    >
      <motion.h1
        className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-center mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Activités de l&lsquo;Union des Sortants d&apos;Algérie
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Découvrez les prochaines activités organisées par l&lsquo;Union, incluant des séminaires, forums et webinaires sur des sujets clés.
      </motion.p>

      {activities.length === 0 ? (
        <p className="text-center text-xl text-gray-300">Il n&lsquo;y a actuellement aucune activité.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => {
            const formattedDate = new Date(activity.date).toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            return (
              <motion.div
                key={activity.id}
                className="bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">{activity.title}</h3>
                  <p className="text-gray-600 mb-4">{activity.description}</p>
                  <div className="flex items-center space-x-2 text-gray-500 rtl:space-x-reverse">
                    <FaRegCalendarAlt className="w-5 h-5" />
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ActivitiesPage;
