import type { ReactNode } from 'react';
import { Frame } from '@/components/Frame';

export const metadata = {
  title: 'Guides - Tonal Field',
  description: 'Learn about color systems, OKLCH, accessibility, and more',
};

export default function GuidesLayout({ children }: { children: ReactNode }) {
  return (
    <Frame>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        {children}
      </div>
    </Frame>
  );
}
