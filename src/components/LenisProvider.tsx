"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/" || pathname === "/action-taker" || pathname === "/waitlist" || pathname === "/book" || pathname.startsWith("/pre-orders") || pathname.startsWith("/app")) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup: (() => void) | undefined;
    const syncMotion = () => {
      cleanup?.();
      cleanup = undefined;
      if (preference.matches) return;
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
      };
    };
    syncMotion();
    preference.addEventListener("change", syncMotion);
    return () => {
      cleanup?.();
      preference.removeEventListener("change", syncMotion);
    };
  }, [pathname]);

  return <>{children}</>;
}
