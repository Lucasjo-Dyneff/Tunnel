import { Injectable } from '@nestjs/common';
import {
  type ExternalApiClient,
  InjectExternalApi,
} from '../external-api/index.js';
import type { Address, BanResponse } from './address.types.js';

export const ADDRESS_FR = 'ADDRESS_FR';

/**
 * Recherche d'adresses (autocomplétion) en France,
 * via la Base Adresse Nationale → ADDRESS_FR_API_URL.
 */
@Injectable()
export class AddressService {
  constructor(
    @InjectExternalApi(ADDRESS_FR) private readonly ban: ExternalApiClient,
  ) {}

  async search(query: string, limit = 5): Promise<Address[]> {
    const data = await this.ban.get<BanResponse>('search/', {
      // Pas de filtre `type` côté BAN : il exclurait les rues sans numéro,
      // les chemins et les lieux-dits. On demande un peu plus de résultats
      // pour compenser les communes retirées ci-dessous.
      // (plafonné à 50, le maximum accepté par la BAN)
      query: { q: query, limit: Math.min(limit + 3, 50), autocomplete: 1 },
    });

    return (
      data.features
        // Une commune seule (« Montpellier ») n'est pas une adresse de logement
        .filter(({ properties }) => properties.type !== 'municipality')
        .slice(0, limit)
        .map(({ geometry, properties }) => ({
          id: properties.id,
          label: properties.label,
          street: properties.name,
          postcode: properties.postcode,
          city: properties.city,
          lng: geometry.coordinates[0],
          lat: geometry.coordinates[1],
        }))
    );
  }
}
