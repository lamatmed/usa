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

export async function getChoices() {
  try {
    const choices = await prisma.voteOption.findMany({
      orderBy: { label: "asc" },
    });
    return choices;
  } catch (error) {
    console.error("Erreur lors de la récupération des choix :", error);
    return [];
  }
}
export async function addChoice(label: string) {
  try {
    // Vérifie s'il existe déjà
    const existing = await prisma.voteOption.findUnique({
      where: { label },
    });

    if (existing) {
      return {
        success: false,
        message: "Ce choix existe déjà.",
      };
    }

    const choice = await prisma.voteOption.create({
      data: { label },
    });

    return {
      success: true,
      message: "Choix ajouté avec succès.",
      choice,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Erreur inconnue lors de l'ajout.",
    };
  }
}

export async function deleteChoice(label: string) {
  try {
    await prisma.choice.delete({ where: { label } });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: "Erreur lors de la suppression du choix.",
    };
  }
}

export async function castVote(userId: string, choice: string) {
  try {
    // Vérifier si l'utilisateur a déjà voté (optionnel, si un seul vote est permis)
    const existingVote = await prisma.vote.findUnique({
      where: { userId }
    });

    if (existingVote) {
      throw new Error("Vous avez déjà voté.");
    }

    // Enregistrer le vote
    const vote = await prisma.vote.create({
      data: {
        userId,
        choice,
      },
    });

    return { success: true, message: "Vote enregistré avec succès", vote };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Une erreur inconnue est survenue." 
    };
  }
}


export async function getVoteResults() {
  const totalVotes = await prisma.vote.count();  // Nombre total de votes

  const results = await prisma.vote.groupBy({
    by: ["choice"],
    _count: {
      choice: true,
    },
  });

  // Organiser les résultats pour chaque choix
  const resultsObj = {
    UDA: 0,
    UDE: 0,
    Naitre: 0,
    totalVotes: totalVotes,
  };

  results.forEach((result) => {
    resultsObj[result.choice as keyof typeof resultsObj] = result._count.choice;
  });

  return resultsObj;
}

