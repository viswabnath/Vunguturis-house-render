import React from "react";
import { PROJECT_INFO } from "@/data/projectData";

const fmt = (n: number) => n.toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 2 });

export default function StatutoryAreaSection() {
  const m = PROJECT_INFO.metrics;

  const rows: { label: string; sqft: number; sqm: number; kind?: "less" | "total" }[] = [
    { label: "Site area", sqft: m.grossSiteAreaSqFt, sqm: m.grossSiteAreaSqM },
    { label: "Less road widening", sqft: -m.roadWideningAreaSqFt, sqm: -m.roadWideningAreaSqM, kind: "less" },
    { label: "Net site area", sqft: m.netSiteAreaSqFt, sqm: m.netSiteAreaSqM, kind: "total" },
    { label: "Ground floor plinth", sqft: m.plinthAreaPerFloorSqFt, sqm: m.plinthAreaPerFloorSqM },
    { label: "First floor plinth", sqft: m.plinthAreaPerFloorSqFt, sqm: m.plinthAreaPerFloorSqM },
    { label: "Second floor plinth", sqft: m.plinthAreaPerFloorSqFt, sqm: m.plinthAreaPerFloorSqM },
    { label: "Built-up area", sqft: m.totalBuiltUpAreaSqFt, sqm: m.totalBuiltUpAreaSqM, kind: "total" },
    { label: "Open site area", sqft: m.openSiteAreaSqFt, sqm: m.openSiteAreaSqM },
  ];

  return (
    <section id="area-statement" className="section">
      <div className="wrap">
        <div className="section-head">
          <h2>Areas and setbacks</h2>
          <p>Area statement and boundary gaps as approved under RUDA permit {PROJECT_INFO.permitNo}.</p>
        </div>

        <div className="areas-grid">
          <table className="ledger">
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className={r.kind}>
                  <td>{r.label}</td>
                  <td className="num">
                    {r.sqft < 0 ? "-" : ""}{fmt(Math.abs(r.sqft))} sq.ft
                    <span className="alt">{fmt(Math.abs(r.sqm))} m²</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            <div className="plot">
              <div className="plot-site" role="img" aria-label="Plot diagram: building set 0.75 m from the rear and sides, and 1.00 m from the road-widening strip at the front">
                <div className="plot-building">Building<br />7.64 × 10.77 m</div>
                <div className="plot-road-widening" />
                <span className="plot-label" style={{ top: 4, left: "50%", transform: "translateX(-50%)" }}>Rear 0.75 m</span>
                <span className="plot-label" style={{ bottom: "calc(1.2 / 13.72 * 100% + 2px)", left: "50%", transform: "translateX(-50%)" }}>Front 1.00 m</span>
              </div>
              <div className="plot-legend">
                {PROJECT_INFO.setbacks.map((s) => (
                  <div key={s.side}>
                    <b>{s.side}</b> <span className="num">{s.meters}</span> ({s.feet})
                    <div style={{ color: "var(--ink-3)" }}>{s.note}</div>
                  </div>
                ))}
                <div>
                  <b>Road widening</b> <span className="num">1.20 m</span> (hatched), given up to the road
                </div>
                <div style={{ color: "var(--ink-3)" }}>Road on the west, at the bottom of the plan.</div>
              </div>
            </div>

            <h3 style={{ marginBottom: 12 }}>Heights</h3>
            <dl className="spec-list">
              {PROJECT_INFO.heights.map((h) => (
                <div key={h.element}>
                  <dt>{h.element}</dt>
                  <dd>{h.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
