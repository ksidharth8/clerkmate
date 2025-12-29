import { Schema, model, Types } from "mongoose";

const aiSummarySchema = new Schema(
	{
		userId: {
			type: Types.ObjectId,
			ref: "User",
			required: true,
		},
		startDate: {
			type: String,
			required: true,
		},
		endDate: {
			type: String,
			required: true,
		},
		summaryText: {
			type: String,
			required: true,
		},
		standupFingerprint: {
			type: String,
			required: false,
		},
	},
	{ timestamps: true }
);

aiSummarySchema.index(
	{ userId: 1, startDate: 1, endDate: 1 },
	{ unique: true }
);

export const AISummary = model("AISummary", aiSummarySchema);
