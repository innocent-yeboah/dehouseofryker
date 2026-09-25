import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import type { PoolClient } from "pg";
import { seedProducts } from "@/data/seed-catalog";
import { shelfQty } from "@/lib/availability";
import { findVariant, newId, newOrderCode, newViewToken, phonesMatch } from "@/lib/local-db";
import { postgresUrl } from "@/lib/db/config";
import { withTransaction } from "@/lib/db/pool";
import { reserveLine, ShopError } from "@/lib/reserve";
import { variantSizeLabel } from "@/lib/money";
import type {
  CartLine,
  Fulfillment,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  StockMovement,
  StockMovementKind,
} from "@/types/shop";
import type { OwnerAction } from "@/types/shop";

type StockSnapshot = {
  variantId: number;
  priceGhs: number;
  stockOnHand: number;
  stockReserved: number;
};

function money(value: unknown): number {
  const amount = typeof value === "number" ? value : Number(value);
  return Math.round(amount * 100) / 100;
}

function iso(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return new Date(String(value)).toISOString();
}

function mapItem(row: {
  variant_id: number;
  product_name: string;
  sku: string;
  size_label: string;
  qty: number;
  unit_price_ghs: unknown;
  availability_snapshot: "on_shelf" | "blend";
}): OrderItem {
  return {
    variantId: row.variant_id,
    productName: row.product_name,
    sku: row.sku,
    sizeLabel: row.size_label,
    qty: row.qty,
    unitPriceGhs: money(row.unit_price_ghs),
    availabilitySnapshot: row.availability_snapshot,
  };
}

function mapOrder(row: Record<string, unknown>, items: OrderItem[]): Order {
  return {
    id: String(row.id),
    code: String(row.code),
    viewToken: String(row.view_token),
    customerName: String(row.customer_name),
    phone: String(row.phone),
    email: row.email ? String(row.email) : null,
    fulfillment: row.fulfillment as Fulfillment,
    deliveryAddress: row.delivery_address ? String(row.delivery_address) : null,
    payment: row.payment as PaymentMethod,
    status: row.status as OrderStatus,
    goodsTotalGhs: money(row.goods_total_ghs),
    deliveryFeeGhs: row.delivery_fee_ghs === null || row.delivery_fee_ghs === undefined ? null : money(row.delivery_fee_ghs),
    deliveryAgreedAt: row.delivery_agreed_at ? iso(row.delivery_agreed_at) : null,
    momoRef: row.momo_ref ? String(row.momo_ref) : null,
    momoNumberMasked: row.momo_number_masked ? String(row.momo_number_masked) : null,
    momoRequestId: row.momo_request_id ? String(row.momo_request_id) : null,
    items,
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
    notes: row.notes ? String(row.notes) : null,
  };
}

async function itemsFor(client: PoolClient, orderId: string): Promise<OrderItem[]> {
  const result = await client.query(
    `select variant_id, product_name, sku, size_label, qty, unit_price_ghs, availability_snapshot
     from order_items where order_id = $1 order by id`,
    [orderId],
  );
  return result.rows.map((row) => mapItem(row));
}

async function orderById(client: PoolClient, id: string): Promise<Order | null> {
  const result = await client.query(`select * from orders where id = $1`, [id]);
  const row = result.rows[0] as Record<string, unknown> | undefined;
  if (!row) {
    return null;
  }
  return mapOrder(row, await itemsFor(client, id));
}

async function orderByCode(client: PoolClient, code: string): Promise<Order | null> {
  const result = await client.query(`select * from orders where code = $1`, [code.trim().toUpperCase()]);
  const row = result.rows[0] as Record<string, unknown> | undefined;
  if (!row) {
    return null;
  }
  return mapOrder(row, await itemsFor(client, String(row.id)));
}

let seedPromise: Promise<void> | null = null;

export function resetSeedState(): void {
  seedPromise = null;
}

export async function ensureSeed(): Promise<void> {
  if (!seedPromise) {
    seedPromise = seedCatalog().catch((error: unknown) => {
      seedPromise = null;
      throw error;
    });
  }
  await seedPromise;
}

async function seedCatalog(): Promise<void> {
  const rows = seedProducts.flatMap((product) =>
    product.variants.map((variant) => [variant.id, variant.priceGhs, variant.stockOnHand]),
  );
  if (rows.length === 0) {
    return;
  }
  const values: Array<number> = [];
  const placeholders = rows.map((row, index) => {
    const base = index * 3;
    values.push(row[0], row[1], row[2]);
    return `($${base + 1}, $${base + 2}, $${base + 3}, 0)`;
  });
  await withTransaction(async (client) => {
    await client.query(
      `insert into variant_stock (variant_id, price_ghs, stock_on_hand, stock_reserved)
       values ${placeholders.join(", ")}
       on conflict (variant_id) do nothing`,
      values,
    );
  });
}

export async function loadVariantRows(): Promise<StockSnapshot[]> {
  await ensureSeed();
  return withTransaction(async (client) => {
    const result = await client.query(
      `select variant_id, price_ghs, stock_on_hand, stock_reserved from variant_stock order by variant_id`,
    );
    return result.rows.map((row) => ({
      variantId: Number(row.variant_id),
      priceGhs: money(row.price_ghs),
      stockOnHand: Number(row.stock_on_hand),
      stockReserved: Number(row.stock_reserved),
    }));
  });
}

async function recordMovement(
  client: PoolClient,
  input: {
    variantId: number;
    kind: StockMovementKind;
    qtyDelta: number;
    reservedDelta?: number;
    priceGhs?: number | null;
    note?: string | null;
    orderId?: string | null;
  },
): Promise<void> {
  await client.query(
    `insert into stock_movements (variant_id, kind, qty_delta, reserved_delta, price_ghs, note, order_id)
     values ($1, $2, $3, $4, $5, $6, $7)`,
    [
      input.variantId,
      input.kind,
      input.qtyDelta,
      input.reservedDelta ?? 0,
      input.priceGhs ?? null,
      input.note ?? null,
      input.orderId ?? null,
    ],
  );
}

export async function createOrderDb(input: {
  customerName: string;
  phone: string;
  email: string | null;
  fulfillment: Fulfillment;
  deliveryAddress: string | null;
  payment: PaymentMethod;
  lines: CartLine[];
  momoRef?: string | null;
  momoNumberMasked?: string | null;
}): Promise<Order> {
  await ensureSeed();
  return withTransaction(async (client) => {
    const ids = [...new Set(input.lines.map((line) => line.variantId))].sort((a, b) => a - b);
    const locked = await client.query(
      `select variant_id, price_ghs, stock_on_hand, stock_reserved
       from variant_stock
       where variant_id = any($1::int[])
       order by variant_id
       for update`,
      [ids],
    );
    const stock = new Map<number, { priceGhs: number; stockOnHand: number; stockReserved: number }>();
    for (const row of locked.rows) {
      stock.set(Number(row.variant_id), {
        priceGhs: money(row.price_ghs),
        stockOnHand: Number(row.stock_on_hand),
        stockReserved: Number(row.stock_reserved),
      });
    }

    const items: OrderItem[] = [];
    let goodsTotalGhs = 0;
    for (const line of input.lines) {
      const found = findVariant(seedProducts, line.variantId);
      const row = stock.get(line.variantId);
      if (!found || !row || line.qty < 1) {
        throw new ShopError("A cart item is no longer available.");
      }
      const { product, variant } = found;
      if (line.qty > variant.maxRetailQty) {
        throw new ShopError(
          `${product.displayName} is limited to ${variant.maxRetailQty} per order. For more, WhatsApp the house.`,
        );
      }
      const snapshot = reserveLine(row, line.qty, variant.blendWhenZero);
      const unit = row.priceGhs;
      goodsTotalGhs += unit * line.qty;
      items.push({
        variantId: variant.id,
        productName: product.displayName,
        sku: variant.sku,
        sizeLabel: variantSizeLabel(variant),
        qty: line.qty,
        unitPriceGhs: unit,
        availabilitySnapshot: snapshot,
      });
    }

    for (const [variantId, row] of stock) {
      await client.query(
        `update variant_stock
         set stock_reserved = $2, updated_at = now()
         where variant_id = $1`,
        [variantId, row.stockReserved],
      );
    }

    const status: OrderStatus = input.payment === "cash_pickup" ? "reserved_pay_at_shop" : "awaiting_momo";
    const now = new Date().toISOString();
    const order: Order = {
      id: newId(),
      code: newOrderCode(),
      viewToken: newViewToken(),
      customerName: input.customerName.trim(),
      phone: input.phone,
      email: input.email,
      fulfillment: input.fulfillment,
      deliveryAddress: input.deliveryAddress,
      payment: input.payment,
      status,
      goodsTotalGhs,
      deliveryFeeGhs: null,
      deliveryAgreedAt: null,
      momoRef: input.momoRef ?? null,
      momoNumberMasked: input.momoNumberMasked ?? null,
      items,
      createdAt: now,
      updatedAt: now,
      notes: null,
    };

    await client.query(
      `insert into orders (
        id, code, view_token, customer_name, phone, email, fulfillment, delivery_address,
        payment, status, goods_total_ghs, delivery_fee_ghs, delivery_agreed_at, momo_ref,
        momo_number_masked, momo_request_id, notes, created_at, updated_at
      ) values (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19
      )`,
      [
        order.id,
        order.code,
        order.viewToken,
        order.customerName,
        order.phone,
        order.email,
        order.fulfillment,
        order.deliveryAddress,
        order.payment,
        order.status,
        order.goodsTotalGhs,
        order.deliveryFeeGhs,
        order.deliveryAgreedAt,
        order.momoRef,
        order.momoNumberMasked,
        null,
        order.notes,
        order.createdAt,
        order.updatedAt,
      ],
    );
    for (const item of items) {
      await client.query(
        `insert into order_items (
          order_id, variant_id, product_name, sku, size_label, qty, unit_price_ghs, availability_snapshot
        ) values ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          order.id,
          item.variantId,
          item.productName,
          item.sku,
          item.sizeLabel,
          item.qty,
          item.unitPriceGhs,
          item.availabilitySnapshot,
        ],
      );
      if (item.availabilitySnapshot === "on_shelf") {
        await recordMovement(client, {
          variantId: item.variantId,
          kind: "reservation",
          qtyDelta: 0,
          reservedDelta: item.qty,
          orderId: order.id,
          note: order.code,
        });
      }
    }
    return order;
  });
}

export async function getOrderByIdDb(id: string): Promise<Order | null> {
  await ensureSeed();
  return withTransaction((client) => orderById(client, id));
}

export async function getOrderByCodeAndTokenDb(code: string, token: string): Promise<Order | null> {
  await ensureSeed();
  return withTransaction(async (client) => {
    const order = await orderByCode(client, code);
    if (!order || order.viewToken !== token) {
      return null;
    }
    return order;
  });
}

export async function findOrderDb(phone: string, code: string): Promise<Order | null> {
  await ensureSeed();
  return withTransaction(async (client) => {
    const order = await orderByCode(client, code);
    if (!order || !phonesMatch(order.phone, phone)) {
      return null;
    }
    return order;
  });
}

export async function listOrdersDb(): Promise<Order[]> {
  await ensureSeed();
  return withTransaction(async (client) => {
    const result = await client.query(`select id from orders order by created_at desc`);
    const orders: Order[] = [];
    for (const row of result.rows) {
      const order = await orderById(client, String(row.id));
      if (order) {
        orders.push(order);
      }
    }
    return orders;
  });
}

async function lockVariants(client: PoolClient, variantIds: number[]): Promise<Map<number, StockSnapshot>> {
  const ids = [...new Set(variantIds)].sort((a, b) => a - b);
  const locked = await client.query(
    `select variant_id, price_ghs, stock_on_hand, stock_reserved
     from variant_stock
     where variant_id = any($1::int[])
     order by variant_id
     for update`,
    [ids],
  );
  const stock = new Map<number, StockSnapshot>();
  for (const row of locked.rows) {
    stock.set(Number(row.variant_id), {
      variantId: Number(row.variant_id),
      priceGhs: money(row.price_ghs),
      stockOnHand: Number(row.stock_on_hand),
      stockReserved: Number(row.stock_reserved),
    });
  }
  return stock;
}

async function writeStock(client: PoolClient, row: StockSnapshot): Promise<void> {
  await client.query(
    `update variant_stock
     set stock_on_hand = $2, stock_reserved = $3, updated_at = now()
     where variant_id = $1`,
    [row.variantId, row.stockOnHand, row.stockReserved],
  );
}

function shelfItems(order: Order): OrderItem[] {
  return order.items.filter((item) => item.availabilitySnapshot === "on_shelf");
}

export async function applyOwnerActionDb(
  orderId: string,
  action: OwnerAction,
  extra?: { deliveryFeeGhs?: number | null },
): Promise<Order> {
  await ensureSeed();
  return withTransaction(async (client) => {
    const existing = await client.query(`select id from orders where id = $1 for update`, [orderId]);
    if (!existing.rows[0]) {
      throw new ShopError("Order not found.", 404);
    }
    const order = await orderById(client, orderId);
    if (!order) {
      throw new ShopError("Order not found.", 404);
    }
    const now = new Date().toISOString();
    const stock = await lockVariants(
      client,
      shelfItems(order).map((item) => item.variantId),
    );

    if (action === "confirm_merchant") {
      if (order.status !== "awaiting_momo") {
        throw new ShopError("This order is not waiting for a merchant payment.");
      }
      order.status = order.fulfillment === "delivery" ? "paid_waiting_delivery_agree" : "paid_awaiting_ready";
    } else if (action === "ready") {
      if (order.status !== "paid_awaiting_ready" && order.status !== "reserved_pay_at_shop") {
        throw new ShopError("This order cannot be marked ready yet.");
      }
      order.status = "ready_for_pickup";
    } else if (action === "paid_in_shop") {
      if (order.payment !== "cash_pickup") {
        throw new ShopError("This order is not a cash pickup.");
      }
      if (order.status !== "ready_for_pickup" && order.status !== "reserved_pay_at_shop") {
        throw new ShopError("Cash can be taken when they collect, or after it is ready.");
      }
      order.status = order.status === "reserved_pay_at_shop" ? "ready_for_pickup" : order.status;
      order.notes = [order.notes, "Paid in shop"].filter(Boolean).join(" · ");
    } else if (action === "picked_up") {
      if (order.status !== "ready_for_pickup") {
        throw new ShopError("Mark ready before pickup.");
      }
      for (const item of shelfItems(order)) {
        const row = stock.get(item.variantId);
        if (!row) {
          throw new ShopError("Stock row missing.");
        }
        row.stockOnHand = Math.max(0, row.stockOnHand - item.qty);
        row.stockReserved = Math.max(0, row.stockReserved - item.qty);
        await writeStock(client, row);
        await recordMovement(client, {
          variantId: item.variantId,
          kind: "sale",
          qtyDelta: -item.qty,
          reservedDelta: -item.qty,
          orderId: order.id,
          note: order.code,
        });
      }
      order.status = "picked_up";
    } else if (action === "delivery_agreed") {
      if (order.status !== "paid_waiting_delivery_agree") {
        throw new ShopError("Delivery can only be agreed after goods are paid.");
      }
      order.deliveryFeeGhs = extra?.deliveryFeeGhs ?? 0;
      order.deliveryAgreedAt = now;
      order.status = "delivery_agreed";
    } else if (action === "dispatched") {
      if (order.status !== "delivery_agreed") {
        throw new ShopError("Agree delivery before dispatch.");
      }
      for (const item of shelfItems(order)) {
        const row = stock.get(item.variantId);
        if (!row) {
          throw new ShopError("Stock row missing.");
        }
        row.stockOnHand = Math.max(0, row.stockOnHand - item.qty);
        row.stockReserved = Math.max(0, row.stockReserved - item.qty);
        await writeStock(client, row);
        await recordMovement(client, {
          variantId: item.variantId,
          kind: "sale",
          qtyDelta: -item.qty,
          reservedDelta: -item.qty,
          orderId: order.id,
          note: order.code,
        });
      }
      order.status = "dispatched";
    } else if (action === "switch_to_pickup") {
      if (order.fulfillment !== "delivery") {
        throw new ShopError("This is already pickup.");
      }
      order.fulfillment = "pickup";
      order.deliveryAddress = null;
      if (order.status === "paid_waiting_delivery_agree" || order.status === "delivery_agreed") {
        order.status = "paid_awaiting_ready";
      }
    } else if (action === "refund") {
      if (order.status === "picked_up" || order.status === "dispatched") {
        throw new ShopError("Use a replacement for collected orders, not this refund button.");
      }
      for (const item of shelfItems(order)) {
        const row = stock.get(item.variantId);
        if (!row) {
          continue;
        }
        row.stockReserved = Math.max(0, row.stockReserved - item.qty);
        await writeStock(client, row);
        await recordMovement(client, {
          variantId: item.variantId,
          kind: "release",
          qtyDelta: 0,
          reservedDelta: -item.qty,
          orderId: order.id,
          note: order.code,
        });
      }
      order.status = "refunded";
      order.notes = [order.notes, "Mark refunded — reverse MoMo by hand if money was sent."].filter(Boolean).join(" · ");
    } else if (action === "release_hold") {
      if (order.status === "picked_up" || order.status === "dispatched" || order.status === "refunded") {
        throw new ShopError("This order is already finished.");
      }
      for (const item of shelfItems(order)) {
        const row = stock.get(item.variantId);
        if (!row) {
          continue;
        }
        row.stockReserved = Math.max(0, row.stockReserved - item.qty);
        await writeStock(client, row);
        await recordMovement(client, {
          variantId: item.variantId,
          kind: "release",
          qtyDelta: 0,
          reservedDelta: -item.qty,
          orderId: order.id,
          note: order.code,
        });
      }
      order.status = "cancelled_released";
    } else {
      throw new ShopError("Unknown action.");
    }

    order.updatedAt = now;
    await client.query(
      `update orders set
        fulfillment = $2,
        delivery_address = $3,
        payment = $4,
        status = $5,
        delivery_fee_ghs = $6,
        delivery_agreed_at = $7,
        notes = $8,
        updated_at = $9
       where id = $1`,
      [
        order.id,
        order.fulfillment,
        order.deliveryAddress,
        order.payment,
        order.status,
        order.deliveryFeeGhs,
        order.deliveryAgreedAt,
        order.notes,
        order.updatedAt,
      ],
    );
    return order;
  });
}

export async function attachMomoRequestDb(orderId: string, referenceId: string): Promise<void> {
  await ensureSeed();
  await withTransaction(async (client) => {
    await client.query(
      `update orders set momo_request_id = $2, updated_at = now()
       where id = $1 and payment = 'momo'`,
      [orderId, referenceId],
    );
  });
}

export async function confirmVerifiedMomoDb(input: {
  code: string;
  referenceId: string;
  amount: string;
  currency: string;
  expectedCurrency: string;
}): Promise<"confirmed" | "already" | "not_found" | "rejected"> {
  await ensureSeed();
  return withTransaction(async (client) => {
    const code = input.code.trim().toUpperCase();
    if (!code) {
      return "rejected";
    }
    const locked = await client.query(`select * from orders where code = $1 for update`, [code]);
    const row = locked.rows[0] as Record<string, unknown> | undefined;
    if (!row) {
      return "not_found";
    }
    const order = mapOrder(row, await itemsFor(client, String(row.id)));
    if (order.payment !== "momo") {
      return "rejected";
    }
    if (order.momoRequestId && order.momoRequestId !== input.referenceId) {
      return "rejected";
    }
    const paid = Number(input.amount);
    if (!Number.isFinite(paid) || Math.abs(paid - order.goodsTotalGhs) > 0.001) {
      return "rejected";
    }
    if (input.currency.toUpperCase() !== input.expectedCurrency.toUpperCase()) {
      return "rejected";
    }
    if (order.status !== "awaiting_momo") {
      return "already";
    }
    const status = order.fulfillment === "delivery" ? "paid_waiting_delivery_agree" : "paid_awaiting_ready";
    await client.query(
      `update orders set status = $2, momo_request_id = $3, updated_at = now() where id = $1`,
      [order.id, status, input.referenceId],
    );
    return "confirmed";
  });
}

export async function recordWalkInDb(variantId: number, qty: number): Promise<void> {
  if (!Number.isInteger(variantId) || variantId < 1) {
    throw new ShopError("Product not found.", 404);
  }
  if (!Number.isInteger(qty) || qty < 1) {
    throw new ShopError("Quantity must be at least 1.");
  }
  await ensureSeed();
  await withTransaction(async (client) => {
    const found = findVariant(seedProducts, variantId);
    if (!found) {
      throw new ShopError("Product not found.", 404);
    }
    const stock = await lockVariants(client, [variantId]);
    const row = stock.get(variantId);
    if (!row) {
      throw new ShopError("Stock row missing.");
    }
    if (shelfQty(row) < qty) {
      throw new ShopError("Not enough on the shelf for that walk-in sale.");
    }
    row.stockOnHand -= qty;
    await writeStock(client, row);
    await client.query(`insert into walk_in_sales (id, variant_id, qty) values ($1, $2, $3)`, [
      newId(),
      variantId,
      qty,
    ]);
    await recordMovement(client, {
      variantId,
      kind: "walk_in",
      qtyDelta: -qty,
      note: "Walk-in sale",
    });
  });
}

export async function updateVariantDb(variantId: number, priceGhs: number, stockOnHand: number): Promise<void> {
  if (!Number.isInteger(variantId) || variantId < 1 || !findVariant(seedProducts, variantId)) {
    throw new ShopError("Product not found.", 404);
  }
  if (!Number.isFinite(priceGhs) || priceGhs < 0) {
    throw new ShopError("Enter a price of zero or more.");
  }
  if (!Number.isInteger(stockOnHand) || stockOnHand < 0) {
    throw new ShopError("On hand must be a whole number.");
  }
  await ensureSeed();
  await withTransaction(async (client) => {
    const stock = await lockVariants(client, [variantId]);
    const row = stock.get(variantId);
    if (!row) {
      throw new ShopError("Stock row missing.");
    }
    if (stockOnHand < row.stockReserved) {
      throw new ShopError("On hand cannot be lower than the quantity already reserved.");
    }
    const delta = stockOnHand - row.stockOnHand;
    const nextPrice = money(priceGhs);
    const priceChanged = Math.abs(nextPrice - row.priceGhs) > 0.001;
    if (delta === 0 && !priceChanged) {
      return;
    }
    await client.query(
      `update variant_stock
       set price_ghs = $2, stock_on_hand = $3, updated_at = now()
       where variant_id = $1`,
      [variantId, nextPrice, stockOnHand],
    );
    if (delta > 0) {
      await recordMovement(client, {
        variantId,
        kind: "restock",
        qtyDelta: delta,
        priceGhs: priceChanged ? nextPrice : null,
        note: priceChanged ? `Price set to ${nextPrice.toFixed(2)}` : null,
      });
    } else if (delta < 0) {
      await recordMovement(client, {
        variantId,
        kind: "manual_adjustment",
        qtyDelta: delta,
        priceGhs: priceChanged ? nextPrice : null,
        note: priceChanged ? `Price set to ${nextPrice.toFixed(2)}` : null,
      });
    }
    if (priceChanged && delta === 0) {
      await recordMovement(client, {
        variantId,
        kind: "manual_adjustment",
        qtyDelta: 0,
        priceGhs: nextPrice,
        note: `Price set to ${nextPrice.toFixed(2)}`,
      });
    }
  });
}

export async function listMovementsDb(limit = 40): Promise<StockMovement[]> {
  await ensureSeed();
  return withTransaction(async (client) => {
    const result = await client.query(
      `select id, variant_id, kind, qty_delta, reserved_delta, price_ghs, note, order_id, created_at
       from stock_movements
       order by id desc
       limit $1`,
      [limit],
    );
    return result.rows.map((row) => ({
      id: String(row.id),
      variantId: Number(row.variant_id),
      kind: row.kind as StockMovementKind,
      qtyDelta: Number(row.qty_delta),
      reservedDelta: Number(row.reserved_delta),
      priceGhs: row.price_ghs === null ? null : money(row.price_ghs),
      note: row.note ? String(row.note) : null,
      orderId: row.order_id ? String(row.order_id) : null,
      createdAt: iso(row.created_at),
    }));
  });
}

const execFileAsync = promisify(execFile);

export async function applySchemaFile(): Promise<void> {
  const url = postgresUrl();
  if (!url) {
    throw new Error("Postgres URL is not set.");
  }
  const file = path.join(process.cwd(), "supabase/migrations/20260925180000_shop_orders_stock.sql");
  await execFileAsync("psql", [url, "-v", "ON_ERROR_STOP=1", "-f", file]);
}

export async function emptyShopTables(): Promise<void> {
  await withTransaction(async (client) => {
    await client.query(
      `truncate table stock_movements, order_items, walk_in_sales, orders, variant_stock restart identity`,
    );
  });
  resetSeedState();
}
