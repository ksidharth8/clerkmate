import { Schema, model, Types } from "mongoose";

const loginTokenSchema = new Schema(
	{
		userId: {
			type: Types.ObjectId,
			ref: "User",
			required: true,
		},
		token: {
			type: String,
			required: true,
			unique: true,
		},
		expiresAt: {
			type: Date,
			required: true,
		},
	},
	{ timestamps: true }
);

// Auto-delete expired tokens
loginTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const LoginToken = model("LoginToken", loginTokenSchema);
