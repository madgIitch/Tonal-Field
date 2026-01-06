import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tonal Field vs Coolors - Which Color Tool is Better in 2026?",
  description: "Detailed comparison of Tonal Field and Coolors. Compare features, pricing, accessibility tools, and exports. See why designers are switching from Coolors to Tonal Field.",
  keywords: [
    "coolors vs tonal field",
    "coolors alternative",
    "better than coolors",
    "coolors comparison",
    "color palette tool comparison",
  ],
  alternates: {
    canonical: "https://tonal-field.vercel.app/vs-coolors",
  },
  openGraph: {
    title: "Tonal Field vs Coolors - Feature & Price Comparison",
    description: "See why Tonal Field is the smarter choice for designers who need advanced control and accessibility features.",
    url: "https://tonal-field.vercel.app/vs-coolors",
  },
};

export default function VsCoolorsPage() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 20px" }}>
      {/* Hero Section */}
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h1 style={{ fontSize: "42px", fontWeight: 700, marginBottom: "16px", lineHeight: 1.2 }}>
          Tonal Field vs Coolors: <br />Which Color Tool is Right for You?
        </h1>
        <p style={{ fontSize: "18px", opacity: 0.8, maxWidth: "700px", margin: "0 auto" }}>
          Both are excellent color palette generators, but they serve different needs.
          Here&apos;s an honest comparison to help you decide.
        </p>
      </div>

      {/* Quick Comparison Table */}
      <div style={{ marginBottom: "60px", overflow: "auto" }}>
        <h2 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "24px" }}>
          Feature Comparison at a Glance
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>Feature</th>
              <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #e5e7eb" }}>Coolors Pro</th>
              <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #3b82f6", background: "#eff6ff" }}>Tonal Field Pro</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>💰 Price</td>
              <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>$3/month</td>
              <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>€2/month ✅</td>
            </tr>
            <tr>
              <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>🎨 Generation Method</td>
              <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>Random/AI</td>
              <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>Energy/Tension Model ✅</td>
            </tr>
            <tr>
              <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>🎯 Semantic Roles</td>
              <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>No</td>
              <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>Yes (bg, surface, primary...) ✅</td>
            </tr>
            <tr>
              <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>♿ Accessibility Auto-Fix</td>
              <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>Basic checker</td>
              <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>Advanced auto-repair ✅</td>
            </tr>
            <tr>
              <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>🌗 Dual Theme Generator</td>
              <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>No</td>
              <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>Yes (Light + Dark) ✅</td>
            </tr>
            <tr>
              <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>👁️ Color Blindness Simulator</td>
              <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>No</td>
              <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>Yes + Alternatives ✅</td>
            </tr>
            <tr>
              <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>📦 Export Formats</td>
              <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>~10 formats</td>
              <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>20+ formats ✅</td>
            </tr>
            <tr>
              <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>💻 Developer Tools</td>
              <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>Basic</td>
              <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>Tailwind, Material, Figma ✅</td>
            </tr>
            <tr>
              <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>👥 Community Gallery</td>
              <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>Passive</td>
              <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #e5e7eb", fontWeight: 600 }}>Active + Authenticated ✅</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Detailed Sections */}
      <div style={{ marginBottom: "60px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "24px" }}>
          When to Choose Coolors
        </h2>
        <div style={{ background: "#f9fafb", padding: "24px", borderRadius: "12px" }}>
          <p style={{ marginBottom: "12px", lineHeight: 1.7 }}>
            <strong>Coolors is great if you:</strong>
          </p>
          <ul style={{ lineHeight: 1.8, paddingLeft: "24px" }}>
            <li>Need quick inspiration with random generation</li>
            <li>Prefer simplicity over advanced control</li>
            <li>Are familiar with the interface and want to stick with it</li>
            <li>Don&apos;t need semantic color roles (bg, surface, primary, etc.)</li>
          </ul>
        </div>
      </div>

      <div style={{ marginBottom: "60px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "24px" }}>
          When to Choose Tonal Field
        </h2>
        <div style={{ background: "#eff6ff", padding: "24px", borderRadius: "12px", border: "2px solid #3b82f6" }}>
          <p style={{ marginBottom: "12px", lineHeight: 1.7 }}>
            <strong>Tonal Field is better if you:</strong>
          </p>
          <ul style={{ lineHeight: 1.8, paddingLeft: "24px" }}>
            <li>Need systematic, design-system-ready color palettes</li>
            <li>Care about accessibility (WCAG compliance, auto-fix contrast)</li>
            <li>Want semantic roles (background, surface, primary, accent, etc.)</li>
            <li>Need dual themes (light + dark mode)</li>
            <li>Export to Tailwind, Material UI, Figma, or other design tools</li>
            <li>Want color blindness simulation and alternative suggestions</li>
            <li>Prefer energy/tension-based generation over random</li>
            <li>Want to save money (33% cheaper than Coolors)</li>
          </ul>
        </div>
      </div>

      {/* Pricing Section */}
      <div style={{ marginBottom: "60px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "24px" }}>
          Pricing Breakdown
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div style={{ background: "#f9fafb", padding: "24px", borderRadius: "12px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "12px" }}>Coolors Pro</h3>
            <p style={{ fontSize: "32px", fontWeight: 700, marginBottom: "8px" }}>
              $3<span style={{ fontSize: "16px", fontWeight: 400 }}>/month</span>
            </p>
            <p style={{ fontSize: "14px", opacity: 0.7 }}>or $24/year</p>
          </div>
          <div style={{ background: "#eff6ff", padding: "24px", borderRadius: "12px", border: "2px solid #3b82f6" }}>
            <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "12px" }}>Tonal Field Pro</h3>
            <p style={{ fontSize: "32px", fontWeight: 700, marginBottom: "8px", color: "#3b82f6" }}>
              €2<span style={{ fontSize: "16px", fontWeight: 400 }}>/month</span>
            </p>
            <p style={{ fontSize: "14px", opacity: 0.7 }}>or €20/year (save €4)</p>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#16a34a", marginTop: "12px" }}>
              💰 Save 33% vs Coolors
            </p>
          </div>
        </div>
      </div>

      {/* SEO-rich FAQ */}
      <div style={{ marginBottom: "60px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "24px" }}>
          Frequently Asked Questions
        </h2>

        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
            Is Tonal Field really better than Coolors?
          </h3>
          <p style={{ lineHeight: 1.7, opacity: 0.8 }}>
            It depends on your needs. Tonal Field offers more advanced features for designers who need systematic,
            accessible color palettes with semantic roles. Coolors is simpler and great for quick inspiration.
            Tonal Field is better for professional design systems and development workflows.
          </p>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
            Can I import my Coolors palettes to Tonal Field?
          </h3>
          <p style={{ lineHeight: 1.7, opacity: 0.8 }}>
            Yes! You can manually input hex values or use our import feature to bring in color codes from Coolors.
          </p>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
            Why is Tonal Field cheaper than Coolors?
          </h3>
          <p style={{ lineHeight: 1.7, opacity: 0.8 }}>
            We&apos;re a newer tool focused on providing maximum value to designers. Our pricing reflects our goal
            to make advanced color tools accessible to everyone.
          </p>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
            What makes Tonal Field&apos;s accessibility features better?
          </h3>
          <p style={{ lineHeight: 1.7, opacity: 0.8 }}>
            Unlike Coolors&apos; basic contrast checker, Tonal Field offers auto-repair of contrast issues,
            color blindness simulation, and alternative color suggestions that maintain your palette&apos;s harmony
            while meeting WCAG standards.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ textAlign: "center", background: "#3b82f6", color: "white", padding: "48px 32px", borderRadius: "16px" }}>
        <h2 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "16px" }}>
          Ready to Try Tonal Field?
        </h2>
        <p style={{ fontSize: "18px", marginBottom: "32px", opacity: 0.9 }}>
          Start free, upgrade when you need advanced features. Cancel anytime.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/studio"
            style={{
              display: "inline-block",
              padding: "16px 32px",
              background: "white",
              color: "#3b82f6",
              borderRadius: "8px",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "16px",
            }}
          >
            Try Studio for Free
          </Link>
          <Link
            href="/pricing"
            style={{
              display: "inline-block",
              padding: "16px 32px",
              background: "transparent",
              color: "white",
              border: "2px solid white",
              borderRadius: "8px",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "16px",
            }}
          >
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
