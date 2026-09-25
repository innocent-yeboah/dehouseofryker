export type ProductKind =
  | "oil"
  | "spray"
  | "format"
  | "empty_bottle"
  | "packaging"
  | "wellness";

/** Shop departments. `resellers` stays out of the menu while it has no products. */
export type DepartmentId = "fragrance" | "skincare" | "wellness" | "resellers";

/** One section per product. Gift sets, empty bottles, and packaging may be empty. */
export type SectionId =
  | "perfumes"
  | "perfume_oils"
  | "gift_sets"
  | "face"
  | "lips_eyes"
  | "body"
  | "supplements"
  | "empty_bottles"
  | "packaging";

export type Availability = "on_shelf" | "blend" | "unavailable";

export type Fulfillment = "pickup" | "delivery";

export type PaymentMethod = "momo" | "cash_pickup" | "merchant_reference";

export type OrderStatus =
  | "awaiting_momo"
  | "reserved_pay_at_shop"
  | "paid_awaiting_ready"
  | "paid_waiting_delivery_agree"
  | "ready_for_pickup"
  | "picked_up"
  | "delivery_agreed"
  | "dispatched"
  | "refunded"
  | "cancelled_released";

export type Variant = {
  id: number;
  productId: number;
  sizeMl: number | null;
  /** Display size when it is not millilitres, for example a 100 g tube. */
  sizeText?: string;
  sku: string;
  priceGhs: number;
  stockOnHand: number;
  stockReserved: number;
  blendWhenZero: boolean;
  maxRetailQty: number;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  kind: ProductKind;
  /** Merchandising department. Navigation uses this, not `kind`. */
  department: DepartmentId;
  /** Exactly one section. */
  section: SectionId;
  /**
   * Printed brand. "House" groups tiles with no brand on the label.
   * That word is not prefixed onto those titles.
   */
  brand: string;
  /** Filter label such as "30 ml" or "100 g". Empty when no size is printed. */
  size: string;
  /** Shelf title: brand + product + format + size, without doubling words. */
  displayName: string;
  images: string[];
  active: boolean;
  featured: boolean;
  /**
   * Merchandising flag.
   * TODO: owner to pick best sellers
   */
  bestSeller: boolean;
  /**
   * Recency key used when Featured has no best sellers to rank.
   * Higher is newer. Seed ids already increase by catalog batch.
   */
  addedRank: number;
  variants: Variant[];
};

export type CartLine = {
  variantId: number;
  qty: number;
};

export type OrderItem = {
  variantId: number;
  productName: string;
  sku: string;
  sizeLabel: string;
  qty: number;
  unitPriceGhs: number;
  availabilitySnapshot: "on_shelf" | "blend";
};

export type Order = {
  id: string;
  code: string;
  viewToken: string;
  customerName: string;
  phone: string;
  email: string | null;
  fulfillment: Fulfillment;
  deliveryAddress: string | null;
  payment: PaymentMethod;
  status: OrderStatus;
  goodsTotalGhs: number;
  deliveryFeeGhs: number | null;
  deliveryAgreedAt: string | null;
  momoRef: string | null;
  momoNumberMasked: string | null;
  /** MTN RequestToPay id for API collections. Older saved orders omit it. */
  momoRequestId?: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  notes: string | null;
};

export type WalkInSale = {
  id: string;
  variantId: number;
  qty: number;
  createdAt: string;
};

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

export type StockMovementKind =
  | "sale"
  | "walk_in"
  | "manual_adjustment"
  | "restock"
  | "reservation"
  | "release";

export type StockMovement = {
  id: string;
  variantId: number;
  kind: StockMovementKind;
  qtyDelta: number;
  reservedDelta: number;
  priceGhs: number | null;
  note: string | null;
  orderId: string | null;
  createdAt: string;
};
