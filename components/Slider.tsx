import type { ChangeEvent } from "react";

type SliderProps = {
  label: string;
  description?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
  onChange: (value: number) => void;
};

export function Slider({
  label,
  description,
  value,
  min = 0,
  max = 100,
  step = 1,
  minLabel,
  maxLabel,
  onChange,
}: SliderProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value));
  };

  return (
    <div className="slider">
      <div className="slider-header">
        <div>
          <div className="slider-label">{label}</div>
          {description ? (
            <div className="slider-description">{description}</div>
          ) : null}
        </div>
        <div className="slider-value">{value}</div>
      </div>
      <input
        className="slider-input"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        aria-label={label}
      />
      <div className="slider-scale">
        <span>{minLabel ?? min}</span>
        <span>{maxLabel ?? max}</span>
      </div>
    </div>
  );
}
