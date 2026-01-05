export type OKLCH = {
  l: number;
  c: number;
  h: number;
};

export type RGB = {
  r: number;
  g: number;
  b: number;
};

export type HSL = {
  h: number;
  s: number;
  l: number;
};

export type LCH = {
  l: number;
  c: number;
  h: number;
};

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

const srgbToLinear = (value: number) => {
  const v = value / 255;
  if (v <= 0.04045) {
    return v / 12.92;
  }
  return Math.pow((v + 0.055) / 1.055, 2.4);
};

export const fromRgb = (rgb: { r: number; g: number; b: number }): OKLCH => {
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);

  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const C = Math.sqrt(a * a + b_ * b_);
  const h = (Math.atan2(b_, a) * 180) / Math.PI;

  return {
    l: clamp(L, 0, 1),
    c: clamp(C, 0, 0.4),
    h: ((h % 360) + 360) % 360,
  };
};

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

const toSrgb = (color: OKLCH) => {
  const rgb = oklchToLinearSrgb(color);
  return {
    r: clamp(linearToSrgb(rgb.r), 0, 1),
    g: clamp(linearToSrgb(rgb.g), 0, 1),
    b: clamp(linearToSrgb(rgb.b), 0, 1),
  };
};

export const toHex = (color: OKLCH) => {
  const rgb = toSrgb(color);
  const toChannel = (channel: number) =>
    Math.round(channel * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toChannel(rgb.r)}${toChannel(rgb.g)}${toChannel(rgb.b)}`;
};

export const toRgb = (color: OKLCH): RGB => {
  const rgb = toSrgb(color);
  return {
    r: Math.round(rgb.r * 255),
    g: Math.round(rgb.g * 255),
    b: Math.round(rgb.b * 255),
  };
};

export const toHsl = (color: OKLCH): HSL => {
  const rgb = toSrgb(color);
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  const delta = max - min;
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (delta > 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rgb.r:
        h = ((rgb.g - rgb.b) / delta) % 6;
        break;
      case rgb.g:
        h = (rgb.b - rgb.r) / delta + 2;
        break;
      default:
        h = (rgb.r - rgb.g) / delta + 4;
        break;
    }
    h *= 60;
    if (h < 0) {
      h += 360;
    }
  }

  return { h, s, l };
};

export const toLch = (color: OKLCH): LCH => {
  const rgb = oklchToLinearSrgb(color);
  const x = rgb.r * 0.4124564 + rgb.g * 0.3575761 + rgb.b * 0.1804375;
  const y = rgb.r * 0.2126729 + rgb.g * 0.7151522 + rgb.b * 0.072175;
  const z = rgb.r * 0.0193339 + rgb.g * 0.119192 + rgb.b * 0.9503041;
  const refX = 0.95047;
  const refY = 1.0;
  const refZ = 1.08883;
  const f = (value: number) =>
    value > 0.008856 ? Math.cbrt(value) : 7.787 * value + 16 / 116;
  const fx = f(x / refX);
  const fy = f(y / refY);
  const fz = f(z / refZ);
  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);
  const C = Math.sqrt(a * a + b * b);
  const h = (Math.atan2(b, a) * 180) / Math.PI;

  return {
    l: clamp(L, 0, 100),
    c: Math.max(0, C),
    h: ((h % 360) + 360) % 360,
  };
};

export function toCss(oklch: OKLCH) {
  const l = clamp(oklch.l, 0, 1) * 100;
  const c = clamp(oklch.c, 0, 0.4);
  const h = ((oklch.h % 360) + 360) % 360;
  return `oklch(${l}% ${c} ${h})`;
}
