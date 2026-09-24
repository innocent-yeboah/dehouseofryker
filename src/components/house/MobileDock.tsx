"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { whatsappHref } from "@/lib/site";
import { useCart } from "@/store/cart";

export function MobileDock() {
  const pathname = usePathname();
  const countStored = useCart((state) => state.lines.reduce((sum, line) => sum + line.qty, 0));
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(countStored);
  }, [countStored]);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const items = [
    { href: "/shop", label: "Shop" },
    { href: "/customize", label: "Custom" },
    { href: "/cart", label: "Cart", badge: count },
    { href: "/order/find", label: "Orders" },
  ];

  return (
    <>
      <a
        href={whatsappHref("Hello, I have a question about De House of Ryker.")}
        className="fixed bottom-20 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-sm font-semibold text-white shadow-lg md:bottom-6"
        aria-label="WhatsApp the house"
      >
        WA
      </a>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 backdrop-blur md:hidden"
        aria-label="Mobile dock"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-4 px-2 py-2 text-center text-[11px]">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`relative flex min-h-12 flex-col items-center justify-center gap-0.5 ${
                    active ? "text-deep-gold" : "text-ink"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 ? (
                    <span className="absolute right-4 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-deep-gold px-1 text-[10px] text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
