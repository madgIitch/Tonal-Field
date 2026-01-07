import Link from "next/link";
import { Frame } from "@/components/Frame";
import { SubscriptionManager } from "@/components/SubscriptionManager";

export default function PricingPage() {
  return (
    <Frame>
      <div className="page">
        <SubscriptionManager />

        <section className="pricing reveal" id="pricing">
          <div className="section-header">
            <h1 className="section-title">Free vs Pro</h1>
            <p className="section-subtitle">
              Start free, upgrade when the kit becomes part of your workflow.
            </p>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-title">Free</div>
              <div className="pricing-price">€0</div>
              <div style={{ fontSize: "14px", opacity: 0.7, marginBottom: "20px" }}>
                Core exploration
              </div>
              <ul className="pricing-list">
                <li>Live field and sliders</li>
                <li>Community access</li>
                <li>Preview palette roles</li>
                <li>Basic auto-fix</li>
                <li>Up to 5 saved palettes</li>
                <li>HEX export</li>
              </ul>
              <div className="pricing-footer">
                <span>Good for exploration</span>
                <span>Active</span>
              </div>
            </div>
            <div className="pricing-card pro">
              <div className="pricing-title">Pro</div>
              <div className="pricing-price">
                €2<span style={{ fontSize: "16px", opacity: 0.7 }}>/month</span>
              </div>
              <div style={{ fontSize: "14px", opacity: 0.7, marginBottom: "20px" }}>
                or €20/year (save €4)
              </div>
              <ul className="pricing-list">
                <li>Everything in Free, plus:</li>
                <li>Complete palette kits</li>
                <li>Advanced contrast repair</li>
                <li>Unlimited saved palettes</li>
                <li>Dual theme generator</li>
                <li>Color blindness simulator</li>
                <li>CSS, JSON, Tailwind exports</li>
                <li>Figma, Sketch, VS Code exports</li>
              </ul>
              <div className="pricing-footer">
                <span>Best for production teams</span>
                <Link className="btn btn-primary" href="/studio">
                  Upgrade in studio
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-block">
          <h2 className="section-title">Start with the field</h2>
          <p className="section-subtitle">
            The studio shows what Pro unlocks. Try it first, then upgrade when
            the kit feels right.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/studio">
              Open studio
            </Link>
            <Link className="btn btn-ghost" href="/system">
              See the system
            </Link>
          </div>
        </section>
      </div>
    </Frame>
  );
}
