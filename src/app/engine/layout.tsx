import { CustomerFrame } from "@/components/customer/CustomerFrame";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Action Engine | Anticipy",
  description:
    "Try Anticipy's AI action engine. Give it a task in plain English and watch it complete the task on real websites autonomously.",
  openGraph: {
    title: "Action Engine | Anticipy",
    description:
      "AI agent that completes real tasks on real websites. Just tell it what you need.",
    url: "https://www.anticipy.ai/engine",
    siteName: "Anticipy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Action Engine | Anticipy",
    description:
      "AI agent that completes real tasks on real websites. Just tell it what you need.",
  },
};

export default function EngineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CustomerFrame className="ac-application"><main id="page-content" tabIndex={-1} className="ac-workspace">{children}</main></CustomerFrame>;
}
