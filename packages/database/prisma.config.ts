import path from "node:path";
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Le .env unique du monorepo est à la racine. Les variables déjà présentes
// dans l'environnement (CI, production) restent prioritaires.
config({ path: path.resolve(import.meta.dirname, "../../.env"), quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // `process.env` plutôt que `env()` : `prisma generate` (lancé par le build)
  // n'a pas besoin de la base et doit fonctionner sans DATABASE_URL (CI).
  // Les commandes migrate/studio échouent explicitement si elle est absente.
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
