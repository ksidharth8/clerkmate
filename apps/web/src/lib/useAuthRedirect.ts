"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuthRedirect(mode: "login" | "protected") {
	const router = useRouter();
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("clerkmate_token");

		if (mode === "login" && token) {
			router.replace("/dashboard/standups");
			return;
		}

		if (mode === "protected" && !token) {
			router.replace("/login");
			return;
		}

		setReady(true);
	}, [mode, router]);

	return ready;
}
