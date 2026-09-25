import { WalkInForm } from "@/components/admin/OwnerOps";
import { StockEditor } from "@/components/admin/StockEditor";
import { requireOwner } from "@/lib/require-owner";
import { usingDatabase } from "@/lib/db/config";
import { getProducts } from "@/lib/catalog";
import { listStockMovements } from "@/lib/orders";

export default async function AdminProductsPage() {
  await requireOwner();
  const [products, movements] = await Promise.all([getProducts(), listStockMovements()]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-serif text-3xl">Stock</h1>
      <div className="mt-6">
        <WalkInForm products={products} />
      </div>
      <StockEditor products={products} movements={movements} database={usingDatabase()} />
    </main>
  );
}
