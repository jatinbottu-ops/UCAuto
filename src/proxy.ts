import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack";

const protectedRoutes = ["/dashboard", "/apply", "/checkout"];
const adminRoutes = ["/admin"];
const authRoutes = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdmin = adminRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtected || isAdmin) {
    const user = await stackServerApp.getUser({ or: "return-null" });
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (isAuthRoute) {
    const user = await stackServerApp.getUser({ or: "return-null" });
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/apply/:path*", "/checkout/:path*", "/admin/:path*", "/login", "/signup"],
};
