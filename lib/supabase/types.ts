import type { OKLCH } from "@/lib/color/oklch";
import type { MoodTag, StyleTag } from "@/lib/community/types";

/**
 * Database types for Supabase
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          plan: "free" | "pro";
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          plan?: "free" | "pro";
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          plan?: "free" | "pro";
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      palettes: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          palette: {
            background: OKLCH;
            surface: OKLCH;
            primary: OKLCH;
            accent: OKLCH;
            text: OKLCH;
            muted: OKLCH;
          };
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
          is_public: boolean;
          likes_count: number;
          saves_count: number;
          views_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          palette: {
            background: OKLCH;
            surface: OKLCH;
            primary: OKLCH;
            accent: OKLCH;
            text: OKLCH;
            muted: OKLCH;
          };
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
          is_public?: boolean;
          likes_count?: number;
          saves_count?: number;
          views_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          palette?: {
            background: OKLCH;
            surface: OKLCH;
            primary: OKLCH;
            accent: OKLCH;
            text: OKLCH;
            muted: OKLCH;
          };
          parameters?: {
            energy: number;
            tension: number;
            hueBase?: number;
            hueAuto?: boolean;
            spectrumMode?: boolean;
          };
          tags?: {
            mood: MoodTag[];
            style: StyleTag[];
          };
          is_public?: boolean;
          likes_count?: number;
          saves_count?: number;
          views_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      interactions: {
        Row: {
          id: string;
          user_id: string;
          palette_id: string;
          liked: boolean;
          saved: boolean;
          viewed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          palette_id: string;
          liked?: boolean;
          saved?: boolean;
          viewed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          palette_id?: string;
          liked?: boolean;
          saved?: boolean;
          viewed_at?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
