"use client";

import { ChangeEvent, ReactNode } from "react";
import { Check } from "lucide-react";
import "./checkbox.scss";

export default function Checkbox({
  label,
  checked = false,
  onChange,
  className,
  name,
  value,
  disabled,
  required,
}: {
  label?: ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  name?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <label
      className={[
        "extranet-checkbox",
        disabled && "extranet-checkbox__disabled",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        type="checkbox"
        className="extranet-checkbox-input"
        checked={checked}
        onChange={(event) => onChange?.(event.target.checked, event)}
        name={name}
        value={value}
        disabled={disabled}
        required={required}
      />
      <span className="extranet-checkbox-box" aria-hidden>
        <Check size="70%" strokeWidth={3} />
      </span>
      {label && <span className="extranet-checkbox-label">{label}</span>}
    </label>
  );
}
