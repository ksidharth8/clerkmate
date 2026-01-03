import { Router } from "express";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";
import { User, LoginToken, LoginSession } from "../models";
import { env } from "../config/env";
import { sendLoginEmail } from "../utils/mailer";

const router = Router();

const JWT_SECRET = env.JWT_SECRET!;
const LOGIN_TOKEN_EXPIRY_MIN = 10;

// POST /auth/login
router.post("/login", async (req, res) => {
	const { email } = req.body;
	if (!email) {
		return res.status(400).json({ error: "Email required" });
	}

	let user = await User.findOne({ email });
	if (!user) {
		user = await User.create({ email });
		console.info("[AUTH] New user created", { email });
	}

	const token = randomUUID();
	const expiresAt = new Date(Date.now() + LOGIN_TOKEN_EXPIRY_MIN * 60 * 1000);

	await LoginToken.create({
		userId: user._id,
		token,
		expiresAt,
	});

	console.info("[AUTH] Login requested", { email });
	await sendLoginEmail(email, token);

	res.json({
		message: "Login token generated. Check email.",
	});
});

// POST /auth/verify
router.post("/verify", async (req, res) => {
	const { token } = req.body;
	if (!token) {
		return res.status(400).json({ error: "Token required" });
	}

	const loginToken = await LoginToken.findOne({ token });
	if (!loginToken) {
		return res.status(401).json({ error: "Invalid token" });
	}

	if (loginToken.expiresAt < new Date()) {
		await LoginToken.deleteOne({ _id: loginToken._id });
		return res.status(401).json({ error: "Token expired" });
	}

	const user = await User.findById(loginToken.userId);
	if (!user) {
		return res.status(401).json({ error: "User not found" });
	}

	const accessToken = jwt.sign(
		{ sub: user._id.toString(), email: user.email },
		JWT_SECRET,
		{ expiresIn: "7d", issuer: "clerkmate-api", audience: "clerkmate-cli" }
	);

	await LoginToken.deleteOne({ _id: loginToken._id });

	console.info("[AUTH] Token verified", {
		userId: user._id.toString(),
	});

	res.json({
		accessToken,
		user: {
			id: user._id,
			email: user.email,
		},
	});
});

// GET /auth/verify-link
router.get("/verify-link", async (req, res) => {
	const { token } = req.query;

	if (!token || typeof token !== "string") {
		return res.status(400).send("Invalid login link");
	}

	const loginToken = await LoginToken.findOne({ token });
	if (!loginToken) {
		return res.status(401).send("Invalid or expired login link");
	}

	if (loginToken.expiresAt < new Date()) {
		await LoginToken.deleteOne({ _id: loginToken._id });
		return res.status(401).send("Login link expired");
	}

	const user = await User.findById(loginToken.userId);
	if (!user) {
		return res.status(401).send("User not found");
	}

	const accessToken = jwt.sign(
		{ sub: user._id.toString(), email: user.email },
		JWT_SECRET,
		{
			expiresIn: "7d",
			issuer: "clerkmate-api",
			audience: "clerkmate-cli",
		}
	);

	await LoginToken.deleteOne({ _id: loginToken._id });

	const redirectUrl = `${env.FRONTEND_URL}/login?token=${accessToken}`;

	console.info("[AUTH] Login link verified", {
		userId: user._id.toString(),
	});

	res.redirect(302, redirectUrl);
});

// POST /auth/cli-session
router.post("/cli-session", async (_req, res) => {
	const sessionId = uuid();

	await LoginSession.create({
		sessionId,
		expiresAt: dayjs().add(10, "minute").toDate(),
	});

	console.info("[AUTH] CLI session created");
	res.json({ sessionId });
});

// GET /auth/cli-session/:id
router.get("/cli-session/:id", async (req, res) => {
	const session = await LoginSession.findOne({
		sessionId: req.params.id,
	});

	if (!session) {
		return res.status(404).json({ error: "Invalid session" });
	}

	if (!session.jwt) {
		return res.status(202).json({ status: "pending" });
	}

	console.info("[AUTH] CLI session JWT retrieved");
	res.json({ token: session.jwt });
});

export default router;
