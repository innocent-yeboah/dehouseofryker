import { z } from "zod";
import { findOrder } from "@/lib/orders";

const schema = z.object({
  phone: z.string().min(9),
  code: z.string().min(3),
});

export async function POST(request: Request) {
  const json: unknown = await request.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Enter your phone and order code." }, { status: 400 });
  }
  const order = await findOrder(parsed.data.phone, parsed.data.code);
  if (!order) {
    return Response.json({ error: "We could not find that order. Check the code and phone." }, { status: 404 });
  }
  return Response.json({ code: order.code, viewToken: order.viewToken });
}
