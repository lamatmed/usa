"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-gray-900 text-white py-10 relative mt-12 overflow-hidden"
    >
      {/* Background image with blur effect (if needed) */}
      <div className="absolute inset-0 bg-[url('/your-footer-bg.jpg')] bg-cover bg-center opacity-10 blur-sm pointer-events-none" />

      {/* Content container */}
      <div className="relative container mx-auto px-6 max-w-7xl text-center">
        {/* Quick links */}
        <nav className="mb-6 flex flex-wrap justify-center gap-6">
          <Link
            href="/"
            className="text-sm sm:text-base text-white hover:underline hover:text-blue-400 transition"
          >
            Accueil
          </Link>
          <Link
            href="/contact"
            className="text-sm sm:text-base text-white hover:underline hover:text-blue-400 transition"
          >
            Contact
          </Link>
          <Link
            href="/about"
            className="text-sm sm:text-base text-white hover:underline hover:text-blue-400 transition"
          >
            À propos
          </Link>
        </nav>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-4">
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-blue-400">
              Union des Sortants d&apos;Algérie
            </span>. Tous droits réservés.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
