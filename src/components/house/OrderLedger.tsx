import { statusCustomerLabel } from "@/lib/availability";
import { formatGhs } from "@/lib/money";
import { copy } from "@/lib/site";
import type { Order } from "@/types/shop";

type OrderLedgerProps = {
  order: Order;
};

export function OrderLedger({ order }: OrderLedgerProps) {
  const showOnTheWay = order.status === "dispatched";

  return (
    <section className="border border-soft-gold bg-white p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">Order {order.code}</p>
      <h1 className="mt-2 font-serif text-3xl text-ink">{statusCustomerLabel(order.status)}</h1>
      {order.fulfillment === "delivery" && order.status === "paid_waiting_delivery_agree" ? (
        <p className="mt-4 text-sm leading-relaxed text-ink">{copy.deliveryGoodsOnly}</p>
      ) : null}
      {order.fulfillment === "delivery" && !showOnTheWay && order.status !== "refunded" ? (
        <p className="mt-2 text-sm text-muted">
          This is not a complete door-to-door total. Delivery is agreed by phone.
        </p>
      ) : null}
      <ul className="mt-6 space-y-3 border-t border-soft-gold/50 pt-4">
        {order.items.map((item) => (
          <li key={`${item.variantId}-${item.sku}`} className="flex justify-between gap-4 text-sm">
            <span>
              {item.productName} · {item.sizeLabel} × {item.qty}
              <span className="block text-xs text-muted">
                {item.availabilitySnapshot === "blend"
                  ? "We will blend this — not on the shelf"
                  : "On the shelf when you ordered"}
              </span>
            </span>
            <span>{formatGhs(item.unitPriceGhs * item.qty)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex justify-between font-medium text-ink">
        <span>Products</span>
        <span>{formatGhs(order.goodsTotalGhs)}</span>
      </p>
      {order.deliveryFeeGhs !== null && order.status !== "paid_waiting_delivery_agree" ? (
        <p className="mt-1 flex justify-between text-sm text-muted">
          <span>Delivery (agreed by phone)</span>
          <span>{formatGhs(order.deliveryFeeGhs)}</span>
        </p>
      ) : null}
    </section>
  );
}
