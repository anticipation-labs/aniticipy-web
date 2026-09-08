"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import "./landing.css";

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
const FAQ = [
  [
    "What is Anticipy?",
    "Anticipy is a titanium AI pendant built to turn spoken commitments into completed actions. It helps capture what you mean to do, prepares the next step, asks for your approval, and keeps a verified record of the result.",
  ],
  [
    "What’s included in the pre-order?",
    "The pendant, a necklace chain, and a wireless charging pad. The current pre-order is $149.99, with free shipping in the US and Canada. The announced launch price is $199.",
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
}: {
  children: React.ReactNode;
  href: string;
  pale?: boolean;
}) {
  return (
    <a
      className={"ap-button" + (pale ? " ap-button-pale" : "")}
      href={href}
      data-cta-id="pendant-preorder"
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
      query.matches || window.location.hash ? 0 : 1700,
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
        window.innerHeight >= 780
      ) {
        const rect = story.current.getBoundingClientRect();
        const p = clamp(-rect.top / Math.max(1, rect.height - h));
        setStep(Math.min(2, Math.floor(p * 3)));
        story.current.style.setProperty("--story-progress", String(p));
      }
      if (hardware.current) {
        const rect = hardware.current.getBoundingClientRect();
        const stickyHeight =
          hardware.current.firstElementChild?.getBoundingClientRect().height ??
          h;
        const p = motion
          ? clamp(-rect.top / Math.max(1, rect.height - stickyHeight))
          : 1;
        hardware.current.style.setProperty("--hardware-progress", String(p));
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
  const chooseStep = (index: number) => {
    setStep(index);
    setApproved(false);
    if (
      story.current &&
      motion &&
      window.innerWidth > 800 &&
      window.innerHeight >= 780
    ) {
      const y =
        window.scrollY +
        story.current.getBoundingClientRect().top +
        (story.current.offsetHeight - window.innerHeight) *
          ((index + 0.35) / 3);
      window.scrollTo({ top: y, behavior: "smooth" });
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
      <a className="ap-skip" href="#main">
        Skip to content
      </a>
      <div className="ap-intro" aria-hidden="true">
        <div className="ap-orbit">
          <i />
          <i />
          <i />
          <span>anticipy</span>
          <b className="ap-cross ap-cross-a">+</b>
          <b className="ap-cross ap-cross-b">+</b>
        </div>
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
        <a className="ap-logo" href="#main" aria-label="Anticipy home">
          anticipy<span>™</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#experience">The experience</a>
          <a href="#pendant">The pendant</a>
          <a href="#privacy">Your privacy</a>
        </nav>
        <div className="ap-nav-actions">
          <a className="ap-nav-order" href={STORE + "/pre-orders/purchase"}>
            Pre-order <Arrow diagonal />
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
        <section className="ap-hero" data-section-id="hero">
          <div className="ap-hero-top">
            <span className="ap-kicker">
              <i /> LIFE, A LITTLE LIGHTER.
            </span>
            <span className="ap-kicker">DESIGNED TO BE WITH YOU.</span>
          </div>
          <h1 className="ap-wordmark">
            anticipy<span>™</span>
          </h1>
          <div className="ap-hero-art">
            <img
              src="/redesign/pendant-cutout.webp"
              alt="Anticipy's brushed silver titanium pendant, suspended on a delicate chain"
              width="2688"
              height="1520"
              loading="eager"
            />
          </div>
          <div className="ap-hero-copy">
            <h2>
              Less on your mind.
              <br />
              More in your life.
            </h2>
            <p>
              The AI pendant that turns the things you say into the things you
              get done.
            </p>
            <Button href={STORE + "/pre-orders/purchase"}>
              Meet your Anticipy
            </Button>
            <small>PRE-ORDER $149.99 · SHIPS Q4 2026</small>
          </div>
          <div className="ap-hero-note">
            <span className="ap-plus">+</span>
            <p>
              A SMALL OBJECT.
              <br />A LITTLE POSSIBILITY.
            </p>
            <span className="ap-note-rule" />
          </div>
          <div className="ap-hero-coordinate">
            <span>01 — THE EVERYDAY COMPANION</span>
            <span>BRUSHED TITANIUM</span>
          </div>
          <a className="ap-scroll" href="#experience">
            <span>SCROLL TO DISCOVER</span>
            <span>↓</span>
          </a>
        </section>

        <section
          tabIndex={-1}
          id="experience"
          className="ap-introduction"
          data-section-id="introduction"
        >
          <span className="ap-kicker">
            01 / OUT OF YOUR HEAD.
            <br />
            INTO YOUR DAY.
          </span>
          <div className="ap-reveal">
            <h2>
              Be here.
              <br />
              <span>We’ll take it from here.</span>
            </h2>
            <p>
              A thought on a walk. A promise over coffee. Something you meant to
              do. Anticipy helps carry it forward, so you can stay in the
              moment.
            </p>
          </div>
        </section>

        <section
          ref={story}
          className="ap-story"
          id="how-it-works"
          data-section-id="how-it-works"
        >
          <div className="ap-story-sticky">
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

        <section className="ap-lifestyle" data-section-id="worn">
          <img
            src="/redesign/pendant-lifestyle.webp"
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
          className="ap-hardware"
          data-section-id="pendant"
        >
          <div className="ap-hardware-sticky">
            <div className="ap-section-line">
              <span className="ap-kicker">03 / SMALL ON THE OUTSIDE.</span>
              <span className="ap-kicker">THOUGHTFULLY PUT TOGETHER.</span>
            </div>
            <div className="ap-hardware-copy">
              <h2>
                A little wonder.
                <br />
                <span>Layer by layer.</span>
              </h2>
              <p>
                Thoughtful on the inside.
                <br />
                Beautiful in the everyday.
              </p>
            </div>
            <div
              className="ap-hardware-visual"
              role="img"
              aria-label="Conceptual exploded study: a silver pendant shell separates from its green circuit board and rear enclosure as you scroll."
            >
              <div className="ap-hardware-layers" aria-hidden="true">
                {["back", "board", "front"].map((layer) => (
                  <div
                    className={"ap-hardware-layer ap-layer-" + layer}
                    key={layer}
                  >
                    <img
                      src="/redesign/exploded-cutout.webp"
                      alt=""
                      width="2048"
                      height="1158"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="ap-hardware-label ap-hardware-label-one">
              <span>01</span>
              <div>
                <strong>Brushed titanium</strong>
                <p>A tactile, quietly sculpted shell.</p>
              </div>
            </div>
            <div className="ap-hardware-label ap-hardware-label-two">
              <span>02</span>
              <div>
                <strong>A little intelligence</strong>
                <p>From a moment to a next step.</p>
              </div>
            </div>
            <div className="ap-hardware-label ap-hardware-label-three">
              <span>03</span>
              <div>
                <strong>Everyday by design</strong>
                <p>Made to go where you go.</p>
              </div>
            </div>
            <div className="ap-hardware-bottom">
              <span className="ap-kicker">SCROLL TO EXPLORE THE LAYERS ↓</span>
              <a
                className="ap-film-link"
                href="/redesign/pendant-disassembly.mp4"
                target="_blank"
                rel="noreferrer"
              >
                Watch the concept film <Arrow diagonal />
              </a>
              <span>CONCEPT VISUALIZATION · FINAL HARDWARE MAY DIFFER</span>
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

        <section className="ap-close" id="waitlist" data-section-id="waitlist">
          <div className="ap-close-top">
            <span className="ap-kicker">
              <i /> A LITTLE AHEAD. A LITTLE LIGHTER.
            </span>
            <span className="ap-kicker">ANTICIPATION LABS / VANCOUVER</span>
          </div>
          <div className="ap-close-main ap-reveal">
            <h2>
              A little less to do.
              <br />
              <span>A little more you.</span>
            </h2>
            <div className="ap-close-purchase">
              <p>Meet your everyday companion.</p>
              <div className="ap-price">
                $149.99 <span>$199 at launch</span>
              </div>
              <Button href={STORE + "/pre-orders/purchase"}>
                Pre-order Anticipy
              </Button>
              <small>
                SHIPS Q4 2026 · FREE US & CANADA SHIPPING
                <br />
                FULL REFUND ANYTIME BEFORE SHIPPING
              </small>
            </div>
          </div>
          <div className="ap-waitlist">
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
