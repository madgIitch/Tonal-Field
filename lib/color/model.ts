import type { OKLCH } from "./oklch";
import { clamp } from "./oklch";

export type Controls = {
  energy: number;
  tension: number;
};

export type Metrics = {
  chroma: number;
  hueDiff: number;
  lightnessContrast: number;
  vibration: number;
  energyFit: number;
  tensionFit: number;
  score: number;
};

export type PairResult = {
  a: OKLCH;
  b: OKLCH;
  metrics: Metrics;
};

const BASE_HUE = 220;

const lerp = (start: number, end: number, amount: number) =>
  start + (end - start) * amount;

const normalizeHue = (hue: number) => ((hue % 360) + 360) % 360;

const hueDistance = (a: number, b: number) => {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
};

export function generatePair({ energy, tension }: Controls): PairResult {
  const energyNormalized = clamp(energy, 0, 100) / 100;
  const tensionNormalized = clamp(tension, 0, 100) / 100;

  const hueDiff =
    lerp(12, 120, tensionNormalized) + lerp(0, 16, energyNormalized);
  const lightnessDelta =
    lerp(0.08, 0.38, tensionNormalized) + lerp(0, 0.05, energyNormalized);
  const baseLightness = lerp(0.92, 0.62, energyNormalized);
  const baseChroma = lerp(0.03, 0.18, energyNormalized);
  const accentBoost = lerp(0.01, 0.08, tensionNormalized);

  const hueA = normalizeHue(BASE_HUE - hueDiff / 2);
  const hueB = normalizeHue(BASE_HUE + hueDiff / 2);

  const lightnessA = clamp(baseLightness + lightnessDelta / 2, 0.05, 0.97);
  const lightnessB = clamp(baseLightness - lightnessDelta / 2, 0.05, 0.97);

  const chromaA = clamp(baseChroma + accentBoost * 0.7, 0, 0.4);
  const chromaB = clamp(baseChroma - accentBoost * 0.3, 0, 0.4);

  const a: OKLCH = { l: lightnessA, c: chromaA, h: hueA };
  const b: OKLCH = { l: lightnessB, c: chromaB, h: hueB };

  const chromaAvg = (chromaA + chromaB) / 2;
  const hueGap = hueDistance(hueA, hueB);
  const contrast = Math.abs(lightnessA - lightnessB);
  const vibration = clamp((chromaAvg / 0.4) * (hueGap / 180), 0, 1);
  const lightnessAvg = (lightnessA + lightnessB) / 2;

  const energySignal = clamp(
    0.6 * (chromaAvg / 0.4) + 0.4 * (1 - Math.abs(lightnessAvg - 0.7)),
    0,
    1
  );

  const tensionSignal = clamp(
    0.5 * (hueGap / 180) + 0.3 * contrast + 0.2 * vibration,
    0,
    1
  );

  const score = clamp(
    1 -
      (Math.abs(energySignal - energyNormalized) +
        Math.abs(tensionSignal - tensionNormalized)) /
        2,
    0,
    1
  );

  return {
    a,
    b,
    metrics: {
      chroma: chromaAvg,
      hueDiff: hueGap,
      lightnessContrast: contrast,
      vibration,
      energyFit: energySignal,
      tensionFit: tensionSignal,
      score,
    },
  };
}
