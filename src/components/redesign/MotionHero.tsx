"use client";

import { useEffect, useRef, useState } from "react";
import { FINISHES, type PendantFinish } from "./pendant-design";
import { PendantOutline } from "./PendantOutline";

type HeroController = {
  setHeroFrame: (
    progress: number,
    intro: number,
    finish: PendantFinish,
    pointer?: number,
    compact?: boolean,
  ) => void;
  dispose: () => void;
};
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (a: number, b: number, p: number) => {
  const t = clamp((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** A single registered object, from its first contour to its last scroll pose. */
export function MotionHero({
  motion,
  finish,
  onFinishChange,
}: {
  motion: boolean;
  finish: PendantFinish;
  onFinishChange: (finish: PendantFinish) => void;
}) {
  const host = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const controller = useRef<HeroController | null>(null);
  const selected = useRef<PendantFinish>(finish);
  const replay = useRef<() => void>(() => {});
  const invalidate = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [cinematic, setCinematic] = useState(false);

  useEffect(() => {
    const section = host.current;
    if (!section || !canvas.current) return;
    let cancelled = false,
      visible = false,
      started = false,
      frame = 0;
    let elapsed = 0,
      previous = 0,
      pointer = 0,
      finishUntil = 0;
    const media = window.matchMedia(
      "(min-width: 900px) and (min-height: 650px)",
    );
    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches || !motion;
    const resetPresentation = () => {
      setCinematic(false);
      setChapter(0);
      for (const [key, value] of Object.entries({
        "--hero-dark": "0",
        "--hero-first": "1",
        "--hero-middle": "0",
        "--hero-last": "0",
        "--hero-object": "1",
        "--hero-shift": "0px",
        "--hero-progress": "0",
      }))
        section.style.setProperty(key, value);
    };
    resetPresentation();
    setReady(false);
    const draw = (time: number) => {
      frame = 0;
      if (cancelled || !visible || document.hidden || !controller.current) {
        previous = 0;
        return;
      }
      const rect = section.getBoundingClientRect();
      const cinematic = media.matches && !reduced;
      const layoutPending =
        cinematic !== section.classList.contains("is-cinematic");
      const p = cinematic
        ? clamp(-rect.top / Math.max(1, rect.height - window.innerHeight))
        : 0;
      if (previous) elapsed += Math.min(80, time - previous);
      previous = time;
      if (reduced || p > 0.04) elapsed = 3200;
      const intro = clamp(elapsed / 3200);
      setCinematic(cinematic);
      section.style.setProperty(
        "--hero-dark",
        String(smooth(0.15, 0.27, p) * (1 - smooth(0.61, 0.75, p))),
      );
      section.style.setProperty(
        "--hero-first",
        String(1 - smooth(0.055, 0.18, p)),
      );
      section.style.setProperty(
        "--hero-middle",
        String(smooth(0.2, 0.29, p) * (1 - smooth(0.54, 0.65, p))),
      );
      section.style.setProperty("--hero-last", String(smooth(0.72, 0.84, p)));
      section.style.setProperty("--hero-object", "1");
      section.style.setProperty(
        "--hero-shift",
        `${-smooth(0.055, 0.18, p) * 35}px`,
      );
      section.style.setProperty("--hero-progress", String(p));
      const nextChapter = p < 0.18 ? 0 : p < 0.74 ? 1 : 2;
      setChapter(nextChapter);
      controller.current.setHeroFrame(
        p,
        intro,
        selected.current,
        reduced ? 0 : pointer,
        !media.matches,
      );
      if (intro < 1 || time < finishUntil || layoutPending)
        frame = requestAnimationFrame(draw);
      else previous = 0;
    };
    const request = () => {
      if (!frame && !cancelled && visible) frame = requestAnimationFrame(draw);
    };
    invalidate.current = () => {
      finishUntil = performance.now() + 500;
      request();
    };
    replay.current = () => {
      elapsed = previous = 0;
      request();
    };
    const onPointer = (event: PointerEvent) => {
      if (reduced || event.pointerType !== "mouse") return;
      pointer = clamp(event.clientX / window.innerWidth) * 2 - 1;
      request();
    };
    const onLeave = () => {
      pointer = 0;
      request();
    };
    const onVisibility = () => {
      previous = 0;
      request();
    };
    const observer = new IntersectionObserver(
      async ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible) {
          cancelAnimationFrame(frame);
          frame = 0;
          previous = 0;
          return;
        }
        if (!started) {
          started = true;
          try {
            const { createPendantScene } = await import("./pendant-renderer");
            if (cancelled || !canvas.current) return;
            controller.current = createPendantScene(
              canvas.current,
              "hero",
              () => {
                if (!cancelled) setReady(true);
              },
            );
          } catch {
            // Keep the inline contour and purchase content if WebGL is unavailable.
            resetPresentation();
            return;
          }
        }
        request();
      },
      { rootMargin: "120px" },
    );
    const onContextLost = (event: Event) => {
      event.preventDefault();
      setReady(false);
      resetPresentation();
      cancelAnimationFrame(frame);
      frame = 0;
      controller.current?.dispose();
      controller.current = null;
    };
    const targetCanvas = canvas.current;
    targetCanvas.addEventListener("webglcontextlost", onContextLost);
    observer.observe(section);
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    document.addEventListener("visibilitychange", onVisibility);
    section.addEventListener("pointermove", onPointer);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      document.removeEventListener("visibilitychange", onVisibility);
      section.removeEventListener("pointermove", onPointer);
      section.removeEventListener("pointerleave", onLeave);
      targetCanvas.removeEventListener("webglcontextlost", onContextLost);
      controller.current?.dispose();
      controller.current = null;
      invalidate.current = replay.current = () => {};
    };
  }, [motion]);

  useEffect(() => {
    selected.current = finish;
    invalidate.current();
  }, [finish]);
  useEffect(() => {
    invalidate.current();
  }, [cinematic, ready]);

  const chooseFinish = (next: PendantFinish) => {
    selected.current = next;
    onFinishChange(next);
    invalidate.current();
  };

  return (
    <section
      ref={host}
      className={
        "ap-motion-hero" +
        (ready ? " is-ready" : "") +
        (cinematic ? " is-cinematic" : "")
      }
      data-section-id="hero"
      aria-labelledby="ap-motion-title"
    >
      <div className="ap-motion-stage">
        <div className="ap-motion-dark" aria-hidden="true" />
        <div
          className="ap-motion-art"
          role="img"
          aria-label={`${FINISHES[finish].label} Anticipy pendant with a continuous rounded body in brushed metal`}
        >
          <PendantOutline className="ap-motion-outline" />
          <canvas ref={canvas} aria-hidden="true" />
        </div>
        <div
          className="ap-motion-copy"
          aria-hidden={chapter !== 0}
          inert={chapter !== 0 ? ("" as unknown as boolean) : undefined}
        >
          <p className="ap-motion-eyebrow">
            <span>ANTICIPY</span>
            <span>PERSONAL AI. WORN.</span>
          </p>
          <h1
            id="ap-motion-title"
            aria-label="Not a note taker. An action taker."
          >
            <span className="ap-motion-lead">
              <span>Not a note taker.</span>
            </span>
            <span className="ap-motion-line">
              <span>An action</span>
            </span>
            <span className="ap-motion-line">
              <span>taker.</span>
            </span>
          </h1>
          <p className="ap-motion-summary">
            Anticipy is a wearable AI pendant that automatically turns
            commitments from your conversations into ready-to-send emails,
            calendar events and tasks.
          </p>
          <div className="ap-motion-intro">
            <a
              className="ap-motion-buy"
              href="#order"
              data-cta-id="hero-order"
              data-cta-type="anchor"
            >
              Buy Now <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div
          className="ap-motion-finishes"
          aria-hidden={chapter !== 0}
          inert={chapter !== 0 ? ("" as unknown as boolean) : undefined}
        >
          <div role="group" aria-label="Preview pendant finish">
            {(["silver", "gold"] as const).map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => chooseFinish(color)}
                aria-pressed={finish === color}
                aria-label={`Preview ${FINISHES[color].label}`}
              >
                <span className={`ap-finish-dot ${color}`} aria-hidden="true" />
              </button>
            ))}
          </div>
          <span>{FINISHES[finish].label}</span>
        </div>
        <div
          className="ap-motion-chapter ap-motion-chapter-middle"
          aria-hidden={cinematic && chapter !== 1}
        >
          <div>
            <p className="ap-chapter-label">01 / A LITTLE LESS TO CARRY</p>
            <h2>
              Small object.
              <br />
              Real possibility.
            </h2>
          </div>
          <p className="ap-chapter-aside">
            A thought becomes a next step.
            <br />
            An email. A plan. A task.
            <br />
            <span>Always with your approval.</span>
          </p>
        </div>
        <div
          className="ap-motion-chapter ap-motion-chapter-last"
          aria-hidden={cinematic && chapter !== 2}
          inert={
            cinematic && chapter !== 2 ? ("" as unknown as boolean) : undefined
          }
        >
          <div>
            <p className="ap-chapter-label">02 / MADE TO BE WITH YOU</p>
            <h2>
              Less on your mind.
              <br />
              More in your life.
            </h2>
            <p className="ap-chapter-description">
              Titanium silver or gold.
              <br />A little more room for the everyday.
            </p>
            <a
              className="ap-motion-buy"
              href="#order"
              data-cta-id="hero-finishes"
              data-cta-type="anchor"
            >
              Find your Anticipy <span aria-hidden="true">↗</span>
            </a>
          </div>
          <figure className="ap-motion-duo-fallback">
            <img
              src="/redesign/purchase-both-finishes.webp"
              width="1600"
              height="1200"
              alt="Silver and gold Anticipy pendants side by side"
              loading="lazy"
            />
            <figcaption>Two finishes. The same possibilities.</figcaption>
          </figure>
        </div>
        <div className="ap-motion-foot">
          <a href="#experience" data-cta-id="hero-demo" data-cta-type="anchor">
            <span className="ap-motion-scroll" aria-hidden="true">
              ↓
            </span>
            <span>Discover what follows.</span>
          </a>
          <span className="ap-motion-signoff">
            LESS ON YOUR MIND. MORE IN YOUR LIFE.
          </span>
          {ready && motion && chapter === 0 && (
            <button
              type="button"
              onClick={() => replay.current()}
              className="ap-motion-control"
              aria-label="Replay pendant opening"
            >
              <span aria-hidden="true">↻</span> Replay opening
            </button>
          )}
          {chapter > 0 && (
            <span className="ap-motion-chapter-count">0{chapter + 1} / 03</span>
          )}
        </div>
      </div>
    </section>
  );
}
