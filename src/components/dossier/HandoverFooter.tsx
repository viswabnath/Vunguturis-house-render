import React from "react";
import { PROJECT_INFO } from "@/data/projectData";

export default function HandoverFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div>
          <div>Prepared for the {PROJECT_INFO.familyName} family. Confidential, 2026.</div>
          <div className="small" style={{ color: "var(--ink-3)", marginTop: 4 }}>
            {PROJECT_INFO.location}
          </div>
        </div>
        <a href={PROJECT_INFO.agency.url} target="_blank" rel="noopener noreferrer" className="credit">
          <span>{PROJECT_INFO.agency.credit}</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="om-logo" src={PROJECT_INFO.agency.logo} alt="OneMarK" width={108} height={36} />
        </a>
      </div>
    </footer>
  );
}
