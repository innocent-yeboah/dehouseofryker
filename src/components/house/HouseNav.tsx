"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { GoldMark } from "@/components/house/GoldMark";
import { kindLabels, kindPaths } from "@/data/seed-catalog";
import { site } from "@/lib/site";
import { useCart } from "@/store/cart";

const utilityLeft = [
  { href: "/about", label: "About Us" },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/branding", label: "Branding" },
];

const utilityRight = [
  { href: "/order/find", label: "Track Your Order" },
  { href: "/contact", label: "Contact Us" },
  { href: "/policies", label: "Policies" },
];

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/customize", label: "Custom blend" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

const shopByKind = [
  { href: `/shop/${kindPaths.spray}`, label: kindLabels.spray },
  { href: `/shop/${kindPaths.format}`, label: kindLabels.format },
];

function formatHotline(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("233") && digits.length >= 12) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return raw;
}

export function HouseNav() {
  const pathname = usePathname();
  const router = useRouter();
  const countStored = useCart((state) => state.lines.reduce((sum, line) => sum + line.qty, 0));
  const [open, setOpen] = useState(false);
  const [kindsOpen, setKindsOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState("");
  const hotline = formatHotline(site.whatsapp);
  const tel = `tel:+${site.whatsapp.replace(/\D/g, "")}`;

  useEffect(() => {
    setCount(countStored);
  }, [countStored]);

  useEffect(() => {
    setOpen(false);
    setKindsOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  }

  return (
    <header className="sticky top-0 z-40">
      <div className="hidden bg-ink text-[11px] text-white/85 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2">
          <nav className="flex flex-wrap items-center gap-x-3 gap-y-1" aria-label="Utility">
            {utilityLeft.map((link, index) => (
              <span key={link.href} className="inline-flex items-center gap-3">
                {index > 0 ? <span className="text-white/30" aria-hidden="true">|</span> : null}
                <Link href={link.href} className="hover:text-house-gold">
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>
          <nav className="flex flex-wrap items-center gap-x-3 gap-y-1" aria-label="Account links">
            {utilityRight.map((link, index) => (
              <span key={link.href} className="inline-flex items-center gap-3">
                {index > 0 ? <span className="text-white/30" aria-hidden="true">|</span> : null}
                <Link href={link.href} className="hover:text-house-gold">
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-ink text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:gap-6 md:py-4">
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center text-white md:hidden"
            aria-expanded={open}
            aria-controls="house-mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Menu</span>
            <span aria-hidden="true" className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
            </span>
          </button>

          <Link href="/" className="shrink-0" aria-label="De House of Ryker home">
            <GoldMark className="brightness-110" />
          </Link>

          <form onSubmit={onSearch} className="hidden min-w-0 flex-1 md:block md:max-w-xl lg:mx-8 lg:max-w-2xl">
            <label className="sr-only" htmlFor="house-search">
              Search for products
            </label>
            <div className="flex overflow-hidden rounded-full bg-white">
              <input
                id="house-search"
                name="q"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for products"
                className="min-w-0 flex-1 bg-transparent px-5 py-2.5 text-sm text-ink outline-none"
              />
              <button
                type="submit"
                className="m-1 rounded-full bg-house-gold px-4 text-sm font-medium text-ink"
              >
                Search
              </button>
            </div>
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-4 md:ml-0">
            <a href={tel} className="hidden text-right lg:block">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-house-gold">Hotline</span>
              <span className="text-sm font-medium text-white">{hotline}</span>
            </a>
            <Link
              href="/cart"
              className="relative inline-flex min-h-11 items-center gap-2 text-sm text-white hover:text-house-gold"
            >
              <span className="hidden sm:inline">Cart</span>
              <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-house-gold px-2 text-xs font-semibold text-ink">
                {count}
              </span>
            </Link>
          </div>
        </div>

        <form onSubmit={onSearch} className="border-t border-white/10 bg-deep-gold px-4 py-2.5 md:hidden">
          <label className="sr-only" htmlFor="house-search-mobile">
            Search for products
          </label>
          <div className="flex overflow-hidden rounded-full bg-white">
            <input
              id="house-search-mobile"
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for products"
              className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-ink outline-none"
            />
            <button type="submit" className="m-1 rounded-full bg-house-gold px-3 text-xs font-medium text-ink">
              Search
            </button>
          </div>
        </form>
      </div>

      <nav className="hidden bg-deep-gold text-white md:block" aria-label="Main">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-3 text-sm font-medium transition-colors hover:bg-house-gold/30 ${
                pathname === link.href ? "bg-house-gold/25" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center gap-1 px-4 py-3 text-sm font-medium hover:bg-house-gold/30"
              aria-expanded={kindsOpen}
              onClick={() => setKindsOpen((value) => !value)}
            >
              Shop by category
              <span aria-hidden="true">▾</span>
            </button>
            {kindsOpen ? (
              <div className="absolute left-0 top-full z-50 min-w-48 border border-soft-gold bg-white py-2 text-ink shadow-lg">
                {shopByKind.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-sm hover:bg-ivory hover:text-deep-gold"
                    onClick={() => setKindsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </nav>

      {open ? (
        <nav
          id="house-mobile-nav"
          className="border-b border-soft-gold bg-white md:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col px-4 py-2">
            {[...mainLinks, ...shopByKind, { href: "/cart", label: `Cart (${count})` }, ...utilityRight].map(
              (link) => (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  className="min-h-11 border-b border-soft-gold/40 py-3 text-sm text-ink"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
