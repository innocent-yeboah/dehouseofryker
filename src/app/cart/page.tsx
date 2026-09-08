import { StorefrontChrome } from "@/components/house/StorefrontChrome";
import { CartView } from "@/components/shop/CartView";
import { getProducts } from "@/lib/catalog";

export default async function CartPage() {
  const products = await getProducts();
  return (
    <StorefrontChrome>
      <h1 className="font-serif text-3xl sm:text-4xl">Cart</h1>
      <div className="mt-8">
        <CartView products={products} />
      </div>
    </StorefrontChrome>
  );
}
