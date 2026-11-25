"use client";

import { KeyboardEvent, useEffect, useId, useState } from "react";
import { Check, CircleAlert, Info, Loader2, MapPin } from "lucide-react";
import type { Address } from "./address.types";
import "../input/input.scss";
import "./addressSelect.scss";

const MIN_CHARS = 3;
const DEBOUNCE_MS = 250;

/** Résultat d'une recherche, rattaché à la saisie qui l'a produit */
type Search = {
  query: string;
  results: Address[];
  /** Message d'erreur à afficher sous le champ (null si la recherche a réussi) */
  error: string | null;
};

/**
 * Champ d'adresse avec autocomplétion (adresses de France).
 * La recherche passe par /api/addresses → API Nest → Base Adresse Nationale.
 *
 * Composant contrôlé : le parent garde l'adresse choisie (`value`) et la
 * reçoit via `onChange` (null tant qu'aucune adresse n'est sélectionnée).
 */
export default function AddressSelect({
  label,
  value,
  onChange,
  placeholder,
  size = "m",
  message,
}: {
  label: string;
  value: Address | null;
  onChange: (address: Address | null) => void;
  placeholder?: string;
  size?: "s" | "m" | "l" | "xl";
  message?: string;
}) {
  const id = useId();
  const listId = `${id}-list`;

  const [query, setQuery] = useState(value?.label ?? "");
  const [search, setSearch] = useState<Search | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const q = query.trim();
  // On ne cherche que si l'adresse n'est pas encore choisie et assez longue
  const searchable = !value && q.length >= MIN_CHARS;

  // Valeurs dérivées : rien à stocker ni à remettre à zéro dans l'effet
  const current = searchable && search?.query === q ? search : null;
  const results = current?.results ?? [];
  const error = current?.error ?? null;
  const failed = error !== null;
  const loading = searchable && !current;

  // Recherche après un court délai sans frappe ; la requête précédente est annulée
  useEffect(() => {
    if (!searchable) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/addresses?${new URLSearchParams({ q })}`,
          { signal: controller.signal },
        );
        if (response.status === 429) {
          // Trop de recherches : limite anti-abus atteinte
          setSearch({
            query: q,
            results: [],
            error: "Trop de recherches, patientez quelques secondes.",
          });
        } else if (!response.ok) {
          throw new Error(String(response.status));
        } else {
          setSearch({ query: q, results: await response.json(), error: null });
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setSearch({
          query: q,
          results: [],
          error: "Recherche indisponible pour le moment, réessayez.",
        });
      }
      setActiveIndex(-1);
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q, searchable]);

  const select = (address: Address) => {
    setQuery(address.label);
    setOpen(false);
    onChange(address);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      select(results[activeIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const type = failed ? "error" : value ? "success" : "info";
  const hint = error ?? message;
  const showList = open && searchable;

  return (
    <div className="extranet-input extranet-address">
      <label htmlFor={id} className="extranet-input-label">
        {label}
      </label>

      <div className={`extranet-input-wrapper extranet-input-wrapper-${size}`}>
        <input
          id={id}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls={listId}
          aria-activedescendant={
            activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined
          }
          // Désactive les suggestions du navigateur (adresses enregistrées,
          // historique) qui recouvriraient notre liste :
          // - Chrome ignore "off" sur les champs qu'il reconnaît comme une
          //   adresse, mais n'auto-remplit pas un jeton qu'il ne connaît pas
          // - name neutre : ne contient pas « address », que Chrome repère
          autoComplete="dyneff-address-search"
          name={`search-${id}`}
          // Gestionnaires de mots de passe (1Password, LastPass, Bitwarden)
          data-1p-ignore
          data-lpignore="true"
          data-bwignore
          data-form-type="other"
          spellCheck={false}
          value={query}
          placeholder={placeholder}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActiveIndex(-1);
            // L'adresse est modifiée à la main : plus de sélection valide
            if (value) onChange(null);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={handleKeyDown}
          className={`extranet-input-wrapper-field extranet-input-wrapper-field-${type} extranet-input-wrapper-field-padding-${size} extranet-input-wrapper-field-${size}`}
        />

        {type === "success" && (
          <span className="extranet-input-logSuccess" aria-hidden>
            <Check size="72%" />
          </span>
        )}

        {loading && (
          <span className="extranet-address-loader" aria-hidden>
            <Loader2 size={18} />
          </span>
        )}

        <div className={`extranet-input-logo extranet-input-logo-${size}`}>
          <MapPin size={size === "s" ? 18 : size === "xl" ? 24 : 20} />
        </div>

        {showList && (
          <ul id={listId} role="listbox" className="extranet-address-list">
            {results.map((address, index) => (
              <li
                key={address.id}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                className={`extranet-address-option${index === activeIndex ? " extranet-address-option__active" : ""}`}
                // mousedown (et pas click) : se déclenche avant le blur du champ
                onMouseDown={(event) => {
                  event.preventDefault();
                  select(address);
                }}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <MapPin size={16} className="extranet-address-option__icon" />
                <span className="extranet-address-option__text">
                  <span className="extranet-address-option__street">
                    {address.street}
                  </span>
                  <span className="extranet-address-option__city">
                    {address.postcode} {address.city}
                  </span>
                </span>
              </li>
            ))}

            {loading && results.length === 0 && (
              <li className="extranet-address-empty">Recherche…</li>
            )}

            {!loading && !failed && results.length === 0 && (
              <li className="extranet-address-empty">Aucune adresse trouvée</li>
            )}

            {/* Une même rue existe dans des centaines de communes : seules les
                plus pertinentes sont listées, d'où l'astuce pour affiner */}
            {results.length > 0 && (
              <li className="extranet-address-hint" aria-hidden>
                Votre ville n&apos;apparaît pas ? Ajoutez le code postal ou la
                commune.
              </li>
            )}
          </ul>
        )}
      </div>

      {hint && (
        <p
          className={`extranet-input-message extranet-input-message-${type} extranet-input-message-${size}`}
        >
          {failed ? <CircleAlert size="1em" /> : <Info size="1em" />}
          {hint}
        </p>
      )}
    </div>
  );
}
