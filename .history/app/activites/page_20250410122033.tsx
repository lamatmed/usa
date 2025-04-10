'use client';

import { motion } from "framer-motion";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function ActivitiesPage() {
  const activities = [
    {
      id: 1,
      title: "Séminaire sur le développement socio-économique",
      description: "Un séminaire visant à promouvoir le rôle des diplômés dans le développement économique.",
      date: "2025-05-10",
    },
    {
      id: 2,
      title: "Forum des Opportunités de Coopération Bilatérale",
      description: "Rencontres entre les diplômés et les entreprises algériennes et étrangères.",
      date: "2025-06-20",
    },
    {
      id: 3,
      title: "Webinaire sur l'innovation et la technologie",
      description: "Un webinaire pour discuter des nouvelles technologies et de leur impact sur le développement.",
      date: "2025-07-15",
    },
  ];

  return (
    <section className="w-full min-h-screen bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-8 md:px-10 py-12">
      <motion.h1
        className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-center mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Activités de l'Union des Sortants d&apos;Algérie
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Découvrez les prochaines activités organisées par l&lsquo;Union, incluant des séminaires, forums et webinaires sur des sujets clés.
      </motion.p>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {activities.map((activity) => (
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
              <div className="flex items-center space-x-2 text-gray-500">
                <FaRegCalendarAlt className="w-5 h-5" />
                <span>{activity.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
