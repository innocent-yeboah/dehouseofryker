import { NextResponse } from "next/server";

/** httpOnly cookie that lets the latest order page open without `?t=` in the URL. */
export const ORDER_VIEW_COOKIE = "dhr_order_view";

const MAX_AGE_SEC = 60 * 60 * 24 * 30;

export function orderViewCookieValue(code: string, token: string): string {
  return `${code}.${token}`;
}

/** Token from the cookie when it was issued for this order code. Legacy `?t=` links do not use this. */
export function orderViewTokenFromCookie(value: string | undefined, code: string): string | null {
  if (!value) {
    return null;
  }
  const dot = value.lastIndexOf(".");
  if (dot <= 0) {
    return null;
  }
  const cookieCode = value.slice(0, dot);
  const token = value.slice(dot + 1);
  if (cookieCode.toUpperCase() !== code.toUpperCase()) {
    return null;
  }
  if (!/^[a-f0-9]{16,}$/i.test(token)) {
    return null;
  }
  return token;
}

export function withOrderViewCookie(response: NextResponse, code: string, token: string): NextResponse {
  response.cookies.set(ORDER_VIEW_COOKIE, orderViewCookieValue(code, token), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
  return response;
}
