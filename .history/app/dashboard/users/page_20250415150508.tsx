'use client';

import React, { useState, useEffect, useContext, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Role } from "@prisma/client";
import { deleteUser, getAllUsers, updateUser, toggleUserBlockStatus } from "@/utils/actions"; // Ajout de la nouvelle fonction
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/components/AuthContext";
import { FiPhone, FiBriefcase, FiLock, FiUnlock } from "react-icons/fi"; // Ajout des icônes
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import Loader from "@/components/Loader";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge"; // Pour afficher le statut

interface User {
  id: string;
  name: string;
  nni: string;
  job: string;
  role: Role;
  isBlocked: boolean; // Nouveau champ
  // Ajoutez d'autres propriétés si nécessaire
}

const USERS_PER_PAGE = 5;

const UsersPage = () => {
  const { user: currentUser } = useContext(AuthContext) ?? {};
  const router = useRouter();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Redirection si l'utilisateur n'est pas admin
  useEffect(() => {
    if (currentUser?.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [currentUser?.role, router]);

  // Récupération des utilisateurs
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const usersList = await getAllUsers();
      setUsers(usersList);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les utilisateurs.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Gestion du blocage/déblocage
  const handleToggleBlockUser = async (userId: string, isCurrentlyBlocked: boolean) => {
    const action = isCurrentlyBlocked ? "débloquer" : "bloquer";
    
    const result = await Swal.fire({
      title: `Êtes-vous sûr de vouloir ${action} cet utilisateur ?`,
      text: `L'utilisateur ${isCurrentlyBlocked ? 'pourra à nouveau' : 'ne pourra plus'} se connecter.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: `Oui, ${action} !`,
    });

    if (result.isConfirmed) {
      try {
        await toggleUserBlockStatus(userId);
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId 
              ? { ...user, isBlocked: !user.isBlocked } 
              : user
          )
        );
        toast({
          title: "Succès",
          description: `Utilisateur ${action} avec succès.`,
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: `Impossible de ${action} cet utilisateur.`,
          variant: "destructive",
        });
      }
    }
  };

  // ... (les autres fonctions restent les mêmes)

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* ... (le reste du code précédent reste inchangé jusqu'à la carte utilisateur) */}
      
      {currentUsers.map((user) => (
        <motion.div 
          key={user.id} 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3 }}
        >
          <Card className={`hover:shadow-lg transition-shadow ${user.isBlocked ? 'border-destructive border-2' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{user.name}</CardTitle>
                <Badge variant={user.isBlocked ? "destructive" : "default"}>
                  {user.isBlocked ? "Bloqué" : "Actif"}
                </Badge>
              </div>
              
              {/* ... (le reste des infos utilisateur) */}
            </CardHeader>
            
            <CardContent className="space-y-2">
              <Button 
                variant={user.isBlocked ? "default" : "outline"} 
                onClick={() => handleToggleBlockUser(user.id, user.isBlocked)}
                className="w-full flex gap-2"
              >
                {user.isBlocked ? (
                  <>
                    <FiUnlock className="w-4 h-4" />
                    Débloquer
                  </>
                ) : (
                  <>
                    <FiLock className="w-4 h-4" />
                    Bloquer
                  </>
                )}
              </Button>
              
              <Button 
                variant="destructive" 
                onClick={() => handleDeleteUser(user.id)}
                className="w-full"
              >
                Supprimer
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      
      {/* ... (le reste du code reste inchangé) */}
    </div>
  );
};

export default UsersPage;