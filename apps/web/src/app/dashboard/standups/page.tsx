"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StandupsPage() {
	const [standups, setStandups] = useState<any[]>([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function load() {
			try {
				const token = getToken()!;
				const res = await apiFetch("/standups", token);
				setStandups(res.standups);
			} catch (e: any) {
				setError(e.message);
			} finally {
				setLoading(false);
			}
		}
		load();
	}, []);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">
					Recent Standups
				</h1>
				<p className="text-muted-foreground text-sm">
					Your logged daily progress updates
				</p>
			</div>

			{error && <p className="text-sm text-destructive">{error}</p>}

			{loading && (
				<div className="space-y-4">
					<Skeleton className="h-32 w-full" />
					<Skeleton className="h-32 w-full" />
					<Skeleton className="h-32 w-full" />
				</div>
			)}

			{!loading && standups.length === 0 && (
				<Card>
					<CardContent className="p-6 text-center text-muted-foreground">
						No standups found.
					</CardContent>
				</Card>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
				{standups.map((s) => (
					<Card
						key={s._id}
						className="
			h-full
			transition-all
			duration-200
			hover:shadow-xl hover:border-primary/20
			hover:-translate-y-1
			border
		"
					>
						<CardHeader className="pb-2 flex flex-row items-center justify-between">
							<CardTitle className="text-md font-medium text-muted-foreground">
								Standup
							</CardTitle>

							<span
								className="
					text-sm
					px-2 py-1
					rounded-md
					bg-muted
					text-muted-foreground
					font-medium
				"
							>
								{s.date}
							</span>
						</CardHeader>

						<CardContent className="space-y-2 text-sm leading-snug">
							<div>
								<p className="font-semibold text-foreground">
									Yesterday
								</p>
								<p className="text-muted-foreground line-clamp-3">
									{s.yesterday}
								</p>
							</div>

							<div>
								<p className="font-semibold text-foreground">Today</p>
								<p className="text-muted-foreground line-clamp-3">
									{s.today}
								</p>
							</div>

							<div>
								<p className="font-semibold text-foreground">
									Blockers
								</p>
								<p className="text-muted-foreground line-clamp-2">
									{s.blockers || "None"}
								</p>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
