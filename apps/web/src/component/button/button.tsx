import { CSSProperties } from "react";
import "./button.scss";

export default function Button({
  type,
  size = "s",
  variant = "primary",
  label,
  disabled,
  className,
  style,
  id,
}: {
  type?: "button" | "reset" | "submit";
  size?: "s" | "m" | "l" | "xl";
  variant?: "primary" | "secondary" | "accent" | "dark" | "ghost";
  label: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  id?: string;
}) {
  return (
    <button
      type={type}
      style={style}
      id={id}
      className={`${className} extranet-button extranet-button-${variant} extranet-button-${size} ${disabled ? "extranet-button-disabled" : ""}`}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
