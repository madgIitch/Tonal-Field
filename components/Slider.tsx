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
  disabled?: boolean;
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
  disabled = false,
  onChange,
}: SliderProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value));
  };

  return (
    <div className={`slider${disabled ? " slider-disabled" : ""}`}>
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
        disabled={disabled}
      />
      <div className="slider-scale">
        <span>{minLabel ?? min}</span>
        <span>{maxLabel ?? max}</span>
      </div>
    </div>
  );
}
