import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

const JWT_SECRET = env.JWT_SECRET!;

export function requireAuth(req: Request, res: Response, next: NextFunction) {
	const header = req.headers.authorization;
	if (!header || !header.startsWith("Bearer ")) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	const token = header.split(" ")[1];

	try {
		const payload = jwt.verify(token, JWT_SECRET, {
			clockTolerance: 60,
			issuer: "clerkmate-api",
			audience: ["clerkmate-cli", "clerkmate-web"],
		});
		(req as any).user = payload;
		next();
	} catch {
		return res.status(401).json({ error: "Invalid token" });
	}
}
