'use client';

import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Role } from "@prisma/client";
import { deleteUser, getAllUsers, updateUser } from "@/utils/actions";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/components/AuthContext";
import { FiPhone, FiBriefcase } from "react-icons/fi"; // Import des icônes
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const UsersPage = () => {
  const { user } = useContext(AuthContext) ?? {};
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [usersPerPage] = useState(5); // Number of users per page
  const { toast } = useToast();

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [user?.role, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersList = await getAllUsers();
        setUsers(usersList);
      } catch (error) {
        toast({ title: "Erreur", description: "Impossible de récupérer les utilisateurs.", variant: "destructive" });
      }
    };
    fetchUsers();
  }, [toast]);

  const handleEditUser = async (userId: string, updatedData: any) => {
    try {
      await updateUser(userId, updatedData);
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, ...updatedData } : user)));
      toast({ title: "Utilisateur modifié", description: "Informations mises à jour avec succès." });
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de modifier cet utilisateur.", variant: "destructive" });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      toast({ title: "Utilisateur supprimé", description: "L'utilisateur a été supprimé avec succès." });
    } catch (error) {
      toast({ title: "Erreur", description:"Impossible de supprimer le dernier administrateur.", variant: "destructive" });
    }
  };

  // Filter users based on the search input
  const filteredUsers = users.filter((user) => user.nni.includes(search));

  // Calculate the users to display for the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const generatePDF = () => {
    const doc = new jsPDF();
  
    const sortants = users.filter((u) => u.role === "USER"); // Remplace par ta condition réelle pour les "sortants"
  
    const tableData = sortants.map((user, index) => [
      index + 1,
      user.name,
      user.nni,
      user.job,
      user.role,
    ]);
  
    autoTable(doc, {
      head: [["#", "Nom", "Téléphone", "Métier", "Rôle"]],
      body: tableData,
    });
  
    doc.save("membres_sortants.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Gestion des Utilisateurs</h1>
      <Button className="mb-4" onClick={() => generatePDF()}>
  Exporter les membres en PDF
</Button>
      <input
        type="text"
        className="border p-2 rounded w-full mb-4"
        placeholder="Numéro Téléphone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <h2 className="text-lg font-semibold mb-2">Nombre total d&apos;utilisateurs : {filteredUsers.length}</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {currentUsers.length > 0 ? (
          currentUsers.map((user) => (
            <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="shadow-md hover:shadow-lg">
                <CardHeader>
                  <CardTitle>
                    <span>{user.name}</span>
                  </CardTitle>
                  <CardDescription className="text-blue-500">
                    <select
                      className="border p-2 rounded w-full"
                      defaultValue={user.role}
                      onChange={(e) => handleEditUser(user.id, { role: e.target.value as Role })}
                    >
                      <option value="USER">Utilisateur</option>
                      <option value="ADMIN">Administrateur</option>
                    </select>
                  </CardDescription>
                  <CardDescription className="flex items-center space-x-2">
                    <FiPhone className="w-5 h-5 text-gray-500" />
                    <span>{user.nni}</span>
                  </CardDescription>
                  <CardDescription className="flex items-center space-x-2">
                    <FiBriefcase className="w-5 h-5 text-gray-500" />
                    <span>{user.job}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    <Button variant="destructive" onClick={() => handleDeleteUser(user.id)}>
                      Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">Aucun utilisateur trouvé.</p>
        )}
      </div>
    

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Précédent</Button>
        <span className="mx-4">Page {currentPage}</span>
        <Button onClick={() => paginate(currentPage + 1)} disabled={currentPage * usersPerPage >= filteredUsers.length}>Suivant</Button>
      </div>
    </div>
  );
};

export default UsersPage;
