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

const faqGroups = [
  {
    name: "Using Anticipy",
    items: [
      [
        "What is an AI action taker?",
        "Anticipy is a wearable AI pendant designed to turn spoken intentions into completed tasks. It identifies the next step, prepares an action, asks for your approval, and shows you the result.",
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
        "Anticipy’s action workflow is designed to show the status of completed actions, so you can review the outcome instead of wondering whether it happened.",
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

export function ActionFAQ() {
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
      <figure className="ap-faq-object">
        <div className="ap-faq-pair">
          {(["gold", "silver"] as const).map((finish) => (
            <div
              className={"ap-faq-pendant ap-faq-pendant-" + finish}
              key={finish}
            >
              <img
                src={FINISHES[finish].image}
                alt={
                  FINISHES[finish].label +
                  " Anticipy pendant with a seamless closed casing"
                }
                width="2048"
                height="1158"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        <figcaption>Titanium silver. Gold. Your choice.</figcaption>
      </figure>
    </section>
  );
}

export function ActionManifesto() {
  return (
    <section className="ap-manifesto" id="manifesto">
      <div className="ap-manifesto-sticky">
        <span className="ap-kicker">ANTICIPY / THE ACTION-TAKER MANIFESTO</span>
        <h1>
          Not a note taker.
          <br />
          An action taker.
        </h1>
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
          Less time managing tasks. More time living.
        </p>
        <a href="#main" className="ap-campaign-cta">
          Explore Anticipy <span>↓</span>
        </a>
        <a className="ap-campaign-back" href="/">
          Back to the main site ↗
        </a>
      </div>
    </section>
  );
}
