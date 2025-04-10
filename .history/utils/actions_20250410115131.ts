'use server';
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

// Récupérer les choix de vote dynamiquement
export async function getChoices() {
  try {
    // Récupère les choix de la base de données, triés par leur label
    const choices = await prisma.voteOption.findMany({
      orderBy: { label: "asc" }, // Trie par le label de chaque choix
    });
    return choices;
  } catch (error) {
    console.error("Erreur lors de la récupération des choix :", error);
    return [];
  }
}

// Ajouter un choix à la liste des options de vote
export async function addChoice(label: string) {
  try {
    // Vérifie si le choix existe déjà
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

// Supprimer un choix de la liste des options de vote
export async function deleteChoice(id: string) {
  try {
    // Vérifier si l'option existe avant de tenter de la supprimer
    const choiceExists = await prisma.voteOption.findUnique({
      where: { id },
    });

    if (!choiceExists) {
      return {
        success: false,
        message: "Choix non trouvé.",
      };
    }

    // Suppression de l'option de vote
    await prisma.voteOption.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Choix supprimé avec succès.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression du choix.",
    };
  }
}


// Enregistrer un vote
export async function castVote(userId: string, choice: string) {
  try {
    // Vérifier si l'utilisateur a déjà voté (optionnel, si un seul vote est permis)
    const existingVote = await prisma.vote.findUnique({
      where: { userId }
    });

    if (existingVote) {
      throw new Error("Vous avez déjà voté.");
    }

    // Enregistrer le vote dans la base de données
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

// Récupérer les résultats des votes
export async function getVoteResults() {
  const totalVotes = await prisma.vote.count();  // Nombre total de votes

  const results = await prisma.vote.groupBy({
    by: ["choice"],
    _count: {
      choice: true,
    },
  });

  // Structure the results to include the 'choices' array
  const updatedChoices = results.map((result) => ({
    label: result.choice,
    votes: result._count.choice,
    percentage: 0, // Initially 0, we'll calculate it later
  }));

  // Calculate percentages
  updatedChoices.forEach((choice) => {
    choice.percentage = (choice.votes / totalVotes) * 100;
  });

  return {
    totalVotes,
    choices: updatedChoices, // Return the choices as an array
  };
}
