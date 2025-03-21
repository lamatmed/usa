"use client";

import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuPortal 
} from "@/components/ui/dropdown-menu";
import { MainNav } from "./main-nav";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!authContext) return null; // Évite les erreurs si le contexte est `null`
  
  const { user, isAuthenticated, logout } = authContext;

  function handleLogout() {
    logout();
    router.push("/login");
  }

  // Fermer le menu si on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const menu = document.getElementById("mobile-menu");
      if (menu && !menu.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav className="p-4 bg-gray-300 shadow-md flex items-center justify-between relative">
      {/* Logo + Menu mobile */}
      <div className="flex items-center space-x-4">
        <Link href="/">
          <Image src="/lok.jpg" alt="logo" width={70} height={70} />
        </Link>
        <h1 className="text-lg font-bold text-blue-600">Shopping</h1>
        
        {/* Bouton Menu Mobile */}
        <button 
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-200 transition" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Navigation visible seulement en mode desktop */}
        <div className="hidden md:block">
          <MainNav />
        </div>
      </div>

      {/* Menu déroulant pour les utilisateurs */}
      {isAuthenticated && user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-white text-blue-600">
  {user.name.length > 12 ? user.name.slice(0, 12) + "..." : user.name}
</Button>

          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent>
              <DropdownMenuLabel>Connecté en tant que {user.role}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500">
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      ) : (
        <Button onClick={() => router.push("/login")} className="bg-white text-blue-600">
          Se connecter
        </Button>
      )}

      {/* Menu Mobile */}
      {menuOpen && (
        <div 
          id="mobile-menu"
          className="absolute top-16 left-0 w-full bg-gray-200 shadow-lg flex flex-col p-4 space-y-3 md:hidden transition-all duration-300 ease-in-out"
        >
          <MainNav />
        </div>
      )}
    </nav>
  );
}
