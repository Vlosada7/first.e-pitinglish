import express from "express";
import { registerUser } from "./controllers/auth/registerUser";
import { loginUser } from "./controllers/auth/loginUser";
import { createTask } from "./controllers/tasks/createTask";
import { authenticateToken } from "./middlewares/auth";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/tasks", authenticateToken, createTask);

export default router;
