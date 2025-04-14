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
      style={{
        backgroundImage: "url('/')", // Remplace par ton image
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto px-6 max-w-7xl text-center">
        {/* Liens rapides */}
        <nav className="mb-4 flex justify-center space-x-6 bg-white text-black">
          <Link href="/" className="text-sm hover:text-blue-400 transition ">
            Accueil
          </Link>
          <Link
            href="/contact"
            className="text-sm hover:text-blue-900transition hover:text-blue-400 "
          >
            Contact
          </Link>
          <Link
            href="/about"
            className="text-sm hover:text-blue-400 transition"
          >
            À propos
          </Link>
        </nav>

        {/* Copyright */}
        <div className="w-full border-t border-gray-400 pt-4 pb-6 px-4 sm:px-6 text-center bg-white">
          <p className="text-[10px] sm:text-xs text-black whitespace-normal sm:whitespace-nowrap leading-relaxed">
            © {new Date().getFullYear()}{" "}
            <span className="font-bold">Union des Sortants d&apos;Algérie</span>. Tous droits réservés.
          </p>
        </div>

      </div>
    </motion.footer>
  );
};

export default Footer;
