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
    <section className="w-full min-h-screen bg-gradient-to-r from-green-600 via-emerald-500 to-lime-400 text-white px-6 sm:px-8 md:px-10 py-12 flex flex-col items-center text-center">

      {/* Image centrée */}
      <motion.div
        className="relative w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src="/uda.jpg"
          alt="USA Logo"
          fill
          priority
          className="object-contain w-full h-full"
        />
      </motion.div>

      {/* Introduction */}
      <motion.p
        className="mt-6 text-lg sm:text-xl md:text-2xl max-w-2xl text-white/90 drop-shadow-sm leading-relaxed z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Rôle des sortants mauritaniens dans le développement socio-économique, opportunités de coopération, et mise en réseau.
      </motion.p>

      {/* À propos de l'Union */}
      <motion.div
        className="mt-12 max-w-3xl bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">À propos de l&apos;Union</h2>
        <p className="mb-4">
          L&apos;Union des Sortants d&apos;Algérie (USA) est une organisation regroupant les diplômés mauritaniens ayant poursuivi leurs études supérieures en Algérie.
        </p>
        <p className="mb-4">
          Elle a pour mission de renforcer les liens d&apos;amitié et de solidarité entre les anciens étudiants, de valoriser les parcours, et de contribuer activement au développement de la Mauritanie à travers l&apos;expertise acquise en Algérie.
        </p>
        <p>
          L&apos;union vise également à favoriser la coopération entre les deux pays, encourager les initiatives collectives et offrir un cadre d&apos;échange et d&apos;entraide entre professionnels mauritaniens formés en Algérie.
        </p>
      </motion.div>

      {/* Bouton */}
      <motion.a
        href="/login"
        className="mt-8 inline-block px-8 py-3 bg-white text-emerald-600 font-semibold rounded-full shadow-lg hover:text-emerald-6 transition-transform transform hover:scale-105"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Se connecter
      </motion.a>
    </section>
  );
}
