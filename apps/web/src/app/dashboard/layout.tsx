"use client";

import { useRouter, usePathname } from "next/navigation";
import { clearToken } from "@/lib/auth";
import { useAuthRedirect } from "@/lib/useAuthRedirect";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "../components/ThemeToggle";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const ready = useAuthRedirect("protected");
	const router = useRouter();
	const pathname = usePathname();

	function logout() {
		clearToken();
		router.push("/login");
	}

	if (!ready) {
		return (
			<div className="flex items-center justify-center min-h-screen text-muted-foreground">
				Loading...
			</div>
		);
	}

	const navItems = [
		{ href: "/dashboard/standups", label: "Standups" },
		{ href: "/dashboard/summaries", label: "Summaries" },
	];

	return (
		<div className="flex">
			{/* Sidebar */}
			<aside className="w-64 border-r bg-muted/40">
				<div className="p-6 space-y-6">
					<nav className="space-y-2">
						{navItems.map((item) => (
							<Button
								key={item.href}
								asChild
								variant={pathname === item.href ? "default" : "ghost"}
								className="w-full justify-start"
							>
								<Link href={item.href}>{item.label}</Link>
							</Button>
						))}
					</nav>
				</div>
			</aside>

			{/* Main Content */}
			<main className="flex-1">
				<div className="max-w-5xl mx-auto px-6 py-10">{children}</div>
			</main>
		</div>
	);
}
