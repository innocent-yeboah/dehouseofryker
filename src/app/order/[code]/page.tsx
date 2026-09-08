import { OrderLedger } from "@/components/house/OrderLedger";
import { StorefrontChrome } from "@/components/house/StorefrontChrome";
import { getOrderByCodeAndToken } from "@/lib/orders";
import { whatsappHref } from "@/lib/site";
import Link from "next/link";

type PageProps = {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ t?: string }>;
};

export default async function OrderPage({ params, searchParams }: PageProps) {
  const { code } = await params;
  const { t } = await searchParams;
  if (!t) {
    return (
      <StorefrontChrome>
        <h1 className="font-serif text-4xl">Look up this order</h1>
        <p className="mt-3 text-sm text-muted">
          The order code alone is not enough. Use find my order with your phone.
        </p>
        <Link className="mt-6 inline-block text-deep-gold" href="/order/find">
          Find my order
        </Link>
      </StorefrontChrome>
    );
  }

  const order = await getOrderByCodeAndToken(decodeURIComponent(code), t);
  if (!order) {
    return (
      <StorefrontChrome>
        <p>We could not open that order.</p>
        <Link href="/order/find" className="text-deep-gold">
          Find my order
        </Link>
      </StorefrontChrome>
    );
  }

  return (
    <StorefrontChrome>
      <OrderLedger order={order} />
      <p className="mt-6 text-sm text-muted">
        Save this page or use Find my order later. Questions?{" "}
        <a
          className="text-deep-gold"
          href={whatsappHref(`Hello, my order code is ${order.code}.`)}
        >
          WhatsApp us with your code
        </a>
        .
      </p>
    </StorefrontChrome>
  );
}
