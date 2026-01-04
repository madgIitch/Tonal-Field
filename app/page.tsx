"use client";

import { useMemo, useState } from "react";
import { Frame } from "@/components/Frame";
import { Section } from "@/components/Section";
import { Slider } from "@/components/Slider";
import { generatePair } from "@/lib/color/model";
import { buildPalette } from "@/lib/color/palette";
import type { OKLCH } from "@/lib/color/oklch";
import { toCss } from "@/lib/color/oklch";

const formatOklch = (color: OKLCH) =>
  `oklch(${Math.round(color.l * 100)}% ${color.c.toFixed(3)} ${Math.round(
    color.h
  )})`;

const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

const swatchText = (color: OKLCH) =>
  color.l > 0.6 ? "oklch(20% 0.02 90)" : "oklch(98% 0.02 90)";

export default function Home() {
  const [energy, setEnergy] = useState(45);
  const [tension, setTension] = useState(35);

  const pair = useMemo(
    () => generatePair({ energy, tension }),
    [energy, tension]
  );

  const palette = useMemo(() => buildPalette(pair), [pair]);

  const swatchA = toCss(pair.a);
  const swatchB = toCss(pair.b);
  const swatchTextA = swatchText(pair.a);
  const swatchTextB = swatchText(pair.b);

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
              {[
                { key: "background", label: "Background", color: palette.background },
                { key: "surface", label: "Surface", color: palette.surface },
                { key: "primary", label: "Primary", color: palette.primary },
                { key: "accent", label: "Accent", color: palette.accent },
                { key: "text", label: "Text", color: palette.text },
                { key: "muted", label: "Muted", color: palette.muted },
              ].map((item) => (
                <div
                  key={item.key}
                  className="palette-swatch"
                  style={{
                    background: toCss(item.color),
                    color: swatchText(item.color),
                  }}
                >
                  <div className="palette-role">{item.label}</div>
                  <div className="palette-value">{formatOklch(item.color)}</div>
                </div>
              ))}
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
          </div>
        </div>
      </Section>
    </Frame>
  );
}
