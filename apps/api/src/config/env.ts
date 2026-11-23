import { z } from 'zod';

/**
 * Variables d'environnement requises par l'API, validées au démarrage :
 * l'application refuse de démarrer si la configuration est invalide.
 *
 * Les variables des API externes (`<NOM>_API_*`) ne sont pas listées ici :
 * elles sont validées par ExternalApiModule.register('<NOM>').
 */
export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  API_PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.url(),
  CORS_ORIGINS: z
    .string()
    .default('')
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    throw new Error(
      `Configuration invalide (voir .env.example) :\n${z.prettifyError(result.error)}`,
    );
  }
  // On conserve les autres variables (API externes) accessibles via ConfigService.
  return { ...config, ...result.data };
}
