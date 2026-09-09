"use client";

import { useEffect, useRef, useState } from "react";

const capabilities = [
  {
    title: "Send the follow-up.",
    text: "Emails prepared from your conversation, ready to send.",
  },
  {
    title: "Make the plan.",
    text: "Calendar events with the people, place and time already in place.",
  },
  {
    title: "Keep things moving.",
    text: "Tasks and reminders for what needs to happen next.",
  },
];

export function ActionExperience({ motion }: { motion: boolean }) {
  const section = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!motion || !section.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(section.current);
    return () => observer.disconnect();
  }, [motion]);

  return (
    <section
      ref={section}
      id="experience"
      tabIndex={-1}
      className="ap-experience"
      data-section-id="experience"
      data-entered={entered || !motion}
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
      <div className="ap-experience-rows">
        {capabilities.map(({ title, text }) => (
          <div className="ap-experience-row" key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
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
