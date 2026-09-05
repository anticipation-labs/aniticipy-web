import type { Metadata } from "next";

// FIX 2026-09-05: the OpenNext/Cloudflare worker resolves the literal route
// "/app" to the root homepage (route-name collision with the app-router dir).
// This alias renders the real app page from a non-colliding path; middleware
// rewrites /app -> /enter so the public URL stays /app. See src/middleware.ts.
export const metadata: Metadata = {
  title: "Anticipy App",
  description:
    "Open Anticipy, install the local Mac engine, and connect the private on-device assistant to the public app shell.",
  alternates: { canonical: "https://www.anticipy.ai/app" },
  openGraph: {
    title: "Anticipy App",
    description:
      "The public Anticipy app shell plus the private local Mac engine.",
    url: "https://www.anticipy.ai/app",
  },
  robots: { index: false, follow: false },
};

export default function EnterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
