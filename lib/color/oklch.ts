export type OKLCH = {
  l: number;
  c: number;
  h: number;
};

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

const OKLCH_TO_LMS = {
  l: 0.3963377774,
  m: 0.2158037573,
  s: 0.1055613458,
  t: 0.0894841775,
  u: 1.291485548,
};

const oklchToOklab = (color: OKLCH) => {
  const hRad = (color.h * Math.PI) / 180;
  return {
    L: color.l,
    a: color.c * Math.cos(hRad),
    b: color.c * Math.sin(hRad),
  };
};

export const oklchToLinearSrgb = (color: OKLCH) => {
  const lab = oklchToOklab(color);
  const l_ = lab.L + OKLCH_TO_LMS.l * lab.a + OKLCH_TO_LMS.m * lab.b;
  const m_ = lab.L - OKLCH_TO_LMS.s * lab.a - 0.0638541728 * lab.b;
  const s_ = lab.L - OKLCH_TO_LMS.t * lab.a - OKLCH_TO_LMS.u * lab.b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
};

const linearToSrgb = (value: number) => {
  if (value <= 0.0031308) {
    return 12.92 * value;
  }
  return 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
};

export const toHex = (color: OKLCH) => {
  const rgb = oklchToLinearSrgb(color);
  const r = clamp(linearToSrgb(rgb.r), 0, 1);
  const g = clamp(linearToSrgb(rgb.g), 0, 1);
  const b = clamp(linearToSrgb(rgb.b), 0, 1);
  const toChannel = (channel: number) =>
    Math.round(channel * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toChannel(r)}${toChannel(g)}${toChannel(b)}`;
};

export function toCss(oklch: OKLCH) {
  const l = clamp(oklch.l, 0, 1) * 100;
  const c = clamp(oklch.c, 0, 0.4);
  const h = ((oklch.h % 360) + 360) % 360;
  return `oklch(${l}% ${c} ${h})`;
}
