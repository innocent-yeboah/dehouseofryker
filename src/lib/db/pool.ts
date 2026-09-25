import { Pool, type PoolClient } from "pg";
import { postgresUrl } from "@/lib/db/config";

let pool: Pool | null = null;

function needsSsl(url: string): boolean {
  return !/@(localhost|127\.0\.0\.1)(:|\/)/.test(url);
}

export function getPool(): Pool {
  const url = postgresUrl();
  if (!url) {
    throw new Error("Postgres URL is not set.");
  }
  if (!pool) {
    pool = new Pool({
      connectionString: url,
      max: 10,
      ssl: needsSsl(url) ? { rejectUnauthorized: false } : undefined,
    });
  }
  return pool;
}

export async function closePool(): Promise<void> {
  if (!pool) {
    return;
  }
  const current = pool;
  pool = null;
  await current.end();
}

export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // The connection is already unusable.
    }
    throw error;
  } finally {
    client.release();
  }
}
