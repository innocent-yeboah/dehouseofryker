import { GoldMark } from "@/components/house/GoldMark";
import { ownerSessionValid } from "@/lib/owner-session";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ok = await ownerSessionValid();
  return (
    <div className="min-h-screen bg-ivory">
      <header className="border-b border-soft-gold bg-white px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <GoldMark />
          {ok ? (
            <nav className="flex gap-4 text-sm">
              <Link href="/admin">Orders</Link>
              <Link href="/admin/products">Stock</Link>
              <Link href="/" className="text-muted">
                View shop
              </Link>
            </nav>
          ) : null}
        </div>
      </header>
      {children}
    </div>
  );
}

