import "server-only";

/**
 * Limiteur de requêtes par visiteur (fenêtres glissantes, en mémoire).
 *
 * Limites de cette version :
 * - Les compteurs vivent dans la mémoire du serveur Next : ils repartent à
 *   zéro au redémarrage et ne sont pas partagés entre plusieurs instances.
 *   Avec plusieurs instances en production, il faudra un stockage partagé
 *   (Redis…) ou la limitation de l'hébergeur / du reverse proxy.
 * - Le visiteur est identifié par son IP (voir `getClientIp`).
 */

export interface RateLimitRule {
  /** Nombre maximum de requêtes… */
  limit: number;
  /** …sur cette durée glissante (ms) */
  windowMs: number;
}

export interface RateLimitResult {
  limited: boolean;
  /** Secondes à attendre avant de réessayer (si limité) */
  retryAfter: number;
}

// Horodatages des requêtes acceptées, par clé (« route:ip »)
const hits = new Map<string, number[]>();
let lastSweep = Date.now();
const SWEEP_EVERY_MS = 60_000;

export function rateLimit(
  key: string,
  rules: RateLimitRule[],
  now = Date.now(),
): RateLimitResult {
  sweep(rules, now);

  const longest = Math.max(...rules.map((rule) => rule.windowMs));
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < longest);

  // La règle la plus contraignante décide du temps d'attente
  let retryAfterMs = 0;
  for (const { limit, windowMs } of rules) {
    const inWindow = timestamps.filter((t) => now - t < windowMs);
    if (inWindow.length >= limit) {
      // On redevient autorisé quand la plus ancienne requête sort de la fenêtre
      const oldest = inWindow[inWindow.length - limit];
      retryAfterMs = Math.max(retryAfterMs, oldest + windowMs - now);
    }
  }

  if (retryAfterMs > 0) {
    hits.set(key, timestamps);
    return { limited: true, retryAfter: Math.ceil(retryAfterMs / 1000) };
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return { limited: false, retryAfter: 0 };
}

/** Retire régulièrement les visiteurs inactifs pour ne pas saturer la mémoire */
function sweep(rules: RateLimitRule[], now: number) {
  if (now - lastSweep < SWEEP_EVERY_MS) return;
  lastSweep = now;
  const longest = Math.max(...rules.map((rule) => rule.windowMs));
  for (const [key, timestamps] of hits) {
    if (timestamps.every((t) => now - t >= longest)) hits.delete(key);
  }
}

/**
 * IP du visiteur, transmise par le reverse proxy / l'hébergeur.
 *
 * ⚠️ En production, le reverse proxy (nginx, hébergeur…) doit ÉCRASER ces
 * en-têtes avec la vraie IP : s'il les laisse passer tels quels, un script
 * pourrait envoyer une fausse IP à chaque requête et contourner la limite.
 * La limite globale de l'API Nest reste alors le dernier rempart.
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

/** Réservé aux tests : remet les compteurs à zéro */
export function resetRateLimit() {
  hits.clear();
}
