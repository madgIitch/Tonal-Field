import type { OKLCH } from "./oklch";
import { clamp } from "./oklch";
import {
  generateTonalPalette,
  generateColorScheme,
  getColorAtTone,
  type TonalPalette,
  type ColorScheme,
} from "./tonal";

export type PaletteRole =
  | "background"
  | "surface"
  | "primary"
  | "accent"
  | "text"
  | "muted";

export type Palette = Record<PaletteRole, OKLCH>;

export type ExtendedPalette = Palette & {
  tonal?: {
    primary: TonalPalette;
    secondary: TonalPalette;
    tertiary: TonalPalette;
    neutral: TonalPalette;
    error: TonalPalette;
  };
  scheme?: {
    light: ColorScheme;
    dark: ColorScheme;
  };
};

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

/**
 * Builds an extended palette with tonal palettes and color schemes
 * Based on Material Design 3 principles from the document
 *
 * @param pair - The color pair from the generative model
 * @returns Extended palette with tonal variations and semantic schemes
 */
export function buildExtendedPaletteFromPalette(basePalette: Palette): ExtendedPalette {
  // Generate tonal palettes for each key color
  const primaryTonal = generateTonalPalette(basePalette.primary, 0.04);

  // Secondary: use accent with slightly reduced chroma
  const secondaryBase = adjust(basePalette.accent, { c: basePalette.accent.c * 0.8 });
  const secondaryTonal = generateTonalPalette(secondaryBase, 0.04);

  // Tertiary: complementary hue to primary (±180°)
  const tertiaryBase = adjust(basePalette.primary, {
    h: basePalette.primary.h + 180,
    c: basePalette.primary.c * 0.7,
  });
  const tertiaryTonal = generateTonalPalette(tertiaryBase, 0.04);

  // Neutral: based on background with very low chroma
  const neutralBase = adjust(basePalette.background, { c: 0.015 });
  const neutralTonal = generateTonalPalette(neutralBase, 0.01);

  // Error: standard red-ish error color
  const errorBase: OKLCH = { l: 0.55, c: 0.18, h: 25 };
  const errorTonal = generateTonalPalette(errorBase, 0.08);

  // Generate complete color schemes for light and dark modes
  const lightScheme = generateColorScheme(
    primaryTonal,
    secondaryTonal,
    tertiaryTonal,
    neutralTonal,
    errorTonal,
    false
  );

  const darkScheme = generateColorScheme(
    primaryTonal,
    secondaryTonal,
    tertiaryTonal,
    neutralTonal,
    errorTonal,
    true
  );

  return {
    ...basePalette,
    tonal: {
      primary: primaryTonal,
      secondary: secondaryTonal,
      tertiary: tertiaryTonal,
      neutral: neutralTonal,
      error: errorTonal,
    },
    scheme: {
      light: lightScheme,
      dark: darkScheme,
    },
  };
}

export function buildExtendedPalette(pair: Pair): ExtendedPalette {
  return buildExtendedPaletteFromPalette(buildPalette(pair));
}

/**
 * Type for role-based tonal palettes
 * Each palette role gets its own tonal ramp
 */
export type RoleTonalPalettes = Record<PaletteRole, TonalPalette>;

/**
 * Default tone values for each role
 * These follow Material Design 3 conventions for light mode
 */
export const DEFAULT_ROLE_TONES: Record<PaletteRole, number> = {
  background: 95, // Very light for backgrounds
  surface: 90, // Slightly darker for cards/surfaces
  primary: 40, // Medium for primary actions
  accent: 50, // Medium-high for accents
  text: 10, // Very dark for readable text
  muted: 40, // Medium for secondary text
};

/**
 * Generates tonal palettes for each role in the base palette
 * Each role gets its own 13-tone ramp based on its base color
 *
 * @param basePalette - The palette to generate tonal ramps from
 * @returns Object mapping each role to its tonal palette
 */
export function buildRoleTonalPalettes(basePalette: Palette): RoleTonalPalettes {
  const palettes: Partial<RoleTonalPalettes> = {};

  (Object.keys(basePalette) as PaletteRole[]).forEach((role) => {
    // Adjust minimum chroma based on role type
    const minChroma =
      role === "background" || role === "surface"
        ? 0.01
        : role === "text" || role === "muted"
          ? 0.02
          : 0.04;

    palettes[role] = generateTonalPalette(basePalette[role], minChroma);
  });

  return palettes as RoleTonalPalettes;
}

/**
 * Applies tone selections to generate final palette colors
 * Takes base palette and tone values, returns adjusted palette
 *
 * @param basePalette - Original palette (provides hue and chroma)
 * @param roleTones - Tone value (0-100) for each role
 * @returns New palette with applied tone values
 */
export function applyTonesToPalette(
  basePalette: Palette,
  roleTones: Record<PaletteRole, number>
): Palette {
  const result: Partial<Palette> = {};

  (Object.keys(basePalette) as PaletteRole[]).forEach((role) => {
    const baseColor = basePalette[role];
    const tone = roleTones[role];

    // Preserve hue and chroma, apply selected tone (lightness)
    result[role] = getColorAtTone(baseColor, tone);
  });

  return result as Palette;
}
