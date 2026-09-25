import { StorefrontChrome } from "@/components/house/StorefrontChrome";
import { CheckoutForm } from "@/components/shop/CheckoutForm";
import { paymentMode } from "@/lib/momo";
import { copy, formatShopPhone, site } from "@/lib/site";

export default function CheckoutPage() {
  return (
    <StorefrontChrome>
      <h1 className="font-serif text-3xl sm:text-4xl">Checkout</h1>
      <p className="mt-3 max-w-xl text-sm text-muted">
        Guest checkout — no account. We need a Ghana phone so we can call you. Product prices are
        the final GHS for what is in the cart. {copy.deliveryGoodsOnly}
      </p>
      <CheckoutForm
        paymentMode={paymentMode()}
        merchantNumber={formatShopPhone(site.momoMerchant) ?? site.momoMerchant}
      />
    </StorefrontChrome>
  );
}
