import React from "react";
import "../styles/button.css";
import type { ButtonProps } from "../utils/types";

export const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  className,
  type,
}) => {
  return (
    <button onClick={onClick} className={`button ${className}`} type={type}>
      {text}
    </button>
  );
};
