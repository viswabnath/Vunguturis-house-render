"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const PlaceholderBody = () => (
  <div className="wrap">
    <div className="section-head">
      <h2>The build, stage by stage</h2>
      <p>Eleven 3D models, from the empty plot to the finished house. Pick a stage to see its model and measurements.</p>
    </div>
    <p className="muted small">Loading the 3D viewer…</p>
  </div>
);

const AllStagesInspector = dynamic(() => import("./AllStagesInspector"), { ssr: false, loading: PlaceholderBody });

/**
 * Mounts the 3D stages viewer (and downloads three.js for it) only when the visitor scrolls near it,
 * or follows a link to it. Keeps the first page load light, especially on phones.
 * The section element stays the same throughout so anchors and the header's scroll highlight keep working.
 */
export default function LazyStages() {
  const ref = useRef<HTMLElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.location.hash === "#stages-inspector") {
      setShow(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100% 0px" }
    );
    observer.observe(el);
    const onHash = () => window.location.hash === "#stages-inspector" && setShow(true);
    window.addEventListener("hashchange", onHash);
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  return (
    // Height stays reserved even after mounting, so the sections below never jump up while the viewer loads
    <section id="stages-inspector" ref={ref} className="section stages-placeholder">
      {show ? <AllStagesInspector /> : <PlaceholderBody />}
    </section>
  );
}
