import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
	userId?: number; // Certifique-se de que o tipo é `number`
}

export const authenticateToken = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res
			.status(401)
			.json({ message: "Token de autenticação não fornecido" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
			userId: number;
		};
		req.userId = decoded.userId;
		next();
	} catch (error) {
		return res.status(403).json({ message: "Token inválido" });
	}
};
