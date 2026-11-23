import { type DynamicModule, Inject, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExternalApiClient } from './external-api.client.js';
import { loadExternalApiConfig } from './external-api.config.js';

export const getExternalApiToken = (name: string) => `EXTERNAL_API_${name}`;

/** Injecte le client d'une API externe enregistrée : `@InjectExternalApi('METEO')`. */
export const InjectExternalApi = (name: string) =>
  Inject(getExternalApiToken(name));

/**
 * Enregistre un client pour une API externe dont la configuration est lue
 * dans les variables `<NOM>_API_*` (voir .env.example). La configuration est
 * validée au démarrage : une variable manquante empêche l'API de démarrer.
 *
 * @example
 * // meteo.module.ts
 * imports: [ExternalApiModule.register('METEO')]
 * // meteo.service.ts
 * constructor(@InjectExternalApi('METEO') private readonly meteo: ExternalApiClient) {}
 */
@Module({})
export class ExternalApiModule {
  static register(name: string): DynamicModule {
    const token = getExternalApiToken(name);
    return {
      module: ExternalApiModule,
      providers: [
        {
          provide: token,
          inject: [ConfigService],
          useFactory: (config: ConfigService) =>
            new ExternalApiClient(
              name,
              loadExternalApiConfig(name, (key) => config.get<string>(key)),
            ),
        },
      ],
      exports: [token],
    };
  }
}
