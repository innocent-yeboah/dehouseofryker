import { randomBytes, randomInt } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
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
};

const dataDir = path.join(process.cwd(), ".data");
const statePath = path.join(dataDir, "state.json");

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
  return { stock: defaultStock(), orders: [], walkIns: [] };
}

let writeQueue: Promise<void> = Promise.resolve();

async function readState(): Promise<LocalState> {
  try {
    const raw = await readFile(statePath, "utf8");
    const parsed = JSON.parse(raw) as LocalState;
    return {
      stock: { ...defaultStock(), ...parsed.stock },
      orders: parsed.orders ?? [],
      walkIns: parsed.walkIns ?? [],
    };
  } catch {
    return emptyState();
  }
}

async function writeState(state: LocalState): Promise<void> {
  await mkdir(dataDir, { recursive: true });
  await writeFile(statePath, JSON.stringify(state, null, 2), "utf8");
}

export async function withState<T>(
  fn: (state: LocalState) => Promise<T> | T,
): Promise<T> {
  const run = writeQueue.then(async () => {
    const state = await readState();
    const result = await fn(state);
    await writeState(state);
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
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let body = "";
  for (let i = 0; i < 4; i += 1) {
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
