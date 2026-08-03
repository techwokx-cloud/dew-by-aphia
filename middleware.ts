import { NextRequest, NextResponse } from "next/server";

const FALLBACK_PASSWORD = "dew-admin-2026";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const expected = process.env.ADMIN_PASSWORD || FALLBACK_PASSWORD;
  const cookie = request.cookies.get("admin_pw")?.value;

  if (cookie !== expected) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
