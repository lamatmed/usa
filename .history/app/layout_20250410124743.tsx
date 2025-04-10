import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/AuthContext";
import NavBar from "@/components/NavBar";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Union des Sortants  d'Algérie",
  description: "Application",
  icons: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <NavBar />
          <main className="flex-grow mt-7">{children}</main>
          <Footer />
        </AuthProvider>
        <Toaster /> {/* Placer Toaster en dehors d'AuthProvider pour éviter sa réinitialisation */}
      </body>
    </html>
  );
}
