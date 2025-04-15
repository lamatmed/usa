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
    <section className="relative w-full min-h-screen bg-gradient-to-tr from-green-700 via-emerald-500 to-lime-400 text-white px-6 sm:px-10 py-16 flex flex-col items-center text-center overflow-hidden">
      {/* Effet de fond animé */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none animate-pulse" />

      {/* Halo derrière l’image */}
      <motion.div
        className="absolute w-[400px] h-[400px] bg-emerald-300/20 rounded-full blur-3xl z-0"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1.2 }}
        transition={{ duration: 1.2 }}
      />

      {/* Logo animé */}
      <motion.div
        className="relative z-10 w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 mb-10 rounded-full overflow-hidden shadow-2xl border-4 border-white/30"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src="/uda.jpg"
          alt="USA Logo"
          fill
          priority
          className="object-contain p-3"
        />
      </motion.div>

      {/* Titre principal */}
      <motion.h1
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow-xl tracking-wide"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Union des Sortants d'Algérie
      </motion.h1>

      {/* Intro */}
      <motion.p
        className="mt-6 text-lg sm:text-xl md:text-2xl max-w-2xl text-white/90 drop-shadow-sm leading-relaxed z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Rôle des sortants mauritaniens dans le développement socio-économique, opportunités de coopération, et mise en réseau.
      </motion.p>

      {/* À propos */}
      <motion.div
        className="mt-12 max-w-3xl bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-5 text-white">
          À propos de l'Union
        </h2>
        <div className="space-y-4 text-blue-700 text-base sm:text-lg md:text-xl leading-relaxed">
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

      {/* Bouton moderne */}
      <motion.a
        href="/login"
        className="mt-10 px-10 py-3 bg-white text-green-700 font-semibold rounded-full shadow-md hover:bg-white/90 transition-all duration-300 transform hover:scale-105 relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Se connecter
      </motion.a>
    </section>
  );
}
