function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const ENV = {
  API_BASE_URL: process.env.API_BASE_URL ?? 'https://clerkmate.onrender.com',
  FRONTEND_URL: process.env.FRONTEND_URL ?? 'https://clerkmate.vercel.app',
};
