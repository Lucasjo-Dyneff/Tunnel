"use client";

import Pin from "@/component/pin/pin";
import {
  ArrowRight,
  Check,
  Flame,
  Gauge,
  MapPin,
  Phone,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import Card from "@/component/card/card";
import { ChangeEvent, useState } from "react";
import Input from "@/component/input/input";
import AddressSelect from "@/component/addressSelect/addressSelect";
import type { Address } from "@/component/addressSelect/address.types";
import Checkbox from "@/component/checkbox/checkbox";
import Button from "@/component/button/button";
import Bubble from "@/component/bubble/bubble";
import "./housing.scss";

export default function Housing() {
  const [rgbpd, setRgpd] = useState(false);

  // Adresse choisie dans la liste (null tant qu'aucune n'est sélectionnée)
  const [address, setAddress] = useState<Address | null>(null);

  const [typeName, setTypeName] = useState<"info" | "success" | "error">(
    "info",
  );
  const [typeLastName, setTypeLastName] = useState<
    "info" | "success" | "error"
  >("info");
  const [typePdl, setTypePdl] = useState<"info" | "success" | "error">("info");

  const [situation, setSituation] = useState<"change" | "movedIn" | null>(null);
  const [estimate, setEstimate] = useState<"address" | "meter" | null>(null);
  const [energy, setEnergy] = useState<"electricity" | "gas" | "dual" | null>(
    null,
  );

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    pdl: "",
  });

  const formatPdl = (raw: string) =>
    raw
      .replace(/\D/g, "")
      .slice(0, 14)
      .replace(/(\d{4})(?=\d)/g, "$1 ");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    const value =
      name === "pdl" ? formatPdl(event.target.value) : event.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "firstName")
      setTypeName(value.length > 0 ? "success" : "info");

    if (name === "lastName")
      setTypeLastName(value.length > 0 ? "success" : "info");

    if (name === "pdl")
      setTypePdl(value.replace(/\D/g, "").length === 14 ? "success" : "info");
  };

  return (
    <div className="app-housing">
      <div className="app-housing-main">
        <div className="app-housing-main-title">
          <div className="app-housing-main-title__content">
            <h1>Trouvons votre compteur</h1>
            <p className="dyneff-subtitle-l">
              30 secondes, sans avoir besoin de votre facture.
            </p>
            <Pin
              label="Données sécurisée"
              type="success"
              logo={ShieldCheck}
              className="app-housing-main-title__pin"
            />
          </div>
        </div>

        <div className="app-housing-main-step">
          <h2 className="app-housing-main-step-h2">Quelle énergie ?</h2>
          <p className="dyneff-p-xs app-housing-main-step-p">
            Vous pouvez souscrire aux deux en une seule démarche.
          </p>
          <div className="app-housing-main-step-container">
            <Card
              title="Électricité"
              subtitle="Compteur Linky"
              logo={Zap}
              active={energy === "electricity"}
              onClick={() => {
                energy === "electricity"
                  ? setEnergy(null)
                  : setEnergy("electricity");
              }}
            />
            <Card
              title="Gaz"
              subtitle="Compteur gaz"
              logo={Flame}
              active={energy === "gas"}
              onClick={() => {
                energy === "gas" ? setEnergy(null) : setEnergy("gas");
              }}
            />
            <Card
              title="Les deux"
              subtitle="Électricité + Gaz"
              logo={Sparkles}
              active={energy === "dual"}
              onClick={() => {
                energy === "dual" ? setEnergy(null) : setEnergy("dual");
              }}
            />
          </div>

          <h2 className="app-housing-main-step-h2">Votre situation</h2>
          <div className="app-housing-main-step-container">
            <Card
              title="Je change de fournisseur"
              subtitle="Sans coupure, sans déplacement"
              logo={RefreshCcw}
              active={situation === "change"}
              onClick={() => {
                situation === "change"
                  ? setSituation(null)
                  : setSituation("change");
              }}
            />
            <Card
              title="J'emménage"
              subtitle="Mise en service à votre date"
              logo={MapPin}
              active={situation === "movedIn"}
              onClick={() => {
                situation === "movedIn"
                  ? setSituation(null)
                  : setSituation("movedIn");
              }}
            />
          </div>

          <h2 className="app-housing-main-step-h2">
            Estimation de votre consommation
          </h2>
          <p className="dyneff-p-xs app-housing-main-step-p">
            Le compteur donne l'estimation la plus juste. L'adresse suffit pour
            démarrer.
          </p>
          <div className="app-housing-main-step-container">
            <Card
              title="Votre adresse"
              subtitle="On retrouve votre compteur"
              logo={MapPin}
              active={estimate === "address"}
              onClick={() => {
                estimate === "address"
                  ? setEstimate(null)
                  : setEstimate("address");
              }}
            />
            <Card
              title="Votre compteur"
              subtitle="J'ai mon numéro PDL/PRM"
              logo={Flame}
              active={estimate === "meter"}
              onClick={() => {
                estimate === "meter" ? setEstimate(null) : setEstimate("meter");
              }}
            />
          </div>
          {estimate === "address" ? (
            <AddressSelect
              label="Adresse du logement"
              size="m"
              placeholder="12 rue des Oliviers, 34000 Montpellier"
              value={address}
              onChange={setAddress}
            />
          ) : (
            estimate === "meter" && (
              <Input
                label="Numéro de compteur (PDL/PRM)"
                message="14 chiffres, indiqués sur votre facture ou votre compteur."
                logo={Gauge}
                size="m"
                type={typePdl}
                placeholder="1234 5678 9012 34"
                name="pdl"
                value={form.pdl}
                onChange={handleChange}
              />
            )
          )}

          {(estimate === "meter" || estimate === "address") && (
            <>
              <div className="app-housing-main-step-input">
                <Input
                  label="Prénom"
                  size="m"
                  type={typeName}
                  placeholder="Jean"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                />
                <Input
                  label="Nom"
                  size="m"
                  type={typeLastName}
                  placeholder="Martin"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="app-housing-main-step-rgbpd">
            <Checkbox
              className="app-housing-main-step-rgbpd__check"
              checked={rgbpd}
              onChange={setRgpd}
            />

            <p
              className="app-housing-main-step-rgbpd__btn dyneff-p-s"
              onClick={() => setRgpd(!rgbpd)}
            >
              J'autorise Dyneff à consulter auprès d'Enedis / GRDF les données
              de mon compteur (identifiant, puissance, consommation) pour
              établir ma simulation.{" "}
              <button
                type="button"
                className="app-housing-main-step-rgbpd__why"
                onClick={(event) => event.stopPropagation()}
              >
                Quelles données, pourquoi ?
              </button>
            </p>
          </div>
          <div className="app-housing-main-step-rgbpd-footer">
            <p className="app-housing-main-step-rgbpd-footer__question dyneff-p-s">
              Pas de compteur trouvé ? Estimer en 4 questions
            </p>
            <Button
              label="Voir mon prix"
              logo={ArrowRight}
              logo_direction="right"
              size="l"
              disabled={
                energy === null ||
                situation === null ||
                estimate === null ||
                (estimate === "address"
                  ? address === null
                  : typePdl !== "success") ||
                typeName !== "success" ||
                typeLastName !== "success" ||
                !rgbpd
              }
            />
          </div>
        </div>
      </div>

      <div className="app-housing-info">
        <div className="app-housing-info-global">
          <div className="app-housing-info-global-bloc">
            <div className="app-housing-info-global-bloc-title">
              <h2 className="app-housing-info-global-bloc-title__text">
                Votre simulation
              </h2>
              <Pin label="En cours" type="incoming" />
            </div>
            <div className="app-housing-info-global-bloc-element">
              <div className="app-housing-info-simulation">
                <div className="app-housing-info-simulation-logo">
                  <Zap size={14} />
                </div>
                <span className="app-housing-info-simulation__element dyneff-p-s">
                  Électricité
                </span>
              </div>

              <div className="app-housing-info-simulation">
                <div className="app-housing-info-simulation-logo">
                  <RefreshCcw size={14} />
                </div>
                <span className="app-housing-info-simulation__element dyneff-p-s">
                  Changement de fournisseur
                </span>
              </div>

              <div className="app-housing-info-simulation">
                <div className="app-housing-info-simulation-logo">
                  <MapPin size={14} />
                </div>
                <span className="app-housing-info-simulation__element dyneff-p-s">
                  Linky
                </span>
              </div>
            </div>
            <p className="app-housing-info-simulation__border dyneff-p-xs">
              Votre prix s'affiche à l'étape suivante, sans engagement.
            </p>
          </div>
        </div>

        <div className="app-housing-info-global">
          <div className="app-housing-info-global-bloc">
            <h2 className="app-housing-info-global-bloc-title__text">
              Changer, c'est simple
            </h2>
            <div className="app-housing-info-global-bloc-element">
              <ul className="app-housing-info-change">
                <li className="app-housing-info-change__li dyneff-p-xs">
                  <Check size={14} color="#0fa678" strokeWidth={3} />
                  Aucune coupure, aucun déplacement
                </li>
                <li className="app-housing-info-change__li dyneff-p-xs">
                  <Check size={14} color="#0fa678" />
                  Ancien contrat résilié automatiquement
                </li>
                <li className="app-housing-info-change__li dyneff-p-xs">
                  <Check size={14} color="#0fa678" />
                  14 jours pour changer d'avis
                </li>
                <li className="app-housing-info-change__li dyneff-p-xs">
                  <Check size={14} color="#0fa678" />
                  Prix garanti 30 jours après simulation
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Bubble
          className="app-housing-call"
          title="Besoin d'aide ?"
          type="info"
          logo={Phone}
        >
          <p className="dyneff-p-xs">
            Un conseiller vous rappelle gratuitement.
          </p>
          <Button
            className="app-housing-call__btn"
            label="Être rappelé"
            logo={Phone}
            variant="secondary"
            size="m"
          />
        </Bubble>
      </div>
    </div>
  );
}
