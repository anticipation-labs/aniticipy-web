import {
  type PendantFinish,
  parsePendantFinish,
  pendantFinishLabel,
} from "@/lib/pendant-finish";
import Link from "next/link";
import { CustomerFrame, Arrow } from "@/components/customer/CustomerFrame";
import { FINISHES } from "@/components/redesign/pendant-design";
import type { Metadata } from "next";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Anticipy order",
  description:
    "Your Anticipy pre-order is confirmed. Thank you for being early.",
  robots: { index: false, follow: false },
};

type Session = {
  finish: PendantFinish | null;
  email: string | null;
  amount: number;
  currency: string;
  name: string | null;
  city: string | null;
  state: string | null;
};

async function loadSession(
  sessionId: string | undefined,
): Promise<Session | null> {
  if (!sessionId || !sessionId.startsWith("cs_")) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (
      session.payment_status !== "paid" ||
      session.metadata?.product_type !== "preorder"
    )
      return null;
    return {
      finish: parsePendantFinish(session.metadata?.pendant_finish),
      email: session.customer_details?.email ?? session.customer_email ?? null,
      amount: session.amount_total ?? 0,
      currency: session.currency ?? "usd",
      name:
        session.customer_details?.name ??
        session.collected_information?.shipping_details?.name ??
        null,
      city:
        session.collected_information?.shipping_details?.address?.city ?? null,
      state:
        session.collected_information?.shipping_details?.address?.state ?? null,
    };
  } catch {
    return null;
  }
}

export default async function PreOrderSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const session = await loadSession(searchParams?.session_id);
  const firstName = session?.name?.split(" ")[0];
  return (
    <CustomerFrame>
      <main id="page-content" tabIndex={-1} className="ac-split-page ac-enter">
        <div className="ac-split-copy">
          <p className="ac-eyebrow">Your Anticipy</p>
          {session ? (
            <>
              <div
                className="ac-success-mark"
                style={{ marginTop: 28 }}
                aria-hidden="true"
              >
                ✓
              </div>
              <h1>
                {firstName
                  ? `Thank you, ${firstName}.`
                  : "It’s a little closer."}
              </h1>
              <p className="ac-lead">
                Your Anticipy order is confirmed. A little more room for life is
                on its way.
              </p>
              <dl className="ac-summary-list">
                <div>
                  <dt>Amount paid</dt>
                  <dd>
                    ${(session.amount / 100).toFixed(2)}{" "}
                    {session.currency.toUpperCase()}
                  </dd>
                </div>
                {session.finish && (
                  <div>
                    <dt>Your finish</dt>
                    <dd>{pendantFinishLabel(session.finish)}</dd>
                  </div>
                )}
                {session.email && (
                  <div>
                    <dt>Order email</dt>
                    <dd>{session.email}</dd>
                  </div>
                )}
                <div>
                  <dt>Estimated shipping</dt>
                  <dd>Q4 2026</dd>
                </div>
              </dl>
              <p className="ac-form-note">
                We’ll email you as manufacturing progresses and confirm your
                shipping details before your pendant is sent. You can cancel for
                a full refund any time before it ships.
              </p>
            </>
          ) : (
            <>
              <h1>
                Let’s check
                <br />
                your order.
              </h1>
              <p className="ac-lead">
                We couldn’t verify a completed payment from this link. If you
                just checked out, look for your confirmation email before
                placing another order.
              </p>
              <p className="ac-aside-link">
                Need a hand?
                <br />
                <a href="mailto:hello@anticipy.ai">hello@anticipy.ai ↗</a>
              </p>
            </>
          )}
          <div className="ac-action-row">
            <Link className="ac-button" href="/">
              Back to Anticipy <Arrow />
            </Link>
            <Link className="ac-text-link" href="/pre-orders/agreement">
              Purchase terms
            </Link>
          </div>
        </div>
        <figure className="ac-split-photo">
          <img
            src={
              session?.finish
                ? FINISHES[session.finish].stone
                : "/redesign/purchase-both-finishes.webp"
            }
            alt={
              session?.finish
                ? `${pendantFinishLabel(session.finish)} Anticipy pendant with a seamless brushed casing`
                : "Titanium silver and gold Anticipy pendants with matching chains"
            }
            width="1600"
            height="1600"
          />
          <figcaption>
            <span>Small object. Real possibility.</span>
          </figcaption>
        </figure>
      </main>
    </CustomerFrame>
  );
}
