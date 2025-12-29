const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

type RequestInit = Parameters<typeof fetch>[1];

export async function apiFetch(
	path: string,
	token: string,
	options: RequestInit = {}
) {
	const res = await fetch(`${API_BASE}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(token && { Authorization: `Bearer ${token}` }),
			...options.headers,
		},
	});

	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.error || "Request failed");
	}

	return res.json();
}
