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
      
      <Card className="w-full mx-4 sm:max-w-xl bg-white/90 backdrop-blur-sm shadow-lg sm:shadow-2xl rounded-2xl sm:rounded-3xl border border-white/20">
        <CardContent className="p-5 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-3 sm:mb-4 text-center">
            Contactez-nous
          </h1>
          <p className="text-gray-600 text-center mb-6 text-sm sm:text-base leading-relaxed">
            Pour toute question ou assistance, n'hésitez pas à nous contacter :
          </p>

          <div className="space-y-3 sm:space-y-4">
            {/* Téléphone */}
            <div className="flex items-center gap-3 bg-white/95 shadow-sm hover:shadow-md transition-shadow duration-200 px-4 py-3 sm:px-5 sm:py-4 rounded-lg group">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 group-hover:scale-110 transition-transform" />
              <span className="text-gray-800 text-sm sm:text-base font-medium">
                +222 30572816
              </span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 bg-white/95 shadow-sm hover:shadow-md transition-shadow duration-200 px-4 py-3 sm:px-5 sm:py-4 rounded-lg group">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 group-hover:scale-110 transition-transform" />
              <span className="text-gray-800 text-sm sm:text-base font-medium">
                lamat032025@gmail.com
              </span>
            </div>

            {/* Adresse */}
            <div className="flex items-center gap-3 bg-white/95 shadow-sm hover:shadow-md transition-shadow duration-200 px-4 py-3 sm:px-5 sm:py-4 rounded-lg group">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 group-hover:scale-110 transition-transform" />
              <span className="text-gray-800 text-sm sm:text-base font-medium">
                Nouakchott, Mauritanie
              </span>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 text-center text-blue-700 text-xs sm:text-sm">
            <p>Nous vous répondrons dans les plus brefs délais</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Contact;
