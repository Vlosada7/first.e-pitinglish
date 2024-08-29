import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const updateTask = async (req: Request, res: Response) => {
	const { userId, taskId } = req.body;

	try {
		// Verifique se a task existe e pertence ao usuário
		const existingTask = await prisma.task.findFirst({
			where: {
				id: Number(taskId),
				userId: Number(userId),
			},
		});

		if (!existingTask) {
			return res
				.status(404)
				.json({ message: "Task not found or does not belong to the user" });
		}

		// Toggle o status de 'completed'
		const updatedTask = await prisma.task.update({
			where: {
				id: Number(taskId),
			},
			data: {
				isCompleted: !existingTask.isCompleted, // Alterna o status de 'completed'
			},
		});

		res.status(200).json(updatedTask);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: "An error occurred while updating the task" });
	}
};
