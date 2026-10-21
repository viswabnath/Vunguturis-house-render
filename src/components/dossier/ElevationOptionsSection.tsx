"use client";

import React, { useState } from "react";
import { ELEVATION_OPTIONS, DesignOption } from "@/data/projectData";

const ROWS: { label: string; render: (o: DesignOption) => React.ReactNode }[] = [
  { label: "In short", render: (o) => o.summary },
  { label: "Stair", render: (o) => o.circulation },
  { label: "Front view", render: (o) => o.facadeAesthetic },
  { label: "Afternoon sun", render: (o) => o.solarOrientation },
  { label: "Renting", render: (o) => o.rentalPotential },
  { label: "Lift", render: () => "Not included. A version with a lift is in design." },
  {
    label: "Good",
    render: (o) => (
      <ul>{o.advantages.map((a) => <li key={a}>{a}</li>)}</ul>
    ),
  },
  {
    label: "Watch out",
    render: (o) => (
      <ul>{o.considerations.map((c) => <li key={c}>{c}</li>)}</ul>
    ),
  },
];

export default function ElevationOptionsSection() {
  // Which column is visible on narrow screens
  const [shown, setShown] = useState(0);
  const [preferred, setPreferred] = useState<string | null>(null);

  return (
    <section id="options" className="section">
      <div className="wrap">
        <div className="section-head">
          <h2>Three ways to place the stair</h2>
          <p>
            On a west-facing plot, where the stair goes decides how the front looks, how much afternoon sun
            the rooms get, and whether each floor can have its own entrance.
          </p>
        </div>

        <div className="seg compare-tabs" role="group" aria-label="Choose an option to view">
          {ELEVATION_OPTIONS.map((o, i) => (
            <button key={o.id} aria-pressed={shown === i} onClick={() => setShown(i)}>
              {o.code} {o.title}
            </button>
          ))}
        </div>

        <table className="compare" data-show={shown}>
          <thead>
            <tr>
              <td className="row-label" aria-hidden="true" />
              {ELEVATION_OPTIONS.map((o, i) => (
                <th key={o.id} scope="col" className={`c${i}`}>
                  <div className="opt-code">{o.code}</div>
                  <div className="opt-title">{o.title}</div>
                  <div className={`opt-status${o.status === "ready" ? " ready" : ""}`}>{o.statusText}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label}>
                <th scope="row" className="row-label">{row.label}</th>
                {ELEVATION_OPTIONS.map((o, i) => (
                  <td key={o.id} className={`c${i}`}>{row.render(o)}</td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="row-label" />
              {ELEVATION_OPTIONS.map((o, i) => (
                <td key={o.id} className={`c${i}`}>
                  {o.status === "ready" ? (
                    <a className="btn" href="#stages-inspector">See it in 3D</a>
                  ) : preferred === o.id ? (
                    <p className="pref-note">
                      Marked as your preference on this screen. Tell OneMarK so modelling can start.
                    </p>
                  ) : (
                    <button className="btn btn-ghost" onClick={() => setPreferred(o.id)}>
                      I prefer this
                    </button>
                  )}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>

        <p className="lift-note">
          None of the three options has a lift yet. Versions of each with a lift are being designed and
          will be added here when ready.
        </p>
      </div>
    </section>
  );
}
