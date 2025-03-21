import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/AuthContext";
import NavBar from "@/components/NavBar";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shopping",
  description: "Application de gestion ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
      <div className="flex flex-col min-h-screen">
        <AuthProvider>
          <NavBar />

          <main className="flex-grow mt-7">{children}</main>
          <Toaster />
          <Footer /> {/* Ajoute un espace entre children et le footer */}
        </AuthProvider>
        </div>
      </body>
    </html>
  );
}
