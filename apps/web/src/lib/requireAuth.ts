import { getToken } from "./auth";

export function requireAuth() {
	const token = getToken();
	if (!token) {
		window.location.href = "/login";
	}
	return token;
}
