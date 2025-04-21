import React from "react";
import "../styles/input.css";
import type { InputProps } from "../utils/types";

export const Input: React.FC<InputProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  max,
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
        id={name}
        value={value}
        onChange={onChange}
        max={max}
        className="input-field"
        placeholder={placeholder}
        required={required}
        checked={checked}
      />
    </div>
  );
};
