"use client";
import Link from "next/link";
import { useRef, useState } from "react";
export function CustomerNav({
  audience = "shop",
}: {
  audience?: "shop" | "careers" | "investors";
}) {
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const links =
    audience === "investors"
      ? [
          ["Meet Anticipy", "/"],
          ["Book a call", "#book-a-call"],
          ["Stay in touch", "#investor-interest"],
        ]
      : audience === "careers"
        ? [
            ["Open roles", "/apply"],
            ["Meet Anticipy", "/"],
            ["Let’s talk", "/book"],
          ]
        : [
            ["The experience", "/#experience"],
            ["The pendant", "/#pendant"],
            ["Your privacy", "/privacy"],
          ];
  return (
    <header
      className="ac-nav"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          toggleRef.current?.focus();
        }
      }}
    >
      <Link className="ac-logo" href="/" aria-label="Anticipy home">
        anticipy<sup>™</sup>
      </Link>
      <nav className="ac-nav-links" aria-label="Main navigation">
        {links.map(([label, href]) => (
          <Link href={href} key={href}>
            {label}
          </Link>
        ))}
      </nav>
      <div className="ac-nav-actions">
        <Link
          className="ac-button ac-button-small"
          href={
            audience === "investors"
              ? "#book-a-call"
              : audience === "careers"
                ? "/apply"
                : "/pre-orders/purchase"
          }
        >
          {audience === "investors"
            ? "Let’s talk"
            : audience === "careers"
              ? "Open roles"
              : "Buy Now"}
          <span aria-hidden="true">↗</span>
        </Link>
        <button
          ref={toggleRef}
          className="ac-menu-toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="customer-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span aria-hidden="true">{open ? "×" : "="}</span>
        </button>
      </div>
      {open && (
        <nav
          id="customer-menu"
          className="ac-menu"
          aria-label="More navigation"
        >
          {[
            ...links,
            ["The app", "/app"],
            ["Waitlist", "/waitlist"],
            ["Compare", "/compare"],
          ].map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setOpen(false)}>
              {label}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
