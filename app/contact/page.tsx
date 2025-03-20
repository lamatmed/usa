"use client";

import { motion } from "framer-motion";

const Contact = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Contactez-nous</h1>
      <p className="text-gray-700 leading-relaxed text-center">
        Pour toute question ou assistance:
      </p>

      <div className="mt-6 text-center">
        <p className="text-lg font-semibold">📞 Téléphone : <span className="text-blue-600">+244939465408</span></p>
        <p className="text-lg font-semibold">📧 Email : <span className="text-blue-600">lamat032025@gmail.com</span></p>
        <p className="text-lg font-semibold">📍 Adresse : <span className="text-blue-600">123 Rue espoir Mauritanie</span></p>
      </div>
    </motion.div>
  );
};

export default Contact;
