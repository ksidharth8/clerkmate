"use client";

import { useEffect, useState } from "react";
import "./globals.css";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [theme, setTheme] = useState<"light" | "dark">("light");

	useEffect(() => {
		const saved = localStorage.getItem("theme") as "light" | "dark" | null;
		const system = window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";

		setTheme(saved ?? system);
	}, []);

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
		localStorage.setItem("theme", theme);
	}, [theme]);

	return (
		<html lang="en">
			<body>
				<div data-theme-toggle={theme}>{children}</div>
			</body>
		</html>
	);
}
