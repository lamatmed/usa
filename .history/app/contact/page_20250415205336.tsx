"use client";

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

  if (loading) {
    return <Loader />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 px-4 py-8"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Card className="w-full max-w-2xl bg-white shadow-lg rounded-xl overflow-hidden border-0">
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
              Contactez-nous
            </h1>
          </div>

          <CardContent className="p-6 sm:p-8">
            <p className="text-gray-600 text-center mb-8 text-base sm:text-lg">
              Pour toute question ou assistance, n'hésitez pas à nous contacter :
            </p>

            <div className="space-y-6">
              {/* Contact Item - Téléphone */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-5 bg-gray-50 hover:bg-green-50 px-5 py-4 rounded-lg transition-all duration-300 border border-gray-100"
              >
                <div className="bg-green-100 p-3 rounded-full">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
                  <p className="text-gray-800 text-lg font-medium">
                    +222 30572816
                  </p>
                </div>
              </motion.div>

              {/* Contact Item - Email */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-5 bg-gray-50 hover:bg-green-50 px-5 py-4 rounded-lg transition-all duration-300 border border-gray-100"
              >
                <div className="bg-green-100 p-3 rounded-full">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="text-gray-800 text-lg font-medium">
                    lamat032025@gmail.com
                  </p>
                </div>
              </motion.div>

              {/* Contact Item - Adresse */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-5 bg-gray-50 hover:bg-green-50 px-5 py-4 rounded-lg transition-all duration-300 border border-gray-100"
              >
                <div className="bg-green-100 p-3 rounded-full">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
                  <p className="text-gray-800 text-lg font-medium">
                    123 Rue de l'Espoir, Mauritanie
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="mt-8 text-center text-gray-500 text-sm">
              <p>Nous vous répondrons dans les plus brefs délais</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Contact;