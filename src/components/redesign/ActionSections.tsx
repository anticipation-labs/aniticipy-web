"use client";

import { useState } from "react";
import { FINISHES, type PendantFinish } from "./pendant-design";

export function FinishPicker({
  finish,
  onChange,
  label = "Choose your finish",
}: {
  finish: PendantFinish;
  onChange: (finish: PendantFinish) => void;
  label?: string;
}) {
  return (
    <fieldset className="ap-finish-picker">
      <legend>{label}</legend>
      <div>
        {(Object.keys(FINISHES) as PendantFinish[]).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={finish === value}
            onClick={() => onChange(value)}
          >
            <i className={"ap-swatch ap-swatch-" + value} />
            {FINISHES[value].label}
            {finish === value && <span aria-hidden="true">✓</span>}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

const actions = [
  {
    kind: "FOLLOW-UPS",
    icon: "↗",
    title: "The email, sent.",
    quote: "“Send Maya the plan after lunch.”",
    detail:
      "A follow-up prepared from your conversation, sent after your approval.",
    result: "Sent to Maya · receipt saved",
  },
  {
    kind: "SCHEDULING",
    icon: "31",
    title: "The time, set.",
    quote: "“Let’s catch up on Friday at two.”",
    detail:
      "The person, date and time become a calendar action for you to review.",
    result: "Friday, 2:00 pm · event created",
  },
  {
    kind: "TASKS",
    icon: "✓",
    title: "The next step, handled.",
    quote: "“Remind me to review the proposal tomorrow.”",
    detail: "An intention becomes a clear task with the details that matter.",
    result: "Review proposal · reminder set",
  },
  {
    kind: "FOLLOW-THROUGH",
    icon: "≡",
    title: "The result, verified.",
    quote: "“Did that get done?”",
    detail: "See the outcome of an approved action and the receipt behind it.",
    result: "Completed · confirmation available",
  },
];

export function ActionHub({ finish }: { finish: PendantFinish }) {
  const [active, setActive] = useState(0);
  return (
    <section
      className="ap-action-hub"
      id="actions"
      aria-labelledby="ap-actions-title"
    >
      <div className="ap-centered-heading ap-reveal">
        <span className="ap-kicker">
          ONE CONVERSATION. REAL FOLLOW-THROUGH.
        </span>
        <h2 id="ap-actions-title">
          You say what needs doing.
          <br />
          <em>Anticipy takes it from there.</em>
        </h2>
        <p>
          From the words you say to the tasks you finish.
          <br />
          With your approval, in the tools you connect.
        </p>
      </div>
      <div className="ap-action-network">
        <svg
          className="ap-action-wires"
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M250 105C420 105 380 250 500 250S600 105 750 105M250 395C420 395 380 250 500 250S600 395 750 395" />
        </svg>
        <div className="ap-network-object">
          <img
            src={FINISHES[finish].image}
            alt={FINISHES[finish].label + " Anticipy action taker"}
            width="2048"
            height="1158"
            loading="lazy"
          />
          <span>anticipy</span>
          <small>YOUR WORDS → YOUR NEXT MOVE</small>
        </div>
        {actions.map((item, i) => (
          <button
            className={
              "ap-action-node ap-action-node-" +
              i +
              (active === i ? " is-active" : "")
            }
            key={item.kind}
            onClick={() => setActive(i)}
            aria-pressed={active === i}
            aria-controls="ap-action-result"
          >
            <span className="ap-node-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="ap-kicker">{item.kind}</span>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
            <span className="ap-node-link">
              Explore this action <span aria-hidden="true">↗</span>
            </span>
          </button>
        ))}
      </div>
      <div
        className="ap-action-receipt"
        id="ap-action-result"
        aria-live="polite"
      >
        <div>
          <span>YOU SAY</span>
          <strong>{actions[active].quote}</strong>
        </div>
        <span className="ap-receipt-arrow" aria-hidden="true">
          →
        </span>
        <div>
          <span>AFTER YOUR APPROVAL</span>
          <strong>✓ {actions[active].result}</strong>
        </div>
        <small>
          Illustrative examples. Available actions depend on your connected
          tools.
        </small>
      </div>
    </section>
  );
}

export function ActionDifference() {
  return (
    <section className="ap-difference" aria-labelledby="ap-difference-title">
      <div className="ap-centered-heading ap-reveal">
        <span className="ap-kicker">LIFE DOESN’T END AT THE TRANSCRIPT.</span>
        <h2 id="ap-difference-title">
          Less taking notes.
          <br />
          <em>More taking action.</em>
        </h2>
        <p>
          Remembering the to-do is a start.
          <br />
          Getting it done is where life gets lighter.
        </p>
      </div>
      <div className="ap-difference-panels">
        <article className="ap-notes-panel">
          <span className="ap-kicker">A NOTE IS THE START</span>
          <h3>“I need to…”</h3>
          <div className="ap-transcript-sheet">
            <span>CONVERSATION SUMMARY</span>
            <p>Send the proposal.</p>
            <p>Arrange a catch-up.</p>
            <p>Remember the follow-up.</p>
            <hr />
            <span>3 things still waiting for you.</span>
          </div>
        </article>
        <article className="ap-done-panel">
          <span className="ap-kicker">FOLLOW-THROUGH IS THE POINT</span>
          <h3>“That’s done.”</h3>
          <div className="ap-completed-list">
            <p>
              <i>✓</i> Proposal sent <span>Verified</span>
            </p>
            <p>
              <i>✓</i> Catch-up scheduled <span>Verified</span>
            </p>
            <p>
              <i>✓</i> Reminder set <span>Verified</span>
            </p>
          </div>
          <p className="ap-difference-note">
            You gave the go-ahead.
            <br />
            Now get back to your day.
          </p>
        </article>
      </div>
      <p className="ap-example-caption">
        Illustrative workflow. Available actions depend on your connected tools.
      </p>
    </section>
  );
}

const faqGroups = [
  {
    name: "Using Anticipy",
    items: [
      [
        "What is an AI action taker?",
        "Anticipy is a wearable AI pendant designed to turn spoken intentions into completed tasks. It identifies the next step, prepares an action, asks for your approval, and keeps a receipt of the outcome.",
      ],
      [
        "What can Anticipy help me get done?",
        "The examples on this page include email follow-ups, calendar events and task reminders. Available actions depend on the tools you connect and the permissions you give. Review the proposed action before approving it.",
      ],
      [
        "Will it act without asking me?",
        "No. You review the action and give the go-ahead. Anticipy is designed to follow through with your approval and show you the result.",
      ],
    ],
  },
  {
    name: "Privacy & control",
    items: [
      [
        "Who controls my information?",
        "You do. You can request access to, correction of, or deletion of your personal information. Anticipy’s privacy policy explains retention, service providers, and the choices available to you.",
      ],
      [
        "Can I see what happened?",
        "Anticipy’s action workflow is designed to keep a verified record of completed actions, so you can review the outcome instead of wondering whether it happened.",
      ],
    ],
  },
  {
    name: "Orders & shipping",
    items: [
      [
        "What’s included in the pre-order?",
        "Your pendant and matching chain, wireless charging pad, and the first year of AI service. The pre-order price is $149.99 USD. Free shipping is included in the US and Canada.",
      ],
      [
        "When will my Anticipy arrive?",
        "Shipping is currently estimated for Q4 2026. You’ll receive an order number, build updates and tracking when your unit ships.",
      ],
      [
        "What happens after the first year?",
        "The first year of AI service starts when your pendant ships. Continued cloud AI then requires a separate annual opt-in, currently projected at $99 USD/year. You will not be automatically enrolled.",
      ],
      [
        "Can I cancel my pre-order?",
        "Yes. Your pre-order is fully refundable any time before your unit ships. Contact hello@anticipy.ai to request a refund.",
      ],
    ],
  },
];

export function ActionFAQ({ finish }: { finish: PendantFinish }) {
  const [group, setGroup] = useState(0);
  return (
    <section className="ap-action-faq" id="questions">
      <div className="ap-faq-intro">
        <span className="ap-kicker">A LITTLE CLARITY GOES A LONG WAY.</span>
        <h2>
          Your questions.
          <br />
          Clear answers.
        </h2>
        <p>
          Something else on your mind?
          <br />
          <a href="https://www.anticipy.ai/book">
            Talk with Anticipation Labs ↗
          </a>
        </p>
      </div>
      <div className="ap-faq-body">
        <div
          className="ap-faq-controls"
          role="group"
          aria-label="Question categories"
        >
          {faqGroups.map((item, i) => (
            <button
              key={item.name}
              onClick={() => setGroup(i)}
              aria-pressed={group === i}
              aria-controls="ap-faq-answers"
            >
              {item.name}
            </button>
          ))}
        </div>
        <div id="ap-faq-answers" className="ap-faq-list" key={group}>
          {faqGroups[group].items.map(([q, a]) => (
            <details key={q}>
              <summary>
                <span>{q}</span>
                <b>+</b>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
      <div className="ap-faq-object">
        <img
          src={FINISHES[finish].image}
          alt={
            FINISHES[finish].label + " pendant with a continuous closed casing"
          }
          width="2048"
          height="1158"
          loading="lazy"
        />
        <span>Small object. Real possibility.</span>
      </div>
    </section>
  );
}

export function ActionManifesto() {
  return (
    <section className="ap-manifesto" id="manifesto">
      <div className="ap-manifesto-sticky">
        <span className="ap-kicker">ANTICIPY / THE ACTION-TAKER MANIFESTO</span>
        <h1>Screw busywork.</h1>
        <div className="ap-manifesto-reveal">
          <div className="ap-note-mask" aria-hidden="true">
            NOTE TAKER<span>More words. More work waiting.</span>
          </div>
          <div className="ap-manifesto-product">
            <img
              src={FINISHES.silver.image}
              width="2048"
              height="1158"
              alt="Anticipy revealed beneath the note-taker label"
            />
            <h2>ACTION TAKER</h2>
          </div>
        </div>
        <p>
          Your life needs follow-through.
          <br />
          Say it. Approve it. Get back to living.
        </p>
        <a href="#main" className="ap-campaign-cta">
          Meet your Anticipy <span>↓</span>
        </a>
        <a className="ap-campaign-back" href="/">
          Back to the main site ↗
        </a>
      </div>
    </section>
  );
}
