"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useFullscreen } from "@/lib/useFullscreen";

// three.js and the model only download once the 3D is started
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

type Idle = (cb: () => void, opts?: { timeout: number }) => number;

/**
 * Hero picture of the finished house. A still render shows immediately; the live 3D model takes over
 * on its own once the page is idle on desktop, or when tapped on phones and tablets.
 */
export default function HeroModel() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const { isFullscreen, toggle } = useFullscreen(stageRef);

  // Desktop: start the 3D as soon as the visitor moves the mouse, scrolls or types (so it never competes
  // with the first paint), or on its own once the browser is idle a few seconds after load.
  useEffect(() => {
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!desktop) return;
    const events = ["pointermove", "scroll", "keydown", "wheel"] as const;
    let idleId = 0;
    let timer = 0;
    const go = () => setActive(true);
    const fallback = () => {
      timer = window.setTimeout(() => {
        const ric = (window as Window & { requestIdleCallback?: Idle }).requestIdleCallback;
        if (ric) idleId = ric(go, { timeout: 2000 });
        else go();
      }, 8000);
    };
    events.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
    if (document.readyState === "complete") fallback();
    else window.addEventListener("load", fallback, { once: true });
    return () => {
      events.forEach((e) => window.removeEventListener(e, go));
      window.removeEventListener("load", fallback);
      const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (idleId && cic) cic(idleId);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const startAndMaybeFullscreen = (fullscreen: boolean) => {
    setActive(true);
    if (fullscreen && !isFullscreen) toggle();
  };

  const showScene = active && !failed;

  return (
    <figure className="hero-model">
      <div ref={stageRef} className="hero-model-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={`hero-poster${ready ? " hidden" : ""}`}
          src="/hero-house.webp"
          srcSet="/hero-house-640.webp 640w, /hero-house.webp 1064w"
          sizes="(max-width: 1024px) 100vw, 45vw"
          alt="3D view of the finished house: three floors, terrace tanks, and the front stair"
          width={1064}
          height={1064}
          fetchPriority="high"
          decoding="async"
        />

        {showScene && (
          <HeroScene isFullscreen={isFullscreen} onReady={() => setReady(true)} onError={() => setFailed(true)} />
        )}

        {!active && (
          <button className="hero-3d-btn" onClick={() => startAndMaybeFullscreen(false)}>
            Turn it in 3D
          </button>
        )}
        {active && !ready && !failed && <div className="hero-model-status">Loading 3D model…</div>}

        {(ready || !active) && (
          <button
            className="hero-fs-btn"
            onClick={() => (ready ? toggle() : startAndMaybeFullscreen(true))}
            aria-label={isFullscreen ? "Exit full screen" : "View the 3D model full screen"}
          >
            {isFullscreen ? "Exit full screen" : "Full screen"}
          </button>
        )}
      </div>
      <figcaption>
        {ready ? "The finished house. Drag to turn it, or open it full screen to zoom." : "The finished house, from the 3D model."}
      </figcaption>
    </figure>
  );
}
