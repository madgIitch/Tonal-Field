import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'OKLCH Color Space Guide - Tonal Field',
  description: 'Understand OKLCH: the perceptually uniform color space that powers Tonal Field. Learn why OKLCH is superior for design systems.',
  openGraph: {
    title: 'OKLCH Color Space Guide',
    description: 'Master the modern color space designed for UI design and accessibility',
    type: 'article',
  },
};

export default function OklchGuide() {
  return (
    <article>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
          OKLCH Color Space
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.7 }}>
          The perceptually uniform color space designed for modern UI design
        </p>
      </header>

      <section style={{ marginBottom: '40px' }}>
        <h2>What is OKLCH?</h2>
        <p>
          OKLCH is a modern color space that addresses limitations in traditional models like HSL and HSV.
          It&apos;s based on Oklab, a perceptually uniform color model that aligns with how human eyes perceive
          color differences.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Why OKLCH for Design Systems?</h2>
        <ul>
          <li><strong>Perceptual Uniformity:</strong> Equal numeric changes = equal visual changes</li>
          <li><strong>Better Contrast Prediction:</strong> More accurate WCAG calculations</li>
          <li><strong>Intuitive Controls:</strong> Lightness, Chroma, Hue work like you&apos;d expect</li>
          <li><strong>Native CSS Support:</strong> Works in modern browsers without conversion</li>
          <li><strong>Future-Proof:</strong> CSS Working Group standard</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>OKLCH vs HSL</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <th style={{ textAlign: 'left', padding: '12px' }}>Aspect</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>OKLCH</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>HSL</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <td style={{ padding: '12px' }}>Perceptual Uniformity</td>
              <td style={{ padding: '12px' }}>✓ Yes</td>
              <td style={{ padding: '12px' }}>✗ No</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <td style={{ padding: '12px' }}>Contrast Prediction</td>
              <td style={{ padding: '12px' }}>✓ Accurate</td>
              <td style={{ padding: '12px' }}>✗ Unreliable</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <td style={{ padding: '12px' }}>Intuitive Adjustments</td>
              <td style={{ padding: '12px' }}>✓ Yes</td>
              <td style={{ padding: '12px' }}>⚠ Sometimes</td>
            </tr>
            <tr>
              <td style={{ padding: '12px' }}>Browser Support</td>
              <td style={{ padding: '12px' }}>✓ Modern browsers</td>
              <td style={{ padding: '12px' }}>✓ Universal</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Components of OKLCH</h2>
        <dl style={{ gap: '24px', display: 'flex', flexDirection: 'column' }}>
          <div>
            <dt style={{ fontWeight: 600, marginBottom: '8px' }}>L (Lightness): 0–1</dt>
            <dd>How light or dark the color is. 0 = pure black, 1 = pure white.</dd>
          </div>
          <div>
            <dt style={{ fontWeight: 600, marginBottom: '8px' }}>C (Chroma): 0–0.4</dt>
            <dd>Color intensity or saturation. Higher values = more vibrant, lower = more muted.</dd>
          </div>
          <div>
            <dt style={{ fontWeight: 600, marginBottom: '8px' }}>H (Hue): 0–360</dt>
            <dd>Color type (red, blue, green, etc.). Same as traditional hue.</dd>
          </div>
        </dl>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Using OKLCH in CSS</h2>
        <pre style={{
          background: 'rgba(0,0,0,0.05)',
          padding: '16px',
          borderRadius: '8px',
          overflow: 'auto',
        }}>
{`/* Primary blue */
color: oklch(70% 0.15 200);

/* Muted variant */
color: oklch(55% 0.08 200);

/* Light background */
color: oklch(98% 0.02 90);`}
        </pre>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Next Steps</h2>
        <p>
          Ready to explore OKLCH color systems? Head to the <Link href="/studio">Studio</Link> and
          start building with Tonal Field&apos;s OKLCH-powered controls.
        </p>
      </section>

      <nav style={{
        marginTop: '60px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(0,0,0,0.1)',
      }}>
        <p style={{ opacity: 0.7 }}>Other guides:</p>
        <ul style={{ listStyle: 'none', padding: 0, gap: '8px', display: 'flex', flexDirection: 'column' }}>
          <li><Link href="/guides/color-systems">What is a Color System?</Link></li>
          <li><Link href="/guides/wcag-contrast">WCAG Contrast Guide</Link></li>
          <li><Link href="/guides/material-design-3">Material Design 3 Tonal System</Link></li>
          <li><Link href="/guides/color-blindness">Color Blindness & Inclusion</Link></li>
          <li><Link href="/guides/dual-theme">Light/Dark Theme Design</Link></li>
          <li><Link href="/guides/energy-tension">Energy & Tension Model</Link></li>
        </ul>
      </nav>
    </article>
  );
}
