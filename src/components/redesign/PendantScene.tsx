"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { FINISHES, type PendantFinish } from "./pendant-design";
import { PendantOutline } from "./PendantOutline";

export type PendantSceneHandle = { setProgress: (progress: number) => void };
type Controller = {
  update: (progress: number) => void;
  setFinish: (finish: PendantFinish) => void;
  dispose: () => void;
};

/** Keep an inline contour until the requested 3D frame has actually been drawn. */
export const PendantScene = forwardRef<
  PendantSceneHandle,
  { mode: "benefits" | "hardware"; finish: PendantFinish }
>(function PendantScene({ mode, finish }, ref) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const controller = useRef<Controller | null>(null);
  const position = useRef(0);
  const selectedFinish = useRef(finish);
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
    setReady(false);
    const targetCanvas = canvas.current;
    const onContextLost = (event: Event) => {
      event.preventDefault();
      setReady(false);
      controller.current?.dispose();
      controller.current = null;
    };
    targetCanvas?.addEventListener("webglcontextlost", onContextLost);
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        observer.disconnect();
        try {
          const { createPendantScene } = await import("./pendant-renderer");
          if (cancelled || !canvas.current) return;
          controller.current = createPendantScene(canvas.current, mode, () => {
            if (!cancelled) setReady(true);
          });
          controller.current.setFinish(selectedFinish.current);
          controller.current.update(position.current);
        } catch {
          // The contour and chapter controls remain available without WebGL.
        }
      },
      { rootMargin: "350px" },
    );
    if (host.current) observer.observe(host.current);
    return () => {
      cancelled = true;
      observer.disconnect();
      targetCanvas?.removeEventListener("webglcontextlost", onContextLost);
      controller.current?.dispose();
      controller.current = null;
    };
  }, [mode]);

  useEffect(() => {
    selectedFinish.current = finish;
    controller.current?.setFinish(finish);
  }, [finish]);

  return (
    <div
      ref={host}
      className={"ap-product-scene" + (ready ? " is-ready" : "")}
      role="img"
      aria-label={`${FINISHES[finish].label} Anticipy pendant with a domed crown and a small upper aperture`}
    >
      <PendantOutline className="ap-scene-outline" />
      <canvas ref={canvas} aria-hidden="true" />
    </div>
  );
});
