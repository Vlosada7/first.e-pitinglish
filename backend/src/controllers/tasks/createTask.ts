import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTask = async (req: Request, res: Response) => {
	const { title, description, datetime: dueDate, userId } = req.body;

	try {
		if (!userId) {
			throw new Error("User not authenticated");
		}

		const newTask = await prisma.task.create({
			data: {
				title,
				description,
				dueDate,
				userId,
			},
		});

		res.status(201).send(newTask);
	} catch (error) {
		console.error(error);
		res.status(500).send(`${error}`);
	}
};
