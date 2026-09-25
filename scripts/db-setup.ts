import { postgresUrl } from "../src/lib/db/config";
import { closePool } from "../src/lib/db/pool";
import { applySchemaFile, ensureSeed } from "../src/lib/db/shop-db";

if (!postgresUrl()) {
  console.error("Set POSTGRES_URL or POSTGRES_URL_NON_POOLING, then run this again.");
  process.exit(1);
}

await applySchemaFile();
await ensureSeed();
await closePool();
console.log("Shop tables are ready. Missing prices and stock were filled from the catalog.");
