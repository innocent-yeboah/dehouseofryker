const REFERENCE_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function momoConfigured(): boolean {
  return Boolean(
    process.env.MOMO_COLLECTION_SUBSCRIPTION_KEY &&
      process.env.MOMO_API_USER &&
      process.env.MOMO_API_KEY,
  );
}

export function paymentMode(): "momo_api" | "merchant_pay" {
  return momoConfigured() ? "momo_api" : "merchant_pay";
}

export function isMomoReferenceId(value: string): boolean {
  return REFERENCE_ID.test(value);
}

/** Sandbox collections use EUR. Production (`mtnghana`) uses GHS. */
export function expectedMomoCurrency(): string {
  return (process.env.MOMO_TARGET_ENVIRONMENT ?? "sandbox") === "sandbox" ? "EUR" : "GHS";
}

function momoBase(): string {
  return process.env.MOMO_TARGET_ENVIRONMENT === "mtnghana"
    ? "https://proxy.momoapi.mtn.com"
    : "https://sandbox.momodeveloper.mtn.com";
}

type MomoSession =
  | { ok: true; access: string; base: string; sub: string; env: string }
  | { ok: false; message: string };

async function momoSession(): Promise<MomoSession> {
  if (!momoConfigured()) {
    return { ok: false, message: "MoMo API is not configured." };
  }
  const base = momoBase();
  const user = process.env.MOMO_API_USER ?? "";
  const key = process.env.MOMO_API_KEY ?? "";
  const sub = process.env.MOMO_COLLECTION_SUBSCRIPTION_KEY ?? "";
  const tokenRes = await fetch(`${base}/collection/token/`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${user}:${key}`).toString("base64")}`,
      "Ocp-Apim-Subscription-Key": sub,
    },
  });
  if (!tokenRes.ok) {
    return { ok: false, message: "Could not start MoMo. Send the total by MTN MoMo and share the reference." };
  }
  const tokenJson = (await tokenRes.json()) as { access_token?: string };
  const access = tokenJson.access_token;
  if (!access) {
    return { ok: false, message: "MoMo token missing." };
  }
  return {
    ok: true,
    access,
    base,
    sub,
    env: process.env.MOMO_TARGET_ENVIRONMENT ?? "sandbox",
  };
}

export type VerifiedCollection = {
  referenceId: string;
  status: string;
  externalId: string;
  amount: string;
  currency: string;
};

/**
 * MTN MoMo Collections RequestToPay when keys exist.
 * HTTP 202 means the prompt was accepted, not that the customer has paid.
 * Without keys, checkout asks the customer to send MoMo to the shop number and enter the reference.
 */
export async function requestToPay(input: {
  amountGhs: number;
  msisdn: string;
  externalId: string;
}): Promise<{ ok: true; referenceId: string } | { ok: false; message: string }> {
  const session = await momoSession();
  if (!session.ok) {
    return session;
  }
  const referenceId = crypto.randomUUID();
  const payRes = await fetch(`${session.base}/collection/v1_0/requesttopay`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access}`,
      "X-Reference-Id": referenceId,
      "X-Target-Environment": session.env,
      "Ocp-Apim-Subscription-Key": session.sub,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: input.amountGhs.toFixed(2),
      currency: session.env === "sandbox" ? "EUR" : "GHS",
      externalId: input.externalId,
      payer: { partyIdType: "MSISDN", partyId: input.msisdn },
      payerMessage: "De House of Ryker",
      payeeNote: input.externalId,
    }),
  });
  if (payRes.status !== 202) {
    return { ok: false, message: "MoMo did not accept the payment request." };
  }
  return { ok: true, referenceId };
}

/** Live status from MTN. Callers must not trust the callback body in place of this. */
export async function getRequestToPayStatus(
  referenceId: string,
): Promise<{ ok: true; payment: VerifiedCollection } | { ok: false; message: string }> {
  if (!isMomoReferenceId(referenceId)) {
    return { ok: false, message: "Payment reference is not valid." };
  }
  const session = await momoSession();
  if (!session.ok) {
    return session;
  }
  const statusRes = await fetch(`${session.base}/collection/v1_0/requesttopay/${referenceId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.access}`,
      "X-Target-Environment": session.env,
      "Ocp-Apim-Subscription-Key": session.sub,
    },
  });
  if (!statusRes.ok) {
    return { ok: false, message: "Could not verify this payment with MTN." };
  }
  const body = (await statusRes.json()) as {
    status?: unknown;
    externalId?: unknown;
    amount?: unknown;
    currency?: unknown;
  };
  if (typeof body.status !== "string" || typeof body.externalId !== "string") {
    return { ok: false, message: "MTN did not return a payment status." };
  }
  return {
    ok: true,
    payment: {
      referenceId,
      status: body.status,
      externalId: body.externalId,
      amount: typeof body.amount === "string" ? body.amount : String(body.amount ?? ""),
      currency: typeof body.currency === "string" ? body.currency : "",
    },
  };
}
