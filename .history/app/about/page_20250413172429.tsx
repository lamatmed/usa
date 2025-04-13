"use client";

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
    const [loading, setLoading] = useState(true);
    // Simulate loading state or perform checks
    useEffect(() => {
      // Simule le chargement (ex: attendre Appwrite/Auth)
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 1000); // ou 500ms, selon ton UX
  
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
      <Card className="w-full max-w-2xl shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <Building2 className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">À propos de RIM TECHNOLOGIE</h1>
          <p className="text-gray-700 leading-relaxed">
            RIM TECHNOLOGIE est une entreprise spécialisée dans la gestion de stock et la vente de
            produits à travers une plateforme moderne et intuitive.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            Notre objectif est de faciliter la gestion des stocks en proposant des solutions performantes et adaptées aux besoins des commerçants et des entreprises.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default About;
