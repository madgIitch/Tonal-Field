"use client";

import { useEffect, useMemo, useState } from "react";
import { Frame } from "@/components/Frame";
import { Field } from "@/components/Field";
import { Section } from "@/components/Section";
import { Slider } from "@/components/Slider";
import { generatePair } from "@/lib/color/model";
import { buildPalette } from "@/lib/color/palette";
import type { OKLCH } from "@/lib/color/oklch";
import { clamp, toCss } from "@/lib/color/oklch";
import {
  contrastRatio,
  fixPaletteContrast,
  fixPaletteContrastBasic,
  getContrastLevel,
  pickTextColor,
} from "@/lib/color/contrast";
import type { PaletteRole } from "@/lib/color/palette";
import {
  buildCssVariables,
  buildHexTokens,
  buildJsonTokens,
  buildTailwindConfig,
} from "@/lib/color/export";

const formatOklch = (color: OKLCH) =>
  `oklch(${Math.round(color.l * 100)}% ${color.c.toFixed(3)} ${Math.round(
    color.h
  )})`;

const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

const swatchText = (color: OKLCH) =>
  color.l > 0.6 ? "oklch(20% 0.02 90)" : "oklch(98% 0.02 90)";

const variationOffsets = [-12, 0, 12];

const FULL_ROLES: PaletteRole[] = [
  "background",
  "surface",
  "primary",
  "accent",
  "text",
  "muted",
];

const PREVIEW_ROLES: PaletteRole[] = [
  "background",
  "surface",
  "primary",
  "text",
];

type ExportType = "css" | "json" | "tailwind";

type SavedPalette = {
  id: string;
  energy: number;
  tension: number;
  autoFix: boolean;
  createdAt: string;
};

export default function Home() {
  const [energy, setEnergy] = useState(45);
  const [tension, setTension] = useState(35);
  const [autoFix, setAutoFix] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  const [exportType, setExportType] = useState<ExportType>("css");
  const [copyNotice, setCopyNotice] = useState("");
  const [copyScope, setCopyScope] = useState<"" | "export" | "share">("");
  const [shareUrl, setShareUrl] = useState("");
  const [hasLoadedSeed, setHasLoadedSeed] = useState(false);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);
  const maxFreeSaves = 2;
  const storageKey = "tonal-field:saved";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const energyParam = params.get("e");
    const tensionParam = params.get("t");
    const autoFixSeed = params.get("af");

    if (energyParam !== null) {
      const energySeed = Number(energyParam);
      if (!Number.isNaN(energySeed)) {
        setEnergy(clamp(energySeed, 0, 100));
      }
    }

    if (tensionParam !== null) {
      const tensionSeed = Number(tensionParam);
      if (!Number.isNaN(tensionSeed)) {
        setTension(clamp(tensionSeed, 0, 100));
      }
    }

    if (autoFixSeed === "0" || autoFixSeed === "1") {
      setAutoFix(autoFixSeed === "1");
    }

    setHasLoadedSeed(true);
  }, [clamp]);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as SavedPalette[];
        if (Array.isArray(parsed)) {
          setSavedPalettes(parsed);
        }
      } catch {
        setSavedPalettes([]);
      }
    }
    setHasLoadedStorage(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hasLoadedStorage) {
      return;
    }
    localStorage.setItem(storageKey, JSON.stringify(savedPalettes));
  }, [hasLoadedStorage, savedPalettes, storageKey]);

  useEffect(() => {
    if (!hasLoadedSeed) {
      return;
    }
    const params = new URLSearchParams();
    params.set("e", String(Math.round(energy)));
    params.set("t", String(Math.round(tension)));
    params.set("af", autoFix ? "1" : "0");
    const query = params.toString();
    const nextUrl = `${window.location.pathname}?${query}`;
    window.history.replaceState(null, "", nextUrl);
    setShareUrl(`${window.location.origin}${nextUrl}`);
  }, [autoFix, energy, hasLoadedSeed, tension]);

  const pair = useMemo(
    () => generatePair({ energy, tension }),
    [energy, tension]
  );

  const basePalette = useMemo(() => buildPalette(pair), [pair]);
  const { palette, primaryText } = useMemo(() => {
    if (autoFix) {
      return isPro
        ? fixPaletteContrast(basePalette)
        : fixPaletteContrastBasic(basePalette);
    }

    return {
      palette: basePalette,
      primaryText: pickTextColor(basePalette.primary).color,
    };
  }, [autoFix, basePalette, isPro]);

  const swatchA = toCss(pair.a);
  const swatchB = toCss(pair.b);
  const swatchTextA = swatchText(pair.a);
  const swatchTextB = swatchText(pair.b);

  const fieldBackground = useMemo(
    () =>
      `radial-gradient(280px circle at 20% 30%, ${swatchA}, transparent 65%),
      radial-gradient(260px circle at 80% 70%, ${swatchB}, transparent 70%),
      color-mix(in oklch, var(--surface), white 25%)`,
    [swatchA, swatchB]
  );

  const paletteStyles = useMemo(
    () => ({
      background: toCss(palette.background),
      surface: toCss(palette.surface),
      text: toCss(palette.text),
      muted: toCss(palette.muted),
      primary: toCss(palette.primary),
      primaryText: toCss(primaryText),
      accent: toCss(palette.accent),
    }),
    [palette, primaryText]
  );

  const paletteDisplay = useMemo(() => {
    const roles = isPro ? FULL_ROLES : PREVIEW_ROLES;
    const locked = isPro ? [] : ["accent", "muted"];

    const visible = roles.map((role) => ({
      key: role,
      label: role.charAt(0).toUpperCase() + role.slice(1),
      color: palette[role],
    }));

    const lockedItems = locked.map((role) => ({
      key: role,
      label: role.charAt(0).toUpperCase() + role.slice(1),
      color: palette[role],
      locked: true,
    }));

    return [...visible, ...lockedItems];
  }, [isPro, palette]);

  const exportRoles = isPro ? FULL_ROLES : PREVIEW_ROLES;
  const hexTokens = useMemo(
    () => buildHexTokens(palette, exportRoles),
    [exportRoles, palette]
  );

  const exportContent = useMemo(() => {
    switch (exportType) {
      case "css":
        return buildCssVariables(palette, FULL_ROLES);
      case "json":
        return buildJsonTokens(palette, FULL_ROLES);
      case "tailwind":
        return buildTailwindConfig(palette, FULL_ROLES);
      default:
        return buildCssVariables(palette, FULL_ROLES);
    }
  }, [exportType, palette]);

  const savedCount = savedPalettes.length;
  const canSave = isPro || savedCount < maxFreeSaves;

  const handleSave = () => {
    if (!canSave) {
      return;
    }

    const entry: SavedPalette = {
      id: `${Date.now()}`,
      energy,
      tension,
      autoFix,
      createdAt: new Date().toISOString(),
    };

    setSavedPalettes((prev) => [entry, ...prev]);
  };

  const handleUpgrade = () => {
    setIsPro(true);
  };

  const handleLoad = (entry: SavedPalette) => {
    setEnergy(entry.energy);
    setTension(entry.tension);
    setAutoFix(entry.autoFix);
  };

  const handleDelete = (id: string) => {
    setSavedPalettes((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCopy = async (
    text: string,
    notice: string,
    scope: "export" | "share"
  ) => {
    if (!navigator.clipboard) {
      setCopyScope(scope);
      setCopyNotice("Clipboard unavailable");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopyScope(scope);
      setCopyNotice(notice);
      window.setTimeout(() => {
        setCopyNotice("");
        setCopyScope("");
      }, 1500);
    } catch {
      setCopyScope(scope);
      setCopyNotice("Copy failed");
    }
  };

  const contrastChecks = useMemo(() => {
    const items = [
      {
        key: "text-bg",
        label: "Text on background",
        foreground: palette.text,
        background: palette.background,
      },
      {
        key: "text-surface",
        label: "Text on surface",
        foreground: palette.text,
        background: palette.surface,
      },
      {
        key: "muted-bg",
        label: "Muted on background",
        foreground: palette.muted,
        background: palette.background,
      },
      {
        key: "primary",
        label: "Primary text on primary",
        foreground: primaryText,
        background: palette.primary,
      },
      {
        key: "accent",
        label: "Accent on background",
        foreground: palette.accent,
        background: palette.background,
      },
    ];

    return items.map((item) => {
      const ratio = contrastRatio(item.foreground, item.background);
      return {
        ...item,
        ratio,
        level: getContrastLevel(ratio),
      };
    });
  }, [palette, primaryText]);

  const variations = useMemo(() => {
    return variationOffsets.flatMap((yOffset) =>
      variationOffsets.map((xOffset) => {
        const nextEnergy = clamp(energy + xOffset, 0, 100);
        const nextTension = clamp(tension + yOffset, 0, 100);
        const nextPair = generatePair({
          energy: nextEnergy,
          tension: nextTension,
        });

        return {
          key: `${nextEnergy}-${nextTension}`,
          energy: Math.round(nextEnergy),
          tension: Math.round(nextTension),
          gradient: `linear-gradient(135deg, ${toCss(nextPair.a)} 0 50%, ${toCss(
            nextPair.b
          )} 50% 100%)`,
        };
      })
    );
  }, [energy, tension]);

  return (
    <Frame>
      <Section title="Tonal Field" subtitle="Explore color as a continuous space">
        <div className="field-grid">
          <div className="panel panel-controls">
            <div className="panel-title">Energy + Tension</div>
            <div className="controls">
              <Slider
                label="Energy"
                description="Calm to vivid"
                value={energy}
                minLabel="Calm"
                maxLabel="Vivid"
                onChange={setEnergy}
              />
              <Slider
                label="Tension"
                description="Soft to sharp"
                value={tension}
                minLabel="Soft"
                maxLabel="Sharp"
                onChange={setTension}
              />
            </div>
          </div>

          <div className="panel panel-preview">
            <div className="panel-title">Palette Kit</div>
            <div className="field-block">
              <div className="field-header">
                <div className="field-title">Mood Field</div>
                <div className="field-values">
                  <span>Energy {energy}</span>
                  <span>Tension {tension}</span>
                </div>
              </div>
              <Field
                energy={energy}
                tension={tension}
                background={fieldBackground}
                onChange={({ energy: nextEnergy, tension: nextTension }) => {
                  setEnergy(nextEnergy);
                  setTension(nextTension);
                }}
              />
              <div className="variation-grid">
                {variations.map((variant) => (
                  <div
                    key={variant.key}
                    className="variation-swatch"
                    style={{ background: variant.gradient }}
                  >
                    <span className="variation-label">
                      {variant.energy}/{variant.tension}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pair pair-compact">
              <div
                className="swatch"
                style={{ background: swatchA, color: swatchTextA }}
              >
                <div className="swatch-label">A</div>
                <div className="swatch-value">{formatOklch(pair.a)}</div>
              </div>
              <div
                className="swatch"
                style={{ background: swatchB, color: swatchTextB }}
              >
                <div className="swatch-label">B</div>
                <div className="swatch-value">{formatOklch(pair.b)}</div>
              </div>
            </div>
            <div className="palette-grid">
              {paletteDisplay.map((item) => (
                <div
                  key={item.key}
                  className={`palette-swatch${item.locked ? " palette-locked" : ""}`}
                  style={{
                    background: toCss(item.color),
                    color: swatchText(item.color),
                  }}
                >
                  <div className="palette-role">{item.label}</div>
                  <div className="palette-value">{formatOklch(item.color)}</div>
                  {item.locked ? <div className="locked-pill">Pro</div> : null}
                </div>
              ))}
            </div>
            <div className="palette-preview">
              <div className="panel-title">Usage preview</div>
              <div
                className={`ui-preview${isPro ? "" : " preview-locked"}`}
                style={{
                  background: paletteStyles.background,
                  color: paletteStyles.text,
                }}
              >
                <div
                  className="ui-card"
                  style={{ background: paletteStyles.surface }}
                >
                  <span
                    className="ui-chip"
                    style={{
                      background: paletteStyles.muted,
                      color: paletteStyles.text,
                    }}
                  >
                    Muted label
                  </span>
                  <h3 className="ui-title">Interface sample</h3>
                  <p className="ui-body">
                    Primary actions use the main tone. Accent highlights secondary
                    emphasis.
                  </p>
                  <div className="ui-actions">
                    <button
                      className="ui-btn ui-primary"
                      style={{
                        background: paletteStyles.primary,
                        color: paletteStyles.primaryText,
                      }}
                      type="button"
                    >
                      Primary action
                    </button>
                    <button
                      className="ui-btn ui-ghost"
                      style={{ borderColor: paletteStyles.accent, color: paletteStyles.accent }}
                      type="button"
                    >
                      Accent link
                    </button>
                  </div>
                </div>
                {!isPro ? (
                  <div className="upgrade-overlay">
                    <div>
                      Unlock full kit previews and advanced exports with Pro.
                    </div>
                    <button
                      type="button"
                      className="upgrade-btn"
                      onClick={handleUpgrade}
                    >
                      Upgrade
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="panel panel-metrics">
            <div className="panel-title">Metrics</div>
            <div className="metrics">
              <div className="metric">
                <span>Chroma</span>
                <span>{pair.metrics.chroma.toFixed(3)}</span>
              </div>
              <div className="metric">
                <span>Hue diff</span>
                <span>{Math.round(pair.metrics.hueDiff)} deg</span>
              </div>
              <div className="metric">
                <span>Lightness</span>
                <span>{pair.metrics.lightnessContrast.toFixed(2)}</span>
              </div>
              <div className="metric">
                <span>Vibration</span>
                <span>{pair.metrics.vibration.toFixed(2)}</span>
              </div>
              <div className="metric">
                <span>Energy fit</span>
                <span>{formatPercent(pair.metrics.energyFit)}</span>
              </div>
              <div className="metric">
                <span>Tension fit</span>
                <span>{formatPercent(pair.metrics.tensionFit)}</span>
              </div>
            </div>
            <div className="score">
              <div className="score-header">
                <span>Unified score</span>
                <span>{formatPercent(pair.metrics.score)}</span>
              </div>
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{ width: formatPercent(pair.metrics.score) }}
                />
              </div>
            </div>
            <div className="contrast">
              <div className="panel-title">Accessibility</div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={autoFix}
                  onChange={(event) => setAutoFix(event.target.checked)}
                />
                <span>
                  Fix contrast {isPro ? "(advanced)" : "(basic)"}
                </span>
              </label>
              {!isPro ? (
                <div className="upgrade-hint">
                  Pro unlocks advanced auto-fix for accent and muted roles.
                </div>
              ) : null}
              <div className="contrast-list">
                {contrastChecks.map((item) => (
                  <div key={item.key} className="contrast-item">
                    <span>{item.label}</span>
                    <span className={`badge badge-${item.level.toLowerCase()}`}>
                      {item.level}
                    </span>
                    <span className="contrast-value">
                      {item.ratio.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="export">
              <div className="panel-title">Export</div>
              <div className="export-block">
                <div className="export-title">HEX tokens</div>
                <div className="export-grid">
                  {hexTokens.map((token) => (
                    <div key={token.role} className="export-token">
                      <span>{token.label}</span>
                      <span>{token.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`export-block${isPro ? "" : " export-locked"}`}>
                <div className="export-title">Pro exports</div>
                <div className="export-options">
                  <button
                    className={`export-btn${exportType === "css" ? " export-active" : ""}`}
                    type="button"
                    disabled={!isPro}
                    onClick={() => setExportType("css")}
                  >
                    CSS variables
                  </button>
                  <button
                    className={`export-btn${exportType === "json" ? " export-active" : ""}`}
                    type="button"
                    disabled={!isPro}
                    onClick={() => setExportType("json")}
                  >
                    JSON tokens
                  </button>
                  <button
                    className={`export-btn${exportType === "tailwind" ? " export-active" : ""}`}
                    type="button"
                    disabled={!isPro}
                    onClick={() => setExportType("tailwind")}
                  >
                    Tailwind config
                  </button>
                </div>
                {isPro ? (
                  <div className="export-code">
                    <pre className="export-pre">{exportContent}</pre>
                    <div className="export-toolbar">
                      <button
                        className="copy-btn"
                        type="button"
                        onClick={() =>
                          handleCopy(exportContent, "Export copied", "export")
                        }
                      >
                        Copy
                      </button>
                      {copyNotice && copyScope === "export" ? (
                        <span className="copy-status">{copyNotice}</span>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="upgrade-hint">
                    Upgrade to export full kits and developer formats.
                  </div>
                )}
              </div>
              <div className="export-block">
                <div className="export-title">Share</div>
                <div className="share-row">
                  <input
                    className="share-input"
                    type="text"
                    readOnly
                    value={shareUrl}
                  />
                  <button
                    className="copy-btn"
                    type="button"
                    disabled={!shareUrl}
                    onClick={() => handleCopy(shareUrl, "Link copied", "share")}
                  >
                    Copy link
                  </button>
                </div>
                {copyNotice && copyScope === "share" ? (
                  <div className="copy-status">{copyNotice}</div>
                ) : null}
              </div>
            </div>
            <div className="plan">
              <div className="panel-title">Plan</div>
              <div className="plan-row">
                <span className={`plan-pill ${isPro ? "plan-pro" : "plan-free"}`}>
                  {isPro ? "Pro" : "Free"}
                </span>
                {!isPro ? (
                  <button type="button" className="upgrade-btn" onClick={handleUpgrade}>
                    Upgrade
                  </button>
                ) : (
                  <span className="plan-status">Unlocked</span>
                )}
              </div>
              <div className="plan-row">
                <button
                  type="button"
                  className="save-btn"
                  onClick={handleSave}
                  disabled={!canSave}
                >
                  Save palette
                </button>
                <span className="save-count">
                  {isPro ? "Unlimited saves" : `Saved ${savedCount}/${maxFreeSaves}`}
                </span>
              </div>
              {!canSave && !isPro ? (
                <div className="upgrade-hint">
                  Free plan limit reached. Upgrade for unlimited saves.
                </div>
              ) : null}
              {savedPalettes.length ? (
                <div className="saved-list">
                  {savedPalettes.map((item) => (
                    <div key={item.id} className="saved-item">
                      <div className="saved-meta">
                        <span>
                          Energy {item.energy} / Tension {item.tension}
                        </span>
                        <span>{item.autoFix ? "Auto-fix" : "No fix"}</span>
                      </div>
                      <div className="saved-actions">
                        <button
                          type="button"
                          className="saved-btn"
                          onClick={() => handleLoad(item)}
                        >
                          Load
                        </button>
                        <button
                          type="button"
                          className="saved-btn saved-remove"
                          onClick={() => handleDelete(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="saved-empty">No saved palettes yet.</div>
              )}
            </div>
          </div>
        </div>
      </Section>
    </Frame>
  );
}
