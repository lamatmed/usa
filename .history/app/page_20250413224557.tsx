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

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center text-center overflow-hidden bg-black from-green-600 via-emerald-500 to-lime-400">
      {/* Image plein écran sans être coupée */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/uda.jpg"
          alt="Uda"
          fill
          priority
          className="object-contain w-full h-full"
        />
        {/* Overlay sombre facultatif (peut être supprimé si tu veux voir la photo en détail) */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Contenu par-dessus l'image */}
      <div className="relative z-10 px-4 md:px-10 text-white max-w-3xl">
        <motion.h1
          className="text-3xl md:text-5xl lg:text-6xl font-extrabold drop-shadow-xl"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Union des Sortants d&apos;Algérie
        </motion.h1>

        <motion.p
          className="mt-4 text-lg md:text-xl lg:text-2xl text-white/90"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Rôle des diplômés dans le développement socio-économique, opportunités de coopération bilatérale et plus encore.
        </motion.p>

        <motion.a
          href="/login"
          className="mt-8 inline-block px-8 py-3 bg-white text-emerald-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          aria-label="Se connecter pour accéder à l'espace personnel"
        >
          Se connecter
        </motion.a>
      </div>
    </section>
  );
}
