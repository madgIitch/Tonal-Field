import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Energy & Tension Model - Tonal Field',
  description: 'Understand Tonal Field\'s proprietary Energy and Tension dimensions for intuitive color control.',
};

export default function EnergyTensionGuide() {
  return (
    <article>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
          Energy & Tension: Intuitive Color Control
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.7 }}>
          Tonal Field&apos;s proprietary model for understanding color relationships
        </p>
      </header>

      <section style={{ marginBottom: '40px' }}>
        <h2>Beyond HSL and LCH</h2>
        <p>
          Traditional color models (HSL, LCH) are mathematically sound but can feel unintuitive when
          designing systems. Energy and Tension map to design intent instead of color math.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Energy: Calm → Vivid</h2>
        <p>
          <strong>Energy</strong> controls saturation and vibrancy. Move the slider from left (Calm) to right (Vivid).
        </p>
        <ul>
          <li><strong>Calm (0%):</strong> Desaturated, neutral, professional. Good for productivity apps.</li>
          <li><strong>Vivid (100%):</strong> Saturated, energetic, playful. Good for creative tools.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Tension: Soft → Sharp</h2>
        <p>
          <strong>Tension</strong> controls harmony and contrast. Move the slider from left (Soft) to right (Sharp).
        </p>
        <ul>
          <li><strong>Soft (0%):</strong> Analogous colors, harmonious, relaxing. Muted palettes.</li>
          <li><strong>Sharp (100%):</strong> Complementary colors, high contrast, striking. Bold palettes.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>The 2D Field</h2>
        <p>
          Combine Energy (X-axis) and Tension (Y-axis) to explore the entire color space in real time.
          The Field visualizes how colors relate to each other as you adjust both dimensions.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Design Intent</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <th style={{ textAlign: 'left', padding: '12px' }}>Style</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Energy</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Tension</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <td style={{ padding: '12px' }}>Professional</td>
              <td style={{ padding: '12px' }}>Low (Calm)</td>
              <td style={{ padding: '12px' }}>Low (Soft)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <td style={{ padding: '12px' }}>Creative</td>
              <td style={{ padding: '12px' }}>High (Vivid)</td>
              <td style={{ padding: '12px' }}>High (Sharp)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <td style={{ padding: '12px' }}>Playful</td>
              <td style={{ padding: '12px' }}>High (Vivid)</td>
              <td style={{ padding: '12px' }}>Low (Soft)</td>
            </tr>
            <tr>
              <td style={{ padding: '12px' }}>Elegant</td>
              <td style={{ padding: '12px' }}>Low (Calm)</td>
              <td style={{ padding: '12px' }}>High (Sharp)</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Getting Started</h2>
        <p>
          Head to the <Link href="/studio">Studio</Link> and experiment with the Energy and Tension sliders.
          Watch the Field update in real time to see the relationships between your colors.
        </p>
      </section>

      <nav style={{
        marginTop: '60px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(0,0,0,0.1)',
      }}>
        <p style={{ opacity: 0.7 }}>Learn more:</p>
        <ul style={{ listStyle: 'none', padding: 0, gap: '8px', display: 'flex', flexDirection: 'column' }}>
          <li><Link href="/guides/oklch-color-space">OKLCH Color Space</Link></li>
          <li><Link href="/guides/color-systems">What is a Color System?</Link></li>
          <li><Link href="/studio">Build with Energy & Tension</Link></li>
        </ul>
      </nav>
    </article>
  );
}
