import { Check, LucideIcon } from "lucide-react";
import "./card.scss";

export default function Card({
  active = false,
  title,
  subtitle,
  logo: Icon,
  onClick,
}: {
  active?: boolean;
  title: string;
  subtitle?: string;
  logo: LucideIcon;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`extranet-card ${active ? "extranet-card__select" : ""}`}
      onClick={onClick}
    >
      <div
        className={`extranet-card-logo ${active ? "extranet-card-logo__select" : ""}`}
      >
        <Icon size={18} />
      </div>
      <div className="extranet-card-element">
        <span className="extranet-card-element__title">{title}</span>
        <span className="extranet-card-element__subtitle">{subtitle}</span>
      </div>
      {active ? (
        <span className="extranet-card-check" aria-hidden>
          <Check size="65%" strokeWidth={3} />
        </span>
      ) : (
        <span className="extranet-card-nocheck"></span>
      )}
    </button>
  );
}
