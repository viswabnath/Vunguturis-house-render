import HandoverHeader from "@/components/dossier/HandoverHeader";
import ElevationOptionsSection from "@/components/dossier/ElevationOptionsSection";
import ArchitecturalSheetsSection from "@/components/dossier/ArchitecturalSheetsSection";
import StatutoryAreaSection from "@/components/dossier/StatutoryAreaSection";
import HandoverFooter from "@/components/dossier/HandoverFooter";
import HeroModel from "@/components/dossier/HeroModel";
import LazyStages from "@/components/dossier/LazyStages";
import { PROJECT_INFO } from "@/data/projectData";


const m = PROJECT_INFO.metrics;

const FACTS: { label: string; value: string; text?: boolean }[] = [
  { label: "Plot", value: `${m.grossSiteAreaSqFt.toLocaleString("en-IN")} sq.ft` },
  { label: "Built-up", value: `${m.totalBuiltUpAreaSqFt.toLocaleString("en-IN", { minimumFractionDigits: 1 })} sq.ft` },
  { label: "Floors", value: "Ground + 2", text: true },
  { label: "Facing", value: "West", text: true },
  { label: "RUDA permit", value: PROJECT_INFO.permitNo },
];

export default function HomePage() {
  return (
    <>
      <HandoverHeader />

      <main>
        <section id="hero" className="hero">
          <div className="wrap">
            <div>
              <h1>
                {PROJECT_INFO.familyName}
                <br />
                Residence
              </h1>
              <p>
                A three-floor house on a west-facing plot in Katheruvu. Compare the options, then
                walk through the build in 3D.
              </p>
              <div className="hero-actions">
                <a className="btn" href="#options">Compare options</a>
                <a className="btn btn-ghost" href="#stages-inspector">See it in 3D</a>
              </div>
            </div>

            <HeroModel />
          </div>
        </section>

        <section className="facts" aria-label="Key facts">
          <div className="wrap">
            <dl>
              {FACTS.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd className={f.text ? undefined : "num"}>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <ElevationOptionsSection />
        <LazyStages />
        <ArchitecturalSheetsSection />
        <StatutoryAreaSection />
      </main>

      <HandoverFooter />
    </>
  );
}
