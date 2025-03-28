'use server'
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

// Création d'un utilisateur avec des champs optionnels
export const createUser = async (data: {
  nni: string;
  password: string;
  name: string;
  role?: "ADMIN" | "USER";
  address?: string;
  job?: string;
  domain?: string;
  cv?: string;
  photo?: string;
}) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return await prisma.user.create({
    data: { ...data, password: hashedPassword },
  });
};

// Récupérer un utilisateur par ID avec toutes les infos
export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      nni: true,
      name: true,
      role: true,
      address: true,
      job: true,
      domain: true,
      cv: true,
      photo: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

// Récupérer tous les utilisateurs avec leurs détails
export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      nni: true,
      name: true,
      role: true,
      address: true,
      job: true,
      domain: true,
      cv: true,
      photo: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

// Mettre à jour un utilisateur avec les nouveaux champs
export const updateUser = async (
  id: string,
  data: Partial<{
    nni: string;
    password: string;
    name: string;
    role: "ADMIN" | "USER";
    address: string;
    job: string;
    domain: string;
    cv: string;
    photo: string;
  }>
) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("L'utilisateur n'existe pas.");

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  return await prisma.user.update({
    where: { id },
    data,
  });
};

// Supprimer un utilisateur
export const deleteUser = async (id: string) => {
  // Vérifier combien d'admins existent
  const adminCount = await prisma.user.count({
    where: { role: "ADMIN" },
  });

  // Vérifier si l'utilisateur à supprimer est un ADMIN
  const userToDelete = await prisma.user.findUnique({
    where: { id },
  });

  if (!userToDelete) {
    throw new Error("Utilisateur non trouvé.");
  }

  if (userToDelete.role === "ADMIN" && adminCount === 1) {
    throw new Error("Impossible de supprimer le dernier administrateur.");
  }

  // Supprimer l'utilisateur si les conditions sont respectées
  return await prisma.user.delete({ where: { id } });
};

