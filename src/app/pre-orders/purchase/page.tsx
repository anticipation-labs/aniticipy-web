import { parsePendantFinish } from "@/lib/pendant-finish";
import { CustomerFrame } from "@/components/customer/CustomerFrame";
import { PurchaseExperience } from "./PurchaseExperience";
export const metadata = {
  title: "Buy Anticipy",
  description:
    "Choose your Anticipy pendant in titanium silver or gold. Matching chain, charging pad and first year of AI included. Estimated shipping Q4 2026.",
};
export default function PreOrderPurchasePage({
  searchParams,
}: {
  searchParams: { canceled?: string; finish?: string };
}) {
  return (
    <CustomerFrame>
      <PurchaseExperience
        initialFinish={parsePendantFinish(searchParams?.finish) ?? "silver"}
        canceled={searchParams?.canceled === "1"}
      />
    </CustomerFrame>
  );
}
