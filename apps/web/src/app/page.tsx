"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem("clerkmate_token");
		router.replace(token ? "/dashboard/standups" : "/login");
	}, [router]);

	return null;
}
