"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { CustomerFrame, Arrow } from "@/components/customer/CustomerFrame";
type FormState = "idle" | "loading" | "success" | "duplicate" | "error";
export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const confirmationRef = useRef<HTMLHeadingElement>(null);
  const done = state === "success" || state === "duplicate";
  useEffect(() => {
    if (done) confirmationRef.current?.focus();
  }, [done]);
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError("Enter a valid email address.");
      setState("error");
      return;
    }
    setState("loading");
    setError("");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      if (response.ok) setState("success");
      else if (response.status === 409) setState("duplicate");
      else {
        setState("error");
        setError(
          response.status === 429
            ? "Too many attempts. Please try again later."
            : "We couldn’t add you just now. Please try again.",
        );
      }
    } catch {
      setState("error");
      setError("We couldn’t connect. Check your connection and try again.");
    }
  }
  return (
    <CustomerFrame>
      <main id="page-content" tabIndex={-1} className="ac-split-page ac-enter">
        <div className="ac-split-copy">
          <p className="ac-eyebrow">A little ahead. Together.</p>
          {done ? (
            <div role="status">
              <div
                className="ac-success-mark"
                style={{ marginTop: 28 }}
                aria-hidden="true"
              >
                ✓
              </div>
              <h1 ref={confirmationRef} tabIndex={-1}>
                {state === "duplicate"
                  ? "Already in good company."
                  : "You’re on the list."}
              </h1>
              <p className="ac-lead">
                {state === "duplicate"
                  ? "We already have your email. You’ll hear from us when there’s news to share."
                  : "We’ll keep you close to what’s next: product news, launch updates and the moments that matter."}
              </p>
              <div className="ac-action-row">
                <Link href="/" className="ac-button">
                  Explore Anticipy <Arrow />
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h1>
                Be part of
                <br />
                what’s next.
              </h1>
              <p className="ac-lead">
                Meet the pendant that turns your words into action. Leave your
                email for updates as we bring Anticipy into the world.
              </p>
              <form
                className="ac-form"
                onSubmit={handleSubmit}
                noValidate
                aria-busy={state === "loading"}
              >
                <label className="ac-field">
                  Email address
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    aria-invalid={state === "error"}
                    aria-describedby={
                      error ? "waitlist-error" : "waitlist-privacy"
                    }
                  />
                </label>
                {error && (
                  <p
                    id="waitlist-error"
                    className="ac-status ac-status-error"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  className="ac-button"
                  disabled={state === "loading"}
                >
                  {state === "loading" ? "Joining…" : "Join the waitlist"}
                  <Arrow />
                </button>
                <p id="waitlist-privacy" className="ac-form-note">
                  Product and launch updates. Unsubscribe any time. Read our{" "}
                  <Link href="/privacy">privacy policy</Link>.
                </p>
              </form>
              <p className="ac-aside-link">
                Ready to make it yours?
                <br />
                <Link href="/pre-orders/purchase">Choose your Anticipy ↗</Link>
              </p>
            </>
          )}
        </div>
        <figure className="ac-split-photo">
          <img
            src="/redesign/purchase-gold-worn.webp"
            alt="Gold Anticipy pendant worn on a fine chain with a dark top in natural window light"
            width="1600"
            height="1600"
          />
          <figcaption>
            <span>Personal AI. Worn.</span>
            <span>Gold finish</span>
          </figcaption>
        </figure>
      </main>
    </CustomerFrame>
  );
}
