import React from "react";
import "../styles/button.css";
import type { ButtonProps } from "../utils/types";

export const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  className,
  type,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      className={`button ${className}`}
      type={type}
      disabled={disabled}
    >
      {text}
    </button>
  );
};
