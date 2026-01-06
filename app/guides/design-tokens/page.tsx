import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Design Tokens Guide - Color Tokens for Design Systems | Tonal Field',
  description: 'Learn how to use design tokens for scalable color systems. Export color tokens as JSON, CSS variables, Tailwind config, and more.',
  openGraph: {
    title: 'Design Tokens: Build Scalable Color Systems',
    description: 'Master color tokens for design systems. Learn implementation, best practices, and export formats.',
    type: 'article',
  },
};

export default function DesignTokensGuide() {
  return (
    <article>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
          Design Tokens for Color Systems
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.7 }}>
          Build scalable, maintainable color systems with design tokens
        </p>
      </header>

      <section style={{ marginBottom: '40px' }}>
        <h2>What Are Design Tokens?</h2>
        <p>
          Design tokens are named variables that store design decisions like colors, typography, spacing,
          and more. Instead of hardcoding <code>#3B82F6</code> throughout your app, you use a semantic
          token like <code>--color-primary</code> that can be updated globally.
        </p>
        <p>
          Think of tokens as a single source of truth: change the value once, update everywhere.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Why Color Tokens Matter</h2>
        <ul>
          <li><strong>Consistency:</strong> One color definition, used everywhere. No more &quot;Why do we have 3 different blues?&quot;</li>
          <li><strong>Maintainability:</strong> Rebrand your product by updating tokens, not hunting through code</li>
          <li><strong>Scalability:</strong> Add themes (light/dark), platforms (web/mobile), or brands without duplicating logic</li>
          <li><strong>Developer-Designer Sync:</strong> Designers define tokens in Figma, developers consume them as code</li>
          <li><strong>Platform Agnostic:</strong> Export to CSS, Tailwind, React Native, iOS, Android from one source</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Tokens vs CSS Variables</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <th style={{ textAlign: 'left', padding: '12px' }}>Aspect</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>CSS Variables</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Design Tokens</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <td style={{ padding: '12px' }}>Format</td>
              <td style={{ padding: '12px' }}>CSS only</td>
              <td style={{ padding: '12px' }}>JSON, YAML, platform-agnostic</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <td style={{ padding: '12px' }}>Scope</td>
              <td style={{ padding: '12px' }}>Web only</td>
              <td style={{ padding: '12px' }}>Web, iOS, Android, React Native</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <td style={{ padding: '12px' }}>Tooling</td>
              <td style={{ padding: '12px' }}>Manual management</td>
              <td style={{ padding: '12px' }}>Automated transformations, versioning</td>
            </tr>
            <tr>
              <td style={{ padding: '12px' }}>Best Use</td>
              <td style={{ padding: '12px' }}>Simple web projects</td>
              <td style={{ padding: '12px' }}>Design systems, multi-platform products</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Anatomy of Color Tokens</h2>
        <p>Good color tokens follow a clear naming convention:</p>

        <pre style={{
          background: 'rgba(0,0,0,0.05)',
          padding: '16px',
          borderRadius: '8px',
          overflow: 'auto',
        }}>
{`// ❌ Bad: Implementation-focused
--blue-500: #3B82F6;
--red-dark: #DC2626;

// ✅ Good: Purpose-focused (semantic)
--color-primary: #3B82F6;
--color-error: #DC2626;
--color-text-default: #1F2937;
--color-surface-elevated: #FFFFFF;`}
        </pre>

        <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Token Naming Structure</h3>
        <dl style={{ gap: '16px', display: 'flex', flexDirection: 'column' }}>
          <div>
            <dt style={{ fontWeight: 600, marginBottom: '4px' }}>Category + Role + Variant</dt>
            <dd><code>color-primary-hover</code>, <code>color-text-muted</code></dd>
          </div>
          <div>
            <dt style={{ fontWeight: 600, marginBottom: '4px' }}>Common Categories</dt>
            <dd>color, spacing, typography, border, shadow, animation</dd>
          </div>
          <div>
            <dt style={{ fontWeight: 600, marginBottom: '4px' }}>Common Roles (for color)</dt>
            <dd>primary, secondary, accent, background, surface, text, error, success, warning</dd>
          </div>
        </dl>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Token Export Formats</h2>
        <p>Design tokens can be exported to multiple formats for different platforms:</p>

        <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>1. CSS Variables</h3>
        <pre style={{
          background: 'rgba(0,0,0,0.05)',
          padding: '16px',
          borderRadius: '8px',
          overflow: 'auto',
        }}>
{`:root {
  --color-primary: oklch(70% 0.15 200);
  --color-background: oklch(98% 0.02 90);
  --color-text: oklch(20% 0.02 90);
}

button {
  background: var(--color-primary);
  color: var(--color-text);
}`}
        </pre>

        <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>2. Tailwind Config</h3>
        <pre style={{
          background: 'rgba(0,0,0,0.05)',
          padding: '16px',
          borderRadius: '8px',
          overflow: 'auto',
        }}>
{`// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'oklch(70% 0.15 200)',
        background: 'oklch(98% 0.02 90)',
        text: 'oklch(20% 0.02 90)',
      }
    }
  }
}`}
        </pre>

        <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>3. JSON Tokens</h3>
        <pre style={{
          background: 'rgba(0,0,0,0.05)',
          padding: '16px',
          borderRadius: '8px',
          overflow: 'auto',
        }}>
{`{
  "color": {
    "primary": {
      "value": "oklch(70% 0.15 200)",
      "type": "color"
    },
    "background": {
      "value": "oklch(98% 0.02 90)",
      "type": "color"
    }
  }
}`}
        </pre>

        <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>4. React Native / JavaScript</h3>
        <pre style={{
          background: 'rgba(0,0,0,0.05)',
          padding: '16px',
          borderRadius: '8px',
          overflow: 'auto',
        }}>
{`export const colors = {
  primary: '#3B82F6',
  background: '#FAFAFA',
  text: '#1F2937',
};`}
        </pre>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Best Practices</h2>
        <ul>
          <li><strong>Use semantic names:</strong> Name tokens by purpose (primary, error), not appearance (blue, red)</li>
          <li><strong>Start small:</strong> Begin with 10-15 core tokens. Expand as needed</li>
          <li><strong>Version your tokens:</strong> Track changes like code (Git, semantic versioning)</li>
          <li><strong>Document context:</strong> Explain when to use each token (e.g., &quot;Use text-muted for secondary info&quot;)</li>
          <li><strong>Automate transformations:</strong> Use tools like Style Dictionary to generate platform-specific code</li>
          <li><strong>Test across themes:</strong> Ensure tokens work in light, dark, and high-contrast modes</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Common Pitfalls</h2>
        <ul>
          <li><strong>Over-tokenizing:</strong> Don&apos;t create a token for every single color. Group related values</li>
          <li><strong>Naming inconsistency:</strong> Pick a convention (kebab-case, camelCase) and stick to it</li>
          <li><strong>Hard-coded overrides:</strong> Avoid bypassing tokens with inline styles or magic values</li>
          <li><strong>No governance:</strong> Without clear ownership, tokens proliferate and become messy</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Exporting with Tonal Field</h2>
        <p>
          Tonal Field makes token generation effortless. After defining your color system in the{' '}
          <Link href="/studio">Studio</Link>, export your palette as:
        </p>
        <ul>
          <li>CSS Custom Properties (CSS Variables)</li>
          <li>Tailwind Config (tailwind.config.js)</li>
          <li>JSON Design Tokens (W3C spec)</li>
          <li>Material UI Theme (JavaScript)</li>
          <li>Figma Plugins, Sketch, VS Code themes</li>
          <li>Apple .clr format for iOS/macOS</li>
        </ul>
        <p>
          No manual conversion needed. Build once, export everywhere.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Next Steps</h2>
        <p>
          Ready to build your token-based color system? Head to the{' '}
          <Link href="/studio">Tonal Field Studio</Link> to create your palette and export production-ready
          design tokens in seconds.
        </p>
      </section>

      <nav style={{
        marginTop: '60px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(0,0,0,0.1)',
      }}>
        <p style={{ opacity: 0.7 }}>Related guides:</p>
        <ul style={{ listStyle: 'none', padding: 0, gap: '8px', display: 'flex', flexDirection: 'column' }}>
          <li><Link href="/guides/color-systems">What is a Color System?</Link></li>
          <li><Link href="/guides/oklch-color-space">OKLCH Color Space</Link></li>
          <li><Link href="/guides/material-design-3">Material Design 3 Tonal System</Link></li>
          <li><Link href="/studio">Build Your System in Studio</Link></li>
        </ul>
      </nav>
    </article>
  );
}
