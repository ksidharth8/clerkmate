"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";

export default function StandupsPage() {
	const [standups, setStandups] = useState<any[]>([]);
	const [error, setError] = useState("");

	useEffect(() => {
		async function load() {
			try {
				const token = getToken()!;
				const res = await apiFetch("/standups", token);
				setStandups(res.standups);
			} catch (e: any) {
				setError(e.message);
			}
		}
		load();
	}, []);

	return (
		<div>
			<h2>Recent Standups</h2>

			{error && <p style={{ color: "red" }}>{error}</p>}

			{standups.map((s) => (
				<div
					key={s._id}
					style={{ borderBottom: "1px solid #ddd", marginBottom: 12 }}
				>
					<strong>{s.date}</strong>
					<p>
						<b>Yesterday:</b> {s.yesterday}
					</p>
					<p>
						<b>Today:</b> {s.today}
					</p>
					<p>
						<b>Blockers:</b> {s.blockers}
					</p>
				</div>
			))}
		</div>
	);
}
