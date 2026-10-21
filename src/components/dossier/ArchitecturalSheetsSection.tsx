"use client";

import React, { useState } from "react";
import { SCHEDULE_OF_OPENINGS } from "@/data/projectData";

const ROOM_SCHEDULE = [
  {
    floor: "Ground floor",
    rooms: [
      { name: "Parking (2 cars, tandem)", dimensionsM: "4.05 × 10.31 m", dimensionsFt: "13.29 × 33.82 ft", area: "449.5" },
      { name: "Hall", dimensionsM: "3.02 × 4.36 m", dimensionsFt: "9.91 × 14.30 ft", area: "141.7" },
      { name: "Bedroom", dimensionsM: "3.02 × 3.30 m", dimensionsFt: "9.91 × 10.83 ft", area: "107.3" },
      { name: "Kitchen", dimensionsM: "3.02 × 2.43 m", dimensionsFt: "9.91 × 7.97 ft", area: "79.0" },
      { name: "Bath", dimensionsM: "1.27 × 1.23 m", dimensionsFt: "4.17 × 4.04 ft", area: "16.8" },
    ],
  },
  {
    floor: "First floor",
    rooms: [
      { name: "Hall", dimensionsM: "4.05 × 7.77 m", dimensionsFt: "13.29 × 25.49 ft", area: "338.8" },
      { name: "Dining", dimensionsM: "4.05 × 2.43 m", dimensionsFt: "13.29 × 7.97 ft", area: "105.9" },
      { name: "Puja (north-east)", dimensionsM: "Niche", dimensionsFt: "", area: "25.0" },
      { name: "Kitchen (south-east)", dimensionsM: "3.02 × 2.43 m", dimensionsFt: "9.91 × 7.97 ft", area: "79.0" },
      { name: "Master bedroom + bath", dimensionsM: "3.02 × 3.24 m + 3.02 × 1.00 m", dimensionsFt: "9.91 × 10.63 ft + 9.91 × 3.28 ft", area: "138.0" },
      { name: "Second bedroom + bath", dimensionsM: "3.02 × 3.30 m + 1.27 × 1.23 m", dimensionsFt: "9.91 × 10.83 ft + 4.17 × 4.04 ft", area: "124.1" },
    ],
  },
  {
    floor: "Second floor",
    rooms: [
      { name: "Hall", dimensionsM: "4.05 × 7.77 m", dimensionsFt: "13.29 × 25.49 ft", area: "338.8" },
      { name: "Dining + puja niche", dimensionsM: "4.05 × 2.43 m + niche", dimensionsFt: "13.29 × 7.97 ft + niche", area: "130.9" },
      { name: "Kitchen", dimensionsM: "3.02 × 2.43 m", dimensionsFt: "9.91 × 7.97 ft", area: "79.0" },
      { name: "Master bedroom + bath", dimensionsM: "3.02 × 3.24 m + 3.02 × 1.00 m", dimensionsFt: "9.91 × 10.63 ft + 9.91 × 3.28 ft", area: "138.0" },
      { name: "Second bedroom + bath", dimensionsM: "3.02 × 3.30 m + 1.27 × 1.23 m", dimensionsFt: "9.91 × 10.83 ft + 4.17 × 4.04 ft", area: "124.1" },
    ],
  },
];

const DRAWINGS = {
  floor: { src: "/floor_plan_reference.png", caption: "Floor plans, elevation and section A-B. Scale 1:120.", alt: "Floor plan sheet with ground, first and second floor plans, front elevation and section" },
  site: { src: "/site_plan_reference.png", caption: "Site plan with setbacks and road widening, in feet and metres. Scale 1:80.", alt: "Site plan sheet showing plot boundary, setbacks and the road-widening strip" },
};

export default function ArchitecturalSheetsSection() {
  const [activeDrawing, setActiveDrawing] = useState<"floor" | "site">("floor");
  const drawing = DRAWINGS[activeDrawing];

  return (
    <section id="blueprints" className="section">
      <div className="wrap">
        <div className="section-head">
          <h2>Drawings and schedules</h2>
          <p>The sheets the 3D models are built from, with every room size and opening listed below.</p>
        </div>

        <div className="drawings-bar">
          <div className="seg" role="group" aria-label="Choose a drawing">
            <button aria-pressed={activeDrawing === "floor"} onClick={() => setActiveDrawing("floor")}>Floor plans</button>
            <button aria-pressed={activeDrawing === "site"} onClick={() => setActiveDrawing("site")}>Site plan</button>
          </div>
          <div className="downloads">
            <a className="link" href="/docs/Final-Front_Stairs Plan.pdf" target="_blank" rel="noopener noreferrer">Floor plans (PDF)</a>
            <a className="link" href="/docs/Site_Plan_in_Feet.pdf" target="_blank" rel="noopener noreferrer">Site plan (PDF)</a>
          </div>
        </div>

        <figure className="drawing">
          <div className="drawing-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={drawing.src} alt={drawing.alt} width={3308} height={2339} loading="lazy" />
          </div>
          <figcaption>{drawing.caption}</figcaption>
        </figure>

        <div className="sched-grid">
          <div className="sched-scroll">
            <table className="sched">
              <caption>Room sizes</caption>
              <thead>
                <tr>
                  <th scope="col">Room</th>
                  <th scope="col">Size</th>
                  <th scope="col" className="r">Sq.ft</th>
                </tr>
              </thead>
              {ROOM_SCHEDULE.map((sec) => (
                <tbody key={sec.floor}>
                  <tr className="group">
                    <th colSpan={3} scope="rowgroup">{sec.floor}</th>
                  </tr>
                  {sec.rooms.map((rm) => (
                    <tr key={rm.name}>
                      <td>{rm.name}</td>
                      <td>
                        <span className="num">{rm.dimensionsM}</span>
                        {rm.dimensionsFt && <span className="sub num">{rm.dimensionsFt}</span>}
                      </td>
                      <td className="r num">{rm.area}</td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>

          <div className="sched-scroll">
            <table className="sched">
              <caption>Doors, windows and gate</caption>
              <thead>
                <tr>
                  <th scope="col">Code</th>
                  <th scope="col">Item</th>
                  <th scope="col">Size</th>
                  <th scope="col" className="r">Qty</th>
                </tr>
              </thead>
              <tbody>
                {SCHEDULE_OF_OPENINGS.map((op) => (
                  <tr key={op.code}>
                    <td className="num">{op.code}</td>
                    <td>
                      {op.name}
                      <span className="sub">{op.description}</span>
                    </td>
                    <td className="nowrap">
                      <span className="num">{op.sizeM}</span>
                      <span className="sub num">{op.sizeFt}</span>
                    </td>
                    <td className="r num">{op.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="small" style={{ color: "var(--ink-3)", marginTop: 12 }}>
              Quantities are counted from the floor plans, all three floors together.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
