import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ownerCredentialsOk } from "@/lib/owner-auth";
import { COOKIE, createOwnerSession } from "@/lib/owner-session";
import { clientIp, RATE_LIMITS, rateLimit, tooManyRequests } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const limited = rateLimit(`login:${clientIp(request)}`, RATE_LIMITS.login);
  if (!limited.ok) {
    return tooManyRequests(limited.retryAfterSec);
  }
  const form = await request.formData();
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  if (!ownerCredentialsOk(email, password)) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url), { status: 303 });
  }
  const token = await createOwnerSession();
  const response = NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
  response.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete(COOKIE);
  return NextResponse.json({ ok: true });
}
