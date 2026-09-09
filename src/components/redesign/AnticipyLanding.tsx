"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import "./landing.css";
import "./revision.css";
import "./conversion.css";
import "./action.css";
import "./clarity.css";
import { ActionDemonstration, PrototypeTrust } from "./ActionDemonstration";
import { ActionFAQ, ActionManifesto, FinishPicker } from "./ActionSections";
import { FINISHES, PENDANT, type PendantFinish } from "./pendant-design";
import { PendantScene, type PendantSceneHandle } from "./PendantScene";

const STORE = "https://www.anticipy.ai";
const BENEFITS = [
  {
    title: (
      <>
        Wear it.
        <br />
        Get on with your day.
      </>
    ),
    label: "BUILT AROUND YOUR DAY",
    title2: "A pendant. Not another screen.",
    text: "Keep the conversation going while Anticipy prepares the next step.",
    note: "Made for life as it happens.",
  },
  {
    title: (
      <>
        The details
        <br />
        make the difference.
      </>
    ),
    label: "THE CONTEXT MATTERS",
    title2: "Friday. At seven. With Alex.",
    text: "An action needs the right person, timing and context—not just a transcript.",
    note: "The context goes with the task.",
  },
  {
    title: (
      <>
        You choose.
        <br />
        Anticipy acts.
      </>
    ),
    label: "READY FOR YOUR REVIEW",
    title2: "You have the final say.",
    text: "Check what will happen before it happens. Edit or approve the proposed action.",
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
    subtitle: "A closer look at what makes it possible.",
    bullets: [
      "Compact electronics inside the enclosure",
      "Connected to the Anticipy app",
      "Actions in the tools you connect",
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

export function AnticipyLanding({
  preview = false,
  campaign = false,
}: {
  preview?: boolean;
  campaign?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const hardware = useRef<HTMLElement>(null);
  const benefits = useRef<HTMLElement>(null);
  const hardwareScene = useRef<PendantSceneHandle>(null);
  const benefitScene = useRef<PendantSceneHandle>(null);
  const [finish, setFinish] = useState<PendantFinish>("silver");
  const [benefitStep, setBenefitStep] = useState(0);
  const [hardwareStep, setHardwareStep] = useState(0);
  const [menu, setMenu] = useState(false);
  const [intro, setIntro] = useState(true);
  const [scrolled, setScrolled] = useState(false);
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
      setScrolled(window.scrollY > 90);
      const manifesto = el.querySelector(".ap-manifesto");
      if (manifesto) {
        const rect = manifesto.getBoundingClientRect();
        el.style.setProperty(
          "--manifesto-progress",
          String(motion ? clamp(-rect.top / Math.max(1, rect.height - h)) : 1),
        );
      }
      const heroProgress = clamp(window.scrollY / h);
      el.style.setProperty(
        "--hero-progress",
        motion ? String(heroProgress) : "0",
      );
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
        (scrolled ? " ap-scrolled" : "") +
        (menu ? " ap-menu-open" : "") +
        (campaign ? " ap-campaign" : "") +
        (!motion ? " ap-reduced" : "")
      }
    >
      <a className="ap-skip" href="#main" onClick={navigateHome}>
        Skip to content
      </a>
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
      {campaign && <ActionManifesto />}
      <main tabIndex={-1} id="main" className="ap-page">
        <section className="ap-shop-hero" data-section-id="hero">
          <div className="ap-shop-copy">
            <div className="ap-shop-mobile-product" aria-hidden="true">
              <img
                src={FINISHES[finish].image}
                alt=""
                width="2048"
                height="1156"
              />
            </div>
            <h1>
              <span className="ap-hero-contrast">Not a note taker.</span>
              An action taker.
            </h1>
            <p className="ap-shop-description">
              <strong>The AI pendant that gets things done.</strong>
              Turn conversations into emails, calendar events and tasks—with
              your approval.
            </p>
            <FinishPicker
              finish={finish}
              onChange={setFinish}
              label="Choose your finish"
            />
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
            <svg
              className="ap-pendant-intro"
              viewBox="0 0 2048 1158"
              preserveAspectRatio="xMidYMid meet"
              fill="none"
              aria-hidden="true"
            >
              <rect
                className="ap-pendant-guide"
                x="765"
                y="255"
                width="531"
                height={(531 * PENDANT.height) / PENDANT.width}
                rx={531 / 2}
              />
              <circle
                cx="1030.5"
                cy={
                  255 +
                  ((PENDANT.height / 2 - PENDANT.apertureY) * 531) /
                    PENDANT.width
                }
                r={(PENDANT.apertureRadius * 531) / PENDANT.width}
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="M705 255H1356M705 1051H1356M765 195V1111M1296 195V1111" />
              <path d="M765 305V255H815M1246 255H1296V305M765 1001V1051H815M1246 1051H1296V1001" />
            </svg>
            <span className="ap-shop-material">
              {FINISHES[finish].label} · Matching chain included
            </span>
            <img
              src={FINISHES[finish].image}
              alt={
                FINISHES[finish].label +
                " Anticipy AI action taker on a fine necklace"
              }
              width="2048"
              height="1156"
              loading="eager"
            />
            <div
              className="ap-hero-capabilities"
              aria-label="What Anticipy does"
            >
              <span>
                <Mark type="context" /> Send emails
              </span>
              <span>
                <Mark type="check" /> Schedule plans
              </span>
              <span>
                <Mark type="sound" /> Set reminders
              </span>
            </div>
          </div>
          <div className="ap-shop-foot">
            <span>LESS ON YOUR MIND. MORE IN YOUR LIFE.</span>
            <a href="#experience">
              Try an action <span>↓</span>
            </a>
          </div>
        </section>

        <PrototypeTrust />
        <ActionDemonstration motion={motion} />

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
              <PendantScene
                ref={benefitScene}
                mode="benefits"
                finish={finish}
              />
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
              <span>MADE FOR LIFE AS IT HAPPENS.</span>
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
              aria-label="Interactive concept study of the pendant: a closed metal enclosure, an exploded technical view of its internal board, and a return to the everyday view"
            >
              <PendantScene
                ref={hardwareScene}
                mode="hardware"
                finish={finish}
              />
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
            <div className="ap-engineering-finishes">
              <FinishPicker
                finish={finish}
                onChange={setFinish}
                label="Finish"
              />
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
          <div className="ap-centered-heading ap-reveal">
            <span className="ap-kicker">CLOSE TO YOU. ON YOUR TERMS.</span>
            <h2>Your life stays yours.</h2>
            <p>
              Personal help should feel personal.
              <br />
              Clear choices about your words, your data, and your actions.
            </p>
          </div>
          <div className="ap-privacy-symbol">
            <Mark type="shield" />
          </div>
          <div className="ap-privacy-pills">
            <span>On-phone audio processing</span>
            <span>No stored raw audio</span>
            <span>Personal information never sold</span>
            <span>Your approval comes first</span>
          </div>
          <div className="ap-privacy-grid">
            {[
              [
                "Processed on your phone",
                "Audio is processed locally on your smartphone to identify what needs doing. The cloud action engine receives a short text instruction.",
                "context",
              ],
              [
                "No saved recordings",
                "Raw audio is discarded within seconds of processing. Anticipy’s privacy policy describes an ephemeral audio stream, with no stored recording.",
                "sound",
              ],
              [
                "Your information is not for sale",
                "We don’t sell your personal information or share it with third parties for their own marketing.",
                "shield",
              ],
              [
                "Access, export, delete",
                "Request access to, correction of, or deletion of your information. The privacy policy explains your choices and any retention exceptions.",
                "check",
              ],
            ].map(([title, text, icon]) => (
              <article className="ap-privacy-tile" key={title}>
                <Mark type={icon as "context" | "sound" | "shield" | "check"} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <a href={STORE + "/privacy"} className="ap-privacy-policy">
            Read our full privacy policy <Arrow diagonal />
          </a>
        </section>

        <ActionFAQ finish={finish} />

        <section
          className="ap-stone"
          aria-label="Made for life beyond the screen"
        >
          <img
            src={FINISHES[finish].stone}
            alt={
              FINISHES[finish].label +
              " Anticipy pendant resting on warm pale travertine in natural light"
            }
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
            TITANIUM SILVER. GOLD. EVERYDAY POSSIBILITY.
          </div>
        </section>

        <section
          className="ap-close ap-order"
          id="order"
          data-section-id="order"
        >
          <div className="ap-order-product">
            <span className="ap-kicker">YOUR PERSONAL AI ACTION TAKER</span>
            <img
              src={FINISHES[finish].image}
              alt={
                "The seamless " +
                FINISHES[finish].label +
                " Anticipy AI pendant and its matching fine necklace"
              }
              width="2048"
              height="1156"
              loading="lazy"
            />
            <div className="ap-order-finish">
              <span className={"ap-swatch-" + finish} />{" "}
              {FINISHES[finish].label}{" "}
              <span className="ap-order-included">Matching chain included</span>
            </div>
            <div
              className="ap-finish-gallery"
              role="group"
              aria-label="Preview a finish"
            >
              {(Object.keys(FINISHES) as PendantFinish[]).map((value) => (
                <button
                  key={value}
                  aria-pressed={finish === value}
                  onClick={() => setFinish(value)}
                >
                  <img
                    src={FINISHES[value].image}
                    alt=""
                    width="2048"
                    height="1158"
                    loading="lazy"
                  />
                  <span>{FINISHES[value].label}</span>
                  <i aria-hidden="true">{finish === value ? "✓" : "+"}</i>
                </button>
              ))}
            </div>
          </div>
          <div className="ap-order-details">
            <p className="ap-shop-category">ANTICIPY AI PENDANT</p>
            <h2>
              Choose your
              <br />
              <span>Anticipy.</span>
            </h2>
            <div className="ap-order-price">
              <strong>
                $149.99 <small>USD</small>
              </strong>
              <span>
                Projected launch price $199
                <br />
                <b className="ap-offer-saving">
                  $49.01 below projected launch price
                </b>
              </span>
            </div>
            <p className="ap-order-summary">
              One pendant. Your everyday conversations, put to work.
            </p>
            <FinishPicker finish={finish} onChange={setFinish} />
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
              href={STORE + "/pre-orders/purchase?finish=" + finish}
              ctaId="order-checkout"
            >
              Pre-order {FINISHES[finish].label} · $149.99 USD
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
            <p className="ap-order-service-cost">
              After year one: optional AI service, projected at $99 USD/year. No
              automatic enrollment. Requires a compatible smartphone and
              connected tools.
            </p>
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
              <a href="/action-taker/">
                The action-taker manifesto <Arrow diagonal />
              </a>
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
