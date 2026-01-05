import type { OKLCH } from "./oklch";
import type { Palette } from "./palette";
import { clamp } from "./oklch";
import { calculateContrast, adjustForContrast } from "./accessibility";

/**
 * Dual theme system (light/dark mode)
 * Automatically derives coherent light and dark variants
 */

export type ThemeMode = "light" | "dark";

export type DualTheme = {
  light: Palette;
  dark: Palette;
};

/**
 * Determines if a palette is light or dark based on background lightness
 */
export function detectThemeMode(palette: Palette): ThemeMode {
  return palette.background.l > 0.5 ? "light" : "dark";
}

/**
 * Inverts lightness while preserving hue and chroma
 * Used for generating opposite theme variants
 */
function invertLightness(color: OKLCH, intensity: number = 1.0): OKLCH {
  // Invert lightness around 0.5 midpoint
  const invertedL = 1 - color.l;
  // Blend with original based on intensity
  const newL = color.l + (invertedL - color.l) * intensity;

  return {
    ...color,
    l: clamp(newL, 0, 1),
  };
}

/**
 * Adjusts chroma for theme mode
 * Dark themes often benefit from slightly reduced chroma
 */
function adjustChromaForMode(color: OKLCH, mode: ThemeMode): OKLCH {
  if (mode === "dark") {
    // Reduce chroma slightly in dark mode for better readability
    return {
      ...color,
      c: clamp(color.c * 0.9, 0, 0.4),
    };
  }
  return color;
}

/**
 * Generates a dark variant from a light palette
 */
export function generateDarkMode(lightPalette: Palette): Palette {
  // Invert background and surface (full inversion)
  const darkBackground = invertLightness(lightPalette.background, 1.0);
  const darkSurface = invertLightness(lightPalette.surface, 1.0);

  // Invert text (full inversion)
  const darkText = invertLightness(lightPalette.text, 1.0);
  const darkMuted = invertLightness(lightPalette.muted, 1.0);

  // Primary and accent: adjust lightness to work on dark backgrounds
  // Keep hue and chroma but adjust lightness for visibility
  let darkPrimary = { ...lightPalette.primary };
  let darkAccent = { ...lightPalette.accent };

  // If primary/accent are too dark, brighten them for dark mode
  if (lightPalette.primary.l < 0.5) {
    darkPrimary = { ...lightPalette.primary, l: clamp(1 - lightPalette.primary.l + 0.1, 0.5, 0.8) };
  }

  if (lightPalette.accent.l < 0.5) {
    darkAccent = { ...lightPalette.accent, l: clamp(1 - lightPalette.accent.l + 0.1, 0.5, 0.8) };
  }

  // Adjust chroma for dark mode
  const palette: Palette = {
    background: adjustChromaForMode(darkBackground, "dark"),
    surface: adjustChromaForMode(darkSurface, "dark"),
    primary: adjustChromaForMode(darkPrimary, "dark"),
    accent: adjustChromaForMode(darkAccent, "dark"),
    text: adjustChromaForMode(darkText, "dark"),
    muted: adjustChromaForMode(darkMuted, "dark"),
  };

  // Ensure contrast requirements are met
  return ensureThemeContrast(palette, "dark");
}

/**
 * Generates a light variant from a dark palette
 */
export function generateLightMode(darkPalette: Palette): Palette {
  // Invert background and surface
  const lightBackground = invertLightness(darkPalette.background, 1.0);
  const lightSurface = invertLightness(darkPalette.surface, 1.0);

  // Invert text
  const lightText = invertLightness(darkPalette.text, 1.0);
  const lightMuted = invertLightness(darkPalette.muted, 1.0);

  // Primary and accent: adjust for light backgrounds
  let lightPrimary = { ...darkPalette.primary };
  let lightAccent = { ...darkPalette.accent };

  // If primary/accent are too bright, darken them for light mode
  if (darkPalette.primary.l > 0.6) {
    lightPrimary = { ...darkPalette.primary, l: clamp(1 - darkPalette.primary.l - 0.1, 0.3, 0.6) };
  }

  if (darkPalette.accent.l > 0.6) {
    lightAccent = { ...darkPalette.accent, l: clamp(1 - darkPalette.accent.l - 0.1, 0.3, 0.6) };
  }

  const palette: Palette = {
    background: lightBackground,
    surface: lightSurface,
    primary: lightPrimary,
    accent: lightAccent,
    text: lightText,
    muted: lightMuted,
  };

  // Ensure contrast requirements are met
  return ensureThemeContrast(palette, "light");
}

/**
 * Ensures minimum contrast ratios for a theme
 * Adjusts colors to meet WCAG AA standards
 */
function ensureThemeContrast(palette: Palette, mode: ThemeMode): Palette {
  const result = { ...palette };

  // Ensure text on background meets AA (4.5:1)
  const textBgContrast = calculateContrast(palette.text, palette.background);
  if (textBgContrast < 4.5) {
    result.text = adjustForContrast(palette.text, palette.background, 4.5);
  }

  // Ensure text on surface meets AA
  const textSurfaceContrast = calculateContrast(palette.text, palette.surface);
  if (textSurfaceContrast < 4.5) {
    // Adjust surface lightness slightly if needed
    const surfaceLAdjust = mode === "light" ? -0.05 : 0.05;
    result.surface = {
      ...palette.surface,
      l: clamp(palette.surface.l + surfaceLAdjust, 0, 1),
    };
  }

  // Ensure muted text meets minimum 3:1 for large text
  const mutedBgContrast = calculateContrast(palette.muted, palette.background);
  if (mutedBgContrast < 3.0) {
    result.muted = adjustForContrast(palette.muted, palette.background, 3.0);
  }

  return result;
}

/**
 * Generates both light and dark variants from a single palette
 * Automatically detects the source mode and derives the opposite
 */
export function generateDualTheme(sourcePalette: Palette): DualTheme {
  const sourceMode = detectThemeMode(sourcePalette);

  if (sourceMode === "light") {
    return {
      light: sourcePalette,
      dark: generateDarkMode(sourcePalette),
    };
  } else {
    return {
      light: generateLightMode(sourcePalette),
      dark: sourcePalette,
    };
  }
}

/**
 * Get palette for specific theme mode from dual theme
 */
export function getPaletteForMode(dualTheme: DualTheme, mode: ThemeMode): Palette {
  return dualTheme[mode];
}

/**
 * Compare contrast ratios between light and dark themes
 */
export function compareThemeContrast(dualTheme: DualTheme): {
  light: { textBg: number; textSurface: number; mutedBg: number };
  dark: { textBg: number; textSurface: number; mutedBg: number };
} {
  return {
    light: {
      textBg: calculateContrast(dualTheme.light.text, dualTheme.light.background),
      textSurface: calculateContrast(dualTheme.light.text, dualTheme.light.surface),
      mutedBg: calculateContrast(dualTheme.light.muted, dualTheme.light.background),
    },
    dark: {
      textBg: calculateContrast(dualTheme.dark.text, dualTheme.dark.background),
      textSurface: calculateContrast(dualTheme.dark.text, dualTheme.dark.surface),
      mutedBg: calculateContrast(dualTheme.dark.muted, dualTheme.dark.background),
    },
  };
}

/**
 * Validates that both themes meet accessibility standards
 */
export function validateDualTheme(dualTheme: DualTheme): {
  light: { valid: boolean; issues: string[] };
  dark: { valid: boolean; issues: string[] };
} {
  const validateMode = (palette: Palette, mode: ThemeMode) => {
    const issues: string[] = [];

    const textBg = calculateContrast(palette.text, palette.background);
    if (textBg < 4.5) {
      issues.push(`Text/background contrast too low: ${textBg.toFixed(2)}:1 (needs 4.5:1)`);
    }

    const textSurface = calculateContrast(palette.text, palette.surface);
    if (textSurface < 4.5) {
      issues.push(`Text/surface contrast too low: ${textSurface.toFixed(2)}:1 (needs 4.5:1)`);
    }

    const mutedBg = calculateContrast(palette.muted, palette.background);
    if (mutedBg < 3.0) {
      issues.push(`Muted/background contrast too low: ${mutedBg.toFixed(2)}:1 (needs 3.0:1)`);
    }

    return { valid: issues.length === 0, issues };
  };

  return {
    light: validateMode(dualTheme.light, "light"),
    dark: validateMode(dualTheme.dark, "dark"),
  };
}
