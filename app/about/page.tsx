"use client";

import { motion } from "framer-motion";

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">À propos de RIM TECHNOLOGIE</h1>
      <p className="text-gray-700 leading-relaxed text-center">
        RIM TECHNOLOGIE est une entreprise spécialisée dans la gestion de stock et la vente de produits à travers une plateforme moderne et intuitive.
      </p>
      <p className="text-gray-700 leading-relaxed mt-4 text-center">
        Notre objectif est de faciliter la gestion des stocks en proposant des solutions performantes et adaptées aux besoins des commerçants et des entreprises.
      </p>
    </motion.div>
  );
};

export default About;
