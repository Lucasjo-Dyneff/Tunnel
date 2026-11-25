/** Adresse normalisée renvoyée par GET /addresses. */
export interface Address {
  /** Identifiant de la Base Adresse Nationale */
  id: string;
  /** Libellé complet à afficher, ex : « 8 Boulevard du Port 95000 Cergy » */
  label: string;
  /** Numéro + voie, ex : « 8 Boulevard du Port » */
  street: string;
  postcode: string;
  city: string;
  lat: number;
  lng: number;
}

/** Réponse GeoJSON de la Base Adresse Nationale. */
export interface BanResponse {
  features: {
    geometry: { coordinates: [number, number] };
    properties: {
      /** housenumber (numéro), street (voie), locality (lieu-dit), municipality (commune) */
      type: 'housenumber' | 'street' | 'locality' | 'municipality';
      id: string;
      label: string;
      name: string;
      postcode: string;
      city: string;
    };
  }[];
}
