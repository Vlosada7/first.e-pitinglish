import express from "express";
import { registerUser } from "./controllers/auth/registerUser";
import { loginUser } from "./controllers/auth/loginUser";
import { createTask } from "./controllers/tasks/createTask";
import { authenticateToken } from "./middlewares/auth";
import { getTasks } from "./controllers/tasks/getTasks";
import { deleteTask } from "./controllers/tasks/deleteTask";
import { updateTask } from "./controllers/tasks/updateTask";

const router = express.Router();

// Auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// Tasks
router.post("/tasks", authenticateToken, createTask);
router.get("/tasks/:userId", getTasks);
router.delete("/tasks/:userId/:taskId", deleteTask);
router.put("/task", updateTask);

export default router;
