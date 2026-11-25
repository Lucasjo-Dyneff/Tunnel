/** Adresse renvoyée par GET /api/addresses (même forme que l'API Nest). */
export interface Address {
  id: string;
  label: string;
  street: string;
  postcode: string;
  city: string;
  lat: number;
  lng: number;
}
