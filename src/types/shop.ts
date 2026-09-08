export type ProductKind =
  | "oil"
  | "spray"
  | "format"
  | "empty_bottle"
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
  images: string[];
  active: boolean;
  featured: boolean;
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
