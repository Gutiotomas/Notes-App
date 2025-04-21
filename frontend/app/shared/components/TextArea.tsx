import React from "react";
import "../styles/text.css";
import type { TextAreaProps } from "../utils/types";

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  name,
  value,
  onChange,
  maxLength,
  placeholder,
  required = false,
  rows,
  cols,
}) => {
  return (
    <div className="text-container">
      <label htmlFor={name} className="text-label">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        id={name}
        onChange={onChange}
        maxLength={maxLength}
        className="text-field"
        placeholder={placeholder}
        required={required}
        rows={rows}
        cols={cols}
      />
    </div>
  );
};
