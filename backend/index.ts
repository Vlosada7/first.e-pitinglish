// import * as dotenv from "dotenv";
// dotenv.config();
import express from "express";
import { PrismaClient } from "@prisma/client";
// import cors from "cors";
// import router from "./router";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/tasks", async (req, res) => {
	const tasks = await prisma.task.findMany();
	res.json(tasks);
});

app.listen(7777, () => {
	console.log("Server is running on http://localhost:3000");
});
