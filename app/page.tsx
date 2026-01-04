"use client";

import { useMemo, useState } from "react";
import { Frame } from "@/components/Frame";
import { Field } from "@/components/Field";
import { Section } from "@/components/Section";
import { Slider } from "@/components/Slider";
import { generatePair } from "@/lib/color/model";
import { buildPalette } from "@/lib/color/palette";
import type { OKLCH } from "@/lib/color/oklch";
import { clamp, toCss, toHex } from "@/lib/color/oklch";
import {
  contrastRatio,
  fixPaletteContrast,
  fixPaletteContrastBasic,
  getContrastLevel,
  pickTextColor,
} from "@/lib/color/contrast";
import type { PaletteRole } from "@/lib/color/palette";

const formatOklch = (color: OKLCH) =>
  `oklch(${Math.round(color.l * 100)}% ${color.c.toFixed(3)} ${Math.round(
    color.h
  )})`;

const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

const swatchText = (color: OKLCH) =>
  color.l > 0.6 ? "oklch(20% 0.02 90)" : "oklch(98% 0.02 90)";

const variationOffsets = [-12, 0, 12];

export default function Home() {
  const [energy, setEnergy] = useState(45);
  const [tension, setTension] = useState(35);
  const [autoFix, setAutoFix] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const maxFreeSaves = 2;

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

  const fullRoles: PaletteRole[] = [
    "background",
    "surface",
    "primary",
    "accent",
    "text",
    "muted",
  ];
  const previewRoles: PaletteRole[] = [
    "background",
    "surface",
    "primary",
    "text",
  ];

  const paletteDisplay = useMemo(() => {
    const roles = isPro ? fullRoles : previewRoles;
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

  const exportRoles = isPro ? fullRoles : previewRoles;
  const hexTokens = exportRoles.map((role) => ({
    role,
    value: toHex(palette[role]),
  }));

  const canSave = isPro || savedCount < maxFreeSaves;

  const handleSave = () => {
    if (!canSave) {
      return;
    }
    setSavedCount((count) => count + 1);
  };

  const handleUpgrade = () => {
    setIsPro(true);
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
                      <span>{token.role}</span>
                      <span>{token.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`export-block${isPro ? "" : " export-locked"}`}>
                <div className="export-title">Pro exports</div>
                <div className="export-options">
                  <button className="export-btn" type="button" disabled={!isPro}>
                    CSS variables
                  </button>
                  <button className="export-btn" type="button" disabled={!isPro}>
                    JSON tokens
                  </button>
                  <button className="export-btn" type="button" disabled={!isPro}>
                    Tailwind config
                  </button>
                </div>
                {!isPro ? (
                  <div className="upgrade-hint">
                    Upgrade to export full kits and developer formats.
                  </div>
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
            </div>
          </div>
        </div>
      </Section>
    </Frame>
  );
}
