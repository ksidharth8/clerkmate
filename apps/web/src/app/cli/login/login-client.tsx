"use client";

import { useSearchParams } from "next/navigation";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginClient() {
	const searchParams = useSearchParams();
	const session = searchParams.get("session");

	if (!session) {
		return (
			<div className="flex items-center justify-center min-h-[70vh]">
				<Card className="w-full max-w-md">
					<CardContent className="p-6 text-center text-destructive">
						Invalid CLI login session.
					</CardContent>
				</Card>
			</div>
		);
	}

	const googleLoginUrl = `${process.env.NEXT_PUBLIC_API_BASE}/auth/google?session=${session}`;

	return (
		<div className="flex items-center justify-center min-h-[70vh] px-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Sign in to ClerkMate (CLI)</CardTitle>
					<CardDescription>
						This login will authenticate your CLI session.
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					<Button asChild className="w-full">
						<a href={googleLoginUrl}>Continue with Google</a>
					</Button>

					<p className="text-xs text-muted-foreground text-center">
						After login, return to your terminal.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
