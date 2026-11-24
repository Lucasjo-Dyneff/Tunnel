import { CSSProperties, useId } from "react";
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
  success,
  message,
  size = "s",
  logo: Icon,
  value,
  defaultValue,
  placeholder,
  name,
  style,
}: {
  label: string;
  success?: "success" | "error" | "info";
  size?: "s" | "m" | "l" | "xl";
  message?: string;
  logo?: LucideIcon;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  name?: string;
  style?: CSSProperties;
}) {
  const id = useId();

  return (
    <>
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
          className={`extranet-input-wrapper-field${success ? ` extranet-input-wrapper-field-${success}` : ""} ${Icon ? `extranet-input-wrapper-field-padding-${size}` : ""} extranet-input-wrapper-field-${size}`}
        />
        {success === "success" && (
          <span className="extranet-input-logSuccess" aria-hidden>
            <Check
              className={`extranet-input-logSuccess-${success}`}
              size="72%"
            />
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
          className={`extranet-input-message${success ? ` extranet-input-message-${success}` : ""} extranet-input-message-${size}`}
        >
          {success === "success" ? (
            <CircleCheck size="1em" />
          ) : success === "error" ? (
            <CircleAlert size="1em" />
          ) : (
            <Info size="1em" />
          )}
          {message}
        </p>
      )}
    </>
  );
}
