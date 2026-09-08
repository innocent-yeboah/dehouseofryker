import { OrderActions } from "@/components/admin/OwnerOps";
import { OrderLedger } from "@/components/house/OrderLedger";
import { requireOwner } from "@/lib/require-owner";
import { getOrderById } from "@/lib/orders";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderPage({ params }: PageProps) {
  await requireOwner();
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) {
    notFound();
  }
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <OrderLedger order={order} />
      <OrderActions order={order} />
    </main>
  );
}
