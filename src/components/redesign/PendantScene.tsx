"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type PendantSceneHandle = { setProgress: (progress: number) => void };
type Controller = { update: (progress: number) => void; dispose: () => void };

/** Load the renderer near the product chapter; retain the photograph if WebGL is unavailable. */
export const PendantScene = forwardRef<
  PendantSceneHandle,
  { mode: "benefits" | "hardware" }
>(function PendantScene({ mode }, ref) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const controller = useRef<Controller | null>(null);
  const position = useRef(0);
  const [ready, setReady] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      setProgress(progress) {
        position.current = progress;
        controller.current?.update(progress);
      },
    }),
    [],
  );

  useEffect(() => {
    let cancelled = false;
    let started = false;
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        observer.disconnect();
        try {
          const { createPendantScene } = await import("./pendant-renderer");
          if (cancelled || !canvas.current) return;
          controller.current = createPendantScene(canvas.current, mode);
          controller.current.update(position.current);
          setReady(true);
        } catch {
          // A product photograph and all chapter controls remain available without WebGL.
        }
      },
      { rootMargin: "350px" },
    );
    if (host.current) observer.observe(host.current);
    return () => {
      cancelled = true;
      observer.disconnect();
      controller.current?.dispose();
      controller.current = null;
    };
  }, [mode]);

  return (
    <div ref={host} className={"ap-product-scene" + (ready ? " is-ready" : "")}>
      <img
        className="ap-scene-fallback"
        src="/redesign/pendant-cutout-closed.webp"
        alt="Silver Anticipy pendant with a domed crown and a small upper aperture"
        width="2048"
        height="1158"
        loading="lazy"
      />
      <canvas ref={canvas} aria-hidden="true" />
    </div>
  );
});
