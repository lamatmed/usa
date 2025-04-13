"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Contact = () => {
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex justify-center items-center min-h-screen bg-gray-100 px-4"
    >
      <Card className="w-full max-w-2xl shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Contactez-nous</h1>
          <p className="text-gray-600 text-center mb-6">
            Pour toute question ou assistance, contactez-nous :
          </p>

          <div className="space-y-4 text-center">
            <p className="flex items-center justify-center text-lg font-medium text-gray-800">
              <Phone className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-600">+244 939 465 408</span>
            </p>
            <p className="flex items-center justify-center text-lg font-medium text-gray-800">
              <Mail className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-600">lamat032025@gmail.com</span>
            </p>
            <p className="flex items-center justify-center text-lg font-medium text-gray-800">
              <MapPin className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-600">123 Rue de l&apos;Espoir, Mauritanie</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Contact;
