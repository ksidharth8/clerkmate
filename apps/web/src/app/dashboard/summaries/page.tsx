"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";

type Summary = {
	startDate: string;
	endDate: string;
	updatedAt?: string;
	summaryText: string;
};

export default function SummariesPage() {
	const [list, setList] = useState<Summary[]>([]);
	const [current, setCurrent] = useState<Summary | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	async function load() {
		try {
			const token = getToken()!;

			const latest = await apiFetch("/summaries/latest", token);
			setCurrent(latest.summary);

			const history = await apiFetch("/summaries", token);
			setList(history.summaries);
		} catch (e: any) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	}

	async function generate() {
		try {
			setLoading(true);
			const token = getToken()!;
			const res = await apiFetch("/summaries/generate", token, {
				method: "POST",
			});
			setCurrent(res.summary);
			await load();
		} catch (e: any) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		load();
	}, []);

	if (loading) return <p>Loading summaries…</p>;

	return (
		<div style={{ display: "flex", gap: 24 }}>
			<aside
				style={{
					width: 260,
					borderRight: "1px solid #ddd",
					paddingRight: 16,
				}}
			>
				<h3>This Week</h3>

				{current ? (
					<button
						style={{
							fontWeight: "bold",
							marginBottom: 12,
						}}
						onClick={() => setCurrent(current)}
					>
						{current.startDate} → {current.endDate}
					</button>
				) : (
					<button onClick={generate} disabled={loading}>
						Generate
					</button>
				)}

				<hr style={{ margin: "16px 0" }} />

				<h3>Past Weeks</h3>

				{list.map((s, i) => {
					const active =
						current &&
						current.startDate === s.startDate &&
						current.endDate === s.endDate;

					return (
						<div key={i} style={{ marginBottom: 8 }}>
							<button
								onClick={() => setCurrent(s)}
								style={{
									fontWeight: active ? "bold" : "normal",
								}}
							>
								{s.startDate} → {s.endDate}
							</button>
						</div>
					);
				})}
			</aside>

			<main style={{ flex: 1 }}>
				{error && <p style={{ color: "red" }}>{error}</p>}

				{current ? (
					<>
						<header
							style={{
								position: "sticky",
								top: 0,
								background: "#fff",
								paddingBottom: 8,
								marginBottom: 16,
								borderBottom: "1px solid #eee",
							}}
						>
							<h2 style={{ marginBottom: 4 }}>Weekly Summary</h2>

							<small style={{ color: "#666" }}>
								{current.startDate} → {current.endDate}
								{current.updatedAt && (
									<>
										{" • "}
										Last updated{" "}
										{new Date(current.updatedAt).toLocaleString()}
									</>
								)}
							</small>
						</header>

						<ReactMarkdown>{current.summaryText}</ReactMarkdown>
					</>
				) : (
					<p>No summary yet.</p>
				)}
			</main>
		</div>
	);
}
