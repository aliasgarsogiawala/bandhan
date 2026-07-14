import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidToken } from "@/lib/admin/auth";

// Guards the admin panel: unauthenticated visitors are sent to the login page,
// and an already-authenticated visitor hitting the login page is sent inward.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
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
  matcher: ["/admin/:path*"],
};
