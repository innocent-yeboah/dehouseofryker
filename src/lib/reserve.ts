import { shelfQty } from "@/lib/availability";

export class ShopError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
    this.name = "ShopError";
  }
}

export function reserveLine(
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
