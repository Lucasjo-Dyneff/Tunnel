import { NextResponse, type NextRequest } from "next/server";
import { apiFetch } from "@/lib/api";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import type { Address } from "@/component/addressSelect/address.types";

/**
 * Limites par visiteur pour la recherche d'adresse.
 * Un client qui tape son adresse (une recherche toutes les 250 ms au plus)
 * reste très en dessous ; un script en boucle est bloqué en quelques secondes.
 */
const RULES = [
  { limit: 15, windowMs: 10_000 }, // 15 recherches / 10 s : rafales
  { limit: 80, windowMs: 10 * 60_000 }, // 80 recherches / 10 min : boucles longues
];

/**
 * GET /api/addresses?q=...
 *
 * Relais côté serveur vers l'API NestJS (GET /addresses). Le navigateur
 * n'appelle jamais directement l'API Nest ni la Base Adresse Nationale.
 */
export async function GET(request: NextRequest) {
  const { limited, retryAfter } = rateLimit(
    `addresses:${getClientIp(request.headers)}`,
    RULES,
  );
  if (limited) {
    return NextResponse.json(
      { message: "Trop de recherches, patientez quelques secondes." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 3) return NextResponse.json([]);
  if (q.length > 200) {
    return NextResponse.json(
      { message: "Recherche trop longue" },
      { status: 400 },
    );
  }

  try {
    const addresses = await apiFetch<Address[]>(
      // 50 suggestions : le maximum que la Base Adresse Nationale renvoie
      `addresses?${new URLSearchParams({ q, limit: "50" })}`,
      { cache: "no-store" },
    );
    return NextResponse.json(addresses);
  } catch {
    return NextResponse.json(
      { message: "Recherche d'adresse indisponible" },
      { status: 502 },
    );
  }
}
