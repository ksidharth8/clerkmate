import { Router } from "express";
import dayjs from "dayjs";
import { requireAuth } from "../middlewares/auth";
import { Standup, AISummary } from "../models";
import { generateWeeklySummary } from "../services/ai";
import * as crypto from "crypto";

const router = Router();

function computeFingerprint(standups: InstanceType<typeof Standup>[]) {
	const normalized = standups.map((s) => ({
		date: s.date,
		yesterday: s.yesterday.trim(),
		today: s.today.trim(),
		blockers: s.blockers.trim(),
	}));

	return crypto
		.createHash("sha256")
		.update(JSON.stringify(normalized))
		.digest("hex");
}

// GET /summaries/latest
router.get("/latest", requireAuth, async (req, res) => {
	const user = (req as any).user;

	const endDate = dayjs().format("YYYY-MM-DD");
	const startDate = dayjs().subtract(6, "day").format("YYYY-MM-DD");

	const summary = await AISummary.findOne({
		userId: user.sub,
		startDate,
		endDate,
	});

	console.info("[SUMMARY] Latest summary fetched", {
		userId: user.sub,
		startDate,
		endDate,
	});

	res.json({
		summary: summary || null,
	});
});

// GET /summaries  — list past weeks (latest updated first)
router.get("/", requireAuth, async (req, res) => {
	const user = (req as any).user;

	const summaries = await AISummary.find(
		{ userId: user.sub },
		{
			summaryText: 1,
			startDate: 1,
			endDate: 1,
			updatedAt: 1,
			_id: 0,
		}
	).sort({ updatedAt: -1 });

	console.info("[SUMMARY] Summaries list fetched", {
		userId: user.sub,
		count: summaries.length,
	});

	res.json({ summaries });
});

// POST /summaries/generate
router.post("/generate", requireAuth, async (req, res) => {
	const user = (req as any).user;

	const endDate = dayjs().format("YYYY-MM-DD");
	const startDate = dayjs().subtract(6, "day").format("YYYY-MM-DD");

	const standups = await Standup.find({
		userId: user.sub,
		date: { $gte: startDate, $lte: endDate },
	}).sort({ date: 1 });

	if (standups.length < 2) {
		return res.status(400).json({
			error: "Not enough standups to generate weekly summary",
		});
	}

	const fingerprint = computeFingerprint(standups);

	const existing = await AISummary.findOne({
		userId: user.sub,
		startDate,
		endDate,
	});

	if (existing && existing.standupFingerprint === fingerprint) {
		return res.json({
			summary: existing,
			cached: true,
		});
	} else if (existing) {
		console.warn("[SUMMARY] Overwriting existing summary", {
			userId: user.sub,
			startDate,
			endDate,
		});
	}

	const standupFacts = standups
		.map((s) => {
			return `- Date: ${s.date}
                    - Completed: ${s.yesterday}
                    - In Progress: ${s.today}
                    - Blockers: ${s.blockers}`.trim();
		})
		.join("\n");

	const header = `### Weekly Summary (${startDate} → ${endDate})`;

	const aiInput =
		`Use the header below EXACTLY as provided. Do not change dates or wording in the header.
    
        ${header}
        Using ONLY the facts below, generate a weekly summary in the EXACT structure shown.

        Structure (do not change):
        Overall Progress
        Concrete themes derived from repeated work
        Key Achievements
        - Specific completed items
        Blockers / Risks
        - Only list if explicitly present, otherwise say "None"
        Current Focus
        - Ongoing or upcoming work explicitly mentioned
        Facts:
        ${standupFacts}`.trim();

	const summaryText = await generateWeeklySummary(aiInput);

	if (!summaryText) {
		return res.status(500).json({ error: "AI generation failed" });
	}
	console.info("AI generation completed");

	const summary = await AISummary.findOneAndUpdate(
		{
			userId: user.sub,
			startDate,
			endDate,
		},
		{
			userId: user.sub,
			startDate,
			endDate,
			summaryText,
			standupFingerprint: fingerprint,
		},
		{ upsert: true, new: true }
	);

	console.info("[SUMMARY] Summary generated", {
		userId: user.sub,
		startDate,
		endDate,
		standupCount: standups.length,
	});

	res.json({
		summary,
	});
});

export default router;
