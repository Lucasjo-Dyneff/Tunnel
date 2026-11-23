import { ExternalApiClient, ExternalApiError } from './external-api.client.js';
import { loadExternalApiConfig } from './external-api.config.js';

const env = (vars: Record<string, string>) => (key: string) => vars[key];

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('loadExternalApiConfig', () => {
  it('lit les variables <NOM>_API_* avec des valeurs par défaut', () => {
    const config = loadExternalApiConfig(
      'METEO',
      env({ METEO_API_URL: 'https://api.example.com/v1', METEO_API_KEY: 'k' }),
    );
    expect(config).toMatchObject({
      baseUrl: 'https://api.example.com/v1',
      apiKey: 'k',
      apiKeyHeader: 'x-api-key',
      timeoutMs: 10_000,
    });
  });

  it("échoue si l'URL est absente", () => {
    expect(() => loadExternalApiConfig('METEO', env({}))).toThrow(
      /METEO_API_\*/,
    );
  });

  it('refuse un USERNAME sans PASSWORD', () => {
    expect(() =>
      loadExternalApiConfig(
        'METEO',
        env({ METEO_API_URL: 'https://x.test', METEO_API_USERNAME: 'u' }),
      ),
    ).toThrow(/PASSWORD/);
  });

  it('refuse un nom invalide', () => {
    expect(() => loadExternalApiConfig('meteo', env({}))).toThrow(/invalide/);
  });
});

describe('ExternalApiClient', () => {
  it("construit l'URL en conservant le chemin de base et ajoute l'auth", async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse({ ok: true }));
    const client = new ExternalApiClient(
      'METEO',
      loadExternalApiConfig(
        'METEO',
        env({
          METEO_API_URL: 'https://api.example.com/v1',
          METEO_API_TOKEN: 'secret',
        }),
      ),
      fetchFn,
    );

    const data = await client.get('/forecast', {
      query: { city: 'Paris', days: 3, skip: undefined },
    });

    expect(data).toEqual({ ok: true });
    const [url, init] = fetchFn.mock.calls[0];
    expect(String(url)).toBe(
      'https://api.example.com/v1/forecast?city=Paris&days=3',
    );
    expect(init.headers.Authorization).toBe('Bearer secret');
  });

  it('lève ExternalApiError sur une réponse en erreur', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValue(new Response('nope', { status: 404 }));
    const client = new ExternalApiClient(
      'METEO',
      loadExternalApiConfig('METEO', env({ METEO_API_URL: 'https://x.test' })),
      fetchFn,
    );

    await expect(client.get('missing')).rejects.toBeInstanceOf(
      ExternalApiError,
    );
  });
});
