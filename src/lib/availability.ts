import type { Availability, ProductKind, Variant } from "@/types/shop";

export function shelfQty(variant: Pick<Variant, "stockOnHand" | "stockReserved">): number {
  return Math.max(0, variant.stockOnHand - variant.stockReserved);
}

export function availabilityFor(
  variant: Pick<Variant, "stockOnHand" | "stockReserved" | "blendWhenZero">,
): Availability {
  if (shelfQty(variant) > 0) {
    return "on_shelf";
  }
  if (variant.blendWhenZero) {
    return "blend";
  }
  return "unavailable";
}

export function availabilityLabel(status: Availability): string {
  if (status === "on_shelf") {
    return "On the shelf";
  }
  if (status === "blend") {
    return "We will blend this";
  }
  return "Unavailable";
}

export function canSellKindAtZero(kind: ProductKind): boolean {
  return kind === "oil" || kind === "spray" || kind === "format";
}

export function statusCustomerLabel(status: string): string {
  switch (status) {
    case "awaiting_momo":
      return "Waiting for MoMo payment";
    case "reserved_pay_at_shop":
      return "Reserved — pay when you collect";
    case "paid_awaiting_ready":
      return "Paid — we will tell you when it is ready";
    case "paid_waiting_delivery_agree":
      return "Paid for goods — waiting to agree delivery";
    case "ready_for_pickup":
      return "Ready for pickup — come to the shop";
    case "picked_up":
      return "Picked up";
    case "delivery_agreed":
      return "Delivery agreed — packing";
    case "dispatched":
      return "On the way";
    case "refunded":
      return "Refunded";
    case "cancelled_released":
      return "Cancelled — hold released";
    default:
      return status;
  }
}

export function isForbiddenCompleteLabel(status: string): boolean {
  return (
    status === "paid_waiting_delivery_agree" ||
    status === "awaiting_momo" ||
    status === "reserved_pay_at_shop" ||
    status === "paid_awaiting_ready"
  );
}
