import type { OKLCH } from "../color/oklch";
import type { Palette } from "../color/palette";

/**
 * Community palette types for public sharing and discovery
 */

export type MoodTag =
  | "calm"
  | "energetic"
  | "professional"
  | "playful"
  | "elegant"
  | "bold"
  | "minimal"
  | "vibrant"
  | "warm"
  | "cool"
  | "neutral"
  | "dark"
  | "light";

export type StyleTag =
  | "modern"
  | "classic"
  | "retro"
  | "futuristic"
  | "natural"
  | "industrial"
  | "artistic"
  | "corporate"
  | "casual"
  | "luxury";

export type CommunityPalette = {
  id: string;
  name: string;
  description?: string;
  author: {
    id: string;
    name: string;
  };
  palette: Palette;
  parameters: {
    energy: number;
    tension: number;
    hueBase?: number;
    hueAuto?: boolean;
    spectrumMode?: boolean;
  };
  tags: {
    mood: MoodTag[];
    style: StyleTag[];
  };
  stats: {
    likes: number;
    saves: number;
    views: number;
  };
  createdAt: string;
  updatedAt: string;
};

export type UserInteraction = {
  userId: string;
  paletteId: string;
  liked: boolean;
  saved: boolean;
  viewedAt?: string;
};

export type FilterOptions = {
  mood?: MoodTag[];
  style?: StyleTag[];
  search?: string;
  sortBy?: "recent" | "popular" | "trending";
};

export const MOOD_TAGS: { id: MoodTag; label: string; description: string }[] = [
  { id: "calm", label: "Calm", description: "Peaceful and relaxing" },
  { id: "energetic", label: "Energetic", description: "Dynamic and lively" },
  { id: "professional", label: "Professional", description: "Business-ready" },
  { id: "playful", label: "Playful", description: "Fun and whimsical" },
  { id: "elegant", label: "Elegant", description: "Refined and sophisticated" },
  { id: "bold", label: "Bold", description: "Strong and impactful" },
  { id: "minimal", label: "Minimal", description: "Clean and simple" },
  { id: "vibrant", label: "Vibrant", description: "Bright and colorful" },
  { id: "warm", label: "Warm", description: "Cozy and inviting" },
  { id: "cool", label: "Cool", description: "Fresh and crisp" },
  { id: "neutral", label: "Neutral", description: "Balanced and versatile" },
  { id: "dark", label: "Dark", description: "Deep and moody" },
  { id: "light", label: "Light", description: "Airy and bright" },
];

export const STYLE_TAGS: { id: StyleTag; label: string; description: string }[] = [
  { id: "modern", label: "Modern", description: "Contemporary design" },
  { id: "classic", label: "Classic", description: "Timeless appeal" },
  { id: "retro", label: "Retro", description: "Vintage inspiration" },
  { id: "futuristic", label: "Futuristic", description: "Forward-thinking" },
  { id: "natural", label: "Natural", description: "Earth-inspired" },
  { id: "industrial", label: "Industrial", description: "Urban and raw" },
  { id: "artistic", label: "Artistic", description: "Creative expression" },
  { id: "corporate", label: "Corporate", description: "Enterprise-ready" },
  { id: "casual", label: "Casual", description: "Relaxed and approachable" },
  { id: "luxury", label: "Luxury", description: "Premium and exclusive" },
];
