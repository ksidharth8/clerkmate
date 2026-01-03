import { Schema, model } from "mongoose";

const loginSessionSchema = new Schema(
	{
		sessionId: { type: String, unique: true },
		jwt: { type: String },
		expiresAt: { type: Date },
	},
	{ timestamps: true }
);

// Auto-delete expired sessions
loginSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const LoginSession = model("LoginSession", loginSessionSchema);
