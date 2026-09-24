import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const AUTH_ROUTES = ["/auth"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Sin sesión e intentando entrar a una ruta privada -> a /auth
  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Con sesión pero visitando /auth -> al dashboard
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
