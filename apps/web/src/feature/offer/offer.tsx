"use client";
import Pin from "@/component/pin/pin";
import { useState } from "react";
import OfferCard, { OfferCardProps } from "@/component/offerCard/offerCard";
import {
  ArrowRight,
  Check,
  FileText,
  Flame,
  Mail,
  SlidersHorizontal,
  Zap,
} from "lucide-react";
import Button from "@/component/button/button";
import "./offer.scss";

type Offer = Omit<OfferCardProps, "selected" | "onSelect"> & { id: string };

const offers: Offer[] = [
  {
    id: "fixe-1-an",
    title: "Prix fixe 1 an",
    subtitle: "Le prix du kWh bloqué 12 mois",
    monthlyPrice: "110 €",
    yearlyPrice: "1314 €",
    info: "Prix du kWh HT bloqué 12 mois",
  },
  {
    id: "fixe-2-ans",
    title: "Prix fixe 2 ans",
    subtitle: "Le prix du kWh bloqué 24 mois",
    monthlyPrice: "106 €",
    yearlyPrice: "1273 €",
    info: "Prix du kWh HT bloqué 24 mois",
    recommended: true,
  },
];

export default function OfferFeature() {
  const [selectedOffer, setSelectedOffer] = useState<string | null>(
    () => offers.find((offer) => offer.recommended)?.id ?? null,
  );

  return (
    <div className="app-offer">
      <div className="app-offer-main">
        <div>
          <h1>Votre offre personnalisée</h1>
          <p className="dyneff-subtitle-m">
            Électricité · 6 kVA · Heures creuses · •••• •••• 8942
          </p>

          <div className="app-offer-main-reliability">
            <Pin label="Fiabilité élevée" type="success" />
            <p className="dyneff-p-xs">basée sur votre consommation réelle</p>
            <div className="app-offer-main-reliability__progress app-offer-main-reliability__progress--80"></div>
          </div>

          <div className="app-offer-main-proposals">
            {offers.map((offer) => (
              <OfferCard
                key={offer.id}
                {...offer}
                selected={selectedOffer === offer.id}
                onSelect={() => setSelectedOffer(offer.id)}
              />
            ))}
          </div>
        </div>

        {selectedOffer !== null && (
          <div className="app-offer-view">
            <div className="app-offer-view-detail">
              <div className="app-offer-view-detail-title">
                <h2 className="app-offer-view-detail-title__text">
                  Détail de l'offre
                </h2>
                <Pin label="Prix fix 1 an" />
              </div>
              <div className="app-offer-view-detail-subscription">
                <p className="dyneff-p-s">Abonnement 15 kVA · option Base</p>
                <span className="app-offer-view-detail-price">
                  31,49 € / mois
                </span>
              </div>

              <div className="app-offer-view-detail-consumption">
                <div className="app-offer-view-detail-subscription">
                  <p className="dyneff-p-s">Consommation</p>
                  <span className="app-offer-view-detail-price">
                    31,49 € / mois
                  </span>
                </div>
                <span className="dyneff-p-xs">4 296 kWh × 0.2180 €</span>
              </div>

              <div className="app-offer-view-detail-total">
                <span className="app-offer-view-detail-total__text">
                  Total annel estimé TTC
                </span>
                <span className="app-offer-view-detail-total__price">
                  1314 €
                </span>
              </div>

              <p className="app-offer-view-detail-ttc dyneff-p-xs">
                Prix TTC incluant acheminement, taxes et contributions.{" "}
                <span className="dyneff-link">
                  Voir le détail réglementaire
                </span>
              </p>

              <span className="app-offer-view-detail-ttc__adjust dyneff-link dyneff-p-xs">
                <SlidersHorizontal size={14} /> Ajuster ma puissance ou mon
                option
              </span>

              <p className="app-offer-view-detail-why dyneff-p-xs">
                Pourquoi 15 kVA ? Dimensionné sur votre consommation estimée.
              </p>
            </div>

            <div className="app-offer-view-signature">
              <h2 className="app-offer-view-detail-title__text">
                Ce que vous signez
              </h2>

              <ul className="app-offer-view-signature-list">
                <li className="app-offer-view-signature-list__li">
                  <Check
                    className="app-offer-view-signature-list__logo"
                    size={16}
                    color="#0fa678"
                  />
                  Prix du kWh HT fixe pendant 24 mois
                </li>
                <li className="app-offer-view-signature-list__li">
                  <Check
                    className="app-offer-view-signature-list__logo"
                    size={16}
                    color="#0fa678"
                  />
                  Sans engagement : résiliation gratuite à tout moment
                </li>
                <li className="app-offer-view-signature-list__li">
                  <Check
                    className="app-offer-view-signature-list__logo"
                    size={16}
                    color="#0fa678"
                  />
                  14 jours de rétractation après signature
                </li>
                <li className="app-offer-view-signature-list__li">
                  <Check
                    className="app-offer-view-signature-list__logo"
                    size={16}
                    color="#0fa678"
                  />
                  Mensualités ajustables, facture annuelle de régularisation
                </li>
              </ul>

              <Button
                label="Fiche descriptive de l'offre (PDF)"
                variant="secondary"
                size="s"
                logo={FileText}
                className="app-offer-view-description"
              />
            </div>
          </div>
        )}

        <div className="app-offer-main-info">
          <div className="app-offer-main-info-logo">
            <Flame size={16} />
          </div>
          <p className="app-offer-main-info-text dyneff-p-s">
            <span className="app-offer-main-info-text__energy">
              Vous avez aussi le gaz ?
            </span>{" "}
            Ajoutez-le, on retrouve votre compteur avec les mêmes informations.
          </p>
        </div>
      </div>

      <div className="app-offer-info">
        <div className="app-offer-info-container">
          <div className="app-offer-info-container-title">
            <h2 className="app-offer-info-container-title__text">
              Votre choix
            </h2>
            <Zap size={16} color="#05688c" />
          </div>
          <p className="app-offer-info-container-description dyneff-p-s">
            Prix fixe 2 ans · Électricité
          </p>
          <span className="dyneff-price">106 €</span>
          <span className="dyneff-p-s"> / mois</span>
          <p className="dyneff-p-xs">soit 1 277 € TTC / an estimés</p>
          <Button
            className="app-offer-info-container-btn"
            label="Je choisis cette offre"
            size="m"
            logo={ArrowRight}
            logo_direction="right"
            disabled={selectedOffer === null}
          />
          <p className="app-offer-info-container-commitment dyneff-p-xs">
            Sans engagement · 14 j de rétractation
          </p>
        </div>

        <div className="app-offer-info-container">
          <h2 className="app-offer-info-container-title__text">
            Pas encore décidé ?
          </h2>

          <p className="app-offer-info-container-decided dyneff-p-xs">
            Recevez le récapitulatif et comparez tranquillement.
          </p>

          <Button
            label="Recevoir ce devis"
            size="m"
            logo={Mail}
            variant="secondary"
            className="app-offer-info-container-quote"
          />

          <p className="app-offer-info-container-compare dyneff-link dyneff-p-xs">
            Comparer les 3 offres en détail
          </p>
        </div>
      </div>
    </div>
  );
}
