export type OKLCH = {
  l: number;
  c: number;
  h: number;
};

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function toCss(oklch: OKLCH) {
  const l = clamp(oklch.l, 0, 1) * 100;
  const c = clamp(oklch.c, 0, 0.4);
  const h = ((oklch.h % 360) + 360) % 360;
  return `oklch(${l}% ${c} ${h})`;
}
