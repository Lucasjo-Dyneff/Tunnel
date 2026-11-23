import { z } from 'zod';

const NAME_PATTERN = /^[A-Z][A-Z0-9_]*$/;

const optional = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined);

const schema = z
  .object({
    baseUrl: z.url(),
    token: optional,
    apiKey: optional,
    apiKeyHeader: optional.transform((value) => value ?? 'x-api-key'),
    username: optional,
    password: optional,
    timeoutMs: z.coerce.number().int().positive().default(10_000),
  })
  .refine((c) => (c.username === undefined) === (c.password === undefined), {
    message: 'USERNAME et PASSWORD doivent être définis ensemble',
  });

export type ExternalApiConfig = z.infer<typeof schema>;

/**
 * Lit la configuration d'une API externe depuis les variables
 * `<NOM>_API_URL`, `<NOM>_API_TOKEN`, `<NOM>_API_KEY`, `<NOM>_API_KEY_HEADER`,
 * `<NOM>_API_USERNAME`, `<NOM>_API_PASSWORD`, `<NOM>_API_TIMEOUT_MS`.
 */
export function loadExternalApiConfig(
  name: string,
  read: (key: string) => string | undefined,
): ExternalApiConfig {
  if (!NAME_PATTERN.test(name)) {
    throw new Error(
      `Nom d'API externe invalide "${name}" : utilisez des majuscules, chiffres et _ (ex : METEO).`,
    );
  }
  const key = (suffix: string) => `${name}_API_${suffix}`;
  const result = schema.safeParse({
    baseUrl: read(key('URL')),
    token: read(key('TOKEN')),
    apiKey: read(key('KEY')),
    apiKeyHeader: read(key('KEY_HEADER')),
    username: read(key('USERNAME')),
    password: read(key('PASSWORD')),
    timeoutMs: read(key('TIMEOUT_MS')),
  });
  if (!result.success) {
    throw new Error(
      `Configuration de l'API externe ${name} invalide (variables ${name}_API_*) :\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}
