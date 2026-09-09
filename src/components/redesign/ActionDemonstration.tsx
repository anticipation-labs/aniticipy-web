"use client";

import { useEffect, useRef, useState } from "react";

const examples = [
  {
    name: "Make a plan",
    context: "In the middle of making plans",
    title: "You make the plan.",
    outcome: "Anticipy puts it in your calendar.",
    quote: "Dinner with Alex on Friday at seven. Put it in my calendar.",
    button: "Add the event",
    done: "Dinner is on your calendar.",
  },
  {
    name: "Send a follow-up",
    context: "Walking out of a meeting",
    title: "You finish the meeting.",
    outcome: "Anticipy handles the follow-up.",
    quote:
      "Email the timeline to the project team. Ask for feedback by Friday.",
    button: "Send the email",
    done: "The team has the timeline.",
  },
  {
    name: "Remember a deadline",
    context: "Getting on with your day",
    title: "You mention a deadline.",
    outcome: "Anticipy sets the reminder.",
    quote:
      "This trial renews on the 24th. Remind me to cancel it the day before.",
    button: "Set the reminder",
    done: "Your reminder is set for the 23rd.",
  },
];

function CalendarPreview({ complete }: { complete: boolean }) {
  return (
    <div className="ap-app-calendar">
      <div className="ap-app-title">
        <span>Calendar</span>
        <strong>September</strong>
        <span>‹ &nbsp; ›</span>
      </div>
      <div className="ap-calendar-days">
        {["THU 17", "FRI 18", "SAT 19"].map((day, i) => (
          <span key={day} className={i === 1 ? "selected" : ""}>
            {day}
          </span>
        ))}
      </div>
      <div className="ap-calendar-grid">
        <div className="ap-calendar-hours">
          <span>6 PM</span>
          <span>7 PM</span>
          <span>8 PM</span>
        </div>
        <div className="ap-calendar-event">
          <span>{complete ? "✓ Added" : "Proposed event"}</span>
          <strong>Dinner with Alex</strong>
          <p>7:00 – 8:00 PM</p>
        </div>
        <div className="ap-calendar-time" aria-hidden="true" />
      </div>
    </div>
  );
}

function EmailPreview({ complete }: { complete: boolean }) {
  return (
    <div className="ap-app-email">
      <div className="ap-app-title">
        <span>{complete ? "Sent" : "New message"}</span>
        <span>↗</span>
      </div>
      <p className="ap-email-field">
        <span>To</span> Project team
      </p>
      <p className="ap-email-field">
        <span>Subject</span> Project timeline & next steps
      </p>
      <div className="ap-email-body">
        <p>Hi team,</p>
        <p>
          Here’s the timeline we discussed today. Please send your feedback by
          Friday so we can keep things moving.
        </p>
        <p>Thanks!</p>
      </div>
      <div className="ap-demo-attachment">
        <span aria-hidden="true">↗</span>
        <div>
          <strong>Project timeline.pdf</strong>
          <small>From your connected files</small>
        </div>
      </div>
    </div>
  );
}

function ReminderPreview({ complete }: { complete: boolean }) {
  return (
    <div className="ap-app-reminder">
      <div className="ap-app-title">
        <span>Reminders</span>
        <span>Personal</span>
      </div>
      <div className="ap-reminder-date">
        <span>SEPTEMBER</span>
        <strong>23</strong>
        <span>One day before renewal</span>
      </div>
      <div className="ap-reminder-task">
        <i aria-hidden="true">{complete ? "✓" : ""}</i>
        <div>
          <strong>Cancel the trial</strong>
          <p>9:00 AM · Personal reminders</p>
        </div>
      </div>
      <p className="ap-reminder-caption">
        {complete
          ? "You’ll be reminded before the renewal."
          : "Ready to add to your reminders."}
      </p>
    </div>
  );
}

export function ActionDemonstration({ motion }: { motion: boolean }) {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState(0);
  const [visible, setVisible] = useState(false);
  const item = examples[active];

  useEffect(() => {
    if (!section.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!visible || !motion || phase !== 0) return;
    const timer = window.setTimeout(() => setPhase(1), 1700);
    return () => window.clearTimeout(timer);
  }, [visible, motion, phase, active]);

  function choose(index: number) {
    setActive(index);
    setPhase(0);
  }
  return (
    <section
      ref={section}
      id="experience"
      tabIndex={-1}
      className="ap-workflow"
      data-section-id="experience"
      data-phase={phase}
      data-visible={visible}
    >
      <div className="ap-workflow-heading">
        <h2>
          One conversation.
          <br />
          More off your plate.
        </h2>
        <p>
          Anticipy turns what you say into actions in the tools you connect.
          Explore an example.
        </p>
      </div>
      <div
        className="ap-usecase-tabs"
        role="group"
        aria-label="Action examples"
      >
        {examples.map((example, i) => (
          <button
            key={example.name}
            aria-pressed={active === i}
            aria-controls="ap-workflow-example"
            onClick={() => choose(i)}
          >
            <span>0{i + 1}</span>
            {example.name}
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <div
        id="ap-workflow-example"
        className="ap-workflow-example"
        key={active}
      >
        <div className="ap-spoken-panel">
          <span className="ap-example-context">{item.context}</span>
          <blockquote>“{item.quote}”</blockquote>
          <div className="ap-voice-line" aria-hidden="true">
            {Array.from({ length: 35 }, (_, i) => (
              <i
                key={i}
                style={{
                  height: `${6 + Math.sin(i * 1.5) ** 2 * 30}px`,
                  animationDelay: `${i * 0.04}s`,
                }}
              />
            ))}
          </div>
          <div className="ap-spoken-caption">
            <strong>Your conversation</strong>
            <span>→</span>
          </div>
        </div>
        <div className="ap-outcome-panel">
          <div className="ap-outcome-heading">
            <p>{item.title}</p>
            <h3>{item.outcome}</h3>
          </div>
          <div className="ap-app-preview" data-complete={phase === 2}>
            {active === 0 ? (
              <CalendarPreview complete={phase === 2} />
            ) : active === 1 ? (
              <EmailPreview complete={phase === 2} />
            ) : (
              <ReminderPreview complete={phase === 2} />
            )}
          </div>
          <div className="ap-demo-control">
            <p role="status">
              {phase === 2
                ? item.done
                : phase === 1
                  ? "Review the details. You decide what happens."
                  : "Your words become a proposed action."}
            </p>
            <button onClick={() => setPhase(phase === 2 ? 0 : phase + 1)}>
              {phase === 2
                ? "Replay example"
                : phase === 0
                  ? "See proposed action"
                  : item.button}
              <span aria-hidden="true">{phase === 2 ? "↺" : "→"}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="ap-workflow-caption">
        <span>
          Example workflow · No email, event or reminder is created by this
          demo.
        </span>
        <span>Available actions depend on your connected tools.</span>
      </div>
    </section>
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
