"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

type Summary = {
	startDate: string;
	endDate: string;
	updatedAt?: string;
	summaryText: string;
};

export default function SummariesPage() {
	const [list, setList] = useState<Summary[]>([]);
	const [current, setCurrent] = useState<Summary | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	async function load() {
		try {
			const token = getToken()!;
			const latest = await apiFetch("/summaries/latest", token);
			setCurrent(latest.summary);

			const history = await apiFetch("/summaries", token);
			setList(history.summaries);
		} catch (e: any) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	}

	async function generate() {
		try {
			setLoading(true);
			const token = getToken()!;
			const res = await apiFetch("/summaries/generate", token, {
				method: "POST",
			});
			setCurrent(res.summary);
			await load();
		} catch (e: any) {
			setError(e.message);
		}
	}

	useEffect(() => {
		load();
	}, []);

	if (loading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-10 w-1/3" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}

	const cleaned = current
		? current.summaryText
				.replace(/^###\s*Weekly Summary.*\n?/i, "")
				.replace(/^\*\*\s*Weekly Summary.*\*\*\n?/i, "")
		: "";

	return (
		<div className="flex gap-8">
			{/* Sidebar */}
			<div className="w-72 space-y-4">
				<Card>
					<CardHeader>
						<CardTitle className="text-sm">This Week</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						{current ? (
							<Button
								variant="secondary"
								className="w-full justify-start"
								onClick={() => setCurrent(current)}
							>
								{current.startDate} → {current.endDate}
							</Button>
						) : (
							<Button className="w-full" onClick={generate}>
								Generate Summary
							</Button>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-sm">Past Weeks</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						{list.map((s, i) => {
							const active =
								current &&
								current.startDate === s.startDate &&
								current.endDate === s.endDate;

							return (
								<Button
									key={i}
									variant={active ? "default" : "ghost"}
									className="w-full justify-start text-sm"
									onClick={() => setCurrent(s)}
								>
									{s.startDate} → {s.endDate}
								</Button>
							);
						})}
					</CardContent>
				</Card>
			</div>

			{/* Main Content */}
			<div className="flex-1 space-y-4">
				{error && <p className="text-sm text-destructive">{error}</p>}

				{current ? (
					<Card>
						<CardHeader>
							<CardTitle>Weekly Summary</CardTitle>
							<p className="text-sm text-muted-foreground">
								{current.startDate} → {current.endDate}
								{current.updatedAt && (
									<>
										{" • "}Last updated{" "}
										{new Date(current.updatedAt).toLocaleString()}
									</>
								)}
							</p>
						</CardHeader>

						<Separator />

						<CardContent className="pt-6">
							<div
								className="
		prose dark:prose-invert max-w-none
		prose-headings:font-semibold
		prose-headings:mt-10
		prose-headings:mb-4
		prose-p:leading-relaxed
		prose-p:mb-4
		prose-ul:my-4
		prose-ul:list-disc
		prose-ul:pl-6
		prose-li:my-1
		prose-strong:text-foreground
		"
							>
								<ReactMarkdown remarkPlugins={[remarkGfm]}>
									{cleaned}
								</ReactMarkdown>
							</div>
						</CardContent>
					</Card>
				) : (
					<Card>
						<CardContent className="p-6 text-center text-muted-foreground">
							No summary available.
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
