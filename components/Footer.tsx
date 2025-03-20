"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full py-6 bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-md mt-8"
    >
      <div className="container mx-auto px-6 max-w-7xl text-center">
        {/* Liens rapides */}
        <nav className="mb-4 flex justify-center space-x-6">
          <Link href="/" className="text-sm hover:text-gray-300 transition">Accueil</Link>
          <Link href="/contact" className="text-sm hover:text-gray-300 transition">Contact</Link>
          <Link href="/about" className="text-sm hover:text-gray-300 transition">À propos</Link>
        </nav>

        {/* Copyright */}
        <div className="border-t border-gray-400 pt-4 text-center">
          <p className="text-xs text-gray-300">
            © {new Date().getFullYear()} <span className="font-bold text-blue-400">RIM TECHNOLOGIE</span>. Tous droits réservés.
          </p>
          <p className="text-xs text-gray-300">
            Conçu par <span className="font-bold text-blue-400">Lamat Abdellahi</span>.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
