import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CliSuccessPage() {
	return (
		<div className="flex items-center justify-center min-h-[70vh] px-4">
			<Card className="w-full max-w-md text-center">
				<CardHeader>
					<CardTitle>✅ Logged in successfully</CardTitle>
				</CardHeader>

				<CardContent className="text-muted-foreground">
					Return to your terminal to continue.
				</CardContent>
			</Card>
		</div>
	);
}
