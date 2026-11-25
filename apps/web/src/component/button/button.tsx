import { CSSProperties } from "react";
import "./button.scss";
import { LucideIcon } from "lucide-react";

export default function Button({
  type,
  size = "s",
  variant = "primary",
  label,
  logo: Icon,
  logo_direction = "right",
  active,
  disabled,
  className,
  style,
  id,
}: {
  type?: "button" | "reset" | "submit";
  size?: "s" | "m" | "l" | "xl";
  variant?:
    "primary" | "secondary" | "accent" | "usefulness" | "dark" | "ghost";
  label: string;
  logo?: LucideIcon;
  logo_direction?: "right" | "left";
  active?: boolean;
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
      className={`
        ${className}
        extranet-button
        extranet-button-${variant}
        ${active ? `extranet-button-${variant}__selected` : ""}
        extranet-button-${size}
        ${disabled ? "extranet-button-disabled" : ""}
      `}
      disabled={disabled}
    >
      {Icon && logo_direction === "right" && (
        <Icon
          size={size == "s" ? 14 : size == "m" ? 16 : size == "l" ? 18 : 20}
        />
      )}
      {label}
      {Icon && logo_direction === "left" && (
        <Icon
          size={size == "s" ? 14 : size == "m" ? 16 : size == "l" ? 18 : 20}
        />
      )}
    </button>
  );
}
