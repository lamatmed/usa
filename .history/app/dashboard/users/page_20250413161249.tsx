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
import { FiPhone, FiBriefcase, FiTrash2, FiDownload } from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

const UsersPage = () => {
  const { user } = useContext(AuthContext) ?? {};
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const { toast } = useToast();

  useEffect(() => {
    if (user?.role !== "ADMIN") router.push("/dashboard");
  }, [user?.role, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersList = await getAllUsers();
        setUsers(usersList);
      } catch {
        toast({ title: "Erreur", description: "Impossible de récupérer les utilisateurs.", variant: "destructive" });
      }
    };
    fetchUsers();
  }, [toast]);

  const handleEditUser = async (userId: string, updatedData: any) => {
    try {
      await updateUser(userId, updatedData);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...updatedData } : u)));
      toast({ title: "Utilisateur modifié", description: "Informations mises à jour avec succès." });
    } catch {
      toast({ title: "Erreur", description: "Modification échouée.", variant: "destructive" });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(userId);
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        Swal.fire("Supprimé !", "L'utilisateur a été supprimé.", "success");
      } catch {
        Swal.fire("Erreur", "Impossible de supprimer cet utilisateur.", "error");
      }
    }
  };

  const filteredUsers = users.filter((u) => u.nni.includes(search));
  const indexOfLastUser = currentPage * usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfLastUser - usersPerPage, indexOfLastUser);

  const paginate = (num: number) => setCurrentPage(num);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Liste des membres de l'union sortants", 14, 20);
    const dateStr = new Date().toLocaleDateString("fr-FR");
    doc.setFontSize(10);
    doc.text(`Date de génération : ${dateStr}`, 14, 28);
    autoTable(doc, {
      startY: 35,
      head: [["#", "Nom", "Téléphone", "Métier"]],
      body: users.map((u, i) => [i + 1, u.name, u.nni, u.job]),
    });
    doc.save("membres_union_sortants.pdf");
  };

  return (
    <div className="p-4 min-h-screen bg-black text-white">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
        <Button onClick={generatePDF} className="gap-2"><FiDownload /> Exporter PDF</Button>
      </div>

      <input
        type="text"
        className="bg-gray-800 border border-gray-600 p-2 rounded w-full mb-4 text-white placeholder-gray-400"
        placeholder="Rechercher par téléphone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <p className="text-gray-300 mb-4">Total : {filteredUsers.length} utilisateurs</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {currentUsers.length ? currentUsers.map((u) => (
          <motion.div key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <Card className="bg-gray-900 border border-gray-700 shadow-md rounded-xl hover:ring-2 hover:ring-green-500">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{u.name}</CardTitle>
                <CardDescription className="text-sm">
                  <select
                    defaultValue={u.role}
                    onChange={(e) => handleEditUser(u.id, { role: e.target.value as Role })}
                    className="bg-gray-800 text-white border border-gray-600 p-2 rounded w-full"
                  >
                    <option value="USER">Utilisateur</option>
                    <option value="ADMIN">Administrateur</option>
                  </select>
                </CardDescription>
                <CardDescription className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                  <FiPhone /> {u.nni}
                </CardDescription>
                <CardDescription className="flex items-center gap-2 text-sm text-gray-400">
                  <FiBriefcase /> {u.job}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="w-full" onClick={() => handleDeleteUser(u.id)}>
                  <FiTrash2 className="mr-2" /> Supprimer
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )) : <p className="text-gray-500">Aucun utilisateur trouvé.</p>}
      </div>

      <div className="flex justify-center mt-6 gap-4">
        <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Précédent</Button>
        <span>Page {currentPage}</span>
        <Button onClick={() => paginate(currentPage + 1)} disabled={currentPage * usersPerPage >= filteredUsers.length}>Suivant</Button>
      </div>
    </div>
  );
};

export default UsersPage;