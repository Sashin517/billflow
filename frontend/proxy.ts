import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const token = request.cookies.get("billflow_token")?.value;
  const { pathname } = request.nextUrl;

  // Protect (app) routes: Redirect logged-out visitors to login
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/invoices") ||
    pathname.startsWith("/clients") ||
    pathname.startsWith("/settings");

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Auth routes: Redirect logged-in users away from login/signup to the dashboard
  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|icons|favicon.ico).*)"],
};