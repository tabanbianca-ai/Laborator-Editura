import { PRODUCT_NAME } from "@laborator/shared";

const pillars = [
  "Semantic fidelity",
  "Terminology governance",
  "Collaborative translation",
  "AI-assisted quality checks"
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="intro">
        <p className="eyebrow">Translation platform</p>
        <h1>{PRODUCT_NAME}</h1>
        <p className="lede">
          A focused workspace for building a CAT tool, editorial review system,
          terminology layer and semantic QA platform.
        </p>
      </section>

      <section className="pillar-grid" aria-label="Platform pillars">
        {pillars.map((pillar) => (
          <article className="pillar" key={pillar}>
            <h2>{pillar}</h2>
          </article>
        ))}
      </section>
    </main>
  );
}
