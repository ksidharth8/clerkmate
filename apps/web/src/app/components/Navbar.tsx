"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getToken, clearToken } from "@/lib/auth";
import { ThemeToggle } from "@/app/components/ThemeToggle";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
	const router = useRouter();
	const [hasToken, setHasToken] = useState(false);

	useEffect(() => {
		// initial check
		setHasToken(!!getToken());

		// listen for storage changes
		const handleStorage = () => {
			setHasToken(!!getToken());
		};

		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, []);

	function logout() {
		clearToken();
		setHasToken(false);
		router.push("/login");
	}

	return (
		<header className="border-b bg-background">
			<div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
				<Link href="/" className="text-xl font-semibold tracking-tight">
					ClerkMate
				</Link>

				<div className="flex items-center gap-4">
					<ThemeToggle />

					{hasToken ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
									U
								</button>
							</DropdownMenuTrigger>

							<DropdownMenuContent align="end">
								<DropdownMenuItem
									onClick={() => router.push("/dashboard/standups")}
								>
									Dashboard
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={logout}
									className="text-destructive"
								>
									Logout
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Button size="sm" onClick={() => router.push("/login")}>
							Login
						</Button>
					)}
				</div>
			</div>
		</header>
	);
}
