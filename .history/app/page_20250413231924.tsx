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
    <section className="relative w-full min-h-screen bg-gradient-to-r from-green-600 via-emerald-500 to-lime-400 text-white px-6 sm:px-8 md:px-10 py-12 flex flex-col items-center text-center">

      {/* Image de fond qui couvre toute la page */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/uda.jpg"
          alt="Uda"
          fill
          priority
          className="object-cover w-full h-full opacity-70"  // Assure-toi que l'image couvre tout l'écran et avec un peu de transparence
        />
      </div>

      {/* Contenu au-dessus de l'image */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white max-w-3xl w-full px-4 md:px-10 py-12">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold drop-shadow-lg"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Union des Sortants d&apos;Algérie
        </motion.h1>

        <motion.p
          className="mt-4 text-lg sm:text-xl md:text-2xl max-w-2xl text-white/90"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Rôle des diplômés dans le développement socio-économique, opportunités de coopération bilatérale, etc.
        </motion.p>

        <motion.a
          href="/login"
          className="mt-8 inline-block px-8 py-3 bg-white text-emerald-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Se connecter
        </motion.a>
      </div>
    </section>
  );
}
