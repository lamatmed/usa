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
import { FiPhone, FiBriefcase } from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2"; // Import SweetAlert2

const UsersPage = () => {
  const { user } = useContext(AuthContext) ?? {};
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
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
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(userId);
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
          Swal.fire('Supprimé !', 'L\'utilisateur a été supprimé.', 'success');
        } catch (error) {
          Swal.fire('Erreur', "Impossible de supprimer le dernier administrateur.", 'error');
        }
      }
    });
  };

  const filteredUsers = users.filter((user) => user.nni.includes(search));

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Liste des membres de l'union sortants", 14, 20);
    const today = new Date();
    const dateStr = today.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    doc.setFontSize(10);
    doc.text(`Date de génération : ${dateStr}`, 14, 28);
    const startY = 35;
    const tableData = users.map((user, index) => [
      index + 1,
      user.name,
      user.nni,
      user.job,
    ]);
    autoTable(doc, {
      startY,
      head: [["#", "Nom", "Téléphone", "Métier"]],
      body: tableData,
    });
    doc.save("membres_union_sortants.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-white">Gestion des Utilisateurs</h1>
      <Button className="mb-4" onClick={() => generatePDF()} color="indigo">Exporter en PDF</Button>
      <input
        type="text"
        className="border p-2 rounded w-full mb-4 text-black"
        placeholder="Numéro Téléphone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <h2 className="text-lg font-semibold mb-2 text-white">Nombre total d&apos;utilisateurs : {filteredUsers.length}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {currentUsers.length > 0 ? (
          currentUsers.map((user) => (
            <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="bg-gray-700 text-white shadow-md hover:shadow-lg">
                <CardHeader>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription className="text-blue-500">
                    <select
                      className="border p-2 rounded w-full bg-gray-700 text-white"
                      defaultValue={user.role}
                      onChange={(e) => handleEditUser(user.id, { role: e.target.value as Role })}
                    >
                      <option value="USER">Utilisateur</option>
                      <option value="ADMIN">Administrateur</option>
                    </select>
                  </CardDescription>
                  <CardDescription className="flex items-center space-x-2">
                    <FiPhone className="w-5 h-5 text-gray-400" />
                    <span>{user.nni}</span>
                  </CardDescription>
                  <CardDescription className="flex items-center space-x-2">
                    <FiBriefcase className="w-5 h-5 text-gray-400" />
                    <span>{user.job}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    <Button variant="destructive" onClick={() => handleDeleteUser(user.id)} color="red">Supprimer</Button>
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
        <span className="mx-4 text-white">Page {currentPage}</span>
        <Button onClick={() => paginate(currentPage + 1)} disabled={currentPage * usersPerPage >= filteredUsers.length}>Suivant</Button>
      </div>
    </div>
  );
};

export default UsersPage;
