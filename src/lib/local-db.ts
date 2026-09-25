import { randomBytes, randomInt } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { seedProducts } from "@/data/seed-catalog";
import type { Order, Product, Variant, WalkInSale } from "@/types/shop";

type StockRow = {
  stockOnHand: number;
  stockReserved: number;
};

type LocalState = {
  stock: Record<string, StockRow>;
  orders: Order[];
  walkIns: WalkInSale[];
  /** Owner price edits. Missing keys keep the catalog price. */
  prices: Record<string, number>;
};

/**
 * Project `.data` is writable in local dev and read-only on Vercel (EROFS).
 * Catalog GETs must not mkdir/write it: that 500s /shop and /product while the
 * prerendered homepage stays up. Mutations try the project directory, then
 * os.tmpdir(), and only after the in-memory state actually changes.
 */
const projectDir = path.join(process.cwd(), ".data");
const fallbackDir = path.join(tmpdir(), "dehouseofryker");
const stateFileName = "state.json";

/** Directory that last accepted a write in this process, if any. */
let preferredDir: string | null = null;

function stateFile(dir: string): string {
  return path.join(dir, stateFileName);
}

function uniqueDirs(dirs: Array<string | null>): string[] {
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const dir of dirs) {
    if (!dir || seen.has(dir)) {
      continue;
    }
    seen.add(dir);
    unique.push(dir);
  }
  return unique;
}

function isReadOnlyFs(error: unknown): boolean {
  const code = (error as NodeJS.ErrnoException).code;
  return code === "EROFS" || code === "EACCES" || code === "EPERM";
}

function isMissingFile(error: unknown): boolean {
  const code = (error as NodeJS.ErrnoException).code;
  return code === "ENOENT" || code === "ENOTDIR";
}

function defaultStock(): Record<string, StockRow> {
  const stock: Record<string, StockRow> = {};
  for (const product of seedProducts) {
    for (const variant of product.variants) {
      stock[String(variant.id)] = {
        stockOnHand: variant.stockOnHand,
        stockReserved: variant.stockReserved,
      };
    }
  }
  return stock;
}

function emptyState(): LocalState {
  return { stock: defaultStock(), orders: [], walkIns: [], prices: {} };
}

let writeQueue: Promise<void> = Promise.resolve();

async function readState(): Promise<LocalState> {
  for (const dir of uniqueDirs([preferredDir, projectDir, fallbackDir])) {
    try {
      const raw = await readFile(stateFile(dir), "utf8");
      const parsed = JSON.parse(raw) as LocalState;
      return {
        stock: { ...defaultStock(), ...parsed.stock },
        orders: parsed.orders ?? [],
        walkIns: parsed.walkIns ?? [],
        prices: parsed.prices ?? {},
      };
    } catch (error) {
      if (isMissingFile(error) || isReadOnlyFs(error) || error instanceof SyntaxError) {
        continue;
      }
      throw error;
    }
  }
  return emptyState();
}

async function writeState(state: LocalState): Promise<void> {
  let lastError: unknown;
  for (const dir of uniqueDirs([preferredDir, projectDir, fallbackDir])) {
    try {
      await mkdir(dir, { recursive: true });
      await writeFile(stateFile(dir), JSON.stringify(state, null, 2), "utf8");
      preferredDir = dir;
      return;
    } catch (error) {
      if (isReadOnlyFs(error)) {
        lastError = error;
        continue;
      }
      throw error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Could not persist shop state.");
}

export async function withState<T>(
  fn: (state: LocalState) => Promise<T> | T,
): Promise<T> {
  const run = writeQueue.then(async () => {
    const state = await readState();
    const before = JSON.stringify(state);
    const result = await fn(state);
    if (JSON.stringify(state) !== before) {
      await writeState(state);
    }
    return result;
  });
  writeQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export function applyStock(products: Product[], stock: Record<string, StockRow>): Product[] {
  return products.map((product) => ({
    ...product,
    variants: product.variants.map((variant) => {
      const row = stock[String(variant.id)];
      if (!row) {
        return variant;
      }
      return {
        ...variant,
        stockOnHand: row.stockOnHand,
        stockReserved: row.stockReserved,
      };
    }),
  }));
}

export function applyCommerce(products: Product[], state: Pick<LocalState, "stock" | "prices">): Product[] {
  return applyStock(products, state.stock).map((product) => ({
    ...product,
    variants: product.variants.map((variant) => {
      const price = state.prices[String(variant.id)];
      if (price === undefined || Number.isNaN(price)) {
        return variant;
      }
      return { ...variant, priceGhs: price };
    }),
  }));
}

export function findVariant(
  products: Product[],
  variantId: number,
): { product: Product; variant: Variant } | null {
  for (const product of products) {
    const variant = product.variants.find((item) => item.id === variantId);
    if (variant) {
      return { product, variant };
    }
  }
  return null;
}

export function newOrderCode(): string {
  // 12 characters from a 32-letter alphabet. Lookup is an exact match, so
  // orders already issued as DH- plus 4 characters still resolve.
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let body = "";
  for (let i = 0; i < 12; i += 1) {
    body += alphabet[randomInt(alphabet.length)];
  }
  return `DH-${body}`;
}

export function newViewToken(): string {
  return randomBytes(18).toString("hex");
}

export function newId(): string {
  return randomBytes(12).toString("hex");
}

export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("0")) {
    return `233${digits.slice(1)}`;
  }
  if (digits.length === 12 && digits.startsWith("233")) {
    return digits;
  }
  if (digits.length === 9) {
    return `233${digits}`;
  }
  return null;
}

export function phonesMatch(stored: string, input: string): boolean {
  const a = normalizePhone(stored);
  const b = normalizePhone(input);
  return Boolean(a && b && a === b);
}

export function maskMomo(msisdn: string): string {
  const digits = msisdn.replace(/\D/g, "");
  if (digits.length < 6) {
    return "•••";
  }
  return `${digits.slice(0, 3)}••••${digits.slice(-3)}`;
}
