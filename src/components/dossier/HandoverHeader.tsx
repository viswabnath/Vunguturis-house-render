"use client";

import React, { useEffect, useState } from "react";
import { PROJECT_INFO } from "@/data/projectData";

const NAV = [
  { id: "options", label: "Options", hint: "Three stair layouts compared" },
  { id: "stages-inspector", label: "3D stages", hint: "The build in 11 models" },
  { id: "blueprints", label: "Drawings", hint: "Plans, room sizes, openings" },
  { id: "area-statement", label: "Areas", hint: "Area statement and setbacks" },
];

export default function HandoverHeader() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Highlight the nav link for the section currently in view
  useEffect(() => {
    const sections = NAV.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    // Track every section in the band, then pick the first in page order. Using only the latest
    // event can leave a stale highlight when a section moves out of the band without the next one moving in.
    const inBand = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) inBand.add(entry.target.id);
          else inBand.delete(entry.target.id);
        });
        setActiveSection(NAV.find(({ id }) => inBand.has(id))?.id ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // While the menu is open: no page scroll behind it, Escape closes it,
  // and it closes itself if the window grows past the phone breakpoint.
  useEffect(() => {
    if (!mobileNavOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileNavOpen(false);
    const wide = window.matchMedia("(min-width: 769px)");
    const onWide = (e: MediaQueryListEvent) => e.matches && setMobileNavOpen(false);
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [mobileNavOpen]);

  const linkClass = (id: string) => (activeSection === id ? "active" : undefined);

  return (
    <header className="site-header">
      <div className="wrap">
        <a href="#hero" className="brand" onClick={() => setMobileNavOpen(false)}>{PROJECT_INFO.title}</a>

        <nav className="site-nav" aria-label="Sections">
          {NAV.map(({ id, label }) => (
            <a key={id} href={`#${id}`} className={linkClass(id)}>{label}</a>
          ))}
        </nav>

        <button
          className="menu-btn"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-expanded={mobileNavOpen}
          aria-controls="mobile-nav"
        >
          <span className={`menu-icon${mobileNavOpen ? " open" : ""}`} aria-hidden="true">
            <span />
            <span />
          </span>
          {mobileNavOpen ? "Close" : "Menu"}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`mobile-sheet${mobileNavOpen ? " open" : ""}`}
        inert={!mobileNavOpen}
        aria-hidden={!mobileNavOpen}
      >
        <nav aria-label="Sections">
          <ol>
            {NAV.map(({ id, label, hint }, i) => (
              <li key={id} style={{ "--i": i } as React.CSSProperties}>
                <a href={`#${id}`} className={linkClass(id)} onClick={() => setMobileNavOpen(false)}>
                  <span className="sheet-label">{label}</span>
                  <span className="sheet-hint">{hint}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="sheet-foot">
          <div className="small" style={{ color: "var(--ink-3)" }}>
            {PROJECT_INFO.location}
          </div>
          <a href={PROJECT_INFO.agency.url} target="_blank" rel="noopener noreferrer" className="credit">
            <span>{PROJECT_INFO.agency.credit}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="om-logo" src={PROJECT_INFO.agency.logo} alt="OneMarK" width={96} height={32} />
          </a>
        </div>
      </div>
    </header>
  );
}
