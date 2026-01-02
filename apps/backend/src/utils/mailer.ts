import { Resend } from "resend";
import { env } from "../config/env";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendLoginEmail(email: string, token: string) {
	const loginLink = `${env.BACKEND_URL}/auth/verify-link?token=${token}`;

	const text = `
Click the link below to log in to ClerkMate:

${loginLink}

For CLI access, use this token:
${token}

This link expires in 10 minutes.
If you did not request this, ignore this email.
`;

	const html = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<title>ClerkMate Login</title>
</head>
<body style="margin:0;padding:0;background:#f6f7f9;font-family:Arial,Helvetica,sans-serif;">
	<div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:8px;padding:32px;color:#111;">
		<h2 style="margin-top:0;">Sign in to ClerkMate</h2>

		<p style="font-size:14px;line-height:1.6;">
			You requested a secure login link for your ClerkMate account.
		</p>

		<p style="text-align:center;margin:32px 0;">
			<a
				href="${loginLink}"
				style="
					background:#111827;
					color:#ffffff;
					text-decoration:none;
					padding:12px 24px;
					border-radius:6px;
					font-size:14px;
					display:inline-block;
				"
			>
				Log in to ClerkMate
			</a>
		</p>

		<p style="font-size:14px;line-height:1.6;">
			<strong>CLI login token:</strong>
		</p>

		<pre style="
			background:#f3f4f6;
			padding:12px;
			border-radius:6px;
			font-size:13px;
			overflow:auto;
		">${token}</pre>

		<p style="font-size:13px;color:#555;">
			This link expires in <strong>10 minutes</strong>.
			If you did not request this login, you can safely ignore this email.
		</p>

		<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />

		<p style="font-size:12px;color:#777;">
			ClerkMate · Secure CLI Standup Logging
		</p>
	</div>
</body>
</html>
`;

	const { error } = await resend.emails.send({
		from: env.EMAIL_FROM,
		to: [email],
		subject: "Your ClerkMate Login Link",
		text,
		html,
	});

	if (error) {
		console.error(`Failed to send login email to ${email}:`, error);
		throw new Error("Failed to send login email");
	}

	console.info(`Login email sent to ${email}`);
}
