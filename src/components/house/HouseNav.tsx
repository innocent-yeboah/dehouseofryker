"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { GoldMark } from "@/components/house/GoldMark";
import type { NavGroup } from "@/lib/ia";
import { formatShopPhone, shopTelHref, site } from "@/lib/site";
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

const utilityExtras = [
  { href: "/shop", label: "Shop" },
  { href: "/customize", label: "Custom blend" },
];

export function HouseNav({
  departments,
  quick,
}: {
  departments: NavGroup[];
  quick: Array<{ href: string; label: string }>;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const countStored = useCart((state) => state.lines.reduce((sum, line) => sum + line.qty, 0));
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState("");
  const hotline = formatShopPhone(site.whatsapp);
  const tel = hotline ? shopTelHref(site.whatsapp) : "";

  useEffect(() => {
    setCount(countStored);
  }, [countStored]);

  useEffect(() => {
    setOpen(false);
    setOpenMenu(null);
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
                {index > 0 ? (
                  <span className="text-white/30" aria-hidden="true">
                    |
                  </span>
                ) : null}
                <Link href={link.href} className="hover:text-house-gold">
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>
          <nav className="flex flex-wrap items-center gap-x-3 gap-y-1" aria-label="Account links">
            {utilityRight.map((link, index) => (
              <span key={link.href} className="inline-flex items-center gap-3">
                {index > 0 ? (
                  <span className="text-white/30" aria-hidden="true">
                    |
                  </span>
                ) : null}
                <Link href={link.href} className="hover:text-house-gold">
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-ink text-white">
        <div className="mx-auto flex max-w-7xl flex-nowrap items-center gap-2 px-3 py-2.5 md:gap-6 md:px-4 md:py-4">
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

          <Link
            href="/"
            className="flex shrink-0 items-center gap-3"
            aria-label="De House of Ryker home"
          >
            <GoldMark
              showWord={false}
              className="brightness-110"
              imgClassName="h-9 w-9 object-contain sm:h-11 sm:w-11 md:h-12 md:w-12"
            />
            <span className="flex flex-col justify-center leading-none">
              <span className="house-wordmark whitespace-nowrap text-base font-semibold tracking-[0.01em] text-ivory min-[390px]:text-[17px] sm:text-xl md:text-[1.65rem]">
                {site.name}
              </span>
              <span className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.32em] text-house-gold md:block">
                Accra
              </span>
            </span>
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
              <button type="submit" className="m-1 rounded-full bg-house-gold px-4 text-sm font-medium text-ink">
                Search
              </button>
            </div>
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 md:ml-0 md:gap-4">
            {hotline ? (
              <>
                <a href={tel} className="hidden text-right leading-tight md:block">
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-house-gold">Hotline</span>
                  <span className="whitespace-nowrap text-sm font-medium text-white">{hotline}</span>
                </a>
                <a
                  href={tel}
                  className="inline-flex h-10 w-10 items-center justify-center text-white md:hidden"
                  aria-label={`Hotline ${hotline}`}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </>
            ) : null}
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

        <form onSubmit={onSearch} className="border-t border-white/10 bg-deep-gold px-3 py-2.5 md:hidden">
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
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-1 px-4">
          <Link
            href="/"
            className={`px-3 py-3 text-sm font-medium hover:bg-house-gold/30 ${pathname === "/" ? "bg-house-gold/25" : ""}`}
          >
            Home
          </Link>
          <Link
            href="/shop"
            className={`px-3 py-3 text-sm font-medium hover:bg-house-gold/30 ${pathname === "/shop" ? "bg-house-gold/25" : ""}`}
          >
            Shop
          </Link>
          {departments.map((department) => (
            <div
              key={department.href}
              className="relative"
              onMouseEnter={() => setOpenMenu(department.href)}
              onMouseLeave={() => setOpenMenu((current) => (current === department.href ? null : current))}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1 px-3 py-3 text-sm font-medium hover:bg-house-gold/30"
                aria-expanded={openMenu === department.href}
                onClick={() => setOpenMenu(department.href)}
              >
                {department.label}
                <span aria-hidden="true">▾</span>
              </button>
              {openMenu === department.href ? (
                <div className="absolute left-0 top-full z-50 min-w-56 border border-soft-gold bg-white py-2 text-ink shadow-lg">
                  <Link
                    href={department.href}
                    className="block px-4 py-2 text-sm font-medium hover:bg-ivory hover:text-deep-gold"
                    onClick={() => setOpenMenu(null)}
                  >
                    All {department.label}
                  </Link>
                  {department.sections.map((section) => (
                    <Link
                      key={section.href}
                      href={section.href}
                      className="block px-4 py-2 text-sm hover:bg-ivory hover:text-deep-gold"
                      onClick={() => setOpenMenu(null)}
                    >
                      {section.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          {quick.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-3 text-sm font-medium hover:bg-house-gold/30 ${
                pathname === link.href ? "bg-house-gold/25" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/customize" className="px-3 py-3 text-sm font-medium hover:bg-house-gold/30">
            Custom blend
          </Link>
        </div>
      </nav>

      {open ? (
        <nav id="house-mobile-nav" className="border-b border-soft-gold bg-white md:hidden" aria-label="Mobile">
          <div className="flex flex-col px-4 py-2">
            <Link href="/" className="min-h-11 border-b border-soft-gold/40 py-3 text-sm font-medium text-ink" onClick={() => setOpen(false)}>
              Home
            </Link>
            {departments.map((department) => (
              <div key={department.href} className="border-b border-soft-gold/40 py-2">
                <Link
                  href={department.href}
                  className="block py-2 text-sm font-medium text-ink"
                  onClick={() => setOpen(false)}
                >
                  {department.label}
                </Link>
                {department.sections.map((section) => (
                  <Link
                    key={section.href}
                    href={section.href}
                    className="block py-2 pl-4 text-sm text-muted"
                    onClick={() => setOpen(false)}
                  >
                    {section.label}
                  </Link>
                ))}
              </div>
            ))}
            {quick.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="min-h-11 border-b border-soft-gold/40 py-3 text-sm text-ink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {[...utilityExtras, { href: "/cart", label: `Cart (${count})` }, ...utilityRight].map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className="min-h-11 border-b border-soft-gold/40 py-3 text-sm text-ink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
