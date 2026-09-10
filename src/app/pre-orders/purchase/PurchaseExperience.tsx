"use client";
import { useState } from "react";
import Link from "next/link";
import { PurchaseGallery } from "@/components/redesign/PurchaseGallery";
import { type PendantFinish } from "@/lib/pendant-finish";
import { PurchaseForm } from "./PurchaseForm";
import "@/components/redesign/purchase.css";
export function PurchaseExperience({
  initialFinish,
  canceled,
}: {
  initialFinish: PendantFinish;
  canceled: boolean;
}) {
  const [finish, setFinish] = useState(initialFinish);
  return (
    <main id="page-content" tabIndex={-1} className="ac-main ac-enter">
      <div className="ac-breadcrumb">
        <Link href="/">Anticipy</Link>
        <span>/</span>Make it yours
      </div>
      <div className="ac-purchase-grid">
        <div className="ac-purchase-visual">
          <PurchaseGallery finish={finish} priority />
          <div className="ac-purchase-caption">
            <span>Titanium silver. Gold. Your choice.</span>
            <span>Matching chain included.</span>
          </div>
        </div>
        <div className="ac-purchase-copy">
          <p className="ac-eyebrow">Your personal AI action taker</p>
          <h1>Make it yours.</h1>
          <p className="ac-lead">
            A little less to remember. A little more room for life. Your words
            become emails, plans and tasks, with your approval.
          </p>
          <div className="ac-price">
            <strong>$149.99</strong>
            <span>USD</span>
          </div>
          <p className="ac-price-note">
            Projected launch price $199 · First year of AI included
          </p>
          <ul className="ac-included">
            <li>Anticipy pendant & matching chain</li>
            <li>Wireless charging pad</li>
            <li>First year of AI service, starting when it ships</li>
          </ul>
          <PurchaseForm
            initialFinish={initialFinish}
            canceled={canceled}
            onFinishChange={setFinish}
          />
        </div>
      </div>
      <section className="ac-question-section">
        <div>
          <p className="ac-eyebrow">A little clarity</p>
          <h2 style={{ marginTop: 16 }}>Good to know.</h2>
          <p className="ac-aside-link">
            Something else on your mind?
            <br />
            <Link href="/book">Talk with our team ↗</Link>
          </p>
        </div>
        <div className="ac-questions">
          <details>
            <summary>When will my Anticipy arrive?</summary>
            <p>
              Estimated shipping is Q4 2026. We’ll keep you informed as
              manufacturing progresses. You can cancel for a full refund any
              time before your pendant ships.
            </p>
          </details>
          <details>
            <summary>What happens after the first year?</summary>
            <p>
              Continued cloud AI service requires a separate annual opt-in,
              currently projected at $99 USD/year. There is no automatic
              enrollment.{" "}
              <Link className="ac-text-link" href="/pre-orders/agreement">
                Read the purchase terms.
              </Link>
            </p>
          </details>
          <details>
            <summary>Where do you ship?</summary>
            <p>
              Shipping is included for the United States and Canada. If you live
              elsewhere,{" "}
              <Link className="ac-text-link" href="/waitlist">
                join the waitlist
              </Link>{" "}
              for updates.
            </p>
          </details>
          <details>
            <summary>Can I change my mind?</summary>
            <p>
              Yes. Contact hello@anticipy.ai from the email address you ordered
              with to cancel before shipping.{" "}
              <Link className="ac-text-link" href="/refund">
                Read the refund policy.
              </Link>
            </p>
          </details>
        </div>
      </section>
    </main>
  );
}
