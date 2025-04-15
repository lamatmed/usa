"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getAllActivities } from "@/utils/actions";
import Loader from "@/components/Loader";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 6;

const ActivitiesPage = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' ou 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const fetchedActivities = await getAllActivities();
        setActivities(fetchedActivities);
      } catch (error) {
        console.error("Erreur lors de la récupération des activités :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const filteredActivities = useMemo(() => {
    return activities
      .filter((activity) =>
        `${activity.title} ${activity.description}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [activities, searchTerm, sortOrder]);

  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading) return <Loader />;

  return (
    <section className="w-full min-h-screen bg-gradient-to-r from-green-600 via-emerald-500 to-lime-400 text-white px-6 py-12" dir="ltr">
      <motion.h1
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Activités de l’Union des Diplômés d’Algérie
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 max-w-6xl mx-auto">
        <input
          type="text"
          placeholder="Rechercher une activité..."
          className="w-full md:w-1/2 p-3 rounded-lg text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="w-full md:w-1/4 p-3 rounded-lg text-black"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="desc">Les plus récentes</option>
          <option value="asc">Les plus anciennes</option>
        </select>
      </div>

      {paginatedActivities.length === 0 ? (
        <p className="text-center text-xl text-gray-300">
          Aucune activité trouvée.
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {paginatedActivities.map((activity) => {
            const formattedDate = new Date(activity.date).toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            return (
              <motion.div
                key={activity.id}
                className="bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="p-6 flex-grow">
                  {activity.imageUrl && (
                    <Image
                      src={activity.imageUrl}
                      alt={activity.title}
                      className="w-full h-40 object-cover rounded-md mb-4"
                      width={600}
                      height={240}
                      layout="responsive"
                    />
                  )}
                  <h3 className="text-xl font-semibold mb-4 text-purple-700">{activity.title}</h3>
                  <p className="text-gray-600 mb-4">{activity.description}</p>
                  <div className="flex items-center space-x-2 text-gray-500 rtl:space-x-reverse">
                    <FaRegCalendarAlt className="w-5 h-5" />
                    <span>{formattedDate}</span>
                  </div>
                </div>
                <div className="p-4">
                  <Button
                    onClick={() => router.push(`/activites/${activity.id}`)}
                    className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                  >
                    Voir plus
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 space-x-4 rtl:space-x-reverse">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
          >
            Précédent
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Butt
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-2 rounded ${currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-800"
                }`}
            >
              {i + 1}
            </Butt>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </section>
  );
};

export default ActivitiesPage;
