import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedServer } from "./hooks/isAuthServer";
import { auth } from "./helpers/auths";
import { generateTestWebhookSignature } from "./helpers/generateSignature";

export async function middleware(request: NextRequest) {
  const payload = "simplip2p";
  const { signature, timestamp } = await generateTestWebhookSignature(
    payload,
    process.env.NEXT_PUBLIC_SK || ""
  );
  const orgName = request.cookies.get("orgName")?.value;
  const host = request.headers.get("host");
  const subdomain = host?.split(".")[0] || "";
  const X = {
    x_signature: signature,
    x_timestamp: timestamp,
  };
  const isValidSubdomain = auth.verifySubDomain(subdomain, X);
  console.log(JSON.stringify(isValidSubdomain, null, 2), "running");
  const { pathname } = request.nextUrl;
  const publicPaths = ["/login", "/register", "/forgot-password", "/"];
  const isPublicPath =
    publicPaths.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith("/auth/");

  const isOrgDashboard =
    pathname.includes("/dashboard") &&
    pathname !== "/dashboard" &&
    pathname.split("/").length === 3;
  if (!isAuthenticatedServer(request) && !isPublicPath) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    const redirect = NextResponse.redirect(loginUrl);
    return redirect;
  }
  if (!isValidSubdomain) {
    return NextResponse.redirect(new URL("/subdomain-not-found", request.url));
  }

  if (
    isAuthenticatedServer(request) &&
    isPublicPath &&
    orgName &&
    !isOrgDashboard
  ) {
    return NextResponse.redirect(new URL(`/${orgName}/dashboard`, request.url));
  }
  if (subdomain === "app" || subdomain === "www") {
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match everything except static files
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
