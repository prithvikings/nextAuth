import { url } from "inspector";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const publiRoutes = [
    "/login",
    "/signin",
    "/register",
    "/api/auth",
    "/favicon.ico",
    "_next",
    "/signup",
  ];

  if (publiRoutes.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

if (!token) {
  const loginUrl = new URL("/signin", req.url);
  loginUrl.searchParams.set("callbackUrl", req.url);
  return NextResponse.redirect(loginUrl);
}
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|node_modules).*)",
};
