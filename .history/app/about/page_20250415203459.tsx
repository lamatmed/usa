'use client';

import Loader from "@/components/Loader";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Hero() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) return <Loader />;

  return (
    <section className="w-full min-h-screen bg-gradient-to-r from-green-600 via-emerald-500 to-lime-400 text-white px-6 sm:px-8 md:px-10 py-12 flex flex-col items-center text-center relative overflow-hidden">
      {/* Effet de lumière subtil */}
      <div className="absolute inset-0 bg-white/5 pointer-events-none"></div>

      {/* Image avec bordure et ombre */}
      <motion.div
        className="relative w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 mb-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-white/30 shadow-2xl"></div>
        <Image
          src="/uda.jpg"
          alt="USA Logo"
          fill
          priority
          className="object-contain w-full h-full p-2"
        />
      </motion.div>

      {/* Titre principal ajouté */}
      <motion.h1
        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Union des Sortants d'Algérie
      </motion.h1>

      {/* Introduction avec ombre de texte */}
      <motion.p
        className="mt-4 text-lg sm:text-xl md:text-2xl max-w-2xl text-white/90 drop-shadow-sm leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Rôle des sortants mauritaniens dans le développement socio-économique, opportunités de coopération, et mise en réseau.
      </motion.p>

      {/* À propos de l'Union - version sobre */}
      <motion.div
        className="mt-10 max-w-3xl bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">À propos de l'Union</h2>
        <div className="space-y-4 text-white/90 text-base sm:text-lg md:text-xl leading-relaxed">
          <p>
            L'Union des Sortants d'Algérie (USA) est une organisation regroupant les diplômés mauritaniens ayant poursuivi leurs études supérieures en Algérie.
          </p>
          <p>
            Elle a pour mission de renforcer les liens d'amitié et de solidarité entre les anciens étudiants, de valoriser les parcours, et de contribuer activement au développement de la Mauritanie à travers l'expertise acquise en Algérie.
          </p>
          <p>
            L'union vise également à favoriser la coopération entre les deux pays, encourager les initiatives collectives et offrir un cadre d'échange et d'entraide entre professionnels mauritaniens formés en Algérie.
          </p>
        </div>
      </motion.div>

      {/* Bouton avec effet moderne mais discret */}
      <motion.a
        href="/login"
        className="mt-10 inline-block px-8 py-3 bg-white text-green-600 font-semibold rounded-full shadow-lg hover:bg-white/90 transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <span className="relative z-10">Se connecter</span>
        <span className="absolute inset-0 bg-white/20 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
      </motion.a>
    </section>
  );
}