import type { OKLCH } from "./oklch";
import { clamp } from "./oklch";

/**
 * Tonal Palette System inspired by Material Design 3 (Material You)
 * Generates tonal variations of a color across the lightness spectrum
 */

export type TonalPalette = {
  [tone: number]: OKLCH;
};

export type ColorRole =
  | "primary"
  | "onPrimary"
  | "primaryContainer"
  | "onPrimaryContainer"
  | "secondary"
  | "onSecondary"
  | "secondaryContainer"
  | "onSecondaryContainer"
  | "tertiary"
  | "onTertiary"
  | "tertiaryContainer"
  | "onTertiaryContainer"
  | "error"
  | "onError"
  | "errorContainer"
  | "onErrorContainer"
  | "background"
  | "onBackground"
  | "surface"
  | "onSurface"
  | "surfaceVariant"
  | "onSurfaceVariant"
  | "outline"
  | "outlineVariant";

export type ColorScheme = {
  [role in ColorRole]: OKLCH;
};

/**
 * Standard tones used in Material Design 3
 * 0 = pure black, 100 = pure white (perceptually)
 */
export const STANDARD_TONES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100];

/**
 * Generates a tonal palette from a base color
 * Maintains hue and chroma, varies lightness across the spectrum
 *
 * Based on Material Design 3's approach:
 * - Tone 0 = almost black with the color's hue
 * - Tone 50 = the color at medium lightness
 * - Tone 100 = almost white with the color's hue
 *
 * @param baseColor - The seed color to generate tones from
 * @param minChroma - Minimum chroma to maintain (default 0.02 for near-neutrals)
 * @returns Object mapping tone values (0-100) to OKLCH colors
 */
export function generateTonalPalette(
  baseColor: OKLCH,
  minChroma: number = 0.02
): TonalPalette {
  const palette: TonalPalette = {};
  const hue = baseColor.h;
  // Ensure minimum chroma to maintain color identity even in extremes
  const chroma = Math.max(baseColor.c, minChroma);

  STANDARD_TONES.forEach((tone) => {
    // Convert tone (0-100) to OKLCH lightness (0-1)
    // This is perceptually linear - a difference of 10 tone units
    // corresponds to a consistent perceptual difference
    const lightness = clamp(tone / 100, 0, 1);

    // At extreme tones (very dark/light), reduce chroma slightly
    // to avoid gamut issues and match Material Design behavior
    let adjustedChroma = chroma;
    if (tone <= 10) {
      // Very dark tones: reduce chroma by ~30%
      adjustedChroma = chroma * 0.7;
    } else if (tone >= 95) {
      // Very light tones: reduce chroma by ~50%
      adjustedChroma = chroma * 0.5;
    }

    palette[tone] = {
      l: lightness,
      c: clamp(adjustedChroma, 0, 0.4),
      h: hue,
    };
  });

  return palette;
}

/**
 * Calculates perceptual contrast ratio based on lightness difference
 *
 * Material Design 3 principle:
 * - 40 tone difference ≈ 3.0:1 contrast ratio
 * - 50 tone difference ≈ 4.5:1 (WCAG AA minimum)
 * - 60 tone difference ≈ 7:1 (WCAG AAA)
 *
 * This is more predictable than WCAG's relative luminance calculation
 * because OKLCH L* is perceptually linear
 *
 * @param tone1 - First tone (0-100)
 * @param tone2 - Second tone (0-100)
 * @returns Approximate contrast ratio
 */
export function estimateContrastFromTones(tone1: number, tone2: number): number {
  const diff = Math.abs(tone1 - tone2);

  // Empirical approximation based on Material Design 3 guidelines
  // These values match the document's stated relationships
  if (diff >= 60) return 7.0;
  if (diff >= 50) return 4.5;
  if (diff >= 40) return 3.0;

  // Linear interpolation for intermediate values
  // At diff=0, contrast is 1:1
  // This approximation follows the curve of actual WCAG contrast
  return 1 + (diff / 60) * 6;
}

/**
 * Finds the nearest tone that meets minimum contrast requirement
 *
 * @param baseTone - The tone to contrast against
 * @param minContrast - Minimum required contrast ratio (e.g., 4.5 for WCAG AA)
 * @param preferDark - Prefer darker tones over lighter ones
 * @returns The tone value that meets the contrast requirement
 */
export function findContrastingTone(
  baseTone: number,
  minContrast: number = 4.5,
  preferDark: boolean = false
): number {
  // Approximate required tone difference for the contrast
  let requiredDiff = 50; // Start with WCAG AA minimum
  if (minContrast >= 7) requiredDiff = 60;
  else if (minContrast >= 4.5) requiredDiff = 50;
  else if (minContrast >= 3) requiredDiff = 40;
  else requiredDiff = Math.ceil(minContrast * 10);

  if (preferDark) {
    // Try going darker first
    const darkTone = Math.max(0, baseTone - requiredDiff);
    if (darkTone >= 0) return Math.round(darkTone / 10) * 10; // Round to nearest 10
    // If can't go dark enough, go light
    return Math.min(100, baseTone + requiredDiff);
  } else {
    // Try going lighter first
    const lightTone = Math.min(100, baseTone + requiredDiff);
    if (lightTone <= 100) return Math.round(lightTone / 10) * 10;
    // If can't go light enough, go dark
    return Math.max(0, baseTone - requiredDiff);
  }
}

/**
 * Generates a complete color scheme from tonal palettes
 * Following Material Design 3 conventions for light and dark modes
 *
 * @param primaryPalette - Tonal palette for primary color
 * @param secondaryPalette - Tonal palette for secondary color
 * @param tertiaryPalette - Tonal palette for tertiary color
 * @param neutralPalette - Tonal palette for neutral colors (backgrounds)
 * @param errorPalette - Tonal palette for error colors
 * @param isDark - Whether to generate dark mode scheme
 * @returns Complete color scheme with all semantic roles
 */
export function generateColorScheme(
  primaryPalette: TonalPalette,
  secondaryPalette: TonalPalette,
  tertiaryPalette: TonalPalette,
  neutralPalette: TonalPalette,
  errorPalette: TonalPalette,
  isDark: boolean = false
): ColorScheme {
  if (isDark) {
    // Dark mode: inverted tone assignments
    return {
      primary: primaryPalette[80],
      onPrimary: primaryPalette[20],
      primaryContainer: primaryPalette[30],
      onPrimaryContainer: primaryPalette[90],

      secondary: secondaryPalette[80],
      onSecondary: secondaryPalette[20],
      secondaryContainer: secondaryPalette[30],
      onSecondaryContainer: secondaryPalette[90],

      tertiary: tertiaryPalette[80],
      onTertiary: tertiaryPalette[20],
      tertiaryContainer: tertiaryPalette[30],
      onTertiaryContainer: tertiaryPalette[90],

      error: errorPalette[80],
      onError: errorPalette[20],
      errorContainer: errorPalette[30],
      onErrorContainer: errorPalette[90],

      background: neutralPalette[10],
      onBackground: neutralPalette[90],
      surface: neutralPalette[10],
      onSurface: neutralPalette[90],
      surfaceVariant: neutralPalette[30],
      onSurfaceVariant: neutralPalette[80],

      outline: neutralPalette[60],
      outlineVariant: neutralPalette[30],
    };
  } else {
    // Light mode: standard tone assignments
    return {
      primary: primaryPalette[40],
      onPrimary: primaryPalette[100],
      primaryContainer: primaryPalette[90],
      onPrimaryContainer: primaryPalette[10],

      secondary: secondaryPalette[40],
      onSecondary: secondaryPalette[100],
      secondaryContainer: secondaryPalette[90],
      onSecondaryContainer: secondaryPalette[10],

      tertiary: tertiaryPalette[40],
      onTertiary: tertiaryPalette[100],
      tertiaryContainer: tertiaryPalette[90],
      onTertiaryContainer: tertiaryPalette[10],

      error: errorPalette[40],
      onError: errorPalette[100],
      errorContainer: errorPalette[90],
      onErrorContainer: errorPalette[10],

      background: neutralPalette[99],
      onBackground: neutralPalette[10],
      surface: neutralPalette[99],
      onSurface: neutralPalette[10],
      surfaceVariant: neutralPalette[90],
      onSurfaceVariant: neutralPalette[30],

      outline: neutralPalette[50],
      outlineVariant: neutralPalette[80],
    };
  }
}

/**
 * Converts a tone value (0-100) to a readable label
 */
export function toneName(tone: number): string {
  if (tone === 0) return "Black";
  if (tone === 100) return "White";
  if (tone <= 20) return "Very Dark";
  if (tone <= 40) return "Dark";
  if (tone <= 60) return "Medium";
  if (tone <= 80) return "Light";
  return "Very Light";
}
