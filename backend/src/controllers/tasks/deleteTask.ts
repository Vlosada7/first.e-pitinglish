import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const deleteTask = async (req: Request, res: Response) => {
	const { userId, taskId } = req.params;

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
		const result = await prisma.task.deleteMany({
			where: {
				id: Number(taskId),
				userId: Number(userId),
			},
		});

		if (result.count === 0) {
			return res
				.status(404)
				.json({ message: "Task not found or does not belong to the user" });
		}
		res.status(200).json({ message: "Task deleted successfully" });
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: "An error occurred while deleting the task" });
	}
};
