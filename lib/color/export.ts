import type { Palette, PaletteRole, ExtendedPalette } from "./palette";
import { toCss, toHex, toHsl, toLch, toRgb, type OKLCH } from "./oklch";
import type { TonalPalette, ColorScheme } from "./tonal";
import { STANDARD_TONES } from "./tonal";

export type TokenFormat = "hex" | "oklch" | "rgb" | "hsl" | "lch";

const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const formatColor = (color: Palette[PaletteRole], format: TokenFormat) => {
  switch (format) {
    case "oklch":
      return toCss(color);
    case "rgb": {
      const rgb = toRgb(color);
      return `rgb(${rgb.r} ${rgb.g} ${rgb.b})`;
    }
    case "hsl": {
      const hsl = toHsl(color);
      return `hsl(${Math.round(hsl.h)} ${Math.round(hsl.s * 100)}% ${Math.round(
        hsl.l * 100
      )}%)`;
    }
    case "lch": {
      const lch = toLch(color);
      return `lch(${lch.l.toFixed(1)}% ${lch.c.toFixed(3)} ${Math.round(lch.h)})`;
    }
    case "hex":
    default:
      return toHex(color);
  }
};

export const buildColorTokens = (
  palette: Palette,
  roles: PaletteRole[],
  format: TokenFormat
) =>
  roles.map((role) => ({
    role,
    label: titleCase(role),
    value: formatColor(palette[role], format),
  }));

export const buildHexTokens = (palette: Palette, roles: PaletteRole[]) =>
  buildColorTokens(palette, roles, "hex");

export const buildCssVariables = (
  palette: Palette,
  roles: PaletteRole[],
  format: TokenFormat = "hex"
) => {
  const lines = roles
    .map((role) => `  --tf-${role}: ${formatColor(palette[role], format)};`)
    .join("\n");
  return `:root {\n${lines}\n}\n`;
};

export const buildCssVariablesExtended = (palette: Palette, roles: PaletteRole[]) => {
  const formats: TokenFormat[] = ["oklch", "hex", "rgb", "hsl", "lch"];
  const lines = roles.flatMap((role) =>
    formats.map(
      (format) =>
        `  --tf-${role}${format === "oklch" ? "" : `-${format}`}: ${formatColor(
          palette[role],
          format
        )};`
    )
  );
  return `:root {\n${lines.join("\n")}\n}\n`;
};

export const buildJsonTokens = (palette: Palette, roles: PaletteRole[]) => {
  const formats: TokenFormat[] = ["hex", "oklch", "rgb", "hsl", "lch"];
  const colors = roles.reduce<Record<string, Record<string, string>>>(
    (acc, role) => {
      acc[role] = formats.reduce<Record<string, string>>((formatAcc, format) => {
        formatAcc[format] = formatColor(palette[role], format);
        return formatAcc;
      }, {});
      return acc;
    },
    {}
  );

  return JSON.stringify({ colors }, null, 2);
};

export const buildTailwindConfig = (palette: Palette, roles: PaletteRole[]) => {
  const lines = roles
    .map((role) => `        "tf-${role}": "${toHex(palette[role])}",`)
    .join("\n");

  return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${lines}\n      },\n    },\n  },\n};\n`;
};

/**
 * Enhanced Tailwind config with better structure and utilities
 */
export const buildTailwindConfigExtended = (palette: Palette, roles: PaletteRole[]) => {
  const colors: Record<string, string> = {};
  roles.forEach((role) => {
    colors[role] = toHex(palette[role]);
  });

  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        tf: ${JSON.stringify(colors, null, 8).replace(/\n/g, '\n        ')},
      },
    },
  },
  plugins: [],
};\n`;
};

export const buildMuiTheme = (palette: Palette) => {
  const background = toHex(palette.background);
  const surface = toHex(palette.surface);
  const primary = toHex(palette.primary);
  const accent = toHex(palette.accent);
  const text = toHex(palette.text);
  const muted = toHex(palette.muted);

  return `import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    background: {
      default: "${background}",
      paper: "${surface}",
    },
    primary: {
      main: "${primary}",
      contrastText: "${text}",
    },
    secondary: {
      main: "${accent}",
    },
    text: {
      primary: "${text}",
      secondary: "${muted}",
    },
  },
});
`;
};

export const buildPluginPayload = (palette: Palette, roles: PaletteRole[]) => {
  const colors = roles.reduce<Record<string, string>>((acc, role) => {
    acc[role] = toHex(palette[role]);
    return acc;
  }, {});

  return JSON.stringify(
    {
      name: "Tonal Field",
      version: "1.0",
      colors,
    },
    null,
    2
  );
};

/**
 * Exports tonal palette as CSS variables with tone numbers
 * Example: --tf-primary-40, --tf-primary-80, etc.
 */
export const buildTonalCssVariables = (
  tonalPalettes: ExtendedPalette["tonal"]
): string => {
  if (!tonalPalettes) return "";

  const lines: string[] = [];

  Object.entries(tonalPalettes).forEach(([paletteName, palette]) => {
    STANDARD_TONES.forEach((tone) => {
      const color = palette[tone];
      if (color) {
        lines.push(`  --tf-${paletteName}-${tone}: ${toCss(color)};`);
      }
    });
  });

  return `:root {\n${lines.join("\n")}\n}\n`;
};

/**
 * Exports Material Design 3 color scheme as CSS variables
 */
export const buildMaterial3CssVariables = (
  scheme: ColorScheme,
  isDark: boolean = false
): string => {
  const prefix = isDark ? "dark" : "light";
  const lines = Object.entries(scheme).map(
    ([role, color]) => `  --md-${prefix}-${role}: ${toCss(color)};`
  );

  return `:root {\n${lines.join("\n")}\n}\n`;
};

/**
 * Exports complete tonal palette as JSON with Material Design 3 structure
 */
export const buildMaterial3Json = (extended: ExtendedPalette): string => {
  if (!extended.tonal || !extended.scheme) {
    return JSON.stringify({ error: "No tonal data available" }, null, 2);
  }

  const tonalData: Record<string, Record<string, string>> = {};

  // Export all tonal palettes
  Object.entries(extended.tonal).forEach(([paletteName, palette]) => {
    const tones: Record<string, string> = {};
    STANDARD_TONES.forEach((tone) => {
      const color = palette[tone];
      if (color) {
        tones[`${tone}`] = toHex(color);
      }
    });
    tonalData[paletteName] = tones;
  });

  // Export light and dark schemes
  const lightScheme: Record<string, string> = {};
  const darkScheme: Record<string, string> = {};

  Object.entries(extended.scheme.light).forEach(([role, color]) => {
    lightScheme[role] = toHex(color);
  });

  Object.entries(extended.scheme.dark).forEach(([role, color]) => {
    darkScheme[role] = toHex(color);
  });

  return JSON.stringify(
    {
      name: "Tonal Field - Material Design 3",
      version: "1.0",
      palettes: tonalData,
      schemes: {
        light: lightScheme,
        dark: darkScheme,
      },
    },
    null,
    2
  );
};

/**
 * Exports tonal palette for Tailwind with all tone levels
 */
export const buildTonalTailwindConfig = (
  tonalPalettes: ExtendedPalette["tonal"]
): string => {
  if (!tonalPalettes) return "";

  const colorLines: string[] = [];

  Object.entries(tonalPalettes).forEach(([paletteName, palette]) => {
    const tones: Record<string, string> = {};
    STANDARD_TONES.forEach((tone) => {
      const color = palette[tone];
      if (color) {
        tones[`${tone}`] = toHex(color);
      }
    });

    const toneLines = Object.entries(tones)
      .map(([tone, hex]) => `          "${tone}": "${hex}",`)
      .join("\n");

    colorLines.push(`        "${paletteName}": {\n${toneLines}\n        },`);
  });

  return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${colorLines.join("\n")}\n      },\n    },\n  },\n};\n`;
};

/**
 * Figma Plugin Format
 * Creates a JSON file compatible with Figma's color styles
 */
export const buildFigmaPlugin = (extended: ExtendedPalette): string => {
  const colors: Array<{
    name: string;
    description: string;
    color: { r: number; g: number; b: number; a: number };
  }> = [];

  // Add base palette
  Object.entries(extended).forEach(([role, color]) => {
    if (typeof color === 'object' && 'l' in color) {
      const rgb = toRgb(color as OKLCH);
      colors.push({
        name: `Tonal Field/${role}`,
        description: `Generated from Energy/Tension model`,
        color: {
          r: rgb.r / 255,
          g: rgb.g / 255,
          b: rgb.b / 255,
          a: 1,
        },
      });
    }
  });

  // Add tonal palettes if available
  if (extended.tonal) {
    Object.entries(extended.tonal).forEach(([paletteName, palette]) => {
      STANDARD_TONES.forEach((tone) => {
        const color = palette[tone];
        if (color) {
          const rgb = toRgb(color);
          colors.push({
            name: `Tonal Field/Material 3/${paletteName}/${tone}`,
            description: `Tone ${tone} - Material Design 3`,
            color: {
              r: rgb.r / 255,
              g: rgb.g / 255,
              b: rgb.b / 255,
              a: 1,
            },
          });
        }
      });
    });
  }

  return JSON.stringify({ colors }, null, 2);
};

/**
 * Sketch Plugin Format
 * Creates a JSON file compatible with Sketch's shared styles
 */
export const buildSketchPlugin = (palette: Palette, roles: PaletteRole[]): string => {
  const swatches = roles.map((role) => {
    const rgb = toRgb(palette[role]);
    return {
      name: role,
      red: rgb.r / 255,
      green: rgb.g / 255,
      blue: rgb.b / 255,
      alpha: 1,
    };
  });

  return JSON.stringify(
    {
      compatibleVersion: "3.0",
      pluginVersion: "1.0",
      colors: swatches,
    },
    null,
    2
  );
};

/**
 * VS Code Theme Format
 * Creates a JSON theme file for VS Code
 */
export const buildVSCodeTheme = (extended: ExtendedPalette): string => {
  const scheme = extended.scheme?.dark || extended.scheme?.light;

  if (!scheme) {
    // Fallback to basic palette
    return JSON.stringify({
      name: "Tonal Field",
      type: "dark",
      colors: {
        "editor.background": toHex(extended.background),
        "editor.foreground": toHex(extended.text),
        "activityBar.background": toHex(extended.surface),
        "sideBar.background": toHex(extended.surface),
        "statusBar.background": toHex(extended.primary),
      },
    }, null, 2);
  }

  return JSON.stringify(
    {
      name: "Tonal Field - Material Design 3",
      type: "dark",
      colors: {
        // Editor
        "editor.background": toHex(scheme.background),
        "editor.foreground": toHex(scheme.onBackground),
        "editorLineNumber.foreground": toHex(scheme.outline),
        "editorCursor.foreground": toHex(scheme.primary),
        "editor.selectionBackground": toHex(scheme.primaryContainer),

        // Sidebar
        "sideBar.background": toHex(scheme.surface),
        "sideBar.foreground": toHex(scheme.onSurface),
        "sideBarSectionHeader.background": toHex(scheme.surfaceVariant),

        // Activity Bar
        "activityBar.background": toHex(scheme.surfaceVariant),
        "activityBar.foreground": toHex(scheme.onSurfaceVariant),
        "activityBar.activeBorder": toHex(scheme.primary),

        // Status Bar
        "statusBar.background": toHex(scheme.primary),
        "statusBar.foreground": toHex(scheme.onPrimary),

        // Tabs
        "tab.activeBackground": toHex(scheme.surface),
        "tab.inactiveBackground": toHex(scheme.surfaceVariant),

        // Terminal
        "terminal.background": toHex(scheme.background),
        "terminal.foreground": toHex(scheme.onBackground),

        // Buttons
        "button.background": toHex(scheme.primary),
        "button.foreground": toHex(scheme.onPrimary),

        // Notifications
        "notificationCenter.border": toHex(scheme.outline),
        "notifications.background": toHex(scheme.surface),

        // Errors
        "errorForeground": toHex(scheme.error),
      },
    },
    null,
    2
  );
};

/**
 * Apple Color List (.clr) format as JSON
 * Can be converted to binary .clr format
 */
export const buildAppleColorList = (palette: Palette, roles: PaletteRole[]): string => {
  const colors = roles.map((role) => {
    const rgb = toRgb(palette[role]);
    return {
      name: role,
      space: "sRGB",
      components: [rgb.r / 255, rgb.g / 255, rgb.b / 255, 1],
    };
  });

  return JSON.stringify(
    {
      name: "Tonal Field",
      colors,
    },
    null,
    2
  );
};
