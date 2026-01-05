import type {
  CommunityPalette,
  UserInteraction,
  FilterOptions,
  MoodTag,
  StyleTag,
} from "./types";

/**
 * Community palette service
 * Currently uses localStorage for MVP, can be migrated to API
 */

const STORAGE_KEY = "tonal-field:community";
const INTERACTIONS_KEY = "tonal-field:interactions";
const USER_ID_KEY = "tonal-field:user-id";

// Generate or retrieve user ID
function getUserId(): string {
  if (typeof window === "undefined") return "anonymous";

  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

// Get all community palettes
export function getCommunityPalettes(): CommunityPalette[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Save community palettes
function saveCommunityPalettes(palettes: CommunityPalette[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes));
  } catch (error) {
    console.error("Failed to save community palettes:", error);
  }
}

// Get user interactions
function getUserInteractions(): UserInteraction[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(INTERACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Save user interactions
function saveUserInteractions(interactions: UserInteraction[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(INTERACTIONS_KEY, JSON.stringify(interactions));
  } catch (error) {
    console.error("Failed to save interactions:", error);
  }
}

// Publish a new palette
export function publishPalette(
  palette: Omit<CommunityPalette, "id" | "createdAt" | "updatedAt" | "stats" | "author">
): CommunityPalette {
  const userId = getUserId();
  const now = new Date().toISOString();

  const newPalette: CommunityPalette = {
    ...palette,
    id: `palette_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    author: {
      id: userId,
      name: palette.name ? `Creator of "${palette.name}"` : "Anonymous",
    },
    stats: {
      likes: 0,
      saves: 0,
      views: 0,
    },
    createdAt: now,
    updatedAt: now,
  };

  const palettes = getCommunityPalettes();
  palettes.unshift(newPalette);
  saveCommunityPalettes(palettes);

  return newPalette;
}

// Update palette stats
function updatePaletteStats(
  paletteId: string,
  updates: Partial<CommunityPalette["stats"]>
): void {
  const palettes = getCommunityPalettes();
  const index = palettes.findIndex((p) => p.id === paletteId);

  if (index !== -1) {
    palettes[index].stats = {
      ...palettes[index].stats,
      ...updates,
    };
    palettes[index].updatedAt = new Date().toISOString();
    saveCommunityPalettes(palettes);
  }
}

// Like a palette
export function likePalette(paletteId: string): void {
  const userId = getUserId();
  const interactions = getUserInteractions();
  const existingIndex = interactions.findIndex(
    (i) => i.userId === userId && i.paletteId === paletteId
  );

  const wasLiked = existingIndex !== -1 && interactions[existingIndex].liked;

  if (existingIndex !== -1) {
    interactions[existingIndex].liked = !wasLiked;
  } else {
    interactions.push({
      userId,
      paletteId,
      liked: true,
      saved: false,
    });
  }

  saveUserInteractions(interactions);

  // Update stats
  const palettes = getCommunityPalettes();
  const palette = palettes.find((p) => p.id === paletteId);
  if (palette) {
    updatePaletteStats(paletteId, {
      likes: palette.stats.likes + (wasLiked ? -1 : 1),
    });
  }
}

// Save a palette
export function savePalette(paletteId: string): void {
  const userId = getUserId();
  const interactions = getUserInteractions();
  const existingIndex = interactions.findIndex(
    (i) => i.userId === userId && i.paletteId === paletteId
  );

  const wasSaved = existingIndex !== -1 && interactions[existingIndex].saved;

  if (existingIndex !== -1) {
    interactions[existingIndex].saved = !wasSaved;
  } else {
    interactions.push({
      userId,
      paletteId,
      liked: false,
      saved: true,
    });
  }

  saveUserInteractions(interactions);

  // Update stats
  const palettes = getCommunityPalettes();
  const palette = palettes.find((p) => p.id === paletteId);
  if (palette) {
    updatePaletteStats(paletteId, {
      saves: palette.stats.saves + (wasSaved ? -1 : 1),
    });
  }
}

// Track view
export function trackView(paletteId: string): void {
  const userId = getUserId();
  const interactions = getUserInteractions();
  const existingIndex = interactions.findIndex(
    (i) => i.userId === userId && i.paletteId === paletteId
  );

  if (existingIndex !== -1) {
    interactions[existingIndex].viewedAt = new Date().toISOString();
  } else {
    interactions.push({
      userId,
      paletteId,
      liked: false,
      saved: false,
      viewedAt: new Date().toISOString(),
    });
  }

  saveUserInteractions(interactions);

  // Update stats (only count first view)
  if (existingIndex === -1) {
    const palettes = getCommunityPalettes();
    const palette = palettes.find((p) => p.id === paletteId);
    if (palette) {
      updatePaletteStats(paletteId, {
        views: palette.stats.views + 1,
      });
    }
  }
}

// Get user's interaction with a palette
export function getUserInteraction(paletteId: string): UserInteraction | null {
  const userId = getUserId();
  const interactions = getUserInteractions();
  return (
    interactions.find((i) => i.userId === userId && i.paletteId === paletteId) || null
  );
}

// Filter and sort palettes
export function filterPalettes(options: FilterOptions = {}): CommunityPalette[] {
  let palettes = getCommunityPalettes();

  // Filter by mood
  if (options.mood && options.mood.length > 0) {
    palettes = palettes.filter((p) =>
      options.mood!.some((mood) => p.tags.mood.includes(mood))
    );
  }

  // Filter by style
  if (options.style && options.style.length > 0) {
    palettes = palettes.filter((p) =>
      options.style!.some((style) => p.tags.style.includes(style))
    );
  }

  // Search by name or description
  if (options.search) {
    const searchLower = options.search.toLowerCase();
    palettes = palettes.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
    );
  }

  // Sort
  switch (options.sortBy) {
    case "popular":
      palettes.sort((a, b) => b.stats.likes - a.stats.likes);
      break;
    case "trending":
      // Simple trending: combination of recent + likes
      palettes.sort((a, b) => {
        const scoreA = a.stats.likes * 2 + a.stats.views;
        const scoreB = b.stats.likes * 2 + b.stats.views;
        return scoreB - scoreA;
      });
      break;
    case "recent":
    default:
      palettes.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
  }

  return palettes;
}

// Get user's saved palettes
export function getSavedPalettes(): CommunityPalette[] {
  const userId = getUserId();
  const interactions = getUserInteractions();
  const savedIds = interactions
    .filter((i) => i.userId === userId && i.saved)
    .map((i) => i.paletteId);

  const allPalettes = getCommunityPalettes();
  return allPalettes.filter((p) => savedIds.includes(p.id));
}

// Seed initial demo palettes
export function seedDemoPalettes(): void {
  const existing = getCommunityPalettes();
  if (existing.length > 0) return; // Already seeded

  const demoPalettes: Omit<CommunityPalette, "id" | "createdAt" | "updatedAt" | "stats" | "author">[] = [
    {
      name: "Ocean Breeze",
      description: "Cool and refreshing palette inspired by coastal waters",
      palette: {
        background: { l: 0.96, c: 0.01, h: 220 },
        surface: { l: 0.92, c: 0.02, h: 220 },
        primary: { l: 0.55, c: 0.15, h: 220 },
        accent: { l: 0.65, c: 0.12, h: 200 },
        text: { l: 0.25, c: 0.04, h: 220 },
        muted: { l: 0.55, c: 0.02, h: 220 },
      },
      parameters: { energy: 25, tension: 20, hueBase: 220 },
      tags: { mood: ["calm", "cool", "light"], style: ["modern", "natural"] },
    },
    {
      name: "Sunset Warmth",
      description: "Warm and inviting palette with golden hour vibes",
      palette: {
        background: { l: 0.94, c: 0.04, h: 40 },
        surface: { l: 0.88, c: 0.06, h: 40 },
        primary: { l: 0.58, c: 0.18, h: 35 },
        accent: { l: 0.62, c: 0.22, h: 20 },
        text: { l: 0.22, c: 0.06, h: 40 },
        muted: { l: 0.48, c: 0.04, h: 40 },
      },
      parameters: { energy: 55, tension: 35, hueBase: 35 },
      tags: { mood: ["warm", "energetic", "vibrant"], style: ["artistic", "natural"] },
    },
    {
      name: "Corporate Blue",
      description: "Professional and trustworthy for business applications",
      palette: {
        background: { l: 0.98, c: 0.005, h: 240 },
        surface: { l: 0.95, c: 0.01, h: 240 },
        primary: { l: 0.45, c: 0.12, h: 240 },
        accent: { l: 0.55, c: 0.14, h: 260 },
        text: { l: 0.18, c: 0.02, h: 240 },
        muted: { l: 0.52, c: 0.01, h: 240 },
      },
      parameters: { energy: 35, tension: 45, hueBase: 240 },
      tags: { mood: ["professional", "minimal", "neutral"], style: ["corporate", "modern"] },
    },
    {
      name: "Forest Deep",
      description: "Rich earth tones with natural depth",
      palette: {
        background: { l: 0.14, c: 0.05, h: 140 },
        surface: { l: 0.18, c: 0.06, h: 140 },
        primary: { l: 0.48, c: 0.14, h: 135 },
        accent: { l: 0.62, c: 0.16, h: 120 },
        text: { l: 0.88, c: 0.04, h: 140 },
        muted: { l: 0.65, c: 0.06, h: 140 },
      },
      parameters: { energy: 40, tension: 55, hueBase: 140 },
      tags: { mood: ["dark", "calm", "neutral"], style: ["modern", "luxury"] },
    },
    {
      name: "Neon Nights",
      description: "Bold and vibrant with futuristic energy",
      palette: {
        background: { l: 0.12, c: 0.04, h: 280 },
        surface: { l: 0.16, c: 0.06, h: 280 },
        primary: { l: 0.65, c: 0.28, h: 310 },
        accent: { l: 0.72, c: 0.32, h: 330 },
        text: { l: 0.92, c: 0.02, h: 280 },
        muted: { l: 0.58, c: 0.08, h: 280 },
      },
      parameters: { energy: 85, tension: 75, hueBase: 310 },
      tags: { mood: ["bold", "vibrant", "dark"], style: ["futuristic", "modern"] },
    },
  ];

  demoPalettes.forEach((demo) => publishPalette(demo));
}
