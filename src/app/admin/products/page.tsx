import { WalkInForm } from "@/components/admin/OwnerOps";
import { requireOwner } from "@/lib/require-owner";
import { availabilityFor, availabilityLabel, shelfQty } from "@/lib/availability";
import { getProducts } from "@/lib/catalog";
import { formatGhs, sizeLabel } from "@/lib/money";

export default async function AdminProductsPage() {
  await requireOwner();
  const products = await getProducts();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-serif text-3xl">Stock</h1>
      <div className="mt-6">
        <WalkInForm products={products} />
      </div>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-soft-gold">
              <th className="py-2">Product</th>
              <th>Size</th>
              <th>Price</th>
              <th>On hand</th>
              <th>Reserved</th>
              <th>Shelf</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.flatMap((product) =>
              product.variants.map((variant) => (
                <tr key={variant.id} className="border-b border-soft-gold/40">
                  <td className="py-2">{product.name}</td>
                  <td>{sizeLabel(variant.sizeMl)}</td>
                  <td>{formatGhs(variant.priceGhs)}</td>
                  <td>{variant.stockOnHand}</td>
                  <td>{variant.stockReserved}</td>
                  <td>{shelfQty(variant)}</td>
                  <td>{availabilityLabel(availabilityFor(variant))}</td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
