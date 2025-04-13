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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-8"
    >
      <Card className="w-full max-w-xl bg-white shadow-xl rounded-2xl border border-gray-200">
        <CardContent className="p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Contactez-nous
          </h1>
          <p className="text-gray-600 text-center mb-6 text-base sm:text-lg">
            Pour toute question ou assistance, n'hésitez pas à nous joindre :
          </p>

          <div className="space-y-5 text-center">
            <div className="flex items-center justify-center gap-3 text-gray-800 text-lg font-medium">
              <Phone className="w-5 h-5 text-indigo-500" />
              <span className="text-indigo-600">+244 939 465 408</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-gray-800 text-lg font-medium">
              <Mail className="w-5 h-5 text-indigo-500" />
              <span className="text-indigo-600">lamat032025@gmail.com</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-gray-800 text-lg font-medium text-center">
              <MapPin className="w-5 h-5 text-indigo-500" />
              <span className="text-indigo-600">
                123 Rue de l&apos;Espoir, Mauritanie
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Contact;
