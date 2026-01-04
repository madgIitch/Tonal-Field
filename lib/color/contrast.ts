import type { OKLCH } from "./oklch";
import type { Palette } from "./palette";
import { clamp, oklchToLinearSrgb } from "./oklch";

export type ContrastLevel = "AAA" | "AA" | "Fail";
export type FixResult = { palette: Palette; primaryText: OKLCH };

export const LIGHT_TEXT: OKLCH = { l: 0.98, c: 0.02, h: 90 };
export const DARK_TEXT: OKLCH = { l: 0.14, c: 0.02, h: 90 };

const relativeLuminance = (color: OKLCH) => {
  const rgb = oklchToLinearSrgb(color);

  const r = clamp(rgb.r, 0, 1);
  const g = clamp(rgb.g, 0, 1);
  const b = clamp(rgb.b, 0, 1);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrastRatio = (foreground: OKLCH, background: OKLCH) => {
  const lumA = relativeLuminance(foreground);
  const lumB = relativeLuminance(background);
  const light = Math.max(lumA, lumB);
  const dark = Math.min(lumA, lumB);

  return (light + 0.05) / (dark + 0.05);
};

export const getContrastLevel = (ratio: number): ContrastLevel => {
  if (ratio >= 7) {
    return "AAA";
  }
  if (ratio >= 4.5) {
    return "AA";
  }
  return "Fail";
};

export const pickTextColor = (background: OKLCH) => {
  const lightRatio = contrastRatio(LIGHT_TEXT, background);
  const darkRatio = contrastRatio(DARK_TEXT, background);
  return lightRatio >= darkRatio
    ? { color: LIGHT_TEXT, ratio: lightRatio }
    : { color: DARK_TEXT, ratio: darkRatio };
};

const adjustLightnessForTargets = (
  color: OKLCH,
  backgrounds: OKLCH[],
  target: number
) => {
  const steps = 200;
  let best = color;
  let bestDistance = Number.POSITIVE_INFINITY;
  let bestMinRatio = -1;
  let foundTarget = false;

  for (let i = 0; i <= steps; i += 1) {
    const l = i / steps;
    const candidate = { ...color, l };
    const minRatio = backgrounds.reduce(
      (min, bg) => Math.min(min, contrastRatio(candidate, bg)),
      Number.POSITIVE_INFINITY
    );
    const distance = Math.abs(l - color.l);

    if (minRatio >= target) {
      if (!foundTarget || distance < bestDistance) {
        best = candidate;
        bestDistance = distance;
      }
      foundTarget = true;
      continue;
    }

    if (!foundTarget && minRatio > bestMinRatio) {
      best = candidate;
      bestMinRatio = minRatio;
    }
  }

  return best;
};

const fixPrimaryForContrast = (primary: OKLCH, target: number) => {
  const primaryWithLight = adjustLightnessForTargets(
    primary,
    [LIGHT_TEXT],
    target
  );
  const primaryWithDark = adjustLightnessForTargets(
    primary,
    [DARK_TEXT],
    target
  );

  const lightRatio = contrastRatio(LIGHT_TEXT, primaryWithLight);
  const darkRatio = contrastRatio(DARK_TEXT, primaryWithDark);
  const lightDistance = Math.abs(primaryWithLight.l - primary.l);
  const darkDistance = Math.abs(primaryWithDark.l - primary.l);

  if (lightRatio >= target && darkRatio >= target) {
    return lightDistance <= darkDistance
      ? { primary: primaryWithLight, primaryText: LIGHT_TEXT }
      : { primary: primaryWithDark, primaryText: DARK_TEXT };
  }

  if (lightRatio >= target) {
    return { primary: primaryWithLight, primaryText: LIGHT_TEXT };
  }

  if (darkRatio >= target) {
    return { primary: primaryWithDark, primaryText: DARK_TEXT };
  }

  return lightRatio >= darkRatio
    ? { primary: primaryWithLight, primaryText: LIGHT_TEXT }
    : { primary: primaryWithDark, primaryText: DARK_TEXT };
};

export const fixPaletteContrastBasic = (palette: Palette): FixResult => {
  const text = adjustLightnessForTargets(
    palette.text,
    [palette.background, palette.surface],
    4.5
  );
  const primaryFix = fixPrimaryForContrast(palette.primary, 4.5);

  return {
    palette: {
      ...palette,
      text,
      primary: primaryFix.primary,
    },
    primaryText: primaryFix.primaryText,
  };
};

export const fixPaletteContrast = (palette: Palette): FixResult => {
  const text = adjustLightnessForTargets(
    palette.text,
    [palette.background, palette.surface],
    4.5
  );
  const muted = adjustLightnessForTargets(
    palette.muted,
    [palette.background, palette.surface],
    3
  );
  const accent = adjustLightnessForTargets(
    palette.accent,
    [palette.background],
    4.5
  );
  const primaryFix = fixPrimaryForContrast(palette.primary, 4.5);

  return {
    palette: {
      ...palette,
      text,
      muted,
      accent,
      primary: primaryFix.primary,
    },
    primaryText: primaryFix.primaryText,
  };
};
