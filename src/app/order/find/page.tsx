import { StorefrontChrome } from "@/components/house/StorefrontChrome";
import { FindOrderForm } from "@/components/shop/FindOrderForm";

export default function FindOrderPage() {
  return (
    <StorefrontChrome>
      <h1 className="font-serif text-3xl sm:text-4xl">Find my order</h1>
      <p className="mt-2 max-w-lg text-sm text-muted">
        No account needed. Use the Ghana phone and order code from your confirmation screen.
      </p>
      <FindOrderForm />
    </StorefrontChrome>
  );
}
