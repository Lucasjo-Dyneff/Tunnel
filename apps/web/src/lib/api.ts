import "server-only";

/**
 * Client vers l'API NestJS, utilisable uniquement côté serveur
 * (Server Components, Route Handlers, Server Actions).
 *
 * Les API externes ne sont jamais appelées depuis le front : elles passent par
 * l'API NestJS, qui détient leurs URL et identifiants. Le navigateur ne voit
 * ainsi aucun secret.
 */
function apiUrl(): string {
  const url = process.env.API_URL;
  if (!url) {
    throw new Error("API_URL manquant (voir apps/web/.env.example).");
  }
  return url.endsWith("/") ? url : `${url}/`;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(new URL(path.replace(/^\/+/, ""), apiUrl()), {
    ...init,
    headers: { Accept: "application/json", ...init?.headers },
  });
  if (!response.ok) {
    throw new Error(`API ${response.status} sur ${path}`);
  }
  return response.json() as Promise<T>;
}
