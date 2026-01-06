"use client";

import { useEffect, useState } from "react";
import { Frame } from "@/components/Frame";
import { Section } from "@/components/Section";
import { toCss } from "@/lib/color/oklch";
import type { OKLCH } from "@/lib/color/oklch";
import type { CommunityPalette, FilterOptions, MoodTag, StyleTag } from "@/lib/community/types";
import { MOOD_TAGS, STYLE_TAGS } from "@/lib/community/types";
import {
  filterPalettes,
  likePalette,
  savePalette as saveCommunityPalette,
  getUserInteraction,
  trackView,
} from "@/lib/community/supabase-service";
import { useAuth } from "@/lib/auth/AuthProvider";
import { AuthModal } from "@/components/AuthModal";

const swatchText = (color: OKLCH) =>
  color.l > 0.6 ? "oklch(20% 0.02 90)" : "oklch(98% 0.02 90)";

export default function CommunityPage() {
  const { user, loading: authLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [palettes, setPalettes] = useState<CommunityPalette[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<MoodTag[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<StyleTag[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "trending">("recent");
  const [interactions, setInteractions] = useState<Map<string, { liked: boolean; saved: boolean }>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    if (!authLoading && !user) {
      setShowAuthModal(true);
    }
  }, [user, authLoading]);

  // Load palettes on mount
  useEffect(() => {
    loadPalettes();
  }, []);

  const loadPalettes = async () => {
    setLoading(true);
    const filters: FilterOptions = {
      mood: selectedMoods.length > 0 ? selectedMoods : undefined,
      style: selectedStyles.length > 0 ? selectedStyles : undefined,
      search: searchQuery || undefined,
      sortBy,
    };

    const filtered = await filterPalettes(filters);
    setPalettes(filtered);

    // Load user interactions
    const interactionMap = new Map<string, { liked: boolean; saved: boolean }>();
    for (const p of filtered) {
      const interaction = await getUserInteraction(p.id);
      if (interaction) {
        interactionMap.set(p.id, {
          liked: interaction.liked,
          saved: interaction.saved,
        });
      }
    }
    setInteractions(interactionMap);
    setLoading(false);
  };

  useEffect(() => {
    loadPalettes();
  }, [selectedMoods, selectedStyles, searchQuery, sortBy]);

  const handleToggleMood = (mood: MoodTag) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  const handleToggleStyle = (style: StyleTag) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handleLike = async (paletteId: string) => {
    await likePalette(paletteId);
    loadPalettes();
  };

  const handleSave = async (paletteId: string) => {
    await saveCommunityPalette(paletteId);
    loadPalettes();
  };

  const handleViewPalette = (palette: CommunityPalette) => {
    trackView(palette.id);

    // Navigate to studio with palette parameters
    const params = new URLSearchParams({
      e: String(palette.parameters.energy),
      t: String(palette.parameters.tension),
      h: String(palette.parameters.hueBase ?? 0),
      ha: palette.parameters.hueAuto ? "1" : "0",
      sm: palette.parameters.spectrumMode ? "1" : "0",
    });

    window.location.href = `/studio?${params.toString()}`;
  };

  const clearFilters = () => {
    setSelectedMoods([]);
    setSelectedStyles([]);
    setSearchQuery("");
  };

  const hasFilters = selectedMoods.length > 0 || selectedStyles.length > 0 || searchQuery;

  // Show auth modal if user is not logged in
  if (!authLoading && !user) {
    return (
      <Frame>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultMode="signup"
        />
        <div className="page-container">
          <Section
            title="Community Gallery"
            subtitle="Join Tonal Field to explore and share beautiful color palettes"
          >
            <div style={{
              textAlign: "center",
              padding: "80px 20px",
              maxWidth: "600px",
              margin: "0 auto"
            }}>
              <div style={{ fontSize: "64px", marginBottom: "24px" }}>🎨</div>
              <h2 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "16px" }}>
                Join the Community
              </h2>
              <p style={{ fontSize: "16px", lineHeight: 1.6, marginBottom: "32px", opacity: 0.8 }}>
                Sign up to explore palettes created by designers, save your favorites,
                share your own color systems, and connect with the Tonal Field community.
              </p>
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                style={{
                  padding: "14px 32px",
                  fontSize: "16px",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: "8px",
                  background: "rgb(59, 130, 246)",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Sign Up to Continue
              </button>
            </div>
          </Section>
        </div>
      </Frame>
    );
  }

  return (
    <Frame>
      <div className="page-container">
        <Section
          title="Community Gallery"
          subtitle="Discover and share beautiful color palettes"
        >
          <div className="community-container" style={{ maxWidth: "1400px", margin: "0 auto" }}>
            {/* Filters */}
            <div style={{ marginBottom: "32px" }}>
              {/* Search */}
              <div style={{ marginBottom: "20px" }}>
                <input
                  type="text"
                  placeholder="Search palettes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: "14px",
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Sort */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center" }}>
                  Sort by:
                </div>
                {(["recent", "popular", "trending"] as const).map((sort) => (
                  <button
                    key={sort}
                    type="button"
                    onClick={() => setSortBy(sort)}
                    className={`filter-tag${sortBy === sort ? " filter-tag-active" : ""}`}
                    style={{
                      padding: "6px 12px",
                      fontSize: "12px",
                      border: "1px solid rgba(0,0,0,0.15)",
                      borderRadius: "6px",
                      background: sortBy === sort ? "rgba(0,0,0,0.08)" : "transparent",
                      cursor: "pointer",
                      textTransform: "capitalize",
                    }}
                  >
                    {sort}
                  </button>
                ))}
              </div>

              {/* Mood Tags */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
                  Mood:
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {MOOD_TAGS.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleToggleMood(tag.id)}
                      className={`filter-tag${selectedMoods.includes(tag.id) ? " filter-tag-active" : ""}`}
                      style={{
                        padding: "6px 12px",
                        fontSize: "12px",
                        border: "1px solid rgba(0,0,0,0.15)",
                        borderRadius: "6px",
                        background: selectedMoods.includes(tag.id) ? "rgba(0,0,0,0.08)" : "transparent",
                        cursor: "pointer",
                      }}
                      title={tag.description}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Tags */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
                  Style:
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {STYLE_TAGS.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleToggleStyle(tag.id)}
                      className={`filter-tag${selectedStyles.includes(tag.id) ? " filter-tag-active" : ""}`}
                      style={{
                        padding: "6px 12px",
                        fontSize: "12px",
                        border: "1px solid rgba(0,0,0,0.15)",
                        borderRadius: "6px",
                        background: selectedStyles.includes(tag.id) ? "rgba(0,0,0,0.08)" : "transparent",
                        cursor: "pointer",
                      }}
                      title={tag.description}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              {hasFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  style={{
                    padding: "8px 16px",
                    fontSize: "13px",
                    border: "1px solid rgba(0,0,0,0.2)",
                    borderRadius: "6px",
                    background: "transparent",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Clear all filters
                </button>
              ) : null}
            </div>

            {/* Results count */}
            <div style={{ marginBottom: "20px", fontSize: "14px", opacity: 0.7 }}>
              {palettes.length} {palettes.length === 1 ? "palette" : "palettes"} found
            </div>

            {/* Gallery Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "24px",
                marginBottom: "40px",
              }}
            >
              {palettes.map((palette) => {
                const interaction = interactions.get(palette.id);
                const isLiked = interaction?.liked ?? false;
                const isSaved = interaction?.saved ?? false;

                return (
                  <div
                    key={palette.id}
                    style={{
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "12px",
                      overflow: "hidden",
                      background: "white",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {/* Color swatches */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gridTemplateRows: "repeat(2, 80px)",
                        gap: "1px",
                        background: "rgba(0,0,0,0.05)",
                      }}
                      onClick={() => handleViewPalette(palette)}
                    >
                      {(["background", "surface", "primary", "accent", "text", "muted"] as const).map(
                        (role) => (
                          <div
                            key={role}
                            style={{
                              background: toCss(palette.palette[role]),
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "10px",
                              fontWeight: 500,
                              color: swatchText(palette.palette[role]),
                              textTransform: "capitalize",
                            }}
                          >
                            {role}
                          </div>
                        )
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ padding: "16px" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "4px" }}>
                        {palette.name}
                      </h3>

                      {/* Author info */}
                      <div style={{ fontSize: "12px", opacity: 0.6, marginBottom: "8px" }}>
                        by {palette.author.name}
                      </div>

                      {palette.description ? (
                        <p
                          style={{
                            fontSize: "13px",
                            opacity: 0.7,
                            marginBottom: "12px",
                            lineHeight: 1.4,
                          }}
                        >
                          {palette.description}
                        </p>
                      ) : null}

                      {/* Tags */}
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                        {palette.tags.mood.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontSize: "10px",
                              padding: "3px 8px",
                              background: "rgba(0,0,0,0.06)",
                              borderRadius: "4px",
                              textTransform: "capitalize",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Stats and actions */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "12px", fontSize: "12px", opacity: 0.6 }}>
                          <span>👁 {palette.stats.views}</span>
                          <span>❤️ {palette.stats.likes}</span>
                          <span>💾 {palette.stats.saves}</span>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(palette.id);
                            }}
                            style={{
                              padding: "6px 12px",
                              fontSize: "12px",
                              border: "1px solid rgba(0,0,0,0.15)",
                              borderRadius: "6px",
                              background: isLiked ? "rgba(255,0,0,0.1)" : "transparent",
                              cursor: "pointer",
                              fontWeight: 500,
                            }}
                          >
                            {isLiked ? "❤️" : "🤍"}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSave(palette.id);
                            }}
                            style={{
                              padding: "6px 12px",
                              fontSize: "12px",
                              border: "1px solid rgba(0,0,0,0.15)",
                              borderRadius: "6px",
                              background: isSaved ? "rgba(0,100,255,0.1)" : "transparent",
                              cursor: "pointer",
                              fontWeight: 500,
                            }}
                          >
                            {isSaved ? "💾" : "📥"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty state */}
            {palettes.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  opacity: 0.6,
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎨</div>
                <div style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
                  No palettes found
                </div>
                <div style={{ fontSize: "14px" }}>
                  Try adjusting your filters or search query
                </div>
              </div>
            ) : null}
          </div>
        </Section>
      </div>
    </Frame>
  );
}
