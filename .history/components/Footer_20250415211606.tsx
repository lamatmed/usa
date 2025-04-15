"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-gradient-to-r from-green-600 via-emerald-500 to-lime-400 text-white shadow-lg"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
          {/* Colonne 1 - Logo et description */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-bold mb-4">Union des Sortants d'Algérie</h3>
            <p className="text-sm text-white/90 text-center md:text-left">
              Rôle des sortants mauritaniens dans le développement socio-économique, opportunités de coopération, et mise en réseau.
            </p>
          </div>

          {/* Colonne 2 - Liens rapides */}
          <div className="flex flex-col items-center">
            <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-sm hover:text-white transition-colors duration-300"
              >
                Accueil
              </Link>
              <Link
                href="/contact"
                className="text-sm hover:text-white transition-colors duration-300"
              >
                Contact
              </Link>
              <Link
                href="/about"
                className="text-sm hover:text-white transition-colors duration-300"
              >
                À propos
              </Link>
              <Link
                href="/members"
                className="text-sm hover:text-white transition-colors duration-300"
              >
                Membres
              </Link>
            </nav>
          </div>

          {/* Colonne 3 - Réseaux sociaux */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="text-lg font-semibold mb-4">Suivez-nous</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 py-4">
          <p className="text-xs text-center text-white/80">
            © {new Date().getFullYear()} Union des Sortants d'Algérie. Tous droits réservés.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;