import { Link } from "react-router-dom";
import { PassageHero } from "../components/PassageHero";
import { ProofStrip } from "../components/ProofStrip";
import { StatTiles } from "../components/StatTiles";
import { Cartouche } from "../components/Cartouche";
import { homeStatFacts } from "../lib/facts";
import { ownershipContract } from "../lib/brand";

// The homepage: one demonstration, one wound, one promise, one door.
export function Home() {
  return (
    <>
      <PassageHero />

      {/* Band 1 — the proof strip */}
      <ProofStrip />

      {/* Band 2 — what the old route costs */}
      <section aria-label="What the old route costs" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl sm:text-3xl">What the old route costs</h2>
        <p className="mt-2 max-w-xl text-(--muted)">
          This is the picture of value flowing the wrong way.
        </p>
        <div className="mt-8">
          <StatTiles facts={homeStatFacts} />
        </div>
      </section>

      {/* Band 3 — the ownership contract, then one door */}
      <section aria-label="The ownership contract" className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <Cartouche label={ownershipContract.label} text={ownershipContract.text} />
        <div className="mt-10 text-center">
          <Link to="/contact" className="btn-cta" data-cta="home-contract">
            Twenty minutes, and you&rsquo;ll know
          </Link>
        </div>
      </section>
    </>
  );
}
