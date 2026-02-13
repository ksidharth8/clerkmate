import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
	const [theme, setTheme] = useState<"light" | "dark">("light");

	useEffect(() => {
		const saved = localStorage.getItem("theme") as "light" | "dark" | null;
		const system = window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";

		const initial = saved ?? system;
		setTheme(initial);

		if (initial === "dark") {
			document.documentElement.classList.add("dark");
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("theme", theme);

		if (theme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [theme]);

	return (
		<button
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			className="text-muted-foreground hover:text-foreground transition-colors"
		>
			{theme === "dark" ? (
				<Sun className="h-5 w-5" />
			) : (
				<Moon className="h-5 w-5" />
			)}
		</button>
	);
}
