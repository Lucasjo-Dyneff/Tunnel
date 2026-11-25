import { describe, expect, it, vi } from 'vitest';
import type { ExternalApiClient } from '../external-api/index.js';
import { AddressService } from './address.service.js';

const feature = (
  type: string,
  id: string,
  name: string,
  label: string,
  postcode = '34000',
  city = 'Montpellier',
) => ({
  geometry: { coordinates: [3.87, 43.61] },
  properties: { type, id, name, label, postcode, city },
});

function makeService(features: unknown[]) {
  const ban = { get: vi.fn().mockResolvedValue({ features }) };
  return {
    ban,
    service: new AddressService(ban as unknown as ExternalApiClient),
  };
}

describe('AddressService', () => {
  it('normalise les adresses de la Base Adresse Nationale', async () => {
    const { service } = makeService([
      feature(
        'housenumber',
        '34172_1234_00012',
        '12 Rue des Oliviers',
        '12 Rue des Oliviers 34000 Montpellier',
      ),
    ]);

    expect(await service.search('12 rue des oliviers')).toEqual([
      {
        id: '34172_1234_00012',
        label: '12 Rue des Oliviers 34000 Montpellier',
        street: '12 Rue des Oliviers',
        postcode: '34000',
        city: 'Montpellier',
        lat: 43.61,
        lng: 3.87,
      },
    ]);
  });

  it('garde les rues sans numéro et les lieux-dits, mais pas les communes seules', async () => {
    const { service } = makeService([
      feature('municipality', '34172', 'Montpellier', 'Montpellier'),
      feature(
        'street',
        '34172_1234',
        'Rue des Oliviers',
        'Rue des Oliviers 34000 Montpellier',
      ),
      feature(
        'locality',
        '34172_B001',
        'La Bastide',
        'La Bastide 34000 Montpellier',
      ),
    ]);

    const results = await service.search('oliviers montpellier');

    expect(results.map((a) => a.street)).toEqual([
      'Rue des Oliviers',
      'La Bastide',
    ]);
  });

  it('demande quelques résultats en plus mais renvoie au plus `limit`', async () => {
    const { ban, service } = makeService(
      Array.from({ length: 8 }, (_, i) =>
        feature('street', `id-${i}`, `Rue ${i}`, `Rue ${i} 34000 Montpellier`),
      ),
    );

    const results = await service.search('rue', 5);

    expect(ban.get).toHaveBeenCalledWith('search/', {
      query: { q: 'rue', limit: 8, autocomplete: 1 },
    });
    expect(results).toHaveLength(5);
  });

  it('ne demande jamais plus de 50 résultats (maximum de la BAN)', async () => {
    const { ban, service } = makeService([]);

    await service.search('rue', 50);

    expect(ban.get).toHaveBeenCalledWith('search/', {
      query: { q: 'rue', limit: 50, autocomplete: 1 },
    });
  });
});
