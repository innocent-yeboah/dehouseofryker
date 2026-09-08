"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function FindOrderForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="mt-8 max-w-md space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const response = await fetch("/api/orders/find", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: String(form.get("phone") ?? ""),
            code: String(form.get("code") ?? ""),
          }),
        });
        const json = (await response.json()) as { error?: string; code?: string; viewToken?: string };
        if (!response.ok) {
          setError(json.error ?? "Let’s try that again together.");
          return;
        }
        router.push(`/order/${json.code}?t=${json.viewToken}`);
      }}
    >
      <label className="block text-sm">
        Phone used at checkout
        <input required name="phone" className="mt-1 w-full border border-soft-gold bg-white px-3 py-2" />
      </label>
      <label className="block text-sm">
        Order code
        <input required name="code" placeholder="DH-XXXX" className="mt-1 w-full border border-soft-gold bg-white px-3 py-2" />
      </label>
      {error ? <p className="text-sm text-deep-gold">{error}</p> : null}
      <button type="submit" className="w-full bg-house-gold px-6 py-3 text-sm font-medium text-ink sm:w-auto">
        Find order
      </button>
    </form>
  );
}
