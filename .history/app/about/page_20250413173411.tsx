"use client";

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

const About = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex justify-center items-center min-h-screen bg-gray-100 px-4"
    >
      <Card className="w-full max-w-xl bg-neutral-900 text-white shadow-xl rounded-2xl border border-neutral-800">
        <CardContent className="p-6 sm:p-8 text-center">
          <div className="flex justify-center mb-5">
            <Building2 className="w-14 h-14 text-indigo-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-4">
            À propos de <span className="text-indigo-400">RIM TECHNOLOGIE</span>
          </h1>
          <p className="text-neutral-300 leading-relaxed text-base sm:text-lg">
            RIM TECHNOLOGIE est une entreprise spécialisée dans la gestion de stock et la vente de
            produits à travers une plateforme moderne et intuitive.
          </p>
          <p className="text-neutral-300 leading-relaxed mt-4 text-base sm:text-lg">
            Notre objectif est de faciliter la gestion des stocks en proposant des solutions
            performantes et adaptées aux besoins des commerçants et des entreprises.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default About;
