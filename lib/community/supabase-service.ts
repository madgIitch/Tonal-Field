import { createClient } from "@/lib/supabase/client";
import type {
  CommunityPalette,
  FilterOptions,
  MoodTag,
  StyleTag,
} from "./types";
import type { OKLCH } from "@/lib/color/oklch";

/**
 * Community palette service using Supabase
 * Replaces localStorage with real backend
 */

// Get all public palettes
export async function getCommunityPalettes(): Promise<CommunityPalette[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("palettes")
    .select(`
      *,
      profiles:user_id (
        id,
        name,
        email
      )
    `)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching palettes:", error);
    return [];
  }

  return data.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description || undefined,
    palette: p.palette as {
      background: OKLCH;
      surface: OKLCH;
      primary: OKLCH;
      accent: OKLCH;
      text: OKLCH;
      muted: OKLCH;
    },
    parameters: p.parameters as {
      energy: number;
      tension: number;
      hueBase?: number;
      hueAuto?: boolean;
      spectrumMode?: boolean;
    },
    tags: p.tags as { mood: MoodTag[]; style: StyleTag[] },
    author: {
      id: p.profiles.id,
      name: p.profiles.name || p.profiles.email.split("@")[0],
    },
    stats: {
      likes: p.likes_count,
      saves: p.saves_count,
      views: p.views_count,
    },
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }));
}

// Publish a new palette
export async function publishPalette(
  palette: Omit<
    CommunityPalette,
    "id" | "createdAt" | "updatedAt" | "stats" | "author"
  >
): Promise<CommunityPalette | null> {
  const supabase = createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to publish palettes");
  }

  const { data, error } = await supabase
    .from("palettes")
    .insert({
      user_id: user.id,
      name: palette.name,
      description: palette.description || null,
      palette: palette.palette,
      parameters: palette.parameters,
      tags: palette.tags,
      is_public: true,
    })
    .select(`
      *,
      profiles:user_id (
        id,
        name,
        email
      )
    `)
    .single();

  if (error) {
    console.error("Error publishing palette:", error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description || undefined,
    palette: data.palette as any,
    parameters: data.parameters as any,
    tags: data.tags as any,
    author: {
      id: data.profiles.id,
      name: data.profiles.name || data.profiles.email.split("@")[0],
    },
    stats: {
      likes: data.likes_count,
      saves: data.saves_count,
      views: data.views_count,
    },
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// Like/unlike a palette
export async function likePalette(paletteId: string): Promise<void> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to like palettes");
  }

  // Check if interaction exists
  const { data: existing } = await supabase
    .from("interactions")
    .select("*")
    .eq("user_id", user.id)
    .eq("palette_id", paletteId)
    .single();

  if (existing) {
    // Toggle like
    await supabase
      .from("interactions")
      .update({ liked: !existing.liked })
      .eq("user_id", user.id)
      .eq("palette_id", paletteId);
  } else {
    // Create new interaction
    await supabase.from("interactions").insert({
      user_id: user.id,
      palette_id: paletteId,
      liked: true,
      saved: false,
    });
  }
}

// Save/unsave a palette
export async function savePalette(paletteId: string): Promise<void> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to save palettes");
  }

  const { data: existing } = await supabase
    .from("interactions")
    .select("*")
    .eq("user_id", user.id)
    .eq("palette_id", paletteId)
    .single();

  if (existing) {
    await supabase
      .from("interactions")
      .update({ saved: !existing.saved })
      .eq("user_id", user.id)
      .eq("palette_id", paletteId);
  } else {
    await supabase.from("interactions").insert({
      user_id: user.id,
      palette_id: paletteId,
      liked: false,
      saved: true,
    });
  }
}

// Track view
export async function trackView(paletteId: string): Promise<void> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return; // Don't track views for anonymous users

  const { data: existing } = await supabase
    .from("interactions")
    .select("*")
    .eq("user_id", user.id)
    .eq("palette_id", paletteId)
    .single();

  if (existing) {
    // Update viewed_at
    await supabase
      .from("interactions")
      .update({ viewed_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("palette_id", paletteId);
  } else {
    // Create new interaction with view
    await supabase.from("interactions").insert({
      user_id: user.id,
      palette_id: paletteId,
      liked: false,
      saved: false,
      viewed_at: new Date().toISOString(),
    });
  }
}

// Get user's interaction with a palette
export async function getUserInteraction(paletteId: string): Promise<{
  liked: boolean;
  saved: boolean;
} | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("interactions")
    .select("liked, saved")
    .eq("user_id", user.id)
    .eq("palette_id", paletteId)
    .single();

  return data || null;
}

// Filter and sort palettes
export async function filterPalettes(
  options: FilterOptions = {}
): Promise<CommunityPalette[]> {
  const supabase = createClient();

  // Build base query
  let query = supabase
    .from("palettes")
    .select(`
      *,
      profiles:user_id (
        id,
        name,
        email
      )
    `)
    .eq("is_public", true);

  // Apply search filter at database level
  if (options.search) {
    query = query.or(
      `name.ilike.%${options.search}%,description.ilike.%${options.search}%`
    );
  }

  // Apply sorting
  switch (options.sortBy) {
    case "popular":
      query = query.order("likes_count", { ascending: false });
      break;
    case "trending":
      query = query.order("likes_count", { ascending: false });
      break;
    case "recent":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error filtering palettes:", error);
    return [];
  }

  // Map data to CommunityPalette format
  let palettes = data.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description || undefined,
    palette: p.palette as any,
    parameters: p.parameters as any,
    tags: p.tags as any,
    author: {
      id: p.profiles.id,
      name: p.profiles.name || p.profiles.email.split("@")[0],
    },
    stats: {
      likes: p.likes_count,
      saves: p.saves_count,
      views: p.views_count,
    },
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }));

  // Apply client-side tag filtering (more reliable than JSONB queries)
  if (options.mood && options.mood.length > 0) {
    palettes = palettes.filter((p) => {
      const paletteMoods = p.tags.mood || [];
      return options.mood!.some((mood) => paletteMoods.includes(mood));
    });
  }

  if (options.style && options.style.length > 0) {
    palettes = palettes.filter((p) => {
      const paletteStyles = p.tags.style || [];
      return options.style!.some((style) => paletteStyles.includes(style));
    });
  }

  return palettes;
}

// Get user's saved palettes
export async function getSavedPalettes(): Promise<CommunityPalette[]> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("interactions")
    .select(`
      palette_id,
      palettes!inner (
        *,
        profiles:user_id (
          id,
          name,
          email
        )
      )
    `)
    .eq("user_id", user.id)
    .eq("saved", true);

  if (!data) return [];

  return data.map((i) => {
    const p = i.palettes as any;
    return {
      id: p.id,
      name: p.name,
      description: p.description || undefined,
      palette: p.palette,
      parameters: p.parameters,
      tags: p.tags,
      author: {
        id: p.profiles.id,
        name: p.profiles.name || p.profiles.email.split("@")[0],
      },
      stats: {
        likes: p.likes_count,
        saves: p.saves_count,
        views: p.views_count,
      },
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    };
  });
}
