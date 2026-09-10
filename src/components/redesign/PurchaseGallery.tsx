"use client";

import { useEffect, useRef, useState } from "react";
import type { PendantFinish } from "./pendant-design";

const PHOTOS = [
  {
    src: "/redesign/purchase-both-finishes.webp",
    label: "Two finishes. One Anticipy.",
    alt: "Equally sized titanium silver and gold Anticipy pendants with their matching chains on a light surface",
    finish: "both",
  },
  {
    src: "/redesign/purchase-silver-worn.webp",
    label: "Worn in titanium silver",
    alt: "Titanium silver Anticipy pendant on a fine chain, worn with a white T-shirt outdoors",
    finish: "silver",
  },
  {
    src: "/redesign/purchase-gold-worn.webp",
    label: "Worn in gold",
    alt: "Gold Anticipy pendant worn with a dark top in natural window light",
    finish: "gold",
  },

  {
    src: "/redesign/purchase-silver-hand.webp",
    label: "A little perspective",
    alt: "The small titanium silver Anticipy pendant resting in cupped hands with its fine chain",
    finish: "silver",
  },
  {
    src: "/redesign/purchase-gold-detail.webp",
    label: "Gold, from another angle",
    alt: "An angled close-up of the gold Anticipy pendant showing its rounded closed casing and brushed finish",
    finish: "gold",
  },
] as const;

function Chevron({ previous = false }: { previous?: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={previous ? "m14 6-6 6 6 6" : "m10 6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PurchaseGallery({ finish, priority = false }: { finish: PendantFinish; priority?: boolean }) {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const openButton = useRef<HTMLButtonElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const previousFinish = useRef(finish);
  const photo = PHOTOS[selected];
  const select = (index: number) =>
    setSelected((index + PHOTOS.length) % PHOTOS.length);

  useEffect(() => {
    if (previousFinish.current === finish) return;
    previousFinish.current = finish;
    setSelected((current) =>
      PHOTOS[current].finish === "both"
        ? current
        : PHOTOS.findIndex((image) => image.finish === finish),
    );
  }, [finish]);

  useEffect(() => {
    if (!expanded || !dialog.current) return;
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      openButton.current?.focus({ preventScroll: true });
    };
  }, [expanded]);

  return (
    <div
      className="ap-purchase-gallery"
      role="region"
      aria-label="Anticipy product photos"
      aria-roledescription="carousel"
    >
      <div className="ap-gallery-main">
        <button
          className="ap-gallery-open"
          ref={openButton}
          type="button"
          aria-label={"Enlarge image: " + photo.label}
          onPointerDown={(event) => {
            pointer.current = { x: event.clientX, y: event.clientY };
            swiped.current = false;
          }}
          onPointerUp={(event) => {
            if (!pointer.current) return;
            const dx = event.clientX - pointer.current.x;
            const dy = event.clientY - pointer.current.y;
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
              swiped.current = true;
              select(selected + (dx < 0 ? 1 : -1));
            }
            pointer.current = null;
          }}
          onPointerCancel={() => {
            pointer.current = null;
          }}
          onClick={(event) => {
            if (event.detail === 0 || !swiped.current) setExpanded(true);
            swiped.current = false;
          }}
        >
          <img
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            width="1600"
            height="1600"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
          />
          <span className="ap-gallery-enlarge" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>{" "}
            View larger
          </span>
        </button>
        <button
          type="button"
          className="ap-gallery-arrow ap-gallery-prev"
          aria-label="Previous product photo"
          onClick={() => select(selected - 1)}
        >
          <Chevron previous />
        </button>
        <button
          type="button"
          className="ap-gallery-arrow ap-gallery-next"
          aria-label="Next product photo"
          onClick={() => select(selected + 1)}
        >
          <Chevron />
        </button>
      </div>
      <div className="ap-gallery-caption" aria-live="polite" aria-atomic="true">
        <span>{photo.label}</span>
        <span>
          {selected + 1} / {PHOTOS.length}
        </span>
      </div>
      <div
        className="ap-gallery-thumbnails"
        role="group"
        aria-label="Choose a product photo"
      >
        {PHOTOS.map((image, index) => (
          <button
            type="button"
            key={image.src}
            aria-label={image.label}
            aria-pressed={selected === index}
            onClick={() => select(index)}
          >
            <img
              src={image.src}
              alt=""
              width="160"
              height="160"
              loading="lazy"
            />
          </button>
        ))}
      </div>
      <dialog
        className="ap-gallery-dialog"
        ref={dialog}
        aria-label="Enlarged Anticipy product photo"
        onClose={() => setExpanded(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setExpanded(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            select(selected + 1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            select(selected - 1);
          }
        }}
      >
        <div className="ap-gallery-dialog-content">
          <button
            autoFocus
            type="button"
            className="ap-gallery-close"
            aria-label="Close enlarged photo"
            onClick={() => setExpanded(false)}
          >
            ✕
          </button>
          <img src={photo.src} alt={photo.alt} width="1600" height="1600" />
          <div className="ap-gallery-dialog-bar">
            <button
              type="button"
              aria-label="Previous enlarged photo"
              onClick={() => select(selected - 1)}
            >
              <Chevron previous />
            </button>
            <p aria-live="polite">
              {photo.label}{" "}
              <span>
                {selected + 1} / {PHOTOS.length}
              </span>
            </p>
            <button
              type="button"
              aria-label="Next enlarged photo"
              onClick={() => select(selected + 1)}
            >
              <Chevron />
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
