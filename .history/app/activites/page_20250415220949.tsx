"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FaRegCalendarAlt, FaSearch, FaSort } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getAllActivities } from "@/utils/actions";
import Loader from "@/components/Loader";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 6;

const ActivitiesPage = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <Loader />;

  return (
    <section className="w-full min-h-screen bg-gradient-to-r from-green-600 via-emerald-500 to-lime-400 text-white px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* En-tête */}
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Activités de l'Union des Diplômés d'Algérie
          </h1>
          <p className="text-lg text-white/90 max-w-3xl mx-auto">
            Découvrez nos dernières activités et événements
          </p>
        </motion.div>

        {/* Barre de recherche et filtre */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-10 bg-white/10 backdrop-blur-sm p-4 rounded-xl"
        >
          <div className="relative w-full sm:w-1/2">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une activité..."
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-800"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="relative w-full sm:w-1/4">
            <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-800 appearance-none"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Les plus récentes</option>
              <option value="asc">Les plus anciennes</option>
            </select>
          </div>
        </motion.div>

        {/* Liste des activités */}
        {paginatedActivities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center bg-white/10 p-8 rounded-xl backdrop-blur-sm"
          >
            <p className="text-xl">Aucune activité trouvée</p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="mt-4"
            >
              Réinitialiser la recherche
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {paginatedActivities.map((activity) => {
              const formattedDate = new Date(activity.date).toLocaleDateString(
                "fr-FR",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              );

              return (
                <motion.div
                  key={activity.id}
                  whileHover={{ y: -5 }}
                  className="bg-white text-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col h-full"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={activity.imageUrl}
                      alt={activity.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6 flex-grow">
                    <h3 className="text-xl font-bold mb-3 text-green-600">
                      {activity.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 text-gray-500">
                      <FaRegCalendarAlt />
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <Button
                      onClick={() => router.push(`/activites/${activity.id}`)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Voir les détails
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-2 mt-12"
          >
            <Button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              variant="outline"
              className="min-w-[40px]"
            >
              «
            </Button>
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
            >
              Précédent
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  className="min-w-[40px]"
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Suivant
            </Button>
            <Button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              variant="outline"
              className="min-w-[40px]"
            >
              »
            </Button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default ActivitiesPage;