"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { statusCustomerLabel } from "@/lib/availability";
import { formatGhs } from "@/lib/money";
import { whatsappHref } from "@/lib/site";
import type { OwnerAction } from "@/lib/orders";
import type { Order, Product } from "@/types/shop";

export function WalkInForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="flex flex-wrap items-end gap-3 border border-soft-gold bg-white p-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const response = await fetch("/api/admin/ops", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "walk_in",
            variantId: Number(form.get("variantId")),
            qty: Number(form.get("qty")),
          }),
        });
        const json = (await response.json()) as { error?: string };
        if (!response.ok) {
          setError(json.error ?? "Could not record sale.");
          return;
        }
        setError(null);
        router.refresh();
      }}
    >
      <label className="text-sm">
        Walk-in sale
        <select name="variantId" className="mt-1 block border border-soft-gold bg-white px-2 py-2">
          {products.flatMap((product) =>
            product.variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {product.name} {variant.sizeMl ? `${variant.sizeMl}ml` : ""} (shelf{" "}
                {variant.stockOnHand - variant.stockReserved})
              </option>
            )),
          )}
        </select>
      </label>
      <label className="text-sm">
        Qty
        <input
          name="qty"
          type="number"
          min={1}
          defaultValue={1}
          className="mt-1 block w-20 border border-soft-gold px-2 py-2"
        />
      </label>
      <button type="submit" className="bg-house-gold px-4 py-2 text-sm text-ink">
        Record shop sale
      </button>
      {error ? <p className="w-full text-sm text-deep-gold">{error}</p> : null}
    </form>
  );
}

export function OrderActions({ order }: { order: Order }) {
  const router = useRouter();
  const [fee, setFee] = useState("0");
  const [error, setError] = useState<string | null>(null);

  async function run(action: OwnerAction) {
    const response = await fetch("/api/admin/ops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "order",
        orderId: order.id,
        action,
        deliveryFeeGhs: action === "delivery_agreed" ? Number(fee) : null,
      }),
    });
    const json = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(json.error ?? "Could not update.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {order.status === "awaiting_momo" ? (
        <button type="button" className="border border-house-gold px-3 py-1 text-sm" onClick={() => run("confirm_merchant")}>
          Confirm merchant payment
        </button>
      ) : null}
      {order.status === "paid_awaiting_ready" || order.status === "reserved_pay_at_shop" ? (
        <button type="button" className="border border-house-gold px-3 py-1 text-sm" onClick={() => run("ready")}>
          Ready
        </button>
      ) : null}
      {order.payment === "cash_pickup" && order.status !== "picked_up" ? (
        <button type="button" className="border border-house-gold px-3 py-1 text-sm" onClick={() => run("paid_in_shop")}>
          Paid in shop
        </button>
      ) : null}
      {order.status === "ready_for_pickup" ? (
        <button type="button" className="border border-house-gold px-3 py-1 text-sm" onClick={() => run("picked_up")}>
          Picked up
        </button>
      ) : null}
      {order.status === "paid_waiting_delivery_agree" ? (
        <>
          <label className="text-sm">
            Delivery fee GHS
            <input
              value={fee}
              onChange={(event) => setFee(event.target.value)}
              className="ml-2 w-24 border border-soft-gold px-2 py-1"
            />
          </label>
          <button type="button" className="border border-house-gold px-3 py-1 text-sm" onClick={() => run("delivery_agreed")}>
            Delivery agreed
          </button>
          <button type="button" className="border border-soft-gold px-3 py-1 text-sm" onClick={() => run("switch_to_pickup")}>
            Switch to pickup
          </button>
        </>
      ) : null}
      {order.status === "delivery_agreed" ? (
        <button type="button" className="border border-house-gold px-3 py-1 text-sm" onClick={() => run("dispatched")}>
          Dispatched
        </button>
      ) : null}
      <button type="button" className="border border-soft-gold px-3 py-1 text-sm" onClick={() => run("release_hold")}>
        Release hold
      </button>
      <button type="button" className="border border-soft-gold px-3 py-1 text-sm" onClick={() => run("refund")}>
        Mark refunded
      </button>
      <a
        className="px-3 py-1 text-sm text-deep-gold"
        href={whatsappHref(`Hello, your De House of Ryker order ${order.code} is ${statusCustomerLabel(order.status)}.`)}
      >
        WhatsApp customer
      </a>
      {error ? <p className="w-full text-sm text-deep-gold">{error}</p> : null}
      <p className="w-full text-xs text-muted">Goods {formatGhs(order.goodsTotalGhs)}</p>
    </div>
  );
}
