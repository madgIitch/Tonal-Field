import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Color Blindness & Inclusive Design - Tonal Field',
  description: 'Learn about color blindness types and how to design color systems that work for everyone. Understand protanopia, deuteranopia, and tritanopia.',
};

export default function ColorBlindnessGuide() {
  return (
    <article>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
          Color Blindness & Inclusive Design
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.7 }}>
          Design colors that work for people with color vision deficiency
        </p>
      </header>

      <section style={{ marginBottom: '40px' }}>
        <h2>Types of Color Vision Deficiency</h2>
        <dl style={{ gap: '20px', display: 'flex', flexDirection: 'column' }}>
          <div>
            <dt style={{ fontWeight: 600, marginBottom: '8px' }}>Protanopia (Red Blindness)</dt>
            <dd>~1% of males. Red and green appear as shades of yellow/brown. Affects red-green discrimination.</dd>
          </div>
          <div>
            <dt style={{ fontWeight: 600, marginBottom: '8px' }}>Deuteranopia (Green Blindness)</dt>
            <dd>~1% of males. Green and red look similar. Most common color blindness.</dd>
          </div>
          <div>
            <dt style={{ fontWeight: 600, marginBottom: '8px' }}>Tritanopia (Blue-Yellow Blindness)</dt>
            <dd>~0.001% of population. Blue and yellow appear shifted. Rare.</dd>
          </div>
        </dl>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Design Principles</h2>
        <ul>
          <li>Never use color alone to convey meaning</li>
          <li>Provide sufficient contrast (WCAG AA/AAA)</li>
          <li>Test with color blindness simulators</li>
          <li>Use luminance (lightness) as primary cue</li>
          <li>Pair colors with patterns or icons when critical</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Testing with Tonal Field</h2>
        <p>
          Use Tonal Field&apos;s built-in color blindness simulator to preview how your palette looks
          to people with protanopia, deuteranopia, or tritanopia before shipping.
        </p>
      </section>

      <nav style={{
        marginTop: '60px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(0,0,0,0.1)',
      }}>
        <p style={{ opacity: 0.7 }}>Related guides:</p>
        <ul style={{ listStyle: 'none', padding: 0, gap: '8px', display: 'flex', flexDirection: 'column' }}>
          <li><Link href="/guides/wcag-contrast">WCAG Contrast Requirements</Link></li>
          <li><Link href="/guides/color-systems">What is a Color System?</Link></li>
          <li><Link href="/studio">Test your palette</Link></li>
        </ul>
      </nav>
    </article>
  );
}
