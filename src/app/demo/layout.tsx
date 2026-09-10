import { CustomerFrame } from "@/components/customer/CustomerFrame";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <CustomerFrame className="ac-application"><main id="page-content" tabIndex={-1} className="ac-workspace">{children}</main></CustomerFrame>;
}
