import { confirmVerifiedMomo } from "@/lib/orders";
import { expectedMomoCurrency, getRequestToPayStatus, isMomoReferenceId, paymentMode } from "@/lib/momo";

function unverified(): Response {
  return Response.json({ error: "Unverified." }, { status: 401 });
}

/**
 * MTN may POST a callback, but the body is not proof of payment.
 * The reference id is checked with MTN's RequestToPay status API.
 * Pay-to-number orders are never updated here.
 */
export async function POST(request: Request) {
  if (paymentMode() !== "momo_api") {
    return unverified();
  }

  let bodyRef = "";
  try {
    const text = await request.text();
    if (text.trim()) {
      const json = JSON.parse(text) as { referenceId?: unknown };
      if (typeof json.referenceId === "string") {
        bodyRef = json.referenceId.trim();
      }
    }
  } catch {
    return unverified();
  }

  const headerRef = request.headers.get("x-reference-id")?.trim() ?? "";
  if (headerRef && bodyRef && headerRef !== bodyRef) {
    return unverified();
  }
  const referenceId = headerRef || bodyRef;
  if (!isMomoReferenceId(referenceId)) {
    return unverified();
  }

  const checked = await getRequestToPayStatus(referenceId);
  if (!checked.ok || checked.payment.status !== "SUCCESSFUL") {
    return unverified();
  }

  const result = await confirmVerifiedMomo({
    code: checked.payment.externalId,
    referenceId,
    amount: checked.payment.amount,
    currency: checked.payment.currency,
    expectedCurrency: expectedMomoCurrency(),
  });
  if (result === "not_found") {
    return Response.json({ error: "Unknown order." }, { status: 404 });
  }
  if (result === "rejected") {
    return unverified();
  }
  return Response.json({ received: true });
}
