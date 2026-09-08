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

/**
 * MTN MoMo Collections RequestToPay (sandbox) when keys exist.
 * Without keys, checkout uses pay-to-merchant + reference.
 */
export async function requestToPay(input: {
  amountGhs: number;
  msisdn: string;
  externalId: string;
}): Promise<{ ok: boolean; message: string }> {
  if (!momoConfigured()) {
    return { ok: false, message: "MoMo API is not configured." };
  }
  const base =
    process.env.MOMO_TARGET_ENVIRONMENT === "mtnghana"
      ? "https://proxy.momoapi.mtn.com"
      : "https://sandbox.momodeveloper.mtn.com";
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
    return { ok: false, message: "Could not start MoMo. Try pay-to-merchant." };
  }
  const tokenJson = (await tokenRes.json()) as { access_token?: string };
  const access = tokenJson.access_token;
  if (!access) {
    return { ok: false, message: "MoMo token missing." };
  }
  const referenceId = crypto.randomUUID();
  const env = process.env.MOMO_TARGET_ENVIRONMENT ?? "sandbox";
  const payRes = await fetch(`${base}/collection/v1_0/requesttopay`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access}`,
      "X-Reference-Id": referenceId,
      "X-Target-Environment": env,
      "Ocp-Apim-Subscription-Key": sub,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: input.amountGhs.toFixed(2),
      currency: env === "sandbox" ? "EUR" : "GHS",
      externalId: input.externalId,
      payer: { partyIdType: "MSISDN", partyId: input.msisdn },
      payerMessage: "De House of Ryker",
      payeeNote: input.externalId,
    }),
  });
  if (payRes.status !== 202) {
    return { ok: false, message: "MoMo did not accept the payment request." };
  }
  return { ok: true, message: referenceId };
}
