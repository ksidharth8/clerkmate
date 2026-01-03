import { Suspense } from "react";
import LoginClient from "./login-client";

export default function CliLoginPage() {
	return (
		<Suspense fallback={<p>Loading login session...</p>}>
			<LoginClient />
		</Suspense>
	);
}
