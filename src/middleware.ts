import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Rutas que requieren autenticación (prefijos)
const PROTECTED_PREFIXES = [
  "/admin",
  "/revisor",
  "/mesa/",
  "/puesto/",
  "/municipio/",
];

function isProtectedRoute(pathname: string): boolean {
  // La raíz '/' solo debe coincidir exactamente
  if (pathname === "/") return true;
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix),
  );
}

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;
  console.info(
    `Middleware: ${pathname} - User: ${user ? user.email : "No Auth"}`,
  );

  // Redirigir usuarios autenticados fuera de login
  if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirigir usuarios NO autenticados a login si intentan acceder a rutas protegidas
  if (isProtectedRoute(pathname) && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
