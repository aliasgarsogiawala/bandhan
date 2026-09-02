import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidToken } from "@/lib/admin/auth";
import { AGENT_COOKIE, verifyAgentSession } from "@/lib/auth/agentSession";
import { USER_COOKIE, verifySession } from "@/lib/auth/session";

/** Send an unauthenticated visitor to `loginPath`, remembering where they were. */
function toLogin(request: NextRequest, loginPath: string) {
  const url = request.nextUrl.clone();
  // The booking engine carries its selection in the query string
  // (`/book?type=package&id=…`), so the whole target has to survive the round
  // trip — not just the pathname.
  const target = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  url.pathname = loginPath;
  url.search = `?from=${encodeURIComponent(target)}`;
  return NextResponse.redirect(url);
}

// Guards the admin panel, the agent portal and the customer booking engine:
// unauthenticated visitors are sent to their respective login page, and an
// already-authenticated visitor hitting the login page is sent inward.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Booking is account-only: a proposal has to belong to someone before it can
  // be quoted and followed up. Gating here rather than inside the engine keeps
  // an unauthenticated visitor from ever seeing a form they cannot submit.
  if (pathname.startsWith("/book")) {
    return verifySession(request.cookies.get(USER_COOKIE)?.value)
      ? NextResponse.next()
      : toLogin(request, "/signin");
  }

  if (pathname.startsWith("/agent")) {
    const isLoginRoute = pathname === "/agent/login";
    const authed = Boolean(verifyAgentSession(request.cookies.get(AGENT_COOKIE)?.value));

    if (!isLoginRoute && !authed) return toLogin(request, "/agent/login");

    if (isLoginRoute && authed) {
      const url = request.nextUrl.clone();
      url.pathname = "/agent";
      url.search = "";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  const isLoginRoute = pathname === "/admin/login";
  const authed = isValidToken(request.cookies.get(ADMIN_COOKIE)?.value);

  if (!isLoginRoute && !authed) return toLogin(request, "/admin/login");

  if (isLoginRoute && authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/agent/:path*", "/book"],
};
