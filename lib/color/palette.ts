import type { OKLCH } from "./oklch";
import { clamp } from "./oklch";

export type PaletteRole =
  | "background"
  | "surface"
  | "primary"
  | "accent"
  | "text"
  | "muted";

export type Palette = Record<PaletteRole, OKLCH>;

type Pair = {
  a: OKLCH;
  b: OKLCH;
};

const normalizeHue = (hue: number) => ((hue % 360) + 360) % 360;

const clampL = (value: number) => clamp(value, 0.04, 0.98);
const clampC = (value: number) => clamp(value, 0, 0.4);

const adjust = (base: OKLCH, overrides: Partial<OKLCH>): OKLCH => ({
  l: clampL(overrides.l ?? base.l),
  c: clampC(overrides.c ?? base.c),
  h: normalizeHue(overrides.h ?? base.h),
});

export function buildPalette(pair: Pair): Palette {
  const { a, b } = pair;

  const background = adjust(a, { l: a.l + 0.06, c: a.c * 0.5 });
  const surface = adjust(a, { l: a.l - 0.02, c: a.c * 0.85 + 0.01 });
  const primary = adjust(b, { l: b.l + 0.08, c: b.c + 0.06 });
  const accent = adjust(b, { l: b.l + 0.12, c: b.c + 0.12, h: b.h + 12 });
  const text = adjust(b, { l: b.l - 0.22, c: b.c * 0.4 });
  const muted = adjust(text, { l: text.l + 0.2, c: text.c * 0.6 });

  return {
    background,
    surface,
    primary,
    accent,
    text,
    muted,
  };
}
