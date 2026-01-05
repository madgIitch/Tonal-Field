import type { OKLCH } from "./oklch";
import { toRgb, fromRgb } from "./oklch";

/**
 * Color Blindness Simulation and Accessibility Tools
 * Based on Brettel, Viénot and Mollon CVIU 1997
 * and WCAG 2.1 contrast guidelines
 */

export type ColorBlindnessType = "normal" | "protanopia" | "deuteranopia" | "tritanopia";

export type ContrastLevel = "AAA" | "AA" | "AA-large" | "fail";

export interface ContrastResult {
  ratio: number;
  level: ContrastLevel;
  passes: {
    AA: boolean;
    AAA: boolean;
    AALarge: boolean;
  };
}

/**
 * Simulation matrices for different types of color blindness
 * These transform RGB values to simulate how colors appear to people with various CVDs
 */

// Protanopia (red-blind): missing L-cones
const PROTANOPIA_MATRIX = [
  [0.567, 0.433, 0.0],
  [0.558, 0.442, 0.0],
  [0.0, 0.242, 0.758],
];

// Deuteranopia (green-blind): missing M-cones
const DEUTERANOPIA_MATRIX = [
  [0.625, 0.375, 0.0],
  [0.7, 0.3, 0.0],
  [0.0, 0.3, 0.7],
];

// Tritanopia (blue-blind): missing S-cones
const TRITANOPIA_MATRIX = [
  [0.95, 0.05, 0.0],
  [0.0, 0.433, 0.567],
  [0.0, 0.475, 0.525],
];

/**
 * Applies a color blindness transformation matrix to RGB values (0-1 range)
 */
function applyMatrix(rgb: { r: number; g: number; b: number }, matrix: number[][]): { r: number; g: number; b: number } {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  return {
    r: Math.max(0, Math.min(255, (matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b) * 255)),
    g: Math.max(0, Math.min(255, (matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b) * 255)),
    b: Math.max(0, Math.min(255, (matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b) * 255)),
  };
}

/**
 * Simulates how a color appears to someone with color blindness
 *
 * @param color - OKLCH color to simulate
 * @param type - Type of color blindness
 * @returns Simulated OKLCH color
 */
export function simulateColorBlindness(color: OKLCH, type: ColorBlindnessType): OKLCH {
  if (type === "normal") return color;

  // Convert to RGB for matrix transformation
  const rgb = toRgb(color);

  // Apply appropriate transformation
  let transformedRgb: { r: number; g: number; b: number };
  switch (type) {
    case "protanopia":
      transformedRgb = applyMatrix(rgb, PROTANOPIA_MATRIX);
      break;
    case "deuteranopia":
      transformedRgb = applyMatrix(rgb, DEUTERANOPIA_MATRIX);
      break;
    case "tritanopia":
      transformedRgb = applyMatrix(rgb, TRITANOPIA_MATRIX);
      break;
    default:
      return color;
  }

  // Convert back to OKLCH
  return fromRgb(transformedRgb);
}

/**
 * Calculates relative luminance according to WCAG 2.1
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const toLinear = (val: number) => {
    const sRGB = val / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  };

  const r = toLinear(rgb.r);
  const g = toLinear(rgb.g);
  const b = toLinear(rgb.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculates WCAG 2.1 contrast ratio between two colors
 *
 * @param color1 - First color (typically text)
 * @param color2 - Second color (typically background)
 * @returns Contrast ratio (1-21)
 */
export function calculateContrast(color1: OKLCH, color2: OKLCH): number {
  const rgb1 = toRgb(color1);
  const rgb2 = toRgb(color2);

  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Evaluates contrast ratio against WCAG 2.1 standards
 *
 * @param ratio - Contrast ratio to evaluate
 * @param isLargeText - Whether text is large (18pt+ or 14pt+ bold)
 * @returns Contrast evaluation result
 */
export function evaluateContrast(ratio: number, isLargeText: boolean = false): ContrastResult {
  const passesAALarge = ratio >= 3.0;
  const passesAA = ratio >= 4.5;
  const passesAAA = ratio >= 7.0;

  let level: ContrastLevel;
  if (passesAAA) {
    level = "AAA";
  } else if (passesAA) {
    level = "AA";
  } else if (isLargeText && passesAALarge) {
    level = "AA-large";
  } else {
    level = "fail";
  }

  return {
    ratio,
    level,
    passes: {
      AA: passesAA,
      AAA: passesAAA,
      AALarge: passesAALarge,
    },
  };
}

/**
 * Checks if a color pair meets minimum WCAG standards
 */
export function meetsAccessibility(
  foreground: OKLCH,
  background: OKLCH,
  minLevel: "AA" | "AAA" = "AA",
  isLargeText: boolean = false
): boolean {
  const ratio = calculateContrast(foreground, background);
  const result = evaluateContrast(ratio, isLargeText);

  if (minLevel === "AAA") {
    return result.passes.AAA;
  }
  return result.passes.AA || (isLargeText && result.passes.AALarge);
}

/**
 * Adjusts a color's lightness to meet minimum contrast requirements
 *
 * @param color - Color to adjust
 * @param background - Background color to contrast against
 * @param targetRatio - Target contrast ratio (4.5 for AA, 7.0 for AAA)
 * @param preferDarker - Prefer making the color darker vs lighter
 * @returns Adjusted color that meets contrast requirements
 */
export function adjustForContrast(
  color: OKLCH,
  background: OKLCH,
  targetRatio: number = 4.5,
  preferDarker: boolean = false
): OKLCH {
  let adjusted = { ...color };
  let currentRatio = calculateContrast(adjusted, background);

  // If already meets target, return as-is
  if (currentRatio >= targetRatio) {
    return adjusted;
  }

  // Binary search for optimal lightness
  let minL = 0;
  let maxL = 1;
  let iterations = 0;
  const maxIterations = 20;

  while (iterations < maxIterations && Math.abs(currentRatio - targetRatio) > 0.1) {
    const midL = (minL + maxL) / 2;
    adjusted = { ...color, l: midL };
    currentRatio = calculateContrast(adjusted, background);

    if (currentRatio < targetRatio) {
      // Need more contrast - adjust bounds based on background lightness
      if (background.l > 0.5) {
        // Light background - make darker
        maxL = midL;
      } else {
        // Dark background - make lighter
        minL = midL;
      }
    } else {
      // Too much contrast - move towards original
      if (background.l > 0.5) {
        minL = midL;
      } else {
        maxL = midL;
      }
    }

    iterations++;
  }

  return adjusted;
}

/**
 * Generates accessible color alternatives for a given role
 * Returns variants adjusted for AA and AAA compliance
 */
export function generateAccessibleAlternatives(
  color: OKLCH,
  background: OKLCH
): {
  original: OKLCH;
  aa: OKLCH;
  aaa: OKLCH;
  originalContrast: ContrastResult;
  aaContrast: ContrastResult;
  aaaContrast: ContrastResult;
} {
  const original = color;
  const aa = adjustForContrast(color, background, 4.5);
  const aaa = adjustForContrast(color, background, 7.0);

  return {
    original,
    aa,
    aaa,
    originalContrast: evaluateContrast(calculateContrast(original, background)),
    aaContrast: evaluateContrast(calculateContrast(aa, background)),
    aaaContrast: evaluateContrast(calculateContrast(aaa, background)),
  };
}

/**
 * Analyzes all text/background pairs in a palette for accessibility
 */
export interface PairAnalysis {
  foregroundRole: string;
  backgroundRole: string;
  foreground: OKLCH;
  background: OKLCH;
  contrast: ContrastResult;
  recommendations?: {
    aa: OKLCH;
    aaa: OKLCH;
  };
}

export function analyzeTextBackgroundPairs(palette: {
  background: OKLCH;
  surface: OKLCH;
  primary: OKLCH;
  accent: OKLCH;
  text: OKLCH;
  muted: OKLCH;
}): PairAnalysis[] {
  const pairs: PairAnalysis[] = [];

  // Common text/background combinations
  const combinations = [
    { fg: "text", bg: "background" },
    { fg: "text", bg: "surface" },
    { fg: "muted", bg: "background" },
    { fg: "muted", bg: "surface" },
    { fg: "primary", bg: "background" },
    { fg: "accent", bg: "background" },
    { fg: "background", bg: "primary" }, // Inverted
    { fg: "background", bg: "accent" }, // Inverted
  ];

  for (const { fg, bg } of combinations) {
    const foreground = palette[fg as keyof typeof palette];
    const background = palette[bg as keyof typeof palette];
    const ratio = calculateContrast(foreground, background);
    const contrast = evaluateContrast(ratio);

    const analysis: PairAnalysis = {
      foregroundRole: fg,
      backgroundRole: bg,
      foreground,
      background,
      contrast,
    };

    // Add recommendations if doesn't meet AA
    if (!contrast.passes.AA) {
      analysis.recommendations = {
        aa: adjustForContrast(foreground, background, 4.5),
        aaa: adjustForContrast(foreground, background, 7.0),
      };
    }

    pairs.push(analysis);
  }

  return pairs;
}
