"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth";
import { useAuthRedirect } from "@/lib/useAuthRedirect";
import ThemeToggle from "../components/ThemeToggle";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const ready = useAuthRedirect("protected");
	const router = useRouter();

	const [theme, setTheme] = useState<"light" | "dark">("light");

	useEffect(() => {
		const saved = localStorage.getItem("theme") as "light" | "dark" | null;
		if (saved) setTheme(saved);
	}, []);

	function logout() {
		clearToken();
		router.push("/login");
	}

	if (!ready) return <p>Loading…</p>;

	return (
		<div style={{ display: "flex", minHeight: "100vh" }}>
			<aside
				style={{
					width: 220,
					padding: 16,
					borderRight: "1px solid var(--border)",
				}}
			>
				<h3>ClerkMate</h3>

				<ThemeToggle />

				<ul>
					<li>
						<a
							style={{ color: "inherit", textDecoration: "none" }}
							href="/dashboard/standups"
						>
							Standups
						</a>
					</li>
					<li>
						<a
							style={{ color: "inherit", textDecoration: "none" }}
							href="/dashboard/summaries"
						>
							Summaries
						</a>
					</li>
				</ul>

				<button onClick={logout}>Logout</button>
			</aside>

			<main style={{ flex: 1, padding: 20 }}>{children}</main>
		</div>
	);
}
