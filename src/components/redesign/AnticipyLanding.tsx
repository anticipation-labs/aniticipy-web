"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import "./landing.css";
import "./revision.css";
import "./conversion.css";
import { PendantScene, type PendantSceneHandle } from "./PendantScene";

const STORE = "https://www.anticipy.ai";
const STEPS = [
  {
    title: "You say it.",
    subtitle: "No new habit required.",
    text: "A promise over coffee. An idea on a walk. Talk naturally. Anticipy catches the things you mean to do.",
  },
  {
    title: "It connects the dots.",
    subtitle: "Context makes the difference.",
    text: "The person, the timing, the correction you made halfway through. Your words become a clear next step, ready for your review.",
  },
  {
    title: "You give the go-ahead.",
    subtitle: "Your say. Every step of the way.",
    text: "Review the action. Approve it when it’s right. Anticipy follows through and keeps a receipt, so you know it’s done.",
  },
];
const BENEFITS = [
  {
    title: (
      <>
        A thought.
        <br />A little follow-through.
      </>
    ),
    label: "A MOMENT, REMEMBERED",
    title2: "Send Marcus the notes.",
    text: "The promise you made over coffee, ready when you are.",
    note: "Catch the things you mean to do.",
  },
  {
    title: (
      <>
        Your words.
        <br />
        The whole picture.
      </>
    ),
    label: "THE CONTEXT MATTERS",
    title2: "Leave out the budget slide.",
    text: "The small correction that makes the next step the right one.",
    note: "Keep the detail that makes it yours.",
  },
  {
    title: (
      <>
        Your decision.
        <br />A little less to do.
      </>
    ),
    label: "READY FOR YOUR REVIEW",
    title2: "Looks right? Give it the go-ahead.",
    text: "Review the action, approve it, and keep a record of the result.",
    note: "You stay in charge. Always.",
  },
];
const HARDWARE = [
  {
    title: (
      <>
        Quietly
        <br />
        sculpted.
      </>
    ),
    subtitle: "A small presence. A considered shape.",
    bullets: [
      "A continuous, domed silhouette",
      "A tactile brushed metal finish",
      "A fine chain at the shoulders",
    ],
    tag: "THE OUTSIDE",
    label: "Brushed titanium",
    caption: "A softer side of technology.",
  },
  {
    title: (
      <>
        Intelligence,
        <br />
        within.
      </>
    ),
    subtitle: "One closed form. A closer look beneath it.",
    bullets: [
      "A continuous, closed enclosure",
      "The intelligence at its centre",
      "A technical view beneath the surface",
    ],
    tag: "THE INSIDE",
    label: "Beneath the surface",
    caption: "Thoughtful on the inside, too.",
  },
  {
    title: (
      <>
        Designed
        <br />
        around you.
      </>
    ),
    subtitle: "Technology that gives you the say.",
    bullets: [
      "Review actions before they happen",
      "Choose how your information is used",
      "See a record of what gets done",
    ],
    tag: "THE DETAIL",
    label: "Your control",
    caption: "A clear view. A clear next step.",
  },
  {
    title: (
      <>
        Back to
        <br />
        your day.
      </>
    ),
    subtitle: "All that possibility. One little object.",
    bullets: [
      "Wear it on a fine chain",
      "Keep the moment in the real world",
      "Let a good thought become a next step",
    ],
    tag: "THE EVERYDAY",
    label: "Made to be with you",
    caption: "Less on your mind. More in your life.",
  },
];
const FAQ = [
  [
    "What is Anticipy?",
    "Anticipy is a titanium AI pendant built to turn spoken commitments into completed actions. It helps capture what you mean to do, prepares the next step, asks for your approval, and keeps a verified record of the result.",
  ],
  [
    "What’s included in the pre-order?",
    "The titanium pendant, matching necklace chain, wireless charging pad, and your first year of AI service. The current pre-order is $149.99 USD, with free shipping in the US and Canada. The projected launch price is $199.",
  ],
  [
    "Is there an AI service subscription?",
    "Your first year is included, starting when your pendant ships. After that, continued cloud AI service requires a separate annual opt-in, currently projected at $99 USD/year. You will not be automatically enrolled.",
  ],
  [
    "When will my Anticipy arrive?",
    "The current shipping window is Q4 2026. You’ll receive an order number after purchase, build updates along the way, and tracking when your unit ships.",
  ],
  [
    "Who decides what it can do?",
    "You do. Actions are shown to you before they happen. You set the rules for your audio, and you can see, export, or delete your information. Visit the privacy policy for the details.",
  ],
  [
    "Can I change my mind?",
    "Yes. Pre-orders are fully refundable any time before shipping. Contact hello@anticipy.ai to request a refund.",
  ],
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function Mark({ type }: { type: "sound" | "context" | "check" | "shield" }) {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {type === "sound" ? (
          <path d="M4 12v4m5-8v12m5-17v22m5-17v12m5-8v4" />
        ) : type === "context" ? (
          <>
            <rect x="3" y="3" width="8" height="8" rx="2" />
            <rect x="17" y="17" width="8" height="8" rx="2" />
            <path d="M7 15v6h6M21 13V7h-6" />
          </>
        ) : type === "shield" ? (
          <>
            <path d="m14 3 9 4v7c0 6-9 11-9 11S5 20 5 14V7Z" />
            <path d="m10 14 3 3 6-6" />
          </>
        ) : (
          <>
            <circle cx="14" cy="14" r="11" />
            <path d="m8 14 4 4 8-8" />
          </>
        )}
      </g>
    </svg>
  );
}
function Button({
  children,
  href,
  pale = false,
  ctaId = "pendant-preorder",
}: {
  children: React.ReactNode;
  href: string;
  pale?: boolean;
  ctaId?: string;
}) {
  return (
    <a
      className={"ap-button" + (pale ? " ap-button-pale" : "")}
      href={href}
      data-cta-id={ctaId}
      data-cta-type="preorder"
    >
      {children}
      <span>
        <Arrow diagonal />
      </span>
    </a>
  );
}

export function AnticipyLanding({ preview = false }: { preview?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const story = useRef<HTMLElement>(null);
  const hardware = useRef<HTMLElement>(null);
  const benefits = useRef<HTMLElement>(null);
  const hardwareScene = useRef<PendantSceneHandle>(null);
  const benefitScene = useRef<PendantSceneHandle>(null);
  const [benefitStep, setBenefitStep] = useState(0);
  const [hardwareStep, setHardwareStep] = useState(0);
  const [menu, setMenu] = useState(false);
  const [intro, setIntro] = useState(true);
  const [step, setStep] = useState(0);
  const [approved, setApproved] = useState(false);
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState("idle");
  const [motion, setMotion] = useState(true);
  const [systemReduced, setSystemReduced] = useState(false);
  const menuDestination = useRef<string | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setMotion(!query.matches);
    setSystemReduced(query.matches);
    const onPreference = () => {
      setMotion(!query.matches);
      setSystemReduced(query.matches);
    };
    query.addEventListener("change", onPreference);
    const timer = window.setTimeout(
      () => setIntro(false),
      query.matches || window.location.hash ? 0 : 1300,
    );
    return () => {
      window.clearTimeout(timer);
      query.removeEventListener("change", onPreference);
    };
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let frame = 0;
    const clamp = (n: number) => Math.max(0, Math.min(1, n));
    const update = () => {
      frame = 0;
      const h = window.innerHeight;
      el.classList.toggle("ap-scrolled", window.scrollY > 90);
      const heroProgress = clamp(window.scrollY / h);
      el.style.setProperty(
        "--hero-progress",
        motion ? String(heroProgress) : "0",
      );
      if (
        story.current &&
        motion &&
        window.innerWidth > 800 &&
        window.innerHeight >= 680
      ) {
        const rect = story.current.getBoundingClientRect();
        const p = clamp(-rect.top / Math.max(1, rect.height - h));
        setStep(Math.min(2, Math.floor(p * 3)));
        story.current.style.setProperty("--story-progress", String(p));
      }
      for (const [section, scene, count, setStage, property] of [
        [benefits, benefitScene, 3, setBenefitStep, "--benefit-progress"],
        [hardware, hardwareScene, 4, setHardwareStep, "--hardware-progress"],
      ] as const) {
        if (!section.current || !motion || h < 680) continue;
        const rect = section.current.getBoundingClientRect();
        const stageHeight =
          section.current.firstElementChild?.getBoundingClientRect().height ??
          h;
        const stickyTop =
          parseFloat(
            getComputedStyle(section.current.firstElementChild as Element).top,
          ) || 0;
        const p = clamp(
          (stickyTop - rect.top) / Math.max(1, rect.height - stageHeight),
        );
        section.current.style.setProperty(property, String(p));
        scene.current?.setProgress(p);
        setStage(Math.min(count - 1, Math.floor(p * count)));
      }
    };
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("ap-in-view");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    el.querySelectorAll(".ap-reveal").forEach((node) => observer.observe(node));
    update();
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [motion]);

  useEffect(() => {
    let navigationTimer: number | undefined;
    if (menu) dialog.current?.showModal();
    else if (dialog.current?.open) {
      dialog.current.close();
      if (menuDestination.current) {
        const destination = document.getElementById(menuDestination.current);
        destination?.focus({ preventScroll: true });
        navigationTimer = window.setTimeout(
          () =>
            destination?.scrollIntoView({
              behavior: motion ? "smooth" : "auto",
            }),
          motion ? 660 : 0,
        );
        menuDestination.current = null;
      } else menuButton.current?.focus();
    }
    return () => window.clearTimeout(navigationTimer);
  }, [menu, motion]);

  const navigateMenu = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    event.preventDefault();
    menuDestination.current = id;
    setMenu(false);
  };
  const navigateHome = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById("main")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "auto" });
    window.history.replaceState(null, "", "#main");
  };
  const chooseStep = (index: number) => {
    setStep(index);
    setApproved(false);
    if (
      story.current &&
      motion &&
      window.innerWidth > 800 &&
      window.innerHeight >= 680
    ) {
      const y =
        window.scrollY +
        story.current.getBoundingClientRect().top +
        (story.current.offsetHeight - window.innerHeight) *
          ((index + 0.35) / 3);
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };
  const chooseProductChapter = (
    kind: "benefits" | "hardware",
    index: number,
  ) => {
    const section = kind === "benefits" ? benefits.current : hardware.current;
    const positions =
      kind === "benefits" ? [0.05, 0.5, 0.95] : [0.04, 0.35, 0.62, 0.98];
    const progress = positions[index];
    section?.style.setProperty(
      kind === "benefits" ? "--benefit-progress" : "--hardware-progress",
      String(progress),
    );
    (kind === "benefits" ? setBenefitStep : setHardwareStep)(index);
    (kind === "benefits" ? benefitScene : hardwareScene).current?.setProgress(
      progress,
    );
    if (motion && section && window.innerHeight >= 680) {
      const stageHeight =
        section.firstElementChild?.getBoundingClientRect().height ??
        window.innerHeight;
      window.scrollTo({
        top:
          window.scrollY +
          section.getBoundingClientRect().top -
          (parseFloat(
            getComputedStyle(section.firstElementChild as Element).top,
          ) || 0) +
          (section.offsetHeight - stageHeight) * progress,
        behavior: "smooth",
      });
    }
  };
  const submitWaitlist = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (preview) {
      window.location.assign(STORE + "/waitlist");
      return;
    }
    setFormState("loading");
    try {
      const result = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setFormState(
        result.ok ? "success" : result.status === 409 ? "duplicate" : "error",
      );
    } catch {
      setFormState("error");
    }
  };

  return (
    <div
      ref={root}
      className={
        "ap-site " +
        (intro ? "ap-entering" : "ap-ready") +
        (menu ? " ap-menu-open" : "") +
        (!motion ? " ap-reduced" : "")
      }
    >
      <a className="ap-skip" href="#main" onClick={navigateHome}>
        Skip to content
      </a>
      <div className="ap-intro" aria-hidden="true">
        <svg className="ap-construction" viewBox="0 0 800 800" fill="none">
          <defs>
            <pattern
              id="ap-grid"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M100 0H0V100"
                stroke="currentColor"
                strokeOpacity=".1"
                strokeDasharray="3 6"
              />
            </pattern>
          </defs>
          <rect width="800" height="800" fill="url(#ap-grid)" />
          <rect
            className="ap-drawn-pendant"
            x="280"
            y="220"
            width="240"
            height="360"
            rx="120"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="3 5"
          />
          <g className="ap-construction-ring">
            <circle
              cx="400"
              cy="400"
              r="240"
              fill="currentColor"
              fillOpacity=".035"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="3 5"
            />
            <circle
              cx="400"
              cy="400"
              r="112"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="3 5"
            />
          </g>
          {[160, 288, 512, 640].map((line, index) => (
            <g
              className="ap-construction-handle"
              key={line}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <path
                d={`M${line} 310v180M310 ${line}h180`}
                stroke="currentColor"
                strokeWidth="2"
              />
              {[310, 490].map((v) => (
                <g key={v}>
                  <circle cx={line} cy={v} r="4" fill="currentColor" />
                  <circle cx={v} cy={line} r="4" fill="currentColor" />
                </g>
              ))}
              <rect
                x={line - 4}
                y="396"
                width="8"
                height="8"
                fill="currentColor"
              />
              <rect
                x="396"
                y={line - 4}
                width="8"
                height="8"
                fill="currentColor"
              />
            </g>
          ))}
        </svg>
        <p>ANTICIPATION LABS · A LITTLE AHEAD</p>
      </div>
      <noscript>
        <style>
          {
            ".ap-intro{display:none!important}.ap-wordmark{opacity:1!important;transform:none!important}"
          }
        </style>
      </noscript>
      <header className="ap-nav">
        <a
          className="ap-logo"
          href="#main"
          onClick={navigateHome}
          aria-label="Anticipy home"
        >
          anticipy<span>™</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#experience">The experience</a>
          <a href="#pendant">The pendant</a>
          <a href="#privacy">Your privacy</a>
        </nav>
        <div className="ap-nav-actions">
          <a
            className="ap-nav-order"
            href="#order"
            data-cta-id="nav-order"
            data-cta-type="anchor"
          >
            Pre-order <span>· $149.99</span> <Arrow diagonal />
          </a>
          <button
            ref={menuButton}
            className="ap-menu-button"
            onClick={() => setMenu(true)}
            aria-expanded={menu}
            aria-controls="ap-navigation"
            aria-label="Open menu"
          >
            <i />
            <i />
          </button>
        </div>
      </header>
      <dialog
        id="ap-navigation"
        ref={dialog}
        className="ap-menu-panel"
        aria-label="Explore Anticipy"
        onCancel={() => setMenu(false)}
        onClick={(e) => {
          if (e.target === dialog.current) setMenu(false);
        }}
      >
        <button
          className="ap-menu-close"
          aria-label="Close menu"
          onClick={() => setMenu(false)}
        >
          ×
        </button>
        <span className="ap-kicker">A LITTLE AHEAD.</span>
        <a
          onClick={(event) => navigateMenu(event, "experience")}
          href="#experience"
        >
          The experience <span>01</span>
        </a>
        <a onClick={(event) => navigateMenu(event, "pendant")} href="#pendant">
          The pendant <span>02</span>
        </a>
        <a onClick={(event) => navigateMenu(event, "privacy")} href="#privacy">
          Your privacy <span>03</span>
        </a>
        <a href={STORE + "/book"}>
          Let’s talk <Arrow diagonal />
        </a>
        <p>
          Made by Anticipation Labs.
          <br />
          Vancouver, Canada.
        </p>
      </dialog>
      <main tabIndex={-1} id="main" className="ap-page">
        <section className="ap-shop-hero" data-section-id="hero">
          <div className="ap-shop-copy">
            <p className="ap-shop-category">
              <span /> MEET ANTICIPY
            </p>
            <div className="ap-shop-mobile-product" aria-hidden="true">
              <img
                src="/redesign/pendant-cutout-closed.webp"
                alt=""
                width="2048"
                height="1156"
              />
            </div>
            <h1>
              The AI pendant <br />
              that turns words
              <br />
              into action.
            </h1>
            <p className="ap-shop-description">
              Capture a conversation. Draft the follow-up. Schedule the next
              step. Anticipy helps get it done, with your approval.
            </p>
            <div className="ap-shop-actions">
              <Button href="#order" ctaId="hero-order">
                Pre-order · $149.99 USD
              </Button>
              <a
                href="#experience"
                className="ap-shop-demo"
                data-cta-id="hero-demo"
                data-cta-type="anchor"
              >
                See how it works <Arrow />
              </a>
            </div>
            <p className="ap-shop-delivery">
              Estimated shipping Q4 2026 · Free US & Canada shipping
            </p>
            <div className="ap-shop-assurances">
              <span>
                <Mark type="check" /> First year of AI included
              </span>
              <span>
                <Mark type="shield" /> Refundable before shipping
              </span>
            </div>
          </div>
          <div className="ap-shop-visual">
            <div className="ap-shop-backdrop" />
            <span className="ap-shop-material">
              BRUSHED TITANIUM / MADE TO WEAR
            </span>
            <img
              src="/redesign/pendant-cutout-closed.webp"
              alt="Anticipy: a compact, seamless silver AI pendant on a fine necklace"
              width="2048"
              height="1156"
              loading="eager"
            />
            <div className="ap-hero-result">
              <div className="ap-hero-result-top">
                <Mark type="context" />
                <span>FROM YOUR CONVERSATION</span>
                <span className="ap-result-status">Draft ready</span>
              </div>
              <h2>“Send Marcus the notes tonight.”</h2>
              <div className="ap-hero-result-bottom">
                <span>Follow-up email prepared</span>
                <span>You review. You approve.</span>
              </div>
            </div>
          </div>
          <div className="ap-shop-foot">
            <span>LESS ON YOUR MIND. MORE IN YOUR LIFE.</span>
            <a href="#experience">
              From your words to your next step <span>↓</span>
            </a>
          </div>
        </section>

        <section
          ref={story}
          tabIndex={-1}
          className="ap-story"
          id="experience"
          data-section-id="experience"
        >
          <div className="ap-story-sticky" id="how-it-works">
            <div className="ap-section-line">
              <span className="ap-kicker">
                <i /> FROM A FEW WORDS TO A LITTLE LESS WORK.
              </span>
              <span className="ap-kicker">ANTICIPY IN ACTION</span>
            </div>
            <div className="ap-story-layout">
              <div className="ap-story-copy">
                <h2>
                  A good thought.
                  <br />
                  <em>A next step.</em>
                </h2>
                <div
                  className="ap-step-index"
                  role="group"
                  aria-label="How Anticipy works"
                >
                  {STEPS.map((item, index) => (
                    <button
                      id={"ap-step-" + index}
                      key={item.title}
                      aria-pressed={step === index}
                      aria-controls="ap-step-content"
                      onClick={() => chooseStep(index)}
                      className={step === index ? "active" : ""}
                    >
                      <span>{"0" + (index + 1)}</span>
                      {item.title}
                      <Arrow />
                    </button>
                  ))}
                </div>
                <div
                  id="ap-step-content"
                  role="region"
                  aria-labelledby={"ap-step-" + step}
                  className="ap-step-description"
                  key={step}
                >
                  <h3>{STEPS[step].subtitle}</h3>
                  <p>{STEPS[step].text}</p>
                </div>
              </div>
              <div className="ap-demo-stage">
                <div className="ap-demo-top">
                  <span className="ap-kicker">A MOMENT, IN MOTION</span>
                  <span className="ap-kicker">
                    {step === 0
                      ? "LISTENING"
                      : step === 1
                        ? "MAKING SENSE"
                        : "READY WHEN YOU ARE"}
                    <i />
                  </span>
                </div>
                <div className="ap-demo-card" key={step}>
                  {step === 0 ? (
                    <>
                      <div className="ap-demo-icon">
                        <Mark type="sound" />
                      </div>
                      <p className="ap-quote">
                        “I’ll send Marcus
                        <br />
                        the notes tonight.
                        <br />
                        <span>
                          Leave out the
                          <br />
                          budget slide.”
                        </span>
                      </p>
                      <div className="ap-wave" aria-hidden="true">
                        {Array.from({ length: 43 }, (_, i) => (
                          <i
                            key={i}
                            style={{
                              height:
                                Math.round(8 + Math.sin(i * 1.7) ** 2 * 34) +
                                "px",
                              animationDelay: (i * 0.045).toFixed(3) + "s",
                            }}
                          />
                        ))}
                      </div>
                      <div className="ap-demo-footer">
                        <span>ON YOUR WALK HOME</span>
                        <span>00:08</span>
                      </div>
                    </>
                  ) : step === 1 ? (
                    <>
                      <div className="ap-demo-icon">
                        <Mark type="context" />
                      </div>
                      <span className="ap-small-label">COMMITMENT CAUGHT</span>
                      <h3>
                        Send the notes.
                        <br />
                        Keep the context.
                      </h3>
                      <dl className="ap-context-list">
                        <div>
                          <dt>To</dt>
                          <dd>Marcus</dd>
                        </div>
                        <div>
                          <dt>When</dt>
                          <dd>Tonight</dd>
                        </div>
                        <div>
                          <dt>Include</dt>
                          <dd>Meeting notes</dd>
                        </div>
                        <div>
                          <dt>Leave out</dt>
                          <dd>Budget slide</dd>
                        </div>
                      </dl>
                      <div className="ap-demo-footer">
                        <span>YOUR CORRECTION, REMEMBERED.</span>
                        <Mark type="check" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="ap-demo-icon">
                        <Mark type={approved ? "check" : "context"} />
                      </div>
                      <span className="ap-small-label">
                        {approved ? "RECEIPT SAVED" : "YOUR REVIEW"}
                      </span>
                      <h3>
                        {approved ? (
                          <>
                            One less thing
                            <br />
                            on your mind.
                          </>
                        ) : (
                          <>
                            Ready to send.
                            <br />
                            Only if you say so.
                          </>
                        )}
                      </h3>
                      <div className="ap-email-preview">
                        <span>To: Marcus</span>
                        <strong>Notes from today</strong>
                        <p>Here are the meeting notes we discussed.</p>
                        <span className="ap-attachment">
                          ↗ &nbsp; meeting-notes.pdf
                        </span>
                      </div>
                      <button
                        className={
                          "ap-approve " + (approved ? "is-approved" : "")
                        }
                        onClick={() => setApproved(!approved)}
                      >
                        {approved
                          ? "✓  Sent & verified · view again"
                          : "Approve example"}
                        {!approved && <Arrow />}
                      </button>
                      <div className="ap-demo-footer">
                        <span>
                          {approved
                            ? "EXAMPLE COMPLETED"
                            : "NOTHING HAPPENS WITHOUT YOUR SAY."}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="ap-demo-bottom">
                  <span>ILLUSTRATIVE WALKTHROUGH</span>
                  <span>YOUR WORDS. YOUR CONTROL.</span>
                </div>
                <div className="ap-focus-corner tl" />
                <div className="ap-focus-corner tr" />
                <div className="ap-focus-corner bl" />
                <div className="ap-focus-corner br" />
              </div>
            </div>
            <div className="ap-story-progress">
              <i />
            </div>
          </div>
        </section>

        <section
          ref={benefits}
          className="ap-benefits"
          id="product-story"
          aria-label="The everyday companion"
        >
          <div className="ap-benefits-sticky">
            <div className="ap-chapter-track" aria-hidden="true">
              {BENEFITS.map((_, i) => (
                <i key={i} className={i <= benefitStep ? "active" : ""} />
              ))}
            </div>
            <div className="ap-benefit-heading" key={benefitStep}>
              <span className="ap-kicker">
                THE EVERYDAY COMPANION / 0{benefitStep + 1}
              </span>
              <h2>{BENEFITS[benefitStep].title}</h2>
              <p>{BENEFITS[benefitStep].note}</p>
            </div>
            <div
              className="ap-benefit-object"
              role="img"
              aria-label="Anticipy pendant rotating through views of its sculpted metal enclosure"
            >
              <PendantScene ref={benefitScene} mode="benefits" />
            </div>
            <div className="ap-benefit-context" key={"card" + benefitStep}>
              <span className="ap-kicker">{BENEFITS[benefitStep].label}</span>
              <div className="ap-benefit-card">
                <Mark
                  type={
                    benefitStep === 0
                      ? "sound"
                      : benefitStep === 1
                        ? "context"
                        : "check"
                  }
                />
                <div>
                  <h3>{BENEFITS[benefitStep].title2}</h3>
                  <p>{BENEFITS[benefitStep].text}</p>
                </div>
              </div>
            </div>
            <div className="ap-product-bottom">
              <span>ONE LITTLE OBJECT. A LITTLE MORE HEADSPACE.</span>
              <div role="group" aria-label="Product story chapters">
                {BENEFITS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => chooseProductChapter("benefits", i)}
                    aria-pressed={benefitStep === i}
                    aria-label={`Product story ${i + 1}: ${BENEFITS[i].note}`}
                  >
                    0{i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="ap-lifestyle" data-section-id="worn">
          <img
            src="/redesign/pendant-lifestyle-closed.webp"
            alt="The small silver Anticipy pendant worn on a fine chain with a cream knit top in natural sunlight"
            width="2688"
            height="1520"
            loading="lazy"
          />
          <div className="ap-lifestyle-shade" />
          <div className="ap-lifestyle-top">
            <span className="ap-kicker">
              LESS SCREEN TIME.
              <br />
              MORE LIFE TIME.
            </span>
            <span className="ap-kicker">02 / WORN, NOT NOTICED.</span>
          </div>
          <div className="ap-lifestyle-copy ap-reveal">
            <h2>
              Keep your head
              <br />
              in the real world.
            </h2>
            <p>
              A quiet companion.
              <br />
              For a beautifully busy life.
            </p>
          </div>
          <div className="ap-lifestyle-caption">
            <i /> Just you. And a little backup.
          </div>
        </section>

        <section
          tabIndex={-1}
          id="pendant"
          ref={hardware}
          className="ap-engineering"
          data-section-id="pendant"
          aria-label="Explore the pendant"
        >
          <div className="ap-engineering-sticky" data-chapter={hardwareStep}>
            <div className="ap-engineering-top">
              <span className="ap-kicker">03 / AN OBJECT, CONSIDERED.</span>
              <span className="ap-kicker">ANTICIPY — FROM EVERY ANGLE</span>
            </div>
            <div className="ap-engineering-copy" key={hardwareStep}>
              <h2>{HARDWARE[hardwareStep].title}</h2>
              <p>{HARDWARE[hardwareStep].subtitle}</p>
              <ul>
                {HARDWARE[hardwareStep].bullets.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </div>
            <div
              className="ap-engineering-object"
              role="img"
              aria-label="Interactive concept study of the pendant: a closed metal enclosure, transparent technical views of its internal board, and a return to the everyday view"
            >
              <PendantScene ref={hardwareScene} mode="hardware" />
            </div>
            <div className="ap-inspector" aria-hidden="true">
              <span className="ap-inspector-plus">+</span>
              <div className="ap-inspector-card">
                <span>{HARDWARE[hardwareStep].tag}</span>
                <strong>{HARDWARE[hardwareStep].label}</strong>
              </div>
              <div className="ap-inspector-caption">
                {HARDWARE[hardwareStep].caption}
              </div>
            </div>
            <div
              className="ap-engineering-index"
              role="group"
              aria-label="Pendant views"
            >
              {["Shape", "Inside", "Detail", "Everyday"].map((label, i) => (
                <button
                  key={label}
                  onClick={() => chooseProductChapter("hardware", i)}
                  aria-pressed={hardwareStep === i}
                >
                  <span>{label}</span>
                  <b>0{i + 1}</b>
                </button>
              ))}
            </div>
            <div className="ap-engineering-bottom">
              <span>SCROLL TO LOOK CLOSER ↓</span>
              <span>DESIGN STUDY · INTERNAL LAYOUT IS CONCEPTUAL</span>
            </div>
          </div>
        </section>

        <section
          tabIndex={-1}
          id="privacy"
          className="ap-privacy"
          data-section-id="privacy"
        >
          <div className="ap-privacy-title ap-reveal">
            <span className="ap-kicker">
              <i /> 04 / YOU’RE IN CHARGE.
            </span>
            <h2>
              Close to you.
              <br />
              <span>On your terms.</span>
            </h2>
            <a href={STORE + "/privacy"} className="ap-text-link">
              Our approach to privacy <Arrow diagonal />
            </a>
          </div>
          <div className="ap-privacy-rows">
            {[
              [
                "01",
                "Your words. Your rules.",
                "You decide how your audio is used. See, export, or delete your information.",
              ],
              [
                "02",
                "Your approval comes first.",
                "Every action is previewed. Nothing goes ahead without your say.",
              ],
              [
                "03",
                "Done means verified.",
                "A receipt for every completed action. A clear record you can come back to.",
              ],
            ].map(([n, title, text]) => (
              <article className="ap-privacy-row ap-reveal" key={n}>
                <span>{n}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <Mark
                  type={
                    n === "01" ? "shield" : n === "02" ? "context" : "check"
                  }
                />
              </article>
            ))}
          </div>
        </section>

        <section className="ap-faq" id="questions">
          <div className="ap-faq-heading">
            <span className="ap-kicker">
              A FEW THINGS YOU MIGHT BE WONDERING.
            </span>
            <h2>Good questions.</h2>
            <a href={STORE + "/book"} className="ap-text-link">
              Ask us anything <Arrow diagonal />
            </a>
          </div>
          <div className="ap-faq-list">
            {FAQ.map(([q, a]) => (
              <details key={q}>
                <summary>
                  <span>{q}</span>
                  <b>+</b>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section
          className="ap-stone"
          aria-label="Made for life beyond the screen"
        >
          <img
            src="/redesign/pendant-stone-closed.webp"
            alt="The silver Anticipy pendant resting on warm pale travertine in natural light"
            width="2752"
            height="1536"
            loading="lazy"
          />
          <div className="ap-stone-copy">
            <span className="ap-kicker">
              A LITTLE LESS SCREEN. A LITTLE MORE LIFE.
            </span>
            <h2>
              Ready for
              <br />
              the real world.
            </h2>
            <p>A small companion for everything you have going on.</p>
            <Button href="#order" ctaId="stone-order">
              Pre-order your Anticipy
            </Button>
          </div>
          <div className="ap-stone-caption">
            BRUSHED TITANIUM. EVERYDAY POSSIBILITY.
          </div>
        </section>

        <section
          className="ap-close ap-order"
          id="order"
          data-section-id="order"
        >
          <div className="ap-order-product">
            <span className="ap-kicker">YOUR EVERYDAY AI COMPANION</span>
            <img
              src="/redesign/pendant-cutout-closed.webp"
              alt="The seamless Anticipy AI pendant and its fine silver necklace"
              width="2048"
              height="1156"
              loading="lazy"
            />
            <div className="ap-order-finish">
              <span /> Brushed titanium{" "}
              <span className="ap-order-included">Matching chain included</span>
            </div>
          </div>
          <div className="ap-order-details">
            <p className="ap-shop-category">ANTICIPY AI PENDANT</p>
            <h2>
              A little less to do.
              <br />
              <span>A little more you.</span>
            </h2>
            <div className="ap-order-price">
              <strong>
                $149.99 <small>USD</small>
              </strong>
              <span>Projected launch price $199</span>
            </div>
            <p className="ap-order-summary">
              One pendant. Your words turned into useful next steps.
            </p>
            <ul className="ap-order-inclusions">
              <li>
                <Mark type="check" /> Titanium pendant & matching chain
              </li>
              <li>
                <Mark type="check" /> Wireless charging pad
              </li>
              <li>
                <Mark type="check" /> First year of AI service
              </li>
            </ul>
            <Button
              href={STORE + "/pre-orders/purchase"}
              ctaId="order-checkout"
            >
              Pre-order Anticipy · $149.99 USD
            </Button>
            <p className="ap-order-payment">
              Charged today. Estimated shipping Q4 2026.
            </p>
            <div className="ap-order-reassurance">
              <span>
                <Mark type="check" /> Free US & Canada shipping
              </span>
              <span>
                <Mark type="shield" /> Full refund before shipping
              </span>
            </div>
            <details className="ap-service-terms">
              <summary>
                What happens after the first year? <span>+</span>
              </summary>
              <p>
                Your first year of AI service starts when your pendant ships.
                Continued cloud AI then requires a separate annual opt-in,
                currently projected at $99 USD/year. You won’t be automatically
                enrolled.{" "}
                <a href={STORE + "/pre-orders/agreement"}>
                  Read the pre-order terms
                </a>
                .
              </p>
            </details>
          </div>
          <div className="ap-waitlist" id="waitlist">
            <div>
              <h3>Not quite ready?</h3>
              <p>Keep up with what we’re making.</p>
            </div>
            {preview ? (
              <a className="ap-text-link" href={STORE + "/waitlist"}>
                Join the waitlist <Arrow diagonal />
              </a>
            ) : formState === "success" || formState === "duplicate" ? (
              <p role="status">
                {formState === "success"
                  ? "You’re on the list. We’ll keep you posted."
                  : "You’re already on the list."}
              </p>
            ) : (
              <form onSubmit={submitWaitlist}>
                <label className="ap-sr-only" htmlFor="ap-email">
                  Email address
                </label>
                <input
                  id="ap-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={formState === "loading"}
                  aria-label="Join the waitlist"
                >
                  {formState === "loading" ? "Joining…" : <Arrow />}
                </button>
                {formState === "error" && (
                  <p role="alert">Couldn’t join right now. Please try again.</p>
                )}
              </form>
            )}
          </div>
        </section>
        <footer className="ap-footer">
          <div className="ap-footer-links">
            <p>Made for life as it happens.</p>
            <nav aria-label="Footer navigation">
              <a href={STORE + "/app"}>
                The app <Arrow diagonal />
              </a>
              <a href={STORE + "/book"}>
                Let’s talk <Arrow diagonal />
              </a>
              <a href="mailto:hello@anticipy.ai">
                Say hello <Arrow diagonal />
              </a>
            </nav>
          </div>
          <div className="ap-footer-mark" aria-hidden="true">
            anticipy<span>™</span>
          </div>
          <div className="ap-footer-bottom">
            <span>© 2026 Anticipation Labs</span>
            <div>
              <a href={STORE + "/privacy"}>Privacy</a>
              <a href={STORE + "/terms"}>Terms</a>
              <a href={STORE + "/refund"}>Refunds</a>
              <button
                disabled={systemReduced}
                onClick={() => setMotion(!motion)}
                aria-pressed={!motion}
              >
                {systemReduced
                  ? "Motion off (system)"
                  : motion
                    ? "Motion on"
                    : "Motion off"}
                <i />
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
