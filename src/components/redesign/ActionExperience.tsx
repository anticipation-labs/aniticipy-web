"use client";

import { useEffect, useRef, useState } from "react";

const workflow = [
  {
    title: "You talk",
    text: "“I’ll send that proposal Friday.”",
    quote: true,
  },
  {
    title: "Anticipy prepares",
    text: "Drafts the email and creates a Friday reminder.",
  },
  {
    title: "You approve",
    text: "Review, edit or approve it from your phone.",
  },
];

// Fill in with a real, consenting customer before this renders in production.
const testimonial = {
  quote:
    "After a client call, Anticipy prepared the follow-up email and added the promised deliverables to my calendar. I reviewed everything in under a minute.",
  name: "",
  role: "",
};

function useEntered(motion: boolean) {
  const ref = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!motion || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [motion]);

  return [ref, entered || !motion] as const;
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="m3.5 8.5 3 3 6-7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ActionExperience({ motion }: { motion: boolean }) {
  const [section, entered] = useEntered(motion);

  return (
    <section
      ref={section}
      id="experience"
      tabIndex={-1}
      className="ap-experience"
      data-section-id="experience"
      data-entered={entered}
    >
      <div className="ap-experience-heading">
        <h2>
          Turn words
          <br />
          into <span>action.</span>
        </h2>
        <div className="ap-experience-intro">
          <p>
            Anticipy prepares the next step in the apps you connect. You decide
            what goes ahead.
          </p>
          <a href="#order">
            Find your Anticipy <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <ol className="ap-workflow">
        {workflow.map(({ title, text, quote }, i) => (
          <li className="ap-workflow-step" key={title}>
            <span className="ap-workflow-number">{i + 1}.</span>
            <h3>{title}</h3>
            <p className={quote ? "ap-workflow-quote" : undefined}>{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function SeeItWork({ motion }: { motion: boolean }) {
  const [section, entered] = useEntered(motion);

  return (
    <section
      ref={section}
      id="see-it-work"
      className="ap-demo"
      data-section-id="see-it-work"
      data-entered={entered}
    >
      <div className="ap-demo-heading">
        <span className="ap-kicker">SEE IT WORK</span>
        <h2>
          One sentence.
          <br />
          Handled by Friday.
        </h2>
        <p>
          Follow a single commitment from the moment it’s said to the moment
          it lands in your inbox and calendar.
        </p>
        <small>Illustrative example.</small>
      </div>

      <ol className="ap-demo-steps">
        <li className="ap-demo-step">
          <span className="ap-demo-label">
            <b>01</b> What you said
          </span>
          <div className="ap-demo-card ap-demo-said">
            <span className="ap-demo-wave" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <i key={i} />
              ))}
            </span>
            <blockquote>
              “Sounds good, Maya. I’ll send that proposal Friday.”
            </blockquote>
            <span className="ap-demo-meta">Client call · Tuesday, 3:12 PM</span>
          </div>
        </li>

        <li className="ap-demo-step">
          <span className="ap-demo-label">
            <b>02</b> What Anticipy detected
          </span>
          <div className="ap-demo-card">
            <p className="ap-demo-card-title">A commitment to follow up</p>
            <dl className="ap-demo-fields">
              <div>
                <dt>Action</dt>
                <dd>Send the proposal</dd>
              </div>
              <div>
                <dt>To</dt>
                <dd>Maya Lin, Northwind</dd>
              </div>
              <div>
                <dt>Due</dt>
                <dd>Friday</dd>
              </div>
            </dl>
          </div>
        </li>

        <li className="ap-demo-step">
          <span className="ap-demo-label">
            <b>03</b> What it prepared
          </span>
          <div className="ap-demo-pair">
            <div className="ap-demo-card ap-demo-email">
              <span className="ap-demo-tag">Email draft</span>
              <p>
                <span>To</span> maya@northwind.co
              </p>
              <p>
                <span>Subject</span> Proposal for Northwind
              </p>
              <p className="ap-demo-body">
                Hi Maya, thanks for the time today. As promised, here’s the
                proposal we discussed…
              </p>
            </div>
            <div className="ap-demo-card ap-demo-event">
              <span className="ap-demo-tag">Reminder</span>
              <strong>Send Northwind proposal</strong>
              <p>Friday · 9:00 AM</p>
            </div>
          </div>
        </li>

        <li className="ap-demo-step">
          <span className="ap-demo-label">
            <b>04</b> What you approved
          </span>
          <div className="ap-demo-card ap-demo-approve">
            <div>
              <p className="ap-demo-card-title">2 actions ready for review</p>
              <span className="ap-demo-meta">On your phone · 3:14 PM</span>
            </div>
            <div className="ap-demo-buttons" aria-hidden="true">
              <span>Edit</span>
              <span className="is-approved">
                <Check /> Approved
              </span>
            </div>
          </div>
        </li>

        <li className="ap-demo-step">
          <span className="ap-demo-label">
            <b>05</b> The result
          </span>
          <div className="ap-demo-pair">
            <div className="ap-demo-card ap-demo-result">
              <span className="ap-demo-app">Gmail</span>
              <strong>Proposal for Northwind</strong>
              <p>
                <Check /> Draft ready to send
              </p>
            </div>
            <div className="ap-demo-card ap-demo-result">
              <span className="ap-demo-app">Google Calendar</span>
              <strong>Send Northwind proposal</strong>
              <p>
                <Check /> Friday, 9:00 AM
              </p>
            </div>
          </div>
        </li>
      </ol>
    </section>
  );
}

export function Testimonial() {
  if (!testimonial.name && process.env.NODE_ENV === "production") return null;
  return (
    <figure className="ap-testimonial">
      <blockquote>“{testimonial.quote}”</blockquote>
      <figcaption>
        — {testimonial.name || "Name"}, {testimonial.role || "Founder at Company"}
      </figcaption>
    </figure>
  );
}

// Founder-confirmed individual use of early prototypes; no organizational endorsement or logo license.
export function PrototypeTrust() {
  return (
    <aside className="ap-prototype-trust" aria-label="Early prototype users">
      <p>
        Early versions have been used by{" "}
        <strong>founders of YC-backed companies</strong> and people who have
        worked at <strong>Mentra</strong> and <strong>Open Door Law.</strong>
      </p>
      <span>
        Individual use of early prototypes. These organizations have not
        endorsed Anticipy.
      </span>
    </aside>
  );
}
