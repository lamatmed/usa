"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useContext } from "react"
import { AuthContext } from "@/components/AuthContext"
import { cn } from "@/lib/utils"
import { 
  Users, 
  Clipboard,
  ComputerIcon ,
  LayoutDashboard 
} from "lucide-react"

type NavigationItem = {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

type Navigation = {
  ADMIN: NavigationItem[];
  USER: NavigationItem[];
 
}

const navigation: Navigation = {
  ADMIN: [
    { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    
    { name: "Mon espace", href: "/dashboard/espace-user", icon: ComputerIcon},
    { name: "Mombres", href: "/dashboard/users", icon: Users },
    { name: "Election", href: "/dashboard/config-vote", icon: Clipboard },
  ],
  USER: [
    { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    { name: "Mon espace", href: "/dashboard/espace-user", icon: Users },
   
  ],

}

export function MainNav() {
  const pathname = usePathname()
  const { user, isAuthenticated } = useContext(AuthContext)!;

  // Vérifier le rôle de l'utilisateur
  const userRole = user?.role || "USER"; 
  const allowedNavigation = navigation[userRole as keyof Navigation] || navigation.USER;

  return (
    <nav className="flex flex-col md:flex-row items-center md:space-x-6 space-y-2 md:space-y-0">
      {isAuthenticated && user ? (
        allowedNavigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center text-sm font-medium transition-colors duration-200 px-4 py-2 rounded-lg w-full md:w-auto",
                isActive 
                  ? "text-blue-600 bg-gray-100 md:border-b-2 border-blue-600"
                  : "text-gray-700 bg-white hover:text-blue-500 hover:bg-gray-100"
              )}
            >
              <Icon className="mr-2 h-5 w-5" />
              {item.name}
            </Link>
          )
        })
      ) : (
        <span className="text-black text-sm">Connectez-vous pour accéder au menu</span>
      )}
    </nav>
  )
}
