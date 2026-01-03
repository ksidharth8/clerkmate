"use client";

import { useSearchParams } from "next/navigation";

export default function CliLoginPage() {
  const searchParams = useSearchParams();
  const session = searchParams.get("session");

  if (!session) {
    return <p>Invalid CLI login session.</p>;
  }

  const googleLoginUrl =
    `${process.env.NEXT_PUBLIC_API_BASE}/auth/google?session=${session}`;

  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h2>Sign in to ClerkMate (CLI)</h2>

      <a href={googleLoginUrl}>
        <button style={{ marginTop: 20 }}>
          Continue with Google
        </button>
      </a>

      <p style={{ marginTop: 20 }}>
        This login will authenticate your CLI.
      </p>
    </div>
  );
}
