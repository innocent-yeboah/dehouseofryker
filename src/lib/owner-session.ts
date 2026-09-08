import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const COOKIE = "dhr_owner";
export const OWNER_COOKIE = COOKIE;

function secretKey(): Uint8Array {
  const secret = process.env.OWNER_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("OWNER_SESSION_SECRET must be at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

export async function createOwnerSession(): Promise<string> {
  return new SignJWT({ role: "owner" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secretKey());
}

export async function ownerSessionValid(): Promise<boolean> {
  try {
    const jar = await cookies();
    const token = jar.get(COOKIE)?.value;
    if (!token) {
      return false;
    }
    await jwtVerify(token, secretKey());
    return true;
  } catch {
    return false;
  }
}

