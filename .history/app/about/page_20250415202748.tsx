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
    <section className="w-full min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 text-white px-6 sm:px-12 md:px-16 py-16 flex flex-col items-center text-center relative overflow-hidden">
      {/* Effet de fond décoratif */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-lime-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Image centrée avec ombre portée */}
      <motion.div
        className="relative w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 mb-12 z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src="/uda.jpg"
          alt="USA Logo"
          fill
          priority
          className="object-contain w-full h-full drop-shadow-2xl"
        />
      </motion.div>

      {/* Titre principal */}
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Union des Sortants d'Algérie
      </motion.h1>

      {/* Introduction */}
      <motion.p
        className="mt-4 text-lg sm:text-xl md:text-2xl max-w-3xl text-emerald-100 leading-relaxed z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Rôle des sortants mauritaniens dans le développement socio-économique, opportunités de coopération, et mise en réseau.
      </motion.p>

      {/* À propos de l'Union */}
      <motion.div
        className="mt-12 max-w-4xl bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-emerald-50">À propos de l'Union</h2>
        <div className="space-y-4 text-emerald-100 text-base sm:text-lg md:text-xl leading-relaxed">
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

      {/* Bouton avec effet de survol amélioré */}
      <motion.a
        href="/login"
        className="mt-12 inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-emerald-400 hover:to-teal-400 z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <span className="relative z-10">Se connecter</span>
        <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
      </motion.a>
    </section>
  );
}