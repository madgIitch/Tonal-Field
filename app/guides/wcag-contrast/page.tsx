import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'WCAG Contrast Guide - Tonal Field',
  description: 'Master WCAG 2.1 contrast requirements for accessible color systems. Learn AA vs AAA and how to test contrast ratios.',
};

export default function WcagContrastGuide() {
  return (
    <article>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
          WCAG Contrast Requirements
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.7 }}>
          Make your colors accessible to everyone
        </p>
      </header>

      <section style={{ marginBottom: '40px' }}>
        <h2>What is Contrast Ratio?</h2>
        <p>
          Contrast ratio measures the brightness difference between two colors on a scale of 1:1 to 21:1.
          Higher ratios = easier to read for people with vision impairments.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>WCAG Levels</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <th style={{ textAlign: 'left', padding: '12px' }}>Level</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Normal Text</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Large Text</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <td style={{ padding: '12px' }}>AA (Minimum)</td>
              <td style={{ padding: '12px' }}>4.5:1</td>
              <td style={{ padding: '12px' }}>3:1</td>
            </tr>
            <tr>
              <td style={{ padding: '12px' }}>AAA (Enhanced)</td>
              <td style={{ padding: '12px' }}>7:1</td>
              <td style={{ padding: '12px' }}>4.5:1</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Best Practices</h2>
        <ul>
          <li>Always test text on background combinations</li>
          <li>Aim for AAA where possible (7:1 ratio)</li>
          <li>Use Tonal Field&apos;s built-in contrast checker</li>
          <li>Test with real users when possible</li>
          <li>Don&apos;t rely on color alone for meaning</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <p>
          <Link href="/studio">Test and fix contrast in Tonal Field</Link> with automatic AA/AAA adjustments.
        </p>
      </section>

      <nav style={{
        marginTop: '60px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(0,0,0,0.1)',
      }}>
        <p style={{ opacity: 0.7 }}>Related:</p>
        <ul style={{ listStyle: 'none', padding: 0, gap: '8px', display: 'flex', flexDirection: 'column' }}>
          <li><Link href="/guides/color-blindness">Color Blindness & Accessibility</Link></li>
          <li><Link href="/guides/oklch-color-space">OKLCH Color Space</Link></li>
        </ul>
      </nav>
    </article>
  );
}
