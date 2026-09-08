import { OrderActions, WalkInForm } from "@/components/admin/OwnerOps";
import { requireOwner } from "@/lib/require-owner";
import { statusCustomerLabel } from "@/lib/availability";
import { getProducts } from "@/lib/catalog";
import { listOrders } from "@/lib/orders";
import Link from "next/link";

export default async function AdminHomePage() {
  await requireOwner();
  const [orders, products] = await Promise.all([listOrders(), getProducts()]);
  const open = orders.filter(
    (item) => !["picked_up", "dispatched", "refunded", "cancelled_released"].includes(item.status),
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-serif text-3xl">Orders</h1>
      <p className="mt-2 text-sm text-muted">One-tap walk-in sale keeps website stock true to the shelf.</p>
      <div className="mt-6">
        <WalkInForm products={products} />
      </div>
      <ul className="mt-8 space-y-6">
        {open.length === 0 ? <li className="text-sm text-muted">No open orders.</li> : null}
        {open.map((order) => (
          <li key={order.id} className="border border-soft-gold bg-white p-4">
            <div className="flex flex-wrap justify-between gap-2">
              <Link href={`/admin/orders/${order.id}`} className="font-serif text-2xl">
                {order.code}
              </Link>
              <span className="text-sm text-deep-gold">{statusCustomerLabel(order.status)}</span>
            </div>
            <p className="text-sm text-muted">
              {order.customerName} · {order.phone} · {order.fulfillment}
            </p>
            <ul className="mt-2 text-sm">
              {order.items.map((item) => (
                <li key={item.sku}>
                  {item.productName} {item.sizeLabel} × {item.qty} ({item.availabilitySnapshot})
                </li>
              ))}
            </ul>
            <OrderActions order={order} />
          </li>
        ))}
      </ul>
      <h2 className="mt-12 font-serif text-2xl">Recent closed</h2>
      <ul className="mt-4 space-y-2 text-sm">
        {orders
          .filter((item) => ["picked_up", "dispatched", "refunded", "cancelled_released"].includes(item.status))
          .slice(0, 10)
          .map((order) => (
            <li key={order.id}>
              <Link href={`/admin/orders/${order.id}`}>{order.code}</Link> ·{" "}
              {statusCustomerLabel(order.status)}
            </li>
          ))}
      </ul>
    </main>
  );
}
