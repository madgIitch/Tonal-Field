import type { OKLCH } from "./oklch";
import { toCss } from "./oklch";

export const baseTokens: Record<string, OKLCH> = {
  bg: { l: 0.98, c: 0.02, h: 90 },
  surface: { l: 0.96, c: 0.03, h: 90 },
  text: { l: 0.15, c: 0.02, h: 90 },
  accent: { l: 0.7, c: 0.15, h: 200 },
};

export function tokensToCssVars() {
  return Object.entries(baseTokens).map(([key, val]) => ({
    key,
    value: toCss(val),
  }));
}
