import { availabilityFor, shelfQty } from "@/lib/availability";
import { warnIfFileStore, usingDatabase } from "@/lib/db/config";
import {
  applyOwnerActionDb,
  attachMomoRequestDb,
  confirmVerifiedMomoDb,
  createOrderDb,
  findOrderDb,
  getOrderByCodeAndTokenDb,
  getOrderByIdDb,
  listMovementsDb,
  listOrdersDb,
  recordWalkInDb,
  updateVariantDb,
} from "@/lib/db/shop-db";
import { applyCommerce, applyStock, findVariant, newId, newOrderCode, newViewToken, phonesMatch, withState } from "@/lib/local-db";
import { seedProducts } from "@/data/seed-catalog";
import { variantSizeLabel } from "@/lib/money";
import { reserveLine, ShopError } from "@/lib/reserve";
import type {
  CartLine,
  Fulfillment,
  Order,
  OrderItem,
  OrderStatus,
  OwnerAction,
  PaymentMethod,
  StockMovement,
} from "@/types/shop";

export { ShopError };
export type { OwnerAction };

export async function createOrder(input: {
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
  if (usingDatabase()) {
    return createOrderDb(input);
  }
  warnIfFileStore();
  return withState((state) => {
    const products = applyCommerce(seedProducts, state);
    const items: OrderItem[] = [];
    let goodsTotalGhs = 0;

    for (const line of input.lines) {
      const found = findVariant(products, line.variantId);
      if (!found || line.qty < 1) {
        throw new ShopError("A cart item is no longer available.");
      }
      const { product, variant } = found;
      if (line.qty > variant.maxRetailQty) {
        throw new ShopError(
          `${product.displayName} is limited to ${variant.maxRetailQty} per order. For more, WhatsApp the house.`,
        );
      }
      const stock = state.stock[String(variant.id)];
      if (!stock) {
        throw new ShopError("Stock is missing for an item.");
      }
      const snapshot = reserveLine(stock, line.qty, variant.blendWhenZero);
      const unit = variant.priceGhs;
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

    let status: OrderStatus;
    if (input.payment === "cash_pickup") {
      status = "reserved_pay_at_shop";
    } else {
      // Pay-to-number and API MoMo both wait here. HTTP 202 only means MTN
      // accepted a prompt; it is not proof the customer paid.
      status = "awaiting_momo";
    }

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
    state.orders.unshift(order);
    return order;
  });
}

function releaseReservations(state: { stock: Record<string, { stockReserved: number; stockOnHand: number }> }, order: Order) {
  for (const item of order.items) {
    if (item.availabilitySnapshot !== "on_shelf") {
      continue;
    }
    const stock = state.stock[String(item.variantId)];
    if (stock) {
      stock.stockReserved = Math.max(0, stock.stockReserved - item.qty);
    }
  }
}

function confirmSale(state: { stock: Record<string, { stockReserved: number; stockOnHand: number }> }, order: Order) {
  for (const item of order.items) {
    if (item.availabilitySnapshot !== "on_shelf") {
      continue;
    }
    const stock = state.stock[String(item.variantId)];
    if (stock) {
      stock.stockOnHand = Math.max(0, stock.stockOnHand - item.qty);
      stock.stockReserved = Math.max(0, stock.stockReserved - item.qty);
    }
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (usingDatabase()) {
    return getOrderByIdDb(id);
  }
  warnIfFileStore();
  return withState((state) => state.orders.find((item) => item.id === id) ?? null);
}

export async function getOrderByCodeAndToken(code: string, token: string): Promise<Order | null> {
  if (usingDatabase()) {
    return getOrderByCodeAndTokenDb(code, token);
  }
  warnIfFileStore();
  return withState((state) => {
    const order = state.orders.find((item) => item.code.toUpperCase() === code.toUpperCase());
    if (!order || order.viewToken !== token) {
      return null;
    }
    return order;
  });
}

export async function findOrder(phone: string, code: string): Promise<Order | null> {
  if (usingDatabase()) {
    return findOrderDb(phone, code);
  }
  warnIfFileStore();
  return withState((state) => {
    return (
      state.orders.find(
        (item) =>
          item.code.toUpperCase() === code.toUpperCase().trim() && phonesMatch(item.phone, phone),
      ) ?? null
    );
  });
}

export async function listOrders(): Promise<Order[]> {
  if (usingDatabase()) {
    return listOrdersDb();
  }
  warnIfFileStore();
  return withState((state) => state.orders);
}

export async function applyOwnerAction(
  orderId: string,
  action: OwnerAction,
  extra?: { deliveryFeeGhs?: number | null },
): Promise<Order> {
  if (usingDatabase()) {
    return applyOwnerActionDb(orderId, action, extra);
  }
  warnIfFileStore();
  return withState((state) => {
    const order = state.orders.find((item) => item.id === orderId);
    if (!order) {
      throw new ShopError("Order not found.", 404);
    }
    const now = new Date().toISOString();

    if (action === "confirm_merchant") {
      if (order.status !== "awaiting_momo") {
        throw new ShopError("This order is not waiting for a merchant payment.");
      }
      order.status =
        order.fulfillment === "delivery" ? "paid_waiting_delivery_agree" : "paid_awaiting_ready";
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
      order.payment = "cash_pickup";
      order.status = order.status === "reserved_pay_at_shop" ? "ready_for_pickup" : order.status;
      order.notes = [order.notes, "Paid in shop"].filter(Boolean).join(" · ");
    } else if (action === "picked_up") {
      if (order.status !== "ready_for_pickup") {
        throw new ShopError("Mark ready before pickup.");
      }
      confirmSale(state, order);
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
      confirmSale(state, order);
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
      releaseReservations(state, order);
      order.status = "refunded";
      order.notes = [order.notes, "Mark refunded — reverse MoMo by hand if money was sent."].filter(Boolean).join(" · ");
    } else if (action === "release_hold") {
      if (order.status === "picked_up" || order.status === "dispatched" || order.status === "refunded") {
        throw new ShopError("This order is already finished.");
      }
      releaseReservations(state, order);
      order.status = "cancelled_released";
    } else {
      throw new ShopError("Unknown action.");
    }

    order.updatedAt = now;
    return order;
  });
}

export async function attachMomoRequest(orderId: string, referenceId: string): Promise<void> {
  if (usingDatabase()) {
    await attachMomoRequestDb(orderId, referenceId);
    return;
  }
  warnIfFileStore();
  await withState((state) => {
    const order = state.orders.find((item) => item.id === orderId);
    if (!order || order.payment !== "momo") {
      return;
    }
    order.momoRequestId = referenceId;
    order.updatedAt = new Date().toISOString();
  });
}

/**
 * Mark an API MoMo order paid only after MTN's own status check says SUCCESSFUL.
 * Pay-to-number orders (`merchant_reference`) are left for the owner's confirm.
 */
export async function confirmVerifiedMomo(input: {
  code: string;
  referenceId: string;
  amount: string;
  currency: string;
  expectedCurrency: string;
}): Promise<"confirmed" | "already" | "not_found" | "rejected"> {
  if (usingDatabase()) {
    return confirmVerifiedMomoDb(input);
  }
  warnIfFileStore();
  return withState((state) => {
    const code = input.code.trim();
    if (!code) {
      return "rejected";
    }
    const order = state.orders.find((item) => item.code.toUpperCase() === code.toUpperCase());
    if (!order) {
      return "not_found";
    }
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
    order.momoRequestId = input.referenceId;
    order.status =
      order.fulfillment === "delivery" ? "paid_waiting_delivery_agree" : "paid_awaiting_ready";
    order.updatedAt = new Date().toISOString();
    return "confirmed";
  });
}

export async function recordWalkIn(variantId: number, qty: number): Promise<void> {
  if (!Number.isInteger(variantId) || variantId < 1) {
    throw new ShopError("Product not found.", 404);
  }
  if (!Number.isInteger(qty) || qty < 1) {
    throw new ShopError("Quantity must be at least 1.");
  }
  if (usingDatabase()) {
    await recordWalkInDb(variantId, qty);
    return;
  }
  warnIfFileStore();
  return withState((state) => {
    const products = applyStock(seedProducts, state.stock);
    const found = findVariant(products, variantId);
    if (!found) {
      throw new ShopError("Product not found.", 404);
    }
    const stock = state.stock[String(variantId)];
    if (!stock) {
      throw new ShopError("Stock row missing.");
    }
    const available = shelfQty(stock);
    if (available < qty) {
      throw new ShopError("Not enough on the shelf for that walk-in sale.");
    }
    stock.stockOnHand -= qty;
    state.walkIns.unshift({
      id: newId(),
      variantId,
      qty,
      createdAt: new Date().toISOString(),
    });
  });
}

export async function updateVariantCommercials(
  variantId: number,
  priceGhs: number,
  stockOnHand: number,
): Promise<void> {
  if (!Number.isInteger(variantId) || variantId < 1) {
    throw new ShopError("Product not found.", 404);
  }
  if (!Number.isFinite(priceGhs) || priceGhs < 0) {
    throw new ShopError("Enter a price of zero or more.");
  }
  if (!Number.isInteger(stockOnHand) || stockOnHand < 0) {
    throw new ShopError("On hand must be a whole number.");
  }
  if (usingDatabase()) {
    await updateVariantDb(variantId, priceGhs, stockOnHand);
    return;
  }
  warnIfFileStore();
  await withState((state) => {
    if (!findVariant(seedProducts, variantId)) {
      throw new ShopError("Product not found.", 404);
    }
    const stock = state.stock[String(variantId)];
    if (!stock) {
      throw new ShopError("Stock row missing.");
    }
    if (stockOnHand < stock.stockReserved) {
      throw new ShopError("On hand cannot be lower than the quantity already reserved.");
    }
    stock.stockOnHand = stockOnHand;
    state.prices[String(variantId)] = Math.round(priceGhs * 100) / 100;
  });
}

export async function listStockMovements(): Promise<StockMovement[]> {
  if (usingDatabase()) {
    return listMovementsDb();
  }
  warnIfFileStore();
  return [];
}

export { availabilityFor };
