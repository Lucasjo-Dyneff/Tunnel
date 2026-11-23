import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  sassOptions: {
    // Permet `@use "abstracts" as *;` depuis n'importe quel fichier .scss
    loadPaths: [path.join(import.meta.dirname, "src/styles")],
  },
};

export default nextConfig;
