import { CustomerFrame } from "@/components/customer/CustomerFrame";
export default function OnboardingLayout({children}:{children:React.ReactNode}) {
  return <CustomerFrame className="ac-application"><div id="page-content" tabIndex={-1} className="ac-workspace">{children}</div></CustomerFrame>;
}
