import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { Standup } from "../models";

const router = Router();

// POST /standups/sync
router.post("/sync", requireAuth, async (req, res) => {
	const user = (req as any).user;
	const { date, yesterday, today, blockers } = req.body;

	if (!date) {
		return res.status(400).json({ error: "Date is required" });
	}

	if (
		typeof yesterday !== "string" ||
		typeof today !== "string" ||
		typeof blockers !== "string"
	) {
		return res.status(400).json({ error: "Invalid standup payload" });
	}

	try {
		const standup = await Standup.findOneAndUpdate(
			{ userId: user.sub, date },
			{
				userId: user.sub,
				date,
				yesterday: yesterday?.trim() ?? "",
				today: today?.trim() ?? "",
				blockers: blockers?.trim() ?? "",
			},
			{ upsert: true, new: true }
		);

		console.info("[STANDUPS] Standup synced", {
			userId: user.sub,
			date,
		});

		res.json({
			status: "synced",
			standup,
		});
	} catch (err) {
		return res.status(500).json({ error: "Failed to sync standup" });
	}
});

// GET /standups
router.get("/", requireAuth, async (req, res) => {
	const user = (req as any).user;

	const standups = await Standup.find({ userId: user.sub })
		.sort({ date: -1 })
		.limit(30);

	console.info("[STANDUPS] Standups fetched", {
		userId: user.sub,
		count: standups.length,
	});

	res.json({ standups });
});

export default router;
