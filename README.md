# Tunnel

Monorepo **Turborepo + pnpm** :

| Dossier             | Contenu                                                  | Port |
| ------------------- | -------------------------------------------------------- | ---- |
| `apps/web`          | Next.js 16 (App Router, SCSS)                            | 3000 |
| `apps/api`          | NestJS 12 (config validée par zod, Prisma, API externes) | 3001 |
| `packages/database` | Schéma Prisma 7 + client partagé (`@tunnel/database`)    | —    |

PostgreSQL tourne via Docker (`docker-compose.yml`). Il n'y a pas d'authentification.

## Prérequis

- Node.js ≥ 24, pnpm 12 (`corepack enable`)
- Docker

## Démarrage

```bash
pnpm install
cp .env.example .env                       # Postgres, Prisma, API
cp apps/web/.env.example apps/web/.env.local
pnpm db:up                                 # lance PostgreSQL
pnpm db:migrate                            # applique le schéma
pnpm dev                                   # web + api en parallèle
```

Vérification : `curl http://localhost:3001/health` → `{"status":"ok","database":"up"}`

## Scripts (racine)

| Script             | Rôle                                       |
| ------------------ | ------------------------------------------ |
| `pnpm dev`         | Lance toutes les apps en mode watch        |
| `pnpm build`       | Build (génère le client Prisma au passage) |
| `pnpm lint`        | Lint (ESLint pour web, oxlint pour api)    |
| `pnpm check-types` | Vérification TypeScript                    |
| `pnpm test`        | Tests unitaires                            |
| `pnpm db:up/down`  | Démarre / arrête PostgreSQL                |
| `pnpm db:migrate`  | Crée et applique une migration (dev)       |
| `pnpm db:deploy`   | Applique les migrations (prod / CI)        |
| `pnpm db:studio`   | Prisma Studio                              |

## Base de données

Le schéma est dans `packages/database/prisma/schema.prisma`, sans modèle pour le moment.
Ajoutez vos modèles puis lancez `pnpm db:migrate`. Dans l'API, `PrismaService`
s'injecte partout (module global) :

```ts
constructor(private readonly prisma: PrismaService) {}
```

## Styles (SCSS)

```
apps/web/src/styles/
├── globals.scss          # reset + thème (custom properties, mode sombre), importé par layout.tsx
└── abstracts/            # outils Sass sans sortie CSS
    ├── _variables.scss   # breakpoints, espacements, typo
    └── _mixins.scss      # up($bp), container
```

Les styles de composants sont des CSS Modules (`*.module.scss`) placés à côté du composant.
Le dossier `src/styles` est dans les `loadPaths` Sass (`next.config.ts`), donc depuis
n'importe quel fichier :

```scss
@use "abstracts" as *;

.card {
  padding: $space-md;
  @include up(md) {
    padding: $space-lg;
  }
}
```

## Configuration et API externes

Aucune URL ni aucun identifiant n'est codé en dur : tout passe par les variables
d'environnement, validées au démarrage. Une configuration invalide empêche l'API de démarrer.

- `.env` (racine) : lu par docker compose, Prisma et l'API. En production, les
  variables d'environnement réelles sont prioritaires.
- `apps/web/.env.local` : `API_URL`, lue **uniquement côté serveur**.

Les API externes sont appelées **par l'API NestJS uniquement** : leurs secrets ne
sont jamais envoyés au navigateur. Le front passe par `apiFetch()` (`apps/web/src/lib/api.ts`).

Pour ajouter une API externe, par exemple `METEO` :

1. Déclarez-la dans `.env` (et documentez les clés, sans valeurs, dans `.env.example`) :

   ```env
   METEO_API_URL=https://api.example.com/v1
   METEO_API_KEY=xxxxxxxx          # ou METEO_API_TOKEN (Bearer), ou USERNAME/PASSWORD (Basic)
   ```

2. Enregistrez-la dans un module et injectez le client :

   ```ts
   @Module({
     imports: [ExternalApiModule.register("METEO")],
     providers: [MeteoService],
   })
   export class MeteoModule {}

   @Injectable()
   export class MeteoService {
     constructor(
       @InjectExternalApi("METEO") private readonly api: ExternalApiClient,
     ) {}

     forecast(city: string) {
       return this.api.get<Forecast>("forecast", { query: { city } });
     }
   }
   ```

Variables reconnues pour `<NOM>` : `<NOM>_API_URL` (obligatoire), `_TOKEN`, `_KEY`,
`_KEY_HEADER` (défaut `x-api-key`), `_USERNAME`, `_PASSWORD`, `_TIMEOUT_MS` (défaut 10000).
Une réponse HTTP en erreur lève une `ExternalApiError` (statut, URL, corps de la réponse).
