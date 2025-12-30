import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { env } from "../config/env";

const router = Router();

const client = new OAuth2Client(
	env.GOOGLE_CLIENT_ID,
	env.GOOGLE_CLIENT_SECRET,
	env.GOOGLE_REDIRECT_URI
);

router.get("/google", (_req, res) => {
	const url = client.generateAuthUrl({
		access_type: "offline",
		scope: ["profile", "email"],
	});
	res.redirect(url);
});

router.get("/google/callback", async (req, res) => {
	const { code } = req.query;
	if (!code) return res.status(400).send("Missing code");

	const { tokens } = await client.getToken(code as string);
	const ticket = await client.verifyIdToken({
		idToken: tokens.id_token!,
		audience: env.GOOGLE_CLIENT_ID,
	});

	const payload = ticket.getPayload();
	if (!payload?.email) {
		return res.status(400).send("Google auth failed");
	}

	let user = await User.findOne({ email: payload.email });
	if (!user) {
		user = await User.create({ email: payload.email });
	}

	const accessToken = jwt.sign(
		{ sub: user._id.toString(), email: user.email },
		env.JWT_SECRET!,
		{ expiresIn: "7d", issuer: "clerkmate-api",audience: "clerkmate-web" }
	);

	const redirectUrl = `${env.FRONTEND_URL}/login?token=${accessToken}`;

	res.redirect(redirectUrl);
});

export default router;
