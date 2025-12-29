// import OpenAI from 'openai'
import fetch from "node-fetch";
import { env } from "../config/env";

const API_URL = "https://api.pawan.krd/v1/chat/completions";
const MODEL = "gpt-oss-20b";

const SYSTEM_PROMPT = `You are a professional engineering reporting assistant.
                        You summarize ONE developer's work.
                        There is NO team.
                        There is NO project manager language.

                        Rules:
                        - Use ONLY the information provided.
                        - Do NOT invent tasks, names, or abstractions.
                        - Do NOT generalize into vague statements.
                        - Do NOT output placeholder or random tokens.
                        - If something is unclear, omit it.
                        - Prefer concrete technical wording.
                        - Output must be factual and concise.`.trim();

export async function generateWeeklySummary(input: string): Promise<string> {
	const res = await fetch(API_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${env.PAWAN_API_KEY}`,
		},
		body: JSON.stringify({
			model: MODEL,
			temperature: 0.8,
			messages: [
				{
					role: "system",
					content: SYSTEM_PROMPT,
				},
				{
					role: "user",
					content: input,
				},
			],
		}),
	});

	if (!res.ok) {
		throw new Error("AI request failed");
	}

	const data = (await res.json()) as {
		choices?: Array<{ message?: { content?: string } }>;
	};

	return data.choices?.[0]?.message?.content ?? "";
}
