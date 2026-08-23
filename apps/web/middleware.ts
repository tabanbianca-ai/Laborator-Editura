import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "laborator_session_token";
const UI_LOCALE_COOKIE_NAME = "laborator_ui_locale";
const UI_LOCALES = new Set([
  "ro-RO",
  "en-US",
  "en-GB",
  "es-ES",
  "fr-FR",
  "pt-PT",
  "pt-BR",
  "it-IT",
  "de-DE"
]);
const PUBLIC_PATHS = new Set(["/login", "/reset-password"]);

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isFrameworkPath(pathname)) {
    return NextResponse.next();
  }

  const requestedLocale = request.nextUrl.searchParams.get("locale");
  if (requestedLocale) {
    if (!UI_LOCALES.has(requestedLocale)) {
      const invalidLocaleUrl = request.nextUrl.clone();
      invalidLocaleUrl.searchParams.delete("locale");
      invalidLocaleUrl.searchParams.set("localeError", "unsupported");
      return NextResponse.redirect(invalidLocaleUrl);
    }

    const localizedUrl = request.nextUrl.clone();
    localizedUrl.searchParams.delete("locale");
    const response = NextResponse.redirect(localizedUrl);
    response.cookies.set(UI_LOCALE_COOKIE_NAME, requestedLocale, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      secure: request.nextUrl.protocol === "https:"
    });
    return response;
  }

  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (hasSession && pathname === "/login") {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  if (!hasSession) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("returnTo", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

function isFrameworkPath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap") ||
    pathname.includes(".")
  );
}

export const config = {
  matcher: ["/((?!api).*)"]
};
