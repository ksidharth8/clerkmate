"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useAuthRedirect } from "@/lib/useAuthRedirect";
import ThemeToggle from "../components/ThemeToggle";

export default function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [email, setEmail] = useState("");
	const [tokenInput, setTokenInput] = useState("");
	const [step, setStep] = useState<"email" | "emailSent" | "token">("email");
	const [error, setError] = useState("");

	const ready = useAuthRedirect("login");

	useEffect(() => {
		const tokenFromUrl = searchParams.get("token");
		if (tokenFromUrl) {
			setToken(tokenFromUrl);
			router.replace("/dashboard/standups");
		}
	}, [searchParams, router]);

	if (!ready) {
		return <p>Checking session…</p>;
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

	return (
		<main style={{ padding: 40, position: "relative" }}>
			<div style={{ position: "absolute", top: 16, right: 16 }}>
				<ThemeToggle />
			</div>

			<h1>ClerkMate Login</h1>

			{step === "email" && (
				<>
					<input
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<button onClick={submitEmail}>Send Login Token</button>
				</>
			)}

			{step === "token" && (
				<>
					<input
						placeholder="Paste login token"
						value={tokenInput}
						onChange={(e) => setTokenInput(e.target.value)}
					/>
					<button onClick={submitToken}>Verify</button>
				</>
			)}

			{step === "emailSent" && (
				<>
					<p>We've sent a login link to your email.</p>
					<p>Click the link to sign in.</p>

					<a
						style={{ textDecoration: "none", color: "inherit" }}
						href="https://mail.google.com"
						target="_blank"
						rel="noreferrer"
					>
						Open Gmail
					</a>

					<p style={{ marginTop: 16 }}>Or paste the token manually:</p>
					<button onClick={() => setStep("token")}>
						Enter token manually
					</button>
				</>
			)}

			{error && <p style={{ color: "red" }}>{error}</p>}
		</main>
	);
}
