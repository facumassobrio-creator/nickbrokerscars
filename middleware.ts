import { NextRequest, NextResponse } from "next/server";
import { isAdminUserPayload } from "@/lib/auth";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase URL and anon key are required in middleware");
}

const SUPABASE_URL_STR: string = SUPABASE_URL;
const SUPABASE_ANON_KEY_STR: string = SUPABASE_ANON_KEY;

async function getUserFromAccessToken(accessToken: string) {
  const headers: HeadersInit = {
    Authorization: `Bearer ${accessToken}`,
    apikey: SUPABASE_ANON_KEY_STR,
  };

  const response = await fetch(`${SUPABASE_URL_STR}/auth/v1/user`, {
    headers,
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  // Correcto: /auth/v1/user devuelve el usuario directamente, no { user: ... }
  return data as Record<string, unknown> | null;
}

async function refreshAccessToken(refreshToken: string): Promise<{ access_token?: string; refresh_token?: string } | null> {
  const response = await fetch(`${SUPABASE_URL_STR}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY_STR,
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login" || pathname === "/admin/login/") {
    return NextResponse.next();
  }

  // Rutas privadas del admin.
  let accessToken = request.cookies.get("sb-access-token")?.value;
  const refreshToken = request.cookies.get("sb-refresh-token")?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const user = await getUserFromAccessToken(accessToken);

  // Si el access token expiró, intentar refrescar con el refresh token
  if (!user && refreshToken) {
    const refreshed = await refreshAccessToken(refreshToken);
    if (refreshed?.access_token) {
      accessToken = refreshed.access_token;
      const newResponse = NextResponse.redirect(request.url);
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      };
      newResponse.cookies.set("sb-access-token", accessToken, cookieOptions);
      if (refreshed.refresh_token) {
        newResponse.cookies.set("sb-refresh-token", refreshed.refresh_token, cookieOptions);
      }
      return newResponse;
    }
  }

  if (!user || !isAdminUserPayload(user)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
