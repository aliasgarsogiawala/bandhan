import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidToken } from "@/lib/admin/auth";
import { AGENT_COOKIE, verifyAgentSession } from "@/lib/auth/agentSession";

// Guards the admin panel and agent portal: unauthenticated visitors are sent
// to their respective login page, and an already-authenticated visitor
// hitting the login page is sent inward.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/agent")) {
    const isLoginRoute = pathname === "/agent/login";
    const authed = Boolean(verifyAgentSession(request.cookies.get(AGENT_COOKIE)?.value));

    if (!isLoginRoute && !authed) {
      const url = request.nextUrl.clone();
      url.pathname = "/agent/login";
      url.search = `?from=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }

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

  if (!isLoginRoute && !authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = `?from=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  if (isLoginRoute && authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/agent/:path*"],
};
