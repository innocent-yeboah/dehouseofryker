"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/types/shop";

type CartState = {
  lines: CartLine[];
  add: (variantId: number, qty: number, max: number) => { ok: boolean; message?: string };
  setQty: (variantId: number, qty: number, max: number) => void;
  remove: (variantId: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (variantId, qty, max) => {
        const current = get().lines.find((line) => line.variantId === variantId)?.qty ?? 0;
        const next = current + qty;
        if (next > max) {
          return {
            ok: false,
            message: `This item is limited to ${max} per order. For a carton, WhatsApp the house.`,
          };
        }
        set({
          lines: current
            ? get().lines.map((line) =>
                line.variantId === variantId ? { ...line, qty: next } : line,
              )
            : [...get().lines, { variantId, qty }],
        });
        return { ok: true };
      },
      setQty: (variantId, qty, max) => {
        if (qty < 1) {
          set({ lines: get().lines.filter((line) => line.variantId !== variantId) });
          return;
        }
        const capped = Math.min(qty, max);
        set({
          lines: get().lines.map((line) =>
            line.variantId === variantId ? { ...line, qty: capped } : line,
          ),
        });
      },
      remove: (variantId) =>
        set({ lines: get().lines.filter((line) => line.variantId !== variantId) }),
      clear: () => set({ lines: [] }),
    }),
    { name: "dhr-cart" },
  ),
);
