import { timingSafeEqual } from "node:crypto";

export function ownerCredentialsOk(email: string, password: string): boolean {
  const expectedEmail = process.env.OWNER_EMAIL ?? "";
  const expectedPassword = process.env.OWNER_PASSWORD ?? "";
  if (!expectedEmail || !expectedPassword) {
    return false;
  }
  const emailMatch = timingSafeEqual(
    Buffer.from(email.trim().toLowerCase().padEnd(128)),
    Buffer.from(expectedEmail.trim().toLowerCase().padEnd(128)),
  );
  const passMatch = timingSafeEqual(
    Buffer.from(password.padEnd(256)),
    Buffer.from(expectedPassword.padEnd(256)),
  );
  return emailMatch && passMatch;
}
