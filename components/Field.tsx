"use client";

import type { PointerEvent } from "react";
import { useCallback, useRef } from "react";
import { clamp } from "@/lib/color/oklch";

type FieldProps = {
  energy: number;
  tension: number;
  background: string;
  onChange: (next: { energy: number; tension: number }) => void;
};

export function Field({ energy, tension, background, onChange }: FieldProps) {
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
      className="field-canvas"
      style={{ background }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className="field-axis-label field-axis-top">Sharp</div>
      <div className="field-axis-label field-axis-bottom">Soft</div>
      <div className="field-axis-label field-axis-left">Calm</div>
      <div className="field-axis-label field-axis-right">Vivid</div>
      <div className="field-dot" style={markerStyle} />
    </div>
  );
}
