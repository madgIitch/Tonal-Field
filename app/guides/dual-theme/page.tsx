import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Light/Dark Theme Design - Tonal Field',
  description: 'Learn how to design coherent light and dark themes using tonal systems. Master dual-mode color design.',
};

export default function DualThemeGuide() {
  return (
    <article>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
          Designing Light & Dark Themes
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.7 }}>
          Master coherent dual-mode color design
        </p>
      </header>

      <section style={{ marginBottom: '40px' }}>
        <h2>Why Dual Themes Matter</h2>
        <ul>
          <li>User preference (OS, time of day, accessibility)</li>
          <li>Improved battery life on OLED screens</li>
          <li>Reduced eye strain in low-light environments</li>
          <li>Brand consistency across modes</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Key Principles</h2>
        <dl style={{ gap: '20px', display: 'flex', flexDirection: 'column' }}>
          <div>
            <dt style={{ fontWeight: 600, marginBottom: '8px' }}>Maintain Brand</dt>
            <dd>Colors should feel like the same brand in both modes</dd>
          </div>
          <div>
            <dt style={{ fontWeight: 600, marginBottom: '8px' }}>Preserve Contrast</dt>
            <dd>Text must remain readable (WCAG AA/AAA in both light and dark)</dd>
          </div>
          <div>
            <dt style={{ fontWeight: 600, marginBottom: '8px' }}>Semantic Consistency</dt>
            <dd>Primary color means the same thing in light and dark mode</dd>
          </div>
          <div>
            <dt style={{ fontWeight: 600, marginBottom: '8px' }}>Avoid Hard Invertion</dt>
            <dd>Simply inverting colors doesn&apos;t work. Use tonal adjustments instead</dd>
          </div>
        </dl>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Implementation with Tonal Field</h2>
        <p>
          Tonal Field automatically generates coherent light and dark variants. Use the dual-theme
          generator in Studio to see previews of both modes side-by-side.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>CSS Custom Properties Pattern</h2>
        <pre style={{
          background: 'rgba(0,0,0,0.05)',
          padding: '16px',
          borderRadius: '8px',
          overflow: 'auto',
        }}>
{`:root {
  --color-primary: oklch(70% 0.15 200);  /* light mode */
  --color-surface: oklch(98% 0.02 90);
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: oklch(80% 0.12 200);  /* dark mode */
    --color-surface: oklch(15% 0.02 90);
  }
}`}
        </pre>
      </section>

      <nav style={{
        marginTop: '60px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(0,0,0,0.1)',
      }}>
        <p style={{ opacity: 0.7 }}>Related:</p>
        <ul style={{ listStyle: 'none', padding: 0, gap: '8px', display: 'flex', flexDirection: 'column' }}>
          <li><Link href="/guides/wcag-contrast">WCAG Contrast Guide</Link></li>
          <li><Link href="/guides/oklch-color-space">OKLCH Color Space</Link></li>
          <li><Link href="/studio">Generate dual themes</Link></li>
        </ul>
      </nav>
    </article>
  );
}
