'use client';

import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

const Contact = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-600 via-emerald-500 to-lime-400 px-4 py-8"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <motion.
      <Card className="w-full max-w-xl bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl border border-white/30">
        <CardContent className="p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 text-center drop-shadow-sm">
            Contactez-nous
          </h1>
          <p className="text-gray-600 text-center mb-8 text-base sm:text-lg leading-relaxed">
            Pour toute question ou assistance, n&apos;hésitez pas à nous contacter :
          </p>

          <div className="space-y-5">
            {/* Contact Item */}
            <div className="flex items-center gap-4 bg-white shadow-md hover:shadow-xl transition-shadow duration-300 px-5 py-4 rounded-xl group">
              <Phone className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" />
              <span className="text-gray-800 text-base sm:text-lg font-medium tracking-wide">
                +222 30572816
              </span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 bg-white shadow-md hover:shadow-xl transition-shadow duration-300 px-5 py-4 rounded-xl group">
              <Mail className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" />
              <span className="text-gray-800 text-base sm:text-lg font-medium tracking-wide">
                lamat032025@gmail.com
              </span>
            </div>

            {/* Adresse */}
            <div className="flex items-center gap-4 bg-white shadow-md hover:shadow-xl transition-shadow duration-300 px-5 py-4 rounded-xl group">
              <MapPin className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" />
              <span className="text-gray-800 text-base sm:text-lg font-medium tracking-wide">
               Nouakchout, Mauritanie
              </span>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Nous vous répondrons dans les plus brefs délais</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Contact;
