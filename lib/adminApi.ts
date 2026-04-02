import { NextRequest } from "next/server";
import { isAdminUserPayload } from "@/lib/auth";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase URL and anon key are required for admin API checks");
}

const SUPABASE_URL_STR = SUPABASE_URL;
const SUPABASE_ANON_KEY_STR = SUPABASE_ANON_KEY;

export async function ensureAdminRequest(request: NextRequest) {
  const accessToken = request.cookies.get("sb-access-token")?.value;
  if (!accessToken) {
    return { ok: false, status: 401, message: "Unauthorized: missing access token" } as const;
  }

  const response = await fetch(`${SUPABASE_URL_STR}/auth/v1/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      apikey: SUPABASE_ANON_KEY_STR,
    },
  });

  if (!response.ok) {
    return { ok: false, status: 401, message: "Unauthorized: invalid access token" } as const;
  }

  const user = (await response.json()) as Record<string, unknown> | null;
  if (!user || !isAdminUserPayload(user)) {
    return { ok: false, status: 403, message: "Forbidden: admin role required" } as const;
  }

  return { ok: true, user } as const;
}
