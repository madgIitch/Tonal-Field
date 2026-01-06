import Link from "next/link";
import { Frame } from "@/components/Frame";

export default function Home() {
  return (
    <Frame>
      <div className="page">
        <section className="hero reveal" id="top">
          <div className="hero-copy">
            <span className="eyebrow eyebrow-with-icon">
              <img
                src="/icon.png"
                alt=""
                aria-hidden
                className="eyebrow-icon"
              />
              <span>Tonal Field</span>
            </span>

            <h1 className="hero-title">Explore color as a continuous space</h1>
            <p className="hero-text">
              Navigate a tonal field, shape Energy and Tension, and ship palettes
              that translate directly into UI systems.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/studio">
                Enter the studio
              </Link>
              <Link className="btn btn-ghost" href="/system">
                See the system
              </Link>
            </div>
            <div className="hero-note">
              OKLCH native, WCAG aware, shareable seeds.
            </div>
          </div>
          <div className="hero-card reveal delay-1">
            <div className="hero-card-header">
              <span>Snapshot</span>
              <span className="hero-score">86% fit</span>
            </div>
            <div className="hero-swatches">
              <div className="hero-swatch" style={{ background: "oklch(96% 0.03 90)" }} />
              <div className="hero-swatch" style={{ background: "oklch(68% 0.16 210)" }} />
              <div className="hero-swatch" style={{ background: "oklch(72% 0.2 35)" }} />
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="eyebrow">Energy</span>
                <strong>62</strong>
              </div>
              <div className="hero-stat">
                <span className="eyebrow">Tension</span>
                <strong>38</strong>
              </div>
              <div className="hero-stat">
                <span className="eyebrow">Auto-fix</span>
                <strong>On</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-block">
          <h2 className="section-title">Ready to build a tonal system?</h2>
          <p className="section-subtitle">
            Explore the field, validate contrast, and export tokens in minutes.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/studio">
              Launch the studio
            </Link>
            <Link className="btn btn-ghost" href="/pricing">
              Compare plans
            </Link>
          </div>
        </section>
      </div>
    </Frame>
  );
}
