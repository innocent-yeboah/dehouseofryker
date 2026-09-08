"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { copy } from "@/lib/site";
import { useCart } from "@/store/cart";
import type { Fulfillment, PaymentMethod } from "@/types/shop";

type CheckoutFormProps = {
  paymentMode: "momo_api" | "merchant_pay";
  merchantNumber: string;
};

export function CheckoutForm({ paymentMode, merchantNumber }: CheckoutFormProps) {
  const lines = useCart((state) => state.lines);
  const clear = useCart((state) => state.clear);
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [fulfillment, setFulfillment] = useState<Fulfillment>("pickup");
  const [payment, setPayment] = useState<PaymentMethod>("cash_pickup");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (fulfillment === "delivery" && payment === "cash_pickup") {
      setPayment(paymentMode === "merchant_pay" ? "merchant_reference" : "momo");
    }
  }, [fulfillment, payment, paymentMode]);

  if (!hydrated) {
    return <p>Loading checkout…</p>;
  }

  if (lines.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <form
      className="mt-8 max-w-lg space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setError(null);
        const form = new FormData(event.currentTarget);
        const ghana = form.get("ghana") === "yes";
        if (!ghana) {
          setError("Checkout is Ghana only. WhatsApp us if you are abroad.");
          setBusy(false);
          return;
        }
        const body = {
          customerName: String(form.get("name") ?? ""),
          phone: String(form.get("phone") ?? ""),
          email: String(form.get("email") ?? "") || null,
          fulfillment,
          deliveryAddress: fulfillment === "delivery" ? String(form.get("address") ?? "") : null,
          payment,
          momoNumber: String(form.get("momoNumber") ?? ""),
          momoRef: String(form.get("momoRef") ?? ""),
          lines,
        };
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = (await response.json()) as {
          error?: string;
          code?: string;
          viewToken?: string;
        };
        setBusy(false);
        if (!response.ok) {
          setError(json.error ?? "Let’s try that again together.");
          return;
        }
        clear();
        router.push(`/order/${json.code}?t=${json.viewToken}`);
      }}
    >
      <label className="block text-sm">
        Full name
        <input required name="name" className="mt-1 w-full border border-soft-gold bg-white px-3 py-2" />
      </label>
      <label className="block text-sm">
        Ghana phone
        <input
          required
          name="phone"
          inputMode="tel"
          placeholder="024xxxxxxx"
          className="mt-1 w-full border border-soft-gold bg-white px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        Email (optional)
        <input name="email" type="email" className="mt-1 w-full border border-soft-gold bg-white px-3 py-2" />
      </label>

      <fieldset className="space-y-2 text-sm">
        <legend className="font-medium">I live in Ghana</legend>
        <label className="flex gap-2">
          <input type="radio" name="ghana" value="yes" defaultChecked />
          Yes — checkout is for Ghana
        </label>
        <label className="flex gap-2">
          <input type="radio" name="ghana" value="no" />
          No — I will WhatsApp instead
        </label>
      </fieldset>

      <fieldset className="space-y-2 text-sm">
        <legend className="font-medium">How should we get this to you?</legend>
        <label className="flex gap-2">
          <input
            type="radio"
            name="fulfillment"
            checked={fulfillment === "pickup"}
            onChange={() => setFulfillment("pickup")}
          />
          Pickup at the Accra shop
        </label>
        <label className="flex gap-2">
          <input
            type="radio"
            name="fulfillment"
            checked={fulfillment === "delivery"}
            onChange={() => setFulfillment("delivery")}
          />
          Delivery in Ghana
        </label>
      </fieldset>

      {fulfillment === "delivery" ? (
        <div className="border border-soft-gold bg-ivory p-4 text-sm">
          <p>{copy.deliveryGoodsOnly}</p>
          <label className="mt-3 block">
            Delivery address in Ghana
            <textarea
              required
              name="address"
              rows={3}
              className="mt-1 w-full border border-soft-gold bg-white px-3 py-2"
            />
          </label>
        </div>
      ) : null}

      <fieldset className="space-y-2 text-sm">
        <legend className="font-medium">Payment</legend>
        {fulfillment === "pickup" ? (
          <label className="flex gap-2">
            <input
              type="radio"
              checked={payment === "cash_pickup"}
              onChange={() => setPayment("cash_pickup")}
            />
            Pay cash at the shop
          </label>
        ) : null}
        <label className="flex gap-2">
          <input
            type="radio"
            checked={payment === (paymentMode === "merchant_pay" ? "merchant_reference" : "momo")}
            onChange={() =>
              setPayment(paymentMode === "merchant_pay" ? "merchant_reference" : "momo")
            }
          />
          MTN MoMo for products
        </label>
      </fieldset>

      {payment === "momo" ? (
        <label className="block text-sm">
          MoMo number to prompt
          <input
            required
            name="momoNumber"
            className="mt-1 w-full border border-soft-gold bg-white px-3 py-2"
          />
        </label>
      ) : null}

      {payment === "merchant_reference" ? (
        <div className="text-sm">
          <p>
            Send the product total to MTN MoMo merchant <strong>{merchantNumber}</strong>, then enter
            the reference from your SMS. We will confirm it in the house before we pack.
          </p>
          <label className="mt-3 block">
            MoMo reference
            <input
              required
              name="momoRef"
              className="mt-1 w-full border border-soft-gold bg-white px-3 py-2"
            />
          </label>
        </div>
      ) : null}

      {error ? <p className="text-sm text-deep-gold">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="w-full bg-house-gold px-6 py-3 text-sm font-medium text-ink sm:w-auto disabled:opacity-60"
      >
        {busy ? "Placing order…" : "Place order"}
      </button>
    </form>
  );
}
