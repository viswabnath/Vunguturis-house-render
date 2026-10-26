"use client";

import React, { useState } from "react";
import { SCHEDULE_OF_OPENINGS } from "@/data/projectData";

const ROOM_SCHEDULE = [
  {
    floor: "Ground floor",
    rooms: [
      { name: "Parking (2 cars, tandem)", dimensionsM: "9.81 × 4.04 m", dimensionsFt: "32.19 × 13.27 ft", area: "427.1" },
      { name: "Hall", dimensionsM: "3.71 × 3.02 m", dimensionsFt: "12.19 × 9.90 ft", area: "120.7" },
      { name: "Bedroom (incl. bath)", dimensionsM: "3.02 × 3.00 m", dimensionsFt: "9.90 × 9.84 ft", area: "97.5" },
      { name: "Kitchen", dimensionsM: "3.02 × 2.37 m", dimensionsFt: "9.90 × 7.76 ft", area: "76.9" },
      { name: "Bath (identical to upper floors)", dimensionsM: "2.10 × 1.20 m", dimensionsFt: "6.89 × 3.94 ft", area: "27.1" },
    ],
  },
  {
    floor: "First floor",
    rooms: [
      { name: "Hall", dimensionsM: "7.33 × 4.04 m", dimensionsFt: "24.05 × 13.27 ft", area: "319.1" },
      { name: "Dining", dimensionsM: "4.04 × 2.37 m", dimensionsFt: "13.27 × 7.76 ft", area: "103.0" },
      { name: "Puja (north-east)", dimensionsM: "1.14 × 0.70 m", dimensionsFt: "3.74 × 2.30 ft", area: "8.6" },
      { name: "Kitchen (south-east)", dimensionsM: "3.62 × 2.37 m", dimensionsFt: "11.87 × 7.76 ft", area: "92.1" },
      { name: "Master bedroom (incl. bath)", dimensionsM: "3.71 × 3.62 m", dimensionsFt: "12.19 × 11.87 ft", area: "144.7" },
      { name: "Second bedroom (incl. bath)", dimensionsM: "3.62 × 3.00 m", dimensionsFt: "11.87 × 9.84 ft", area: "116.9" },
      { name: "Bath (each, identical)", dimensionsM: "2.10 × 1.20 m", dimensionsFt: "6.89 × 3.94 ft", area: "27.1" },
    ],
  },
  {
    floor: "Second floor",
    rooms: [
      { name: "Hall", dimensionsM: "7.33 × 4.04 m", dimensionsFt: "24.05 × 13.27 ft", area: "319.1" },
      { name: "Dining", dimensionsM: "4.04 × 2.37 m", dimensionsFt: "13.27 × 7.76 ft", area: "103.0" },
      { name: "Puja (north-east)", dimensionsM: "1.14 × 0.70 m", dimensionsFt: "3.74 × 2.30 ft", area: "8.6" },
      { name: "Kitchen (south-east)", dimensionsM: "3.62 × 2.37 m", dimensionsFt: "11.87 × 7.76 ft", area: "92.1" },
      { name: "Master bedroom (incl. bath)", dimensionsM: "3.71 × 3.62 m", dimensionsFt: "12.19 × 11.87 ft", area: "144.7" },
      { name: "Second bedroom (incl. bath)", dimensionsM: "3.62 × 3.00 m", dimensionsFt: "11.87 × 9.84 ft", area: "116.9" },
      { name: "Bath (each, identical)", dimensionsM: "2.10 × 1.20 m", dimensionsFt: "6.89 × 3.94 ft", area: "27.1" },
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
          <p>The original approved sheets, with the room sizes of the current design and the approved openings listed below.</p>
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
              <caption>Room sizes (current design)</caption>
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
            <p className="small" style={{ color: "var(--ink-3)", marginTop: 12 }}>
              Bedroom sizes include the attached bath. Baths are measured inside the walls.
            </p>
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
              Quantities are counted from the approved floor plans, all three floors together.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
