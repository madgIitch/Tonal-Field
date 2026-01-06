import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Material Design 3 Tonal System - Tonal Field',
  description: 'Understand Material Design 3 color system and how it uses tonal palettes for flexible, accessible theming.',
};

export default function MaterialDesign3Guide() {
  return (
    <article>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
          Material Design 3 Tonal System
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.7 }}>
          Google&apos;s modern approach to color and theming
        </p>
      </header>

      <section style={{ marginBottom: '40px' }}>
        <h2>What is Material 3?</h2>
        <p>
          Material Design 3 introduces a tonal system where colors are derived from a single source color
          and automatically generate accessible, harmonious color schemes across light and dark modes.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Tonal Palette Concept</h2>
        <p>
          Instead of manually picking each color, Material 3 generates a palette of tones (0–100) from
          a source color. This ensures harmony and makes theming trivial.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Key Roles</h2>
        <ul>
          <li><strong>Primary:</strong> Main brand color (50–90 tones)</li>
          <li><strong>Secondary:</strong> Supporting color</li>
          <li><strong>Tertiary:</strong> Accent color for contrast</li>
          <li><strong>Error:</strong> Red-based for warnings</li>
          <li><strong>Neutral:</strong> Grays for backgrounds and surfaces</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Tonal Field + Material 3</h2>
        <p>
          Tonal Field natively supports Material Design 3 exports, letting you generate production-ready
          Material theme configurations.
        </p>
      </section>

      <nav style={{
        marginTop: '60px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(0,0,0,0.1)',
      }}>
        <p style={{ opacity: 0.7 }}>Learn more:</p>
        <ul style={{ listStyle: 'none', padding: 0, gap: '8px', display: 'flex', flexDirection: 'column' }}>
          <li><Link href="/guides/dual-theme">Light/Dark Theme Design</Link></li>
          <li><Link href="/guides/oklch-color-space">OKLCH Color Space</Link></li>
          <li><Link href="/studio">Generate Material 3 themes</Link></li>
        </ul>
      </nav>
    </article>
  );
}
