import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth";

const protectedRoutes = ["/dashboard", "/apply", "/checkout"];
const adminRoutes = ["/admin"];
const authRoutes = ["/login", "/signup"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdmin = adminRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  // For page routes, check cookie-based token
  const cookieToken = request.cookies.get("access_token")?.value;
  const activeToken = token || cookieToken;

  if (isProtected || isAdmin) {
    if (!activeToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const payload = verifyAccessToken(activeToken);

      if (isAdmin && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (isAuthRoute && activeToken) {
    try {
      verifyAccessToken(activeToken);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch {
      // Token invalid, allow through
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/apply/:path*", "/checkout/:path*", "/admin/:path*", "/login", "/signup"],
};
