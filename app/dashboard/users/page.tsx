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
import Link from "next/link";

const UsersPage = () => {
  const { user, isAuthenticated } = useContext(AuthContext) ?? {};
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [isAuthenticated, user?.role, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersList = await getAllUsers();
        setUsers(usersList);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les utilisateurs.",
          variant: "destructive",
        });
      }
    };
    fetchUsers();
  }, [toast]);

  const handleEditUser = async (userId: string, updatedData: Partial<{ name: string; nni: string; password: string; role: Role }>) => {
    try {
      await updateUser(userId, updatedData);
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? { ...user, ...updatedData } : user))
      );
      toast({
        title: "Utilisateur modifié",
        description: "Informations mises à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier cet utilisateur.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Gestion des Utilisateurs</h1>
      <Link href={`/register`} className="ml-2 text-blue-500 hover:text-blue-600">
        <Button>Ajouter un utilisateur</Button>
      </Link>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.length > 0 ? (
          users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>
                    <input
                      type="text"
                      className="border p-1 rounded w-full"
                      defaultValue={user.name}
                      onBlur={(e) => handleEditUser(user.id, { name: e.target.value })}
                    />
                  </CardTitle>
                  <CardDescription>
                    <input
                      type="text"
                      className="border p-1 rounded w-full"
                      defaultValue={user.nni}
                      onBlur={(e) => handleEditUser(user.id, { nni: e.target.value })}
                    />
                  </CardDescription>
                  <CardDescription className="text-blue-500">
                    <select
                      className="border p-2 rounded"
                      defaultValue={user.role}
                      onChange={(e) => handleEditUser(user.id, { role: e.target.value as Role })}
                    >
                      <option value={Role.USER}>Utilisateur</option>
                      <option value={Role.ADMIN}>Administrateur</option>
                    </select>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    <input
                      type="password"
                      className="border p-1 rounded w-full"
                      placeholder="Nouveau mot de passe"
                      onBlur={(e) => handleEditUser(user.id, { password: e.target.value })}
                    />
                    <Button variant="destructive" onClick={() => deleteUser(user.id)}>
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
    </div>
  );
};

export default UsersPage;
