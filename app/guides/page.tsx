'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function GuidesIndex() {
  const guides = [
    {
      title: 'What is a Color System?',
      description: 'Learn the difference between palettes and systems. Understand roles, hierarchy, and why systems matter.',
      href: '/guides/color-systems',
      icon: '🎨',
    },
    {
      title: 'OKLCH Color Space',
      description: 'Master OKLCH: the perceptually uniform color space designed for modern UI. Why OKLCH beats HSL.',
      href: '/guides/oklch-color-space',
      icon: '🎯',
    },
    {
      title: 'WCAG Contrast Guide',
      description: 'Understand WCAG 2.1 requirements. Learn AA vs AAA levels and how to ensure accessible color pairs.',
      href: '/guides/wcag-contrast',
      icon: '♿',
    },
    {
      title: 'Material Design 3 Tonal System',
      description: 'Deep dive into Material Design 3 and tonal palettes. How Google generates accessible themes automatically.',
      href: '/guides/material-design-3',
      icon: '📐',
    },
    {
      title: 'Color Blindness & Inclusive Design',
      description: 'Design for protanopia, deuteranopia, and tritanopia. Test your colors with built-in simulators.',
      href: '/guides/color-blindness',
      icon: '👁️',
    },
    {
      title: 'Light/Dark Theme Design',
      description: 'Master dual-mode design. Create coherent light and dark themes using tonal systems.',
      href: '/guides/dual-theme',
      icon: '🌓',
    },
    {
      title: 'Energy & Tension Model',
      description: 'Understand Tonal Field&apos;s proprietary model. Control color with intuitive Energy and Tension dimensions.',
      href: '/guides/energy-tension',
      icon: '⚡',
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div>
      <header style={{ marginBottom: '60px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
          Color Design Guides
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.7, marginBottom: '24px' }}>
          Master modern color systems, accessibility, and intuitive control
        </p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '60px',
      }}>
        {guides.map((guide, idx) => (
          <Link
            key={guide.href}
            href={guide.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '24px',
              borderRadius: '12px',
              background: hoveredIndex === idx ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.02)',
              border: hoveredIndex === idx ? '1px solid rgba(0,0,0,0.15)' : '1px solid rgba(0,0,0,0.08)',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 200ms',
              cursor: 'pointer',
            }}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div style={{ fontSize: '2rem' }}>{guide.icon}</div>
            <h2 style={{ fontSize: '1.1rem', margin: '0' }}>{guide.title}</h2>
            <p style={{ fontSize: '0.9rem', opacity: 0.7, margin: '0' }}>
              {guide.description}
            </p>
            <div style={{ marginTop: '8px', fontSize: '0.9rem', color: 'var(--accent)' }}>
              Read guide →
            </div>
          </Link>
        ))}
      </div>

      <section style={{ marginTop: '60px', padding: '40px', background: 'rgba(0,0,0,0.02)', borderRadius: '12px' }}>
        <h2>Ready to Build?</h2>
        <p>
          Once you&apos;ve mastered these concepts, head to the <Link href="/studio">Studio</Link> to
          create your color system with intuitive Energy and Tension controls.
        </p>
        <Link
          href="/studio"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: 'var(--accent)',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            marginTop: '12px',
          }}
        >
          Open Studio
        </Link>
      </section>
    </div>
  );
}
