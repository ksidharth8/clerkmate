import { Schema, model, Types } from "mongoose";

const standupSchema = new Schema(
	{
		userId: {
			type: Types.ObjectId,
			ref: "User",
			required: true,
		},
		date: {
			type: String, // YYYY-MM-DD
			required: true,
		},
		yesterday: {
			type: String,
			required: true,
		},
		today: {
			type: String,
			required: true,
		},
		blockers: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

// One standup per user per day
standupSchema.index({ userId: 1, date: 1 }, { unique: true });

export const Standup = model("Standup", standupSchema);
