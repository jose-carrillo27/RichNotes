import { PrismaClient } from "@prisma/client";

// Deshabilita prepared statements para compatibilidad con
// PgBouncer en modo Transaction (Supabase connection pooler)
function makePrismaClient() {
  const url = process.env.DATABASE_URL ?? "";

  // Asegura que pgbouncer=true esté en la URL sin duplicar
  const separator = url.includes("?") ? "&" : "?";
  const safeUrl = url.includes("pgbouncer=true")
    ? url
    : `${url}${separator}pgbouncer=true&connection_limit=1`;

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: { url: safeUrl },
    },
  });
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma ?? makePrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
