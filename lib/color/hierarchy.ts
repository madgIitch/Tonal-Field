import type { Palette, PaletteRole } from "./palette";

/**
 * Palette hierarchy and proportion system
 * Based on the 60-30-10 design rule
 */

export type KitSize = 3 | 5 | 7;

export type RoleHierarchy = {
  role: PaletteRole;
  proportion: number; // percentage (0-100)
  usage: string;
  examples: string[];
};

/**
 * Predefined role sets for different kit sizes
 * Each set follows design hierarchy principles
 */
export const ROLE_SETS: Record<KitSize, PaletteRole[]> = {
  // Minimal: Core 3 colors (60-30-10)
  3: ["background", "primary", "text"],

  // Standard: 5 colors with accent and surface
  5: ["background", "surface", "primary", "accent", "text"],

  // Complete: All 6 roles
  7: ["background", "surface", "primary", "accent", "text", "muted"],
};

/**
 * Hierarchy definitions for each kit size
 * Following 60-30-10 proportion rule adapted for each size
 */
export const HIERARCHIES: Record<KitSize, RoleHierarchy[]> = {
  3: [
    {
      role: "background",
      proportion: 60,
      usage: "Dominant color - Main backgrounds, large surfaces",
      examples: [
        "Page backgrounds",
        "Card backgrounds",
        "Main container fills",
        "Modal overlays",
      ],
    },
    {
      role: "primary",
      proportion: 30,
      usage: "Secondary color - Interactive elements, emphasis",
      examples: [
        "Buttons",
        "Links",
        "Active states",
        "Important headings",
        "Icons",
      ],
    },
    {
      role: "text",
      proportion: 10,
      usage: "Accent color - Text, high contrast elements",
      examples: [
        "Body text",
        "Headings",
        "Labels",
        "Critical information",
      ],
    },
  ],

  5: [
    {
      role: "background",
      proportion: 50,
      usage: "Dominant color - Primary backgrounds",
      examples: [
        "Page backgrounds",
        "Main containers",
        "App background",
      ],
    },
    {
      role: "surface",
      proportion: 20,
      usage: "Secondary surface - Cards and elevated elements",
      examples: [
        "Cards",
        "Panels",
        "Dropdown menus",
        "Modals",
        "Sidebars",
      ],
    },
    {
      role: "primary",
      proportion: 15,
      usage: "Primary actions - Main interactive elements",
      examples: [
        "Primary buttons",
        "CTAs",
        "Active navigation",
        "Key icons",
      ],
    },
    {
      role: "accent",
      proportion: 10,
      usage: "Accent highlights - Secondary interactions",
      examples: [
        "Secondary buttons",
        "Badges",
        "Notifications",
        "Highlights",
      ],
    },
    {
      role: "text",
      proportion: 5,
      usage: "Text - High contrast for readability",
      examples: [
        "Body text",
        "Headings",
        "Labels",
        "Form inputs",
      ],
    },
  ],

  7: [
    {
      role: "background",
      proportion: 45,
      usage: "Dominant color - Main backgrounds",
      examples: [
        "Page backgrounds",
        "App container",
        "Primary surface",
      ],
    },
    {
      role: "surface",
      proportion: 20,
      usage: "Secondary surface - Elevated elements",
      examples: [
        "Cards",
        "Panels",
        "Modals",
        "Dropdowns",
      ],
    },
    {
      role: "primary",
      proportion: 15,
      usage: "Primary brand - Main actions",
      examples: [
        "Primary buttons",
        "CTAs",
        "Active states",
        "Brand elements",
      ],
    },
    {
      role: "accent",
      proportion: 10,
      usage: "Accent highlights - Secondary actions",
      examples: [
        "Secondary buttons",
        "Links",
        "Badges",
        "Highlights",
      ],
    },
    {
      role: "text",
      proportion: 5,
      usage: "Primary text - High contrast",
      examples: [
        "Headings",
        "Body text",
        "Important labels",
      ],
    },
    {
      role: "muted",
      proportion: 5,
      usage: "Muted text - Lower hierarchy",
      examples: [
        "Secondary text",
        "Captions",
        "Placeholders",
        "Disabled states",
      ],
    },
  ],
};

/**
 * Get roles for a specific kit size
 */
export function getRolesForSize(size: KitSize): PaletteRole[] {
  return ROLE_SETS[size];
}

/**
 * Get hierarchy information for a specific kit size
 */
export function getHierarchyForSize(size: KitSize): RoleHierarchy[] {
  return HIERARCHIES[size];
}

/**
 * Filter a palette to only include roles for a specific kit size
 */
export function filterPaletteBySize(palette: Palette, size: KitSize): Partial<Palette> {
  const roles = getRolesForSize(size);
  const filtered: Partial<Palette> = {};

  roles.forEach((role) => {
    filtered[role] = palette[role];
  });

  return filtered;
}

/**
 * Get proportion rules as CSS percentages
 * Useful for creating visual hierarchy guides
 */
export function getProportionStyles(size: KitSize): Record<PaletteRole, string> {
  const hierarchy = getHierarchyForSize(size);
  const styles: Partial<Record<PaletteRole, string>> = {};

  hierarchy.forEach((item) => {
    styles[item.role] = `${item.proportion}%`;
  });

  return styles as Record<PaletteRole, string>;
}

/**
 * Validate if a kit size is supported
 */
export function isValidKitSize(size: number): size is KitSize {
  return size === 3 || size === 5 || size === 7;
}

/**
 * Get recommended kit size based on use case
 */
export function getRecommendedSize(useCase: "minimal" | "standard" | "complete"): KitSize {
  switch (useCase) {
    case "minimal":
      return 3;
    case "standard":
      return 5;
    case "complete":
      return 7;
  }
}

/**
 * Calculate visual weight distribution
 * Returns a map of role to its visual impact percentage
 */
export function calculateVisualWeight(size: KitSize): Record<PaletteRole, number> {
  const hierarchy = getHierarchyForSize(size);
  const weights: Partial<Record<PaletteRole, number>> = {};

  hierarchy.forEach((item) => {
    weights[item.role] = item.proportion;
  });

  return weights as Record<PaletteRole, number>;
}
