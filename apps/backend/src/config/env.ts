import dotenv from "dotenv";
dotenv.config();

export const env = {
	PORT: process.env.PORT!,
	MONGO_URI: process.env.MONGO_URI!,
	JWT_SECRET: process.env.JWT_SECRET!,
	PAWAN_API_KEY: process.env.PAWAN_API_KEY!,
	NODE_ENV: process.env.NODE_ENV!,
	SMTP_HOST: process.env.SMTP_HOST!,
	SMTP_PORT: process.env.SMTP_PORT!,
	SMTP_USER: process.env.SMTP_USER!,
	SMTP_PASS: process.env.SMTP_PASS!,
	SMTP_FROM: process.env.SMTP_FROM!,
	FRONTEND_URL: process.env.FRONTEND_URL!,
	BACKEND_URL: process.env.BACKEND_URL!,
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
	GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI!,
};
