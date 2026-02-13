"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
	const router = useRouter();
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("clerkmate_token");

		if (token) {
			router.replace("/dashboard/standups");
		} else {
			setReady(true);
		}
	}, [router]);

	if (!ready) return null;

	return (
		<div className="flex flex-col min-h-[calc(100vh-56px)]">
			{/* HERO */}
			<section className="flex flex-col items-center justify-center text-center px-6 py-28 space-y-6">
				<h1 className="text-5xl font-bold tracking-tight">
					Developer Standups,
					<br />
					Supercharged with AI
				</h1>

				<p className="text-muted-foreground max-w-2xl">
					Log your daily work from the terminal. Automatically generate
					structured weekly summaries. Stay consistent, organized, and
					accountable.
				</p>

				<Button size="lg" onClick={() => router.push("/login")}>
					Get Started
				</Button>
			</section>

			{/* FEATURES */}
			<section className="bg-muted py-20">
				<div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
					<Card>
						<CardContent className="p-6 space-y-3">
							<h3 className="font-semibold">CLI-first Workflow</h3>
							<p className="text-sm text-muted-foreground">
								Log daily standups directly from your terminal without
								context switching.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6 space-y-3">
							<h3 className="font-semibold">AI Weekly Summaries</h3>
							<p className="text-sm text-muted-foreground">
								Generate structured summaries based on real logged work.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6 space-y-3">
							<h3 className="font-semibold">Offline-first Sync</h3>
							<p className="text-sm text-muted-foreground">
								Work locally. Sync securely. Your workflow stays
								uninterrupted.
							</p>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* FOOTER */}
			<footer className="mt-auto border-t py-8 text-center text-sm text-muted-foreground">
				© {new Date().getFullYear()} ClerkMate. Built for developers.
			</footer>
		</div>
	);
}
