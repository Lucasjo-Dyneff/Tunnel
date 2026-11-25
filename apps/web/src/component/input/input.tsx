import { ChangeEventHandler, CSSProperties, useId } from "react";
import {
  Check,
  CircleAlert,
  CircleCheck,
  Info,
  LucideIcon,
} from "lucide-react";
import "./input.scss";

export default function Input({
  label,
  type = "info",
  message,
  size = "s",
  logo: Icon,
  value,
  defaultValue,
  placeholder,
  name,
  style,
  onChange,
}: {
  label: string;
  type?: "success" | "error" | "info";
  size?: "s" | "m" | "l" | "xl";
  message?: string;
  logo?: LucideIcon;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  name?: string;
  style?: CSSProperties;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) {
  const id = useId();

  return (
    <div className="extranet-input">
      <label htmlFor={id} className="extranet-input-label">
        {label}
      </label>

      <div className={`extranet-input-wrapper extranet-input-wrapper-${size}`}>
        <input
          id={id}
          value={value}
          defaultValue={defaultValue}
          name={name}
          placeholder={placeholder}
          style={style}
          onChange={onChange}
          className={`
            extranet-input-wrapper-field
            ${type ? `extranet-input-wrapper-field-${type}` : ""}
            ${Icon ? `extranet-input-wrapper-field-padding-${size}` : ""}
            extranet-input-wrapper-field-${size}
          `}
        />
        {type === "success" && (
          <span className="extranet-input-logSuccess" aria-hidden>
            <Check className={`extranet-input-logSuccess-${type}`} size="72%" />
          </span>
        )}

        {Icon && (
          <div className={`extranet-input-logo extranet-input-logo-${size}`}>
            <Icon
              size={size === "s" ? 18 : size === "m" || size === "l" ? 20 : 24}
            />
          </div>
        )}
      </div>

      {message && (
        <p
          className={`extranet-input-message${type ? ` extranet-input-message-${type}` : ""} extranet-input-message-${size}`}
        >
          {type === "success" ? (
            <CircleCheck size="1em" />
          ) : type === "error" ? (
            <CircleAlert size="1em" />
          ) : (
            <Info size="1em" />
          )}
          {message}
        </p>
      )}
    </div>
  );
}
