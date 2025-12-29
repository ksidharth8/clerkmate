"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth";
import { useAuthRedirect } from "@/lib/useAuthRedirect";

export default function DashboardLayout({ children }: { children: ReactNode }) {
	const router = useRouter();
	const ready = useAuthRedirect("protected");

	if (!ready) return <p>Loading…</p>;

	function logout() {
		clearToken();
		router.push("/login");
	}

	return (
		<div style={{ display: "flex", minHeight: "100vh" }}>
			<aside
				style={{
					width: 200,
					padding: 20,
					borderRight: "1px solid #ccc",
				}}
			>
				<h3>ClerkMate</h3>

				<ul>
					<li>
						<a href="/dashboard/standups">Standups</a>
					</li>
					<li>
						<a href="/dashboard/summaries">Summaries</a>
					</li>
				</ul>

				<button onClick={logout}>Logout</button>
			</aside>

			<main style={{ flex: 1, padding: 20 }}>{children}</main>
		</div>
	);
}

function ThemeToggle() {
	const [theme, setTheme] = useState<"light" | "dark">(
		(typeof window !== "undefined" &&
			(localStorage.getItem("theme") as "light" | "dark")) ||
			"light"
	);

	function toggle() {
		const next = theme === "light" ? "dark" : "light";
		setTheme(next);
		localStorage.setItem("theme", next);
		document.documentElement.dataset.theme = next;
	}

	return (
		<button onClick={toggle} aria-label="Toggle theme">
			{theme === "light" ? "🌙" : "☀️"}
		</button>
	);
}
