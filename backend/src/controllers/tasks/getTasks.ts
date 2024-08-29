import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response) => {
	const userId = req.params.userId;
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: Number(userId),
			},
			select: {
				tasks: true,
			},
		});
		if (!user) {
			throw new Error("User not found");
		}
		res.send(user);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: "An error occurred while getting the tasks" });
	}
};
