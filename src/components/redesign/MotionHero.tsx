"use client";

import { useEffect, useRef, useState } from "react";

/** One photographic product film, with a readable still for every fallback. */
export function MotionHero({ motion }: { motion: boolean }) {
  const host = useRef<HTMLElement>(null);
  const media = useRef<HTMLVideoElement>(null);
  const pausedByUser = useRef(false);
  const syncPlayback = useRef<() => void>(() => {});
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = media.current;
    const section = host.current;
    setReady(false);
    setPlaying(false);
    setFailed(false);
    if (
      !video ||
      !section ||
      !motion ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let visible = false;
    let loaded = false;
    let disposed = false;
    let unavailable = false;
    const sync = () => {
      if (disposed || unavailable) return;
      if (!visible || document.hidden || pausedByUser.current) {
        video.pause();
        return;
      }
      if (!loaded) {
        loaded = true;
        video.src = "/redesign/pendant-hero-film.mp4";
        video.load();
      }
      void video.play().catch(() => {
        if (!disposed) setPlaying(false);
      });
    };
    const onReady = () => {
      if (!disposed) setReady(true);
    };
    const onPlay = () => {
      if (!disposed) setPlaying(true);
    };
    const onPause = () => {
      if (!disposed) setPlaying(false);
    };
    const onError = () => {
      unavailable = true;
      if (!disposed) {
        setFailed(true);
        setReady(false);
        setPlaying(false);
      }
    };
    syncPlayback.current = sync;
    video.addEventListener("loadeddata", onReady);
    video.addEventListener("playing", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("error", onError);
    document.addEventListener("visibilitychange", sync);
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.05 },
    );
    observer.observe(section);
    return () => {
      disposed = true;
      syncPlayback.current = () => {};
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("playing", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("error", onError);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [motion]);

  const togglePlayback = () => {
    const next = playing && !paused;
    pausedByUser.current = next;
    setPaused(next);
    syncPlayback.current();
  };

  return (
    <section
      ref={host}
      className="ap-motion-hero"
      data-section-id="hero"
      aria-labelledby="ap-motion-title"
    >
      <div className="ap-motion-stage">
        <div
          className="ap-motion-art"
          aria-label={
            motion && ready
              ? "Silver and gold Anticipy pendants turning slowly on their fine chains"
              : "Titanium silver Anticipy pendant on a fine chain"
          }
          role="img"
        >
          <div className="ap-motion-camera">
            <img
              src="/redesign/pendant-hero-poster.webp"
              width="1600"
              height="900"
              alt=""
              loading="eager"
              decoding="async"
            />
            {motion && (
              <video
                ref={media}
                className={ready ? "is-ready" : ""}
                muted
                playsInline
                loop
                preload="none"
                disablePictureInPicture
                disableRemotePlayback
                aria-hidden="true"
              />
            )}
          </div>
        </div>

        <div className="ap-motion-copy">
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
          <div className="ap-motion-intro">
            <p>
              Your words become emails, plans and tasks.
              <br /> You have the final say.
            </p>
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

        <div className="ap-motion-edge" aria-hidden="true">
          <span>TITANIUM SILVER</span>
          <span>GOLD</span>
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
          {motion && !failed && (
            <button
              type="button"
              onClick={togglePlayback}
              className="ap-motion-control"
              aria-label={playing ? "Pause pendant film" : "Play pendant film"}
            >
              <span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span>
              {playing ? "Pause film" : "Play film"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
