'use client';

import React, { useState, useEffect, useContext, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Role } from "@prisma/client";
import { deleteUser, getAllUsers, updateUser } from "@/utils/actions";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/components/AuthContext";
import { FiPhone, FiBriefcase } from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import Loader from "@/components/Loader";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface User {
  id: string;
  name: string;
  nni: string;
  job: string;
  role: Role;
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

  useEffect(() => {
    useCallback(async () => {
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
  }, [toast])();
  }, [useCallback(async () => {
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
  }, [toast])]);

  // Gestion de la modification d'un utilisateur
  const handleEditUser = async (userId: string, updatedData: Partial<User>) => {
    try {
      await updateUser(userId, updatedData);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, ...updatedData } : user
        )
      );
      toast({
        title: "Utilisateur modifié",
        description: "Informations mises à jour avec succès."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier cet utilisateur.",
        variant: "destructive"
      });
    }
  };

  // Gestion de la suppression d'un utilisateur
  const handleDeleteUser = async (userId: string) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(userId);
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        Swal.fire('Supprimé !', 'L\'utilisateur a été supprimé.', 'success');
      } catch (error) {
        Swal.fire(
          'Erreur',
          error instanceof Error ? error.message : "Impossible de supprimer le dernier administrateur.",
          'error'
        );
      }
    }
  };

  // Filtrage et pagination
  const filteredUsers = users.filter(user =>
    user.nni.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Génération du PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // En-tête
    doc.setFontSize(16);
    doc.text("Liste des membres de l'union sortants", 14, 20);

    // Date de génération
    doc.setFontSize(10);
    const today = new Date();
    doc.text(
      `Date de génération : ${today.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })}`,
      14,
      28
    );

    // Tableau des utilisateurs
    autoTable(doc, {
      startY: 35,
      head: [["#", "Nom", "Téléphone", "Métier", "Rôle"]],
      body: users.map((user, index) => [
        index + 1,
        user.name,
        user.nni,
        user.job,
        user.role === "ADMIN" ? "Administrateur" : "Utilisateur"
      ]),
    });

    doc.save("membres_union_sortants.pdf");
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-primary">
        Gestion des Utilisateurs
      </h1>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="w-full sm:w-64">
          <Input
            type="text"
            placeholder="Rechercher par téléphone"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <Button onClick={generatePDF} variant="outline">
          Exporter en PDF
        </Button>
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Nombre total d'utilisateurs : {filteredUsers.length}
        </p>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun utilisateur trouvé.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {currentUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{user.name}</CardTitle>

                    <div className="space-y-2 mt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <FiPhone className="w-4 h-4 text-muted-foreground" />
                        <span>{user.nni}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <FiBriefcase className="w-4 h-4 text-muted-foreground" />
                        <span>{user.job || "Non spécifié"}</span>
                      </div>

                      <Select
                        value={user.role}
                        onValueChange={(value) =>
                          handleEditUser(user.id, { role: value as Role })
                        }
                      >
                        <SelectTrigger className="w-full mt-2">
                          <SelectValue placeholder="Rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">Utilisateur</SelectItem>
                          <SelectItem value="ADMIN">Administrateur</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>

                  <CardContent>
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
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Précédent
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {currentPage} sur {totalPages}
            </span>

            <Button
              variant="outline"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Suivant
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default UsersPage;