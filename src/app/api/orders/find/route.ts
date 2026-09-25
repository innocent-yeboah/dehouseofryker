import { NextResponse } from "next/server";
import { z } from "zod";
import { withOrderViewCookie } from "@/lib/order-view";
import { findOrder } from "@/lib/orders";
import { clientIp, RATE_LIMITS, rateLimit, tooManyRequests } from "@/lib/rate-limit";

const schema = z.object({
  phone: z.string().min(9),
  code: z.string().min(3),
});

export async function POST(request: Request) {
  const limited = rateLimit(`find:${clientIp(request)}`, RATE_LIMITS.find);
  if (!limited.ok) {
    return tooManyRequests(limited.retryAfterSec);
  }
  const json: unknown = await request.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Enter your phone and order code." }, { status: 400 });
  }
  const order = await findOrder(parsed.data.phone, parsed.data.code);
  if (!order) {
    return Response.json({ error: "We could not find that order. Check the code and phone." }, { status: 404 });
  }
  return withOrderViewCookie(
    NextResponse.json({ code: order.code, viewToken: order.viewToken }),
    order.code,
    order.viewToken,
  );
}
