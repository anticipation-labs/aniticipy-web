import Link from "next/link";
import { CustomerNav } from "./CustomerNav";
import "./customer.css";

export function Arrow() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function CustomerFrame({
  children,
  audience = "shop",
  className = "",
}: {
  children: React.ReactNode;
  audience?: "shop" | "careers" | "investors";
  className?: string;
}) {
  return (
    <div className={`ac-site ${className}`}>
      <a className="ac-skip" href="#page-content">
        Skip to content
      </a>
      <CustomerNav audience={audience} />
      {children}
      <footer className="ac-footer">
        <div className="ac-footer-top">
          <Link className="ac-logo" href="/">
            anticipy<sup>™</sup>
          </Link>
          <p>
            Less on your mind.
            <br />
            More in your life.
          </p>
        </div>
        <div className="ac-footer-links">
          <nav aria-label="Explore Anticipy">
            <Link href="/#experience">The experience</Link>
            <Link href="/#pendant">The pendant</Link>
            <Link href="/app">The app</Link>
            <Link href="/waitlist">Join the waitlist</Link>
            <Link href="/book">Let’s talk</Link>
          </nav>
          <a href="mailto:hello@anticipy.ai">
            hello@anticipy.ai <Arrow />
          </a>
        </div>
        <div className="ac-footer-bottom">
          <span>© 2026 Anticipation Labs</span>
          <nav aria-label="Policies">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/refund">Refunds</Link>
            <Link href="/pre-orders/agreement">Purchase terms</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
