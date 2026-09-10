"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { FINISHES, type PendantFinish } from "./pendant-design";
import type { PendantSceneHandle } from "./PendantScene";

const clamp = (progress: number) =>
  Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;

/** A reference-based photographic turn follows the product-story scroll timeline. */
export const PhotorealPendantScene = forwardRef<
  PendantSceneHandle,
  { finish: PendantFinish; motion: boolean }
>(function PhotorealPendantScene({ finish, motion }, ref) {
  const host = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLVideoElement>(null);
  const progress = useRef(0);
  const requestSeek = useRef<() => void>(() => {});
  const [readyFinish, setReadyFinish] = useState<PendantFinish | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      setProgress(value) {
        progress.current = clamp(value);
        requestSeek.current();
      },
    }),
    [],
  );

  useEffect(() => {
    setReadyFinish(null);
    const video = media.current;
    if (!motion || !video) return;

    let cancelled = false;
    let failed = false;
    let started = false;
    let frame = 0;
    const reveal = () => {
      if (!cancelled && !failed && video.readyState >= 2) {
        setReadyFinish(finish);
      }
    };
    const seek = () => {
      frame = 0;
      if (
        cancelled ||
        failed ||
        !started ||
        !Number.isFinite(video.duration) ||
        video.duration <= 0 ||
        video.seeking
      ) {
        return;
      }
      // Leave the final decoded frame on screen instead of seeking past the clip.
      const target = progress.current * Math.max(0, video.duration - 0.05);
      if (Math.abs(video.currentTime - target) <= 1 / 24) {
        reveal();
        return;
      }
      try {
        video.currentTime = target;
      } catch {
        // Metadata can precede seekable data; a subsequent load event retries.
      }
    };
    const schedule = () => {
      if (!cancelled && !failed && started && !frame) {
        frame = requestAnimationFrame(seek);
      }
    };
    const onSeeked = () => {
      reveal();
      // A scroll event during decoding only updates the latest target ref.
      schedule();
    };
    const onError = () => {
      failed = true;
      cancelAnimationFrame(frame);
      frame = 0;
      setReadyFinish(null);
    };
    requestSeek.current = schedule;
    video.addEventListener("loadedmetadata", schedule);
    video.addEventListener("loadeddata", schedule);
    video.addEventListener("canplay", schedule);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started || cancelled) return;
        started = true;
        observer.disconnect();
        video.preload = "auto";
        video.src = `/redesign/pendant-turn-${finish}.mp4`;
        video.load();
      },
      { rootMargin: "350px" },
    );
    if (host.current) observer.observe(host.current);

    return () => {
      cancelled = true;
      requestSeek.current = () => {};
      observer.disconnect();
      cancelAnimationFrame(frame);
      video.removeEventListener("loadedmetadata", schedule);
      video.removeEventListener("loadeddata", schedule);
      video.removeEventListener("canplay", schedule);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [finish, motion]);

  return (
    <div
      ref={host}
      className={
        "ap-photoreal-scene" +
        (motion && readyFinish === finish ? " is-ready" : "")
      }
    >
      <img
        src={`/redesign/pendant-turn-${finish}.webp`}
        alt={`${FINISHES[finish].label} Anticipy pendant on a fine chain`}
        loading="lazy"
        decoding="async"
      />
      {motion && (
        <video
          key={finish}
          ref={media}
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
        />
      )}
    </div>
  );
});
