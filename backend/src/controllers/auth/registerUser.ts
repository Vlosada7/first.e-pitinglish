import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
	const { firstName, lastName, email, password } = req.body;

	try {
		// Verificar se o email ja esta em uso
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return res
				.status(400)
				.json({ message: "Ya tiene un usuario con este email" });
		}

		// Criptografa a senha antes de salvar
		const hashedPassword = await bcrypt.hash(password, 10);

		// Cria o novo usuário
		const newUser = await prisma.user.create({
			data: {
				firstName,
				lastName,
				email,
				password: hashedPassword,
			},
		});
		return res
			.status(201)
			.json({ message: "Usuário registrado con suceso", userId: newUser.id });
	} catch (error) {
		return res.status(500).json({ message: "Error interno del server" });
	}
};
