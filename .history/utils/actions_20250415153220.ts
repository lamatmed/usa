'use server';
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

// Création d'un utilisateur avec des champs optionnels


// Types pour une meilleure typage
type UserRole = "ADMIN" | "USER";

interface UserData {
  nni: string;
  password: string;
  name: string;
  role?: UserRole;
  address?: string;
  job?: string;
  domain?: string;
  cv?: string;
  photo?: string;
}

interface UpdateUserData {
  nni?: string;
  password?: string;
  name?: string;
  role?: UserRole;
  address?: string;
  job?: string;
  domain?: string;
  cv?: string;
  photo?: string;
}

// Sélection de base pour les requêtes utilisateur
const userSelect = {
  id: true,
  nni: true,
  name: true,
  role: true,
  address: true,
  job: true,
  domain: true,
  cv: true,
  photo: true,
  isBlocked: true,
  createdAt: true,
  updatedAt: true,
};

// Création d'un utilisateur avec des champs optionnels
export const createUser = async (data: UserData) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      isBlocked: false, // Par défaut, l'utilisateur n'est pas bloqué
    },
    select: userSelect,
  });
};

// Récupérer un utilisateur par ID avec toutes les infos
export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });
};

// Récupérer tous les utilisateurs avec leurs détails
export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: userSelect,
    orderBy: { createdAt: 'desc' }, // Tri par date de création
  });
};

// Mettre à jour un utilisateur avec les nouveaux champs
export const updateUser = async (id: string, data: UpdateUserData) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("L'utilisateur n'existe pas.");

  const updateData: any = { ...data };

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  return await prisma.user.update({
    where: { id },
    data: updateData,
    select: userSelect,
  });
};

// Bloque un utilisateur
export const blockUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("L'utilisateur n'existe pas.");

  return await prisma.user.update({
    where: { id },
    data: { isBlocked: true },
    select: userSelect,
  });
};

// Débloque un utilisateur
export const unblockUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("L'utilisateur n'existe pas.");

  return await prisma.user.update({
    where: { id },
    data: { isBlocked: false },
    select: userSelect,
  });
};

// Vérifie si un utilisateur est bloqué
export const isUserBlocked = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { isBlocked: true },
  });

  if (!user) throw new Error("L'utilisateur n'existe pas.");

  return user.isBlocked;
};

// Supprime un utilisateur
export const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("L'utilisateur n'existe pas.");

  return await prisma.user.delete({
    where: { id },
    select: { id: true }, // Retourne seulement l'ID pour confirmer la suppression
  });
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
// Créer une activité
export async function createActivity(data: {
  title: string;
  description: string;
  date: string; // Format ISO ex: "2025-05-10"
  imageUrl?: string; // <- Ajout du champ imageUrl
}) {
  return await prisma.activity.create({
    data: {
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      imageUrl: data.imageUrl, // <- Ajout ici
    },
  });
}

// Récupérer toutes les activités
export async function getAllActivities() {
  return await prisma.activity.findMany({
    orderBy: { date: 'asc' },
  });
}

// Récupérer une activité par ID
export async function getActivityById(id: string) {
  return await prisma.activity.findUnique({
    where: { id },
  });
}

// Mettre à jour une activité
export async function updateActivity(id: string, data: {
  title?: string;
  description?: string;
  date?: string;
  imageUrl?: string; // <- Ajout du champ imageUrl
}) {
  return await prisma.activity.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      date: data.date ? new Date(data.date) : undefined,
    },
  });
}


// Supprimer une activité
export async function deleteActivity(id: string) {
  return await prisma.activity.delete({
    where: { id },
  });
}
