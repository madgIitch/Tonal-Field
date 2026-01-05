import type { Palette, PaletteRole } from "./palette";
import { toHex } from "./oklch";

const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export const buildHexTokens = (palette: Palette, roles: PaletteRole[]) =>
  roles.map((role) => ({
    role,
    label: titleCase(role),
    value: toHex(palette[role]),
  }));

export const buildCssVariables = (palette: Palette, roles: PaletteRole[]) => {
  const lines = roles
    .map((role) => `  --tf-${role}: ${toHex(palette[role])};`)
    .join("\n");
  return `:root {\n${lines}\n}\n`;
};

export const buildJsonTokens = (palette: Palette, roles: PaletteRole[]) => {
  const colors = roles.reduce<Record<string, string>>((acc, role) => {
    acc[role] = toHex(palette[role]);
    return acc;
  }, {});

  return JSON.stringify({ colors }, null, 2);
};

export const buildTailwindConfig = (palette: Palette, roles: PaletteRole[]) => {
  const lines = roles
    .map((role) => `        "tf-${role}": "${toHex(palette[role])}",`)
    .join("\n");

  return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${lines}\n      },\n    },\n  },\n};\n`;
};
