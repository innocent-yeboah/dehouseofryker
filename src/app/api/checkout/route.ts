import { z } from "zod";
import { normalizePhone, maskMomo } from "@/lib/local-db";
import { paymentMode, requestToPay } from "@/lib/momo";
import { createOrder, ShopError } from "@/lib/orders";
import { site } from "@/lib/site";
import type { Fulfillment, PaymentMethod } from "@/types/shop";

const bodySchema = z.object({
  customerName: z.string().min(2).max(120),
  phone: z.string().min(9).max(20),
  email: z.union([z.string().email(), z.literal("")]).nullable().optional(),
  fulfillment: z.enum(["pickup", "delivery"]),
  deliveryAddress: z.string().max(500).nullable().optional(),
  payment: z.enum(["momo", "cash_pickup", "merchant_reference"]),
  momoNumber: z.string().optional(),
  momoRef: z.string().optional(),
  lines: z.array(z.object({ variantId: z.number().int(), qty: z.number().int().min(1) })).min(1),
});

async function notifyOwner(code: string, name: string, status: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.OWNER_NOTIFY_EMAIL;
  if (!key || !to) {
    return;
  }
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "De House of Ryker <orders@dehouseofryker.com>",
        to: [to],
        subject: `New order ${code}`,
        text: `${name} placed ${code}. Status: ${status}. Open ${site.siteUrl}/admin`,
      }),
    });
  } catch {
    // Owner still has the admin list.
  }
}

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return Response.json({ error: "Please check the form and try again." }, { status: 400 });
    }
    const data = parsed.data;
    const phone = normalizePhone(data.phone);
    if (!phone) {
      return Response.json({ error: "Enter a Ghana phone number." }, { status: 400 });
    }
    const fulfillment = data.fulfillment as Fulfillment;
    if (fulfillment === "delivery" && !data.deliveryAddress?.trim()) {
      return Response.json({ error: "Add a Ghana delivery address." }, { status: 400 });
    }
    if (fulfillment === "delivery" && data.payment === "cash_pickup") {
      return Response.json(
        { error: "Delivery is paid by MoMo for the products. Cash is for shop pickup." },
        { status: 400 },
      );
    }

    let payment = data.payment as PaymentMethod;
    const mode = paymentMode();
    if (payment === "momo" && mode === "merchant_pay") {
      payment = "merchant_reference";
    }
    if (payment === "merchant_reference" && !data.momoRef?.trim()) {
      return Response.json({ error: "Add the MoMo reference from your SMS." }, { status: 400 });
    }

    let momoNumberMasked: string | null = null;
    let msisdn: string | null = null;
    if (payment === "momo") {
      msisdn = normalizePhone(data.momoNumber ?? data.phone);
      if (!msisdn) {
        return Response.json({ error: "Enter the MoMo number to prompt." }, { status: 400 });
      }
      momoNumberMasked = maskMomo(msisdn);
    }

    const order = await createOrder({
      customerName: data.customerName,
      phone,
      email: data.email && data.email.length > 0 ? data.email : null,
      fulfillment,
      deliveryAddress: fulfillment === "delivery" ? data.deliveryAddress?.trim() ?? null : null,
      payment,
      lines: data.lines,
      momoRef: data.momoRef?.trim() ?? null,
      momoNumberMasked,
    });

    if (payment === "momo" && msisdn) {
      const pay = await requestToPay({
        amountGhs: order.goodsTotalGhs,
        msisdn,
        externalId: order.code,
      });
      if (!pay.ok) {
        return Response.json(
          {
            code: order.code,
            viewToken: order.viewToken,
            status: order.status,
            warning: "Order is saved. MoMo prompt failed — pay the merchant number and tell us the reference.",
          },
          { status: 201 },
        );
      }
    }

    await notifyOwner(order.code, order.customerName, order.status);
    return Response.json({ code: order.code, viewToken: order.viewToken, status: order.status });
  } catch (error) {
    if (error instanceof ShopError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "unknown";
    console.error("checkout failed", message);
    return Response.json({ error: "Let’s try that again together." }, { status: 500 });
  }
}
