export function setToken(token: string) {
	localStorage.setItem("clerkmate_token", token);
}

export function getToken() {
	return localStorage.getItem("clerkmate_token");
}

export function clearToken() {
	localStorage.removeItem("clerkmate_token");
}
