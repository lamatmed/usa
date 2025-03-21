"use client";

import { useState, useEffect } from "react";
import { getProducts } from "@/utils/actions";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, PhoneCall } from "lucide-react";
import Loader from "@/components/Loader";
import { motion } from "framer-motion"; // Import de Framer Motion
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  quantity: number;
  price_v: number;
  imageUrl?: string | null;
  userId: string;
  user: {
    name: string;
    nni: string;
  };
};

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // État pour la recherche

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(
        data.map((product) => ({
          ...product,
          imageUrl: product.imageUrl ?? "",
          user: {
            name: product.user?.name ?? "Utilisateur inconnu",
            nni: product.user?.nni ?? "N/A",
          },
        }))
      );
    } catch (err) {
      setError("Erreur lors du chargement des produits. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // Filtrage des produits par nom
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
        🛍️ Liste des Produits
      </h1>

      {/* Champ de recherche */}
      <input
        type="text"
        placeholder="Rechercher un produit..."
        className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && <Loader />}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-4 bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-lg shadow-md text-white transition-transform"
                >
                  {product.imageUrl && product.imageUrl !== "" ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-md border border-gray-300"
                      width={200}
                      height={200}
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-300 flex items-center justify-center text-gray-600 rounded-md">
                      📷
                    </div>
                  )}
                  <div>
                    <p className="text-lg font-semibold">{product.name}</p>
                    <p className="text-sm">
                      Quantité:{" "}
                      <span className="font-medium">{product.quantity}</span>
                    </p>
                    <p className="text-sm">
                      Prix:{" "}
                      <span className="font-medium">
                        {product.price_v.toLocaleString("fr-MR")} MRU
                      </span>
                    </p>
                    <p className="text-sm">
                      Créé par:{" "}
                      <span className="font-medium">{product.user.name}</span>
                    </p>
                    <a
                      href={`https://wa.me/${product.user.nni}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fixed bottom-4 right-4 bg-green-500 p-3 rounded-full text-white shadow-lg hover:bg-green-600 transition"
                    >
                      <PhoneCall size={20} />
                    </a>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-2">
                Aucun produit disponible.
              </p>
            )}
          </motion.div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mt-6 w-full"
            >
              <Button
                className={`flex items-center gap-1 sm:gap-2 bg-blue-600 text-white text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-800 transition ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                Précédent
              </Button>

              <span className="text-gray-800 font-medium text-sm sm:text-base">
                Page {currentPage} / {totalPages}
              </span>

              <Button
                className={`flex items-center gap-1 sm:gap-2 bg-blue-600 text-white text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-800 transition ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Suivant
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
