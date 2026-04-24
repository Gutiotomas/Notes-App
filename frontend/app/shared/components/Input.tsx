import React from "react";
import "../styles/input.css";
import type { InputProps } from "../utils/types";

export const Input: React.FC<InputProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  min,
  max,
  step,
  maxLength,
  placeholder,
  required = false,
  checked = false,
  id,
}) => {
  return (
    <div className="input-container">
      <label htmlFor={name} className="input-label">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={id || name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        maxLength={maxLength}
        className="input-field"
        placeholder={placeholder}
        required={required}
        checked={checked}
      />
    </div>
  );
};
