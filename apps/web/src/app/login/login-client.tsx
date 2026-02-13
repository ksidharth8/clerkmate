"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { clearToken, setToken } from "@/lib/auth";
import { useAuthRedirect } from "@/lib/useAuthRedirect";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [email, setEmail] = useState("");
	const [tokenInput, setTokenInput] = useState("");
	const [step, setStep] = useState<"email" | "emailSent" | "token">("email");
	const [error, setError] = useState("");

	const ready = useAuthRedirect("login");
	const isCli = searchParams.get("source") === "cli";
	const isDone = searchParams.get("done") === "1";

	useEffect(() => {
		const tokenFromUrl = searchParams.get("token");
		if (tokenFromUrl) {
			clearToken();
			setToken(tokenFromUrl);
			router.replace("/dashboard/standups");
		}
	}, [searchParams, router]);

	if (!ready) {
		return (
			<div className="flex items-center justify-center min-h-screen text-muted-foreground">
				Checking session…
			</div>
		);
	}

	async function submitEmail() {
		setError("");
		try {
			await apiFetch("/auth/login", "", {
				method: "POST",
				body: JSON.stringify({ email }),
			});
			setStep("emailSent");
		} catch (e: any) {
			setError(e.message);
		}
	}

	async function submitToken() {
		setError("");
		try {
			const res = await apiFetch("/auth/verify", "", {
				method: "POST",
				body: JSON.stringify({ token: tokenInput }),
			});
			setToken(res.accessToken);
			router.push("/dashboard/standups");
		} catch (e: any) {
			setError(e.message);
		}
	}

	if (isCli && isDone) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Card className="w-full max-w-md text-center">
					<CardHeader>
						<CardTitle>✅ Logged in successfully</CardTitle>
						<CardDescription>Return to your terminal.</CardDescription>
					</CardHeader>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-background px-4 relative">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>ClerkMate Login</CardTitle>
					<CardDescription>
						Sign in to access your standups and summaries
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					{step === "email" && (
						<>
							<Input
								placeholder="Enter your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>

							<Button className="w-full" onClick={submitEmail}>
								Send Login Link
							</Button>

							<Button variant="outline" className="w-full" asChild>
								<a
									href={`${process.env.NEXT_PUBLIC_API_BASE}/auth/google`}
								>
									Continue with Google
								</a>
							</Button>
						</>
					)}

					{step === "emailSent" && (
						<div className="space-y-4 text-sm">
							<p className="text-muted-foreground">
								We've sent a login link to your email.
							</p>

							<Button variant="secondary" className="w-full" asChild>
								<a
									href="https://mail.google.com"
									target="_blank"
									rel="noreferrer"
								>
									Open Gmail
								</a>
							</Button>

							<div className="text-center text-muted-foreground">Or</div>

							<Button
								variant="outline"
								className="w-full"
								onClick={() => setStep("token")}
							>
								Enter token manually
							</Button>
						</div>
					)}

					{step === "token" && (
						<>
							<Input
								placeholder="Paste login token"
								value={tokenInput}
								onChange={(e) => setTokenInput(e.target.value)}
							/>

							<Button className="w-full" onClick={submitToken}>
								Verify
							</Button>
						</>
					)}

					{error && <p className="text-sm text-destructive">{error}</p>}
				</CardContent>
			</Card>
		</div>
	);
}
