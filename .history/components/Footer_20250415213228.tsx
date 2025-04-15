"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-white text-gray-800 shadow-lg border-t border-gray-200"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 items-center">
          {/* Colonne 1 - Logo avec photo réduite */}
          <div className="flex justify-center md:justify-start">
            <motion.div
              className="relative w-32 h-32" // Taille réduite pour le footer
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="/uda.jpg"
                alt="USA Logo"
                fill
                priority
                className="object-contain w-full h-full"
              />
            </motion.div>
          </div>

          {/* Colonne 2 - Liens rapides horizontaux */}
          <div className="flex flex-col items-center">
            <h4 className="text-lg font-semibold mb-4 text-green-600">Liens rapides</h4>
            <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link
                href="/"
                className="text-sm hover:text-green-500 transition-colors duration-300 whitespace-nowrap"
              >
                Accueil
              </Link>
              <Link
                href="/contact"
                className="text-sm hover:text-green-500 transition-colors duration-300 whitespace-nowrap"
              >
                Contact
              </Link>
              <Link
                href="/about"
                className="text-sm hover:text-green-500 transition-colors duration-300 whitespace-nowrap"
              >
                À propos
              </Link>
            </nav>
          </div>

          {/* Colonne 3 - Réseaux sociaux */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="text-lg font-semibold mb-4 text-green-600">Suivez-nous</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-green-500 transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-green-500 transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-green-500 transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-green-500 transition-colors duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 py-4">
          <p className="text-xs text-center text-gray-600">
            © {new Date().getFullYear()} Union des Sortants d'Algérie. Tous droits réservés.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;