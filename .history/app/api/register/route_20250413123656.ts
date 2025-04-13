import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { nni, password, name, role, address, job, domain, cv, photo } = await req.json();

    // Vérification des champs obligatoires
    if (!nni || !password || !name) {
      return NextResponse.json({ error: "NNI, mot de passe et nom sont obligatoires" }, { status: 400 });
    }

    // Vérification de l'unicité du NNI
    const existingUser = await prisma.user.findUnique({
      where: { nni },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Le n est déjà utilisé" }, { status: 400 });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur avec les champs optionnels
    const newUser = await prisma.user.create({
      data: { nni, password: hashedPassword, name, role, address, job, domain, cv, photo },
    });

    return NextResponse.json(newUser, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Une erreur est survenue lors de l'inscription" }, { status: 500 });
  }
}
