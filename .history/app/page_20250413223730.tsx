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
    }, 1000); // plus rapide pour l'expérience

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="w-full min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-br from-green-600 via-emerald-500 to-lime-400 text-white px-6 md:px-12 dark:bg-black">
      <motion.div
        className="relative w-32 h-32 md:w-44 md:h-44 lg:w-52 lg:h-52 xl:w-64 xl:h-64 mb-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src="/uda.jpg"
          alt="Uda"
          width={256}
          height={256}
          className="rounded-full object-cover shadow-xl border-4 border-white dark:border-gray-800"
        />
      </motion.div>

      <motion.h1
        className="text-3xl md:text-5xl lg:text-6xl font-extrabold drop-shadow-lg"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Union des Sortants d&apos;Algérie
      </motion.h1>

      <motion.p
        className="mt-4 text-lg md:text-xl lg:text-2xl max-w-3xl text-white/90 dark:text-white/80"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Rôle des diplômés dans le développement socio-économique, opportunités de coopération bilatérale et plus encore.
      </motion.p>

      <motion.a
        href="/login"
        className="mt-8 px-8 py-3 bg-white text-emerald-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        aria-label="Se connecter pour accéder à l'espace personnel"
      >
        Se connecter
      </motion.a>
    </section>
  );
}
