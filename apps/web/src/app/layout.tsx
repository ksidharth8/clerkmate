"use client";

import "./globals.css";
import { Navbar } from "@/app/components/Navbar";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="min-h-screen flex flex-col bg-background text-foreground">
				<Navbar />

				<main className="flex-1">{children}</main>
			</body>
		</html>
	);
}
