import { availabilityFor, shelfQty } from "@/lib/availability";
import { applyStock, findVariant, newId, newOrderCode, newViewToken, phonesMatch, withState } from "@/lib/local-db";
import { seedProducts } from "@/data/seed-catalog";
import { sizeLabel } from "@/lib/money";
import type {
  CartLine,
  Fulfillment,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
} from "@/types/shop";

export class ShopError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
    this.name = "ShopError";
  }
}

function reserveLine(
  stock: { stockOnHand: number; stockReserved: number },
  qty: number,
  blendOk: boolean,
): "on_shelf" | "blend" {
  const available = shelfQty(stock);
  if (available >= qty) {
    stock.stockReserved += qty;
    return "on_shelf";
  }
  if (blendOk && available === 0) {
    return "blend";
  }
  if (blendOk && available > 0 && available < qty) {
    throw new ShopError(
      "That size is partly on the shelf. Reduce the quantity, or add a second line after this one is gone.",
    );
  }
  throw new ShopError("That item is unavailable.");
}

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
  return withState((state) => {
    const products = applyStock(seedProducts, state.stock);
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
          `${product.name} is limited to ${variant.maxRetailQty} per order. For more, WhatsApp the house.`,
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
        productName: product.name,
        sku: variant.sku,
        sizeLabel: sizeLabel(variant.sizeMl),
        qty: line.qty,
        unitPriceGhs: unit,
        availabilitySnapshot: snapshot,
      });
    }

    let status: OrderStatus;
    if (input.payment === "cash_pickup") {
      status = "reserved_pay_at_shop";
    } else if (input.fulfillment === "delivery") {
      status = input.payment === "merchant_reference" ? "awaiting_momo" : "paid_waiting_delivery_agree";
    } else if (input.payment === "merchant_reference") {
      status = "awaiting_momo";
    } else {
      status = "paid_awaiting_ready";
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
  return withState((state) => state.orders.find((item) => item.id === id) ?? null);
}

export async function getOrderByCodeAndToken(code: string, token: string): Promise<Order | null> {
  return withState((state) => {
    const order = state.orders.find((item) => item.code.toUpperCase() === code.toUpperCase());
    if (!order || order.viewToken !== token) {
      return null;
    }
    return order;
  });
}

export async function findOrder(phone: string, code: string): Promise<Order | null> {
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
  return withState((state) => state.orders);
}

export type OwnerAction =
  | "confirm_merchant"
  | "ready"
  | "paid_in_shop"
  | "picked_up"
  | "delivery_agreed"
  | "dispatched"
  | "switch_to_pickup"
  | "refund"
  | "release_hold";

export async function applyOwnerAction(
  orderId: string,
  action: OwnerAction,
  extra?: { deliveryFeeGhs?: number | null },
): Promise<Order> {
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

export async function recordWalkIn(variantId: number, qty: number): Promise<void> {
  if (qty < 1) {
    throw new ShopError("Quantity must be at least 1.");
  }
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

export { availabilityFor };
