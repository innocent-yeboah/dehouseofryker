/**
 * The shop uses Postgres only when a server-side connection string is present.
 * The Vercel Supabase integration sets POSTGRES_URL and POSTGRES_URL_NON_POOLING.
 * Neither value is public, and the service-role key is never read in the browser.
 */

let warned = false;

export function postgresUrl(): string | null {
  const candidates = [
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.POSTGRES_URL,
    process.env.SUPABASE_DB_URL,
    process.env.DATABASE_URL,
  ];
  for (const candidate of candidates) {
    const url = candidate?.trim();
    if (url) {
      return url;
    }
  }
  return null;
}

export function usingDatabase(): boolean {
  return postgresUrl() !== null;
}

export function warnIfFileStore(): void {
  if (usingDatabase() || warned) {
    return;
  }
  warned = true;
  console.warn(
    "[dehouseofryker] No Postgres URL is set (POSTGRES_URL_NON_POOLING or POSTGRES_URL). Orders and stock are using the temporary file store and will not be shared across Vercel instances.",
  );
}
