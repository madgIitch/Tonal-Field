"use client";

import type { PointerEvent } from "react";
import { useCallback, useRef } from "react";
import { clamp } from "@/lib/color/oklch";

type FieldProps = {
  energy: number;
  tension: number;
  background: string;
  onChange: (next: { energy: number; tension: number }) => void;
  spectrumMode?: boolean;
};

export function Field({ energy, tension, background, onChange, spectrumMode }: FieldProps) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const updateFromEvent = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);

      onChange({
        energy: Math.round(x * 100),
        tension: Math.round((1 - y) * 100),
      });
    },
    [onChange]
  );

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromEvent(event);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) {
      return;
    }
    updateFromEvent(event);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const markerStyle = {
    left: `${energy}%`,
    top: `${100 - tension}%`,
  };

  return (
    <div
      ref={canvasRef}
      className={`field-canvas${spectrumMode ? " field-spectrum-active" : ""}`}
      style={{ background }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className="field-axis-label field-axis-top">Sharp</div>
      <div className="field-axis-label field-axis-bottom">Soft</div>
      <div className="field-axis-label field-axis-left">{spectrumMode ? "Red" : "Calm"}</div>
      <div className="field-axis-label field-axis-right">{spectrumMode ? "Cyan" : "Vivid"}</div>
      {spectrumMode ? (
        <div className="field-spectrum-indicator">
          <svg viewBox="0 0 100 100" className="field-spectrum-wheel">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#spectrum-gradient)"
              strokeWidth="4"
              opacity="0.6"
            />
            <defs>
              <linearGradient id="spectrum-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="oklch(70% 0.15 0)" />
                <stop offset="25%" stopColor="oklch(70% 0.15 90)" />
                <stop offset="50%" stopColor="oklch(70% 0.15 180)" />
                <stop offset="75%" stopColor="oklch(70% 0.15 270)" />
                <stop offset="100%" stopColor="oklch(70% 0.15 360)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ) : null}
      <div className="field-dot" style={markerStyle} />
    </div>
  );
}
