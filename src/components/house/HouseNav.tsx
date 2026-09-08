"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GoldMark } from "@/components/house/GoldMark";
import { useCart } from "@/store/cart";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/customize", label: "Custom" },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/branding", label: "Branding" },
  { href: "/about", label: "The house" },
];

export function HouseNav() {
  const pathname = usePathname();
  const countStored = useCart((state) => state.lines.reduce((sum, line) => sum + line.qty, 0));
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(countStored);
  }, [countStored]);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="border-b border-soft-gold/60 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:py-4">
        <Link href="/" className="shrink-0" aria-label="De House of Ryker home">
          <GoldMark />
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wide ${
                pathname === link.href || pathname.startsWith(`${link.href}/`)
                  ? "text-deep-gold"
                  : "text-ink hover:text-deep-gold"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/cart" className="text-sm text-ink hover:text-deep-gold">
            Cart{count > 0 ? ` (${count})` : ""}
          </Link>
        </nav>
        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center text-sm text-deep-gold md:hidden"
          aria-expanded={open}
          aria-controls="house-mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>
      </div>
      {open ? (
        <nav
          id="house-mobile-nav"
          className="flex flex-col gap-1 border-t border-soft-gold/60 px-4 py-3 md:hidden"
          aria-label="Mobile"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="min-h-11 py-2"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/cart" className="min-h-11 py-2" onClick={() => setOpen(false)}>
            Cart{count > 0 ? ` (${count})` : ""}
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
