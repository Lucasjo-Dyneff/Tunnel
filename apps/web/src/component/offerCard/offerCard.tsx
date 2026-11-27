"use client";

import { Check, LucideIcon, Star, Zap } from "lucide-react";
import Pin from "../pin/pin";
import "./offerCard.scss";

export type OfferCardProps = {
  title: string;
  subtitle: string;
  monthlyPrice: string;
  yearlyPrice: string;
  info: string;
  icon?: LucideIcon;
  recommended?: boolean;
  selected?: boolean;
  onSelect?: () => void;
};

export default function OfferCard({
  title,
  subtitle,
  monthlyPrice,
  yearlyPrice,
  info,
  icon: Icon = Zap,
  recommended = false,
  selected = false,
  onSelect,
}: OfferCardProps) {
  return (
    <button
      type="button"
      className={`
        extranet-offerCard 
        ${selected && "extranet-offerCard--selected"} 
        ${recommended && "extranet-offerCard--recommended"}
      `}
      aria-pressed={selected}
      onClick={onSelect}
    >
      {recommended && (
        <Pin
          label="Recommandé"
          type="new"
          logo={Star}
          className="extranet-offerCard-badge"
        />
      )}

      <div className="extranet-offerCard-head">
        <div className="extranet-offerCard-logo">
          <Icon size={16} />
        </div>
        <span className="extranet-offerCard-check" aria-hidden>
          <Check size={14} strokeWidth={3} />
        </span>
      </div>

      <h3 className="extranet-offerCard__title">{title}</h3>
      <p className="extranet-offerCard__subtitle">{subtitle}</p>

      <p className="extranet-offerCard-price">
        <span className="dyneff-price">{monthlyPrice}</span>
        <span className="extranet-offerCard-price__unit">/ mois</span>
      </p>
      <p className="dyneff-p-xs">soit {yearlyPrice} TTC / an</p>

      <p className="extranet-offerCard__info">{info}</p>
    </button>
  );
}
