import { NextRequest, NextResponse } from "next/server";
import { isAdminUserPayload } from "@/lib/auth";

function getSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase env vars required");
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
  };
}

async function getUserFromAccessToken(accessToken: string) {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();
  const headers: HeadersInit = {
    Authorization: `Bearer ${accessToken}`,
    apikey: supabaseAnonKey,
  };

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: "GET",
    headers,
  });
  const text = await response.text();
  if (!response.ok) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const accessToken = body?.accessToken;
  const refreshToken = body?.refreshToken;

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ message: "Tokens requeridos" }, { status: 400 });
  }

  const user = await getUserFromAccessToken(accessToken);
  if (!user) {
    return NextResponse.json({ message: "Acceso admin denegado - no user" }, { status: 403 });
  }
  if (!isAdminUserPayload(user as Record<string, unknown>)) {
    return NextResponse.json({ message: "Acceso admin denegado - no admin role" }, { status: 403 });
  }

  const res = NextResponse.json({ message: "ok" }, { status: 200 });
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };

  res.cookies.set("sb-access-token", accessToken, cookieOptions);
  res.cookies.set("sb-refresh-token", refreshToken, cookieOptions);
  res.cookies.set("sb-admin", "1", {
    ...cookieOptions,
    httpOnly: false,
  });

  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ message: "logged_out" });
  const cookieOptions = { path: "/" };
  res.cookies.set("sb-access-token", "", { ...cookieOptions, maxAge: 0 });
  res.cookies.set("sb-refresh-token", "", { ...cookieOptions, maxAge: 0 });
  res.cookies.set("sb-admin", "", { ...cookieOptions, maxAge: 0 });
  return res;
}
