import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "mon_secret_jwt"; // Utilise une variable d'environnement

export async function POST(req: { json: () => PromiseLike<{ nni: any; password: any; }> | { nni: any; password: any; }; }) {
  try {
    const { nni, password } = await req.json();

    if (!nni || !password) {
      return NextResponse.json({ message: "NNI et mot de passe requis" }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { nni } });
    if (!user) {
      return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ message: "Mot de passe incorrect" }, { status: 401 });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: user.id, nni: user.nni, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Retourner le token et les informations utilisateur
    return NextResponse.json({ token, user: { id: user.id, name: user.name, role: user.role } }, { status: 200 });
  } catch (error) {
    console.error("Erreur serveur:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
