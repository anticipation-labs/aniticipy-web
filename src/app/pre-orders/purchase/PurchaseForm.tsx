"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  capture,
  identifyByEmail,
  attributionIds,
  emailDomainClass,
} from "@/lib/analytics";

import { type PendantFinish, pendantFinishLabel } from "@/lib/pendant-finish";

type FormState = "idle" | "loading" | "error";

export function PurchaseForm({
  canceled,
  initialFinish = "silver",
  onFinishChange,
}: {
  canceled: boolean;
  initialFinish?: PendantFinish;
  onFinishChange?: (finish: PendantFinish) => void;
}) {
  const [finish, setFinish] = useState<PendantFinish>(initialFinish);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [showCanceled, setShowCanceled] = useState(canceled);

  useEffect(() => {
    if (canceled) {
      setShowCanceled(true);
      const timer = setTimeout(() => setShowCanceled(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [canceled]);

  // Top of the checkout funnel. Emitted once on mount so the form-level
  // drop-off (reached the form -> submitted an email) is measurable
  // independently of the redirect to Stripe.
  useEffect(() => {
    capture("checkout_started", {
      entry_point: "purchase_page",
      price_shown_cents: 14999,
      returned_canceled: canceled,
    });
    if (canceled) {
      capture("checkout_returned_canceled", { entry_point: "purchase_page" });
    }
    // Intentionally mount-only: re-firing on `canceled` flips would
    // double-count a single visit to the form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Fires when the visitor leaves the email field with something in it.
   *
   * Deliberately carries NO address and NO local part — only whether it
   * parses and what class of domain it is. Capturing a typed-but-unsubmitted
   * address is the Popa v. Harriet Carter fact pattern, and under PostHog's
   * identified_only model a half-typed address would become a permanent
   * distinct_id that cannot be rewritten later. This gives the abandonment
   * signal without either problem.
   */
  const onEmailBlur = () => {
    const v = email.trim();
    if (!v) return;
    capture("checkout_email_field_completed", {
      form: "purchase",
      email_valid: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v),
      email_domain_class: emailDomainClass(v),
      fields_completed_count: [name.trim(), v].filter(Boolean).length,
    });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowCanceled(false);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      capture("checkout_validation_failed", {
        field: "email",
        reason: "invalid_format",
      });
      return;
    }
    if (!ageConfirmed) {
      setError("You must confirm that you are at least 18 years old.");
      capture("checkout_validation_failed", {
        field: "age_confirmed",
        reason: "unchecked",
      });
      return;
    }
    if (!agreed) {
      setError("Accept the Pre-Order Agreement to continue.");
      capture("checkout_validation_failed", {
        field: "agreement",
        reason: "unchecked",
      });
      return;
    }

    setState("loading");

    // Identify on SUBMIT — never earlier. This is the moment the visitor
    // hands over the address of their own accord, and it is what collapses
    // every anonymous event they have generated so far onto a real person.
    await identifyByEmail(
      trimmedEmail,
      {
        marketing_consent: marketingOptIn === true,
        marketing_consent_at: new Date().toISOString(),
        marketing_consent_source: "purchase_form",
        marketing_consent_copy_version: "v1",
        lifecycle_stage: "checkout_started",
      },
      {
        first_seen_at: new Date().toISOString(),
        first_intent: "purchase",
      },
    );

    capture("checkout_email_submitted", {
      email_domain_class: emailDomainClass(trimmedEmail),
      has_name: Boolean(name.trim()),
      marketing_opt_in: marketingOptIn === true,
    });

    // Carried into Stripe metadata so the webhook can attribute the paid
    // order to this same person server-side. Client-side purchase events are
    // routinely blocked; the webhook is not.
    const { distinctId, sessionId } = attributionIds();

    try {
      const res = await fetch("/api/pre-orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          name: name.trim(),
          finish,
          ageConfirmed: true,
          agreementAccepted: true,
          marketingOptIn,
          posthogDistinctId: distinctId,
          posthogSessionId: sessionId,
        }),
      });

      const data: { url?: string; error?: string } = await res.json();
      if (!res.ok || !data.url) {
        setState("error");
        setError(data.error || "Could not start checkout. Try again.");
        capture("checkout_validation_failed", {
          field: "server",
          reason: data.error?.slice(0, 120) || `http_${res.status}`,
        });
        return;
      }

      // Last event we control before the visitor leaves for Stripe's domain.
      // The gap between this and order_paid from the webhook is the true
      // hosted-checkout drop-off, which nothing client-side can observe.
      capture("checkout_redirected_to_stripe", {
        email_domain_class: emailDomainClass(trimmedEmail),
      });

      window.location.href = data.url;
    } catch {
      setState("error");
      setError("Network error. Try again.");
      capture("checkout_validation_failed", {
        field: "network",
        reason: "fetch_failed",
      });
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="ac-form"
      noValidate
      aria-busy={state === "loading"}
    >
      <fieldset>
        <legend>
          <span>1</span> Choose your finish
        </legend>
        <div className="ac-finish-options">
          {(["silver", "gold"] as const).map((value) => (
            <label className="ac-finish-option" key={value}>
              <input
                type="radio"
                name="finish"
                value={value}
                checked={finish === value}
                onChange={() => {
                  setFinish(value);
                  onFinishChange?.(value);
                }}
              />
              <i
                className={`ac-swatch ac-swatch-${value}`}
                aria-hidden="true"
              />
              {pendantFinishLabel(value)}
              <span className="ac-finish-check" aria-hidden="true">
                {finish === value ? "✓" : ""}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      {showCanceled && (
        <p className="ac-status" role="status">
          Checkout wasn’t completed. You can continue below when you’re ready.
        </p>
      )}
      <div className="ac-form-section">
        <h2>
          <span className="ac-section-number">2</span>Your details
        </h2>
        <div className="ac-fields">
          <label className="ac-field">
            Full name{" "}
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
            <small>Optional</small>
          </label>
          <label className="ac-field">
            Email address{" "}
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={onEmailBlur}
              placeholder="you@example.com"
              required
              autoComplete="email"
              aria-describedby={error ? "purchase-error" : undefined}
            />
            <small>For your order confirmation and shipping updates.</small>
          </label>
        </div>
      </div>
      <div className="ac-form-section">
        <h2>
          <span className="ac-section-number">3</span>Before you continue
        </h2>
        <div className="ac-consents">
          <label className="ac-check">
            <input
              type="checkbox"
              checked={ageConfirmed}
              onChange={(e) => setAgeConfirmed(e.target.checked)}
            />
            <span>
              I confirm I am at least 18 years old and have the legal capacity
              to enter a binding contract in my jurisdiction.
            </span>
          </label>
          <label className="ac-check">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>
              I have read and accept the{" "}
              <a href="/pre-orders/agreement" target="_blank" rel="noopener">
                Pre-Order Agreement
              </a>
              , the{" "}
              <a href="/terms" target="_blank" rel="noopener">
                Terms of Service
              </a>
              , and the{" "}
              <a href="/privacy" target="_blank" rel="noopener">
                Privacy Policy
              </a>
              . I understand the estimated ship date is Q4 2026, that I can
              cancel for a full refund any time before my unit ships, and that
              the Pre-Order Agreement contains a binding arbitration clause and
              class action waiver in Section 14 that affect my legal rights
              (with a 30-day opt-out).
            </span>
          </label>
          <label className="ac-check">
            <input
              type="checkbox"
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
            />
            <span>
              (Optional) Send me product updates. You can unsubscribe at any
              time using the link in every email.
            </span>
          </label>
        </div>
      </div>
      {error && (
        <p
          id="purchase-error"
          className="ac-status ac-status-error"
          role="alert"
        >
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={state === "loading"}
        data-attr="preorder-submit"
        data-cta-id="preorder_submit"
        data-cta-location="purchase"
        data-cta-type="preorder"
        data-cta-style="primary"
        data-cta-label="Continue to payment"
        className="ac-button"
      >
        {state === "loading"
          ? "Opening secure checkout…"
          : "Continue to payment"}
        <span aria-hidden="true">↗</span>
      </button>
      <p className="ac-payment-note">
        $149.99 USD charged today · Secure payment with Stripe
      </p>
      <div className="ac-promises">
        <div>
          Free shipping<span>United States & Canada</span>
        </div>
        <div>
          Fully refundable<span>Before your pendant ships</span>
        </div>
      </div>
      <p className="ac-form-note">
        Estimated shipping Q4 2026. After year one, optional AI service is
        projected at $99 USD/year. No automatic enrollment.
      </p>
    </form>
  );
}
