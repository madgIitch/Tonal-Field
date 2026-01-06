import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What is a Color System? - Tonal Field',
  description: 'Learn the difference between color palettes and color systems. Understand how to build scalable, accessible color systems for your products.',
};

export default function ColorSystemsGuide() {
  return (
    <article>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
          Color Palettes vs Color Systems
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.7 }}>
          Why random color collections don&apos;t cut it anymore
        </p>
      </header>

      <section style={{ marginBottom: '40px' }}>
        <h2>Palette vs System</h2>
        <p>
          A <strong>palette</strong> is a random collection of pretty colors. A <strong>system</strong>
          is an organized, purposeful set of colors with defined roles and relationships.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Core Roles in a Color System</h2>
        <ul>
          <li><strong>Primary:</strong> Your brand identity, main actions</li>
          <li><strong>Accent:</strong> Secondary interactions, highlights</li>
          <li><strong>Background:</strong> Canvas and empty states</li>
          <li><strong>Surface:</strong> Cards, panels, elevated UI</li>
          <li><strong>Text:</strong> Readable typography</li>
          <li><strong>Muted:</strong> Disabled states, subtle UI</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Why Systems Matter</h2>
        <ul>
          <li>Consistency across products and platforms</li>
          <li>Accessibility built-in from the start</li>
          <li>Scalability for dark mode, themes, and variations</li>
          <li>Reduced design debt and decision fatigue</li>
          <li>Production-ready, not just inspiration</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <p>
          <Link href="/studio">Build your color system in Tonal Field</Link> using Energy and Tension controls.
        </p>
      </section>

      <nav style={{
        marginTop: '60px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(0,0,0,0.1)',
      }}>
        <p style={{ opacity: 0.7 }}>Continue learning:</p>
        <ul style={{ listStyle: 'none', padding: 0, gap: '8px', display: 'flex', flexDirection: 'column' }}>
          <li><Link href="/guides/oklch-color-space">OKLCH Color Space</Link></li>
          <li><Link href="/guides/wcag-contrast">WCAG Contrast Guide</Link></li>
          <li><Link href="/guides/material-design-3">Material Design 3</Link></li>
        </ul>
      </nav>
    </article>
  );
}
