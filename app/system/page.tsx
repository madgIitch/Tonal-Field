import Link from "next/link";
import { Frame } from "@/components/Frame";

export default function SystemPage() {
  return (
    <Frame>
      <div className="page">
        <section className="highlights reveal" id="system">
          <div className="section-header">
            <h1 className="section-title">A palette system you can ship</h1>
            <p className="section-subtitle">
              Tonal Field blends generative harmony with practical roles so teams
              can move from exploration to production.
            </p>
          </div>
          <div className="highlights-grid">
            <div className="highlight-card reveal delay-1">
              <div className="highlight-title">Continuous field</div>
              <p className="highlight-body">
                Every point in the map is coherent. Slide across the space and the
                palette shifts without random jumps.
              </p>
            </div>
            <div className="highlight-card reveal delay-2">
              <div className="highlight-title">Energy and Tension</div>
              <p className="highlight-body">
                Two axes control chroma, contrast, and hue separation with a unified
                score to keep results stable.
              </p>
            </div>
            <div className="highlight-card reveal delay-3">
              <div className="highlight-title">System output</div>
              <p className="highlight-body">
                Primary, surface, text, and accent roles arrive ready for UI
                layouts, not just inspiration boards.
              </p>
            </div>
          </div>
        </section>

        <section className="steps">
          <div className="section-header">
            <h2 className="section-title">A fast workflow</h2>
            <p className="section-subtitle">
              Keep the exploration tactile, then export the system once it feels
              right.
            </p>
          </div>
          <div className="steps-grid">
            <div className="step-card reveal delay-1">
              <div className="step-number">Step 1</div>
              <div className="step-title">Drag the field</div>
              <p className="step-body">
                Move across Energy and Tension to place the palette in the mood
                space.
              </p>
            </div>
            <div className="step-card reveal delay-2">
              <div className="step-number">Step 2</div>
              <div className="step-title">Tune the sliders</div>
              <p className="step-body">
                Refine hue separation, chroma, and contrast until the kit feels
                cohesive.
              </p>
            </div>
            <div className="step-card reveal delay-3">
              <div className="step-number">Step 3</div>
              <div className="step-title">Export and share</div>
              <p className="step-body">
                Generate tokens, copy the seed, and pass the palette into your
                product workflow.
              </p>
            </div>
          </div>
        </section>

        <section className="cta-block">
          <h2 className="section-title">Put the system to work</h2>
          <p className="section-subtitle">
            Open the studio to explore the field, then export the kit when it
            clicks.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/studio">
              Enter the studio
            </Link>
            <Link className="btn btn-ghost" href="/pricing">
              See plans
            </Link>
          </div>
        </section>
      </div>
    </Frame>
  );
}
