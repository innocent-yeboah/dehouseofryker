"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { availabilityFor, availabilityLabel, shelfQty } from "@/lib/availability";
import { variantSizeLabel } from "@/lib/money";
import type { Product, StockMovement, StockMovementKind } from "@/types/shop";

const movementLabel: Record<StockMovementKind, string> = {
  sale: "Sale",
  walk_in: "Walk-in",
  manual_adjustment: "Manual adjustment",
  restock: "Restock",
  reservation: "Reserved for an order",
  release: "Reservation released",
};

export function StockEditor({
  products,
  movements,
  database,
}: {
  products: Product[];
  movements: StockMovement[];
  database: boolean;
}) {
  const names = new Map(products.map((product) => [product.variants[0]?.id, product.displayName]));
  for (const product of products) {
    for (const variant of product.variants) {
      names.set(variant.id, product.displayName);
    }
  }

  return (
    <div className="mt-8 space-y-8">
      <section>
        <h2 className="font-serif text-2xl">Price and stock</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          {database
            ? "Saving writes the price and the quantity on hand. Reserved pieces stay held for open orders."
            : "The database is not connected, so a saved change lasts only until this server restarts."}
        </p>
        <div className="mt-4 space-y-3">
          {products.flatMap((product) =>
            product.variants.map((variant) => (
              <VariantRow key={variant.id} productName={product.displayName} variant={variant} />
            )),
          )}
        </div>
      </section>
      <section>
        <h2 className="font-serif text-2xl">Stock history</h2>
        {movements.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No stock movements yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {movements.map((movement) => (
              <li key={movement.id} className="border border-soft-gold/60 bg-white px-3 py-2 text-sm">
                <span className="font-medium">{movementLabel[movement.kind]}</span>
                {" · "}
                {names.get(movement.variantId) ?? `Variant ${movement.variantId}`}
                {movement.qtyDelta !== 0 ? ` · on hand ${movement.qtyDelta > 0 ? "+" : ""}${movement.qtyDelta}` : ""}
                {movement.note ? ` · ${movement.note}` : ""}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function VariantRow({
  productName,
  variant,
}: {
  productName: string;
  variant: Product["variants"][number];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const status = availabilityFor(variant);

  return (
    <form
      className="border border-soft-gold bg-white p-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setError(null);
        const form = new FormData(event.currentTarget);
        const response = await fetch("/api/admin/ops", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "stock",
            variantId: variant.id,
            priceGhs: Number(form.get("price")),
            stockOnHand: Number(form.get("stock")),
          }),
        });
        const json = (await response.json()) as { error?: string };
        setBusy(false);
        if (!response.ok) {
          setError(json.error ?? "Could not save.");
          return;
        }
        router.refresh();
      }}
    >
      <p className="font-medium text-ink">{productName}</p>
      <p className="mt-1 text-sm text-muted">
        {variantSizeLabel(variant)} · Reserved {variant.stockReserved} · Shelf {shelfQty(variant)} ·{" "}
        {availabilityLabel(status)}
      </p>
      <div className="mt-3 grid grid-cols-1 gap-3 min-[420px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] min-[420px]:items-end">
        <label className="text-sm">
          Price (GHS)
          <input
            name="price"
            inputMode="decimal"
            required
            defaultValue={variant.priceGhs}
            className="mt-1 w-full border border-soft-gold px-2 py-2"
          />
        </label>
        <label className="text-sm">
          On hand
          <input
            name="stock"
            type="number"
            min={0}
            step={1}
            required
            defaultValue={variant.stockOnHand}
            className="mt-1 w-full border border-soft-gold px-2 py-2"
          />
        </label>
        <button type="submit" disabled={busy} className="bg-house-gold px-4 py-2 text-sm text-ink disabled:opacity-60">
          {busy ? "Saving…" : "Save"}
        </button>
      </div>
      {error ? <p className="mt-2 text-sm text-deep-gold">{error}</p> : null}
    </form>
  );
}
