import { NextResponse } from "next/server";
import { ownerSessionValid } from "@/lib/owner-session";
import { applyOwnerAction, listOrders, recordWalkIn, ShopError } from "@/lib/orders";
import type { OwnerAction } from "@/lib/orders";

export async function GET() {
  if (!(await ownerSessionValid())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await listOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  if (!(await ownerSessionValid())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const json = (await request.json()) as {
    type?: string;
    orderId?: string;
    action?: OwnerAction;
    deliveryFeeGhs?: number | null;
    variantId?: number;
    qty?: number;
  };
  try {
    if (json.type === "walk_in") {
      await recordWalkIn(Number(json.variantId), Number(json.qty));
      return NextResponse.json({ ok: true });
    }
    if (json.type === "order" && json.orderId && json.action) {
      const order = await applyOwnerAction(json.orderId, json.action, {
        deliveryFeeGhs: json.deliveryFeeGhs ?? null,
      });
      return NextResponse.json({ order });
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    if (error instanceof ShopError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Let’s try that again together." }, { status: 500 });
  }
}
