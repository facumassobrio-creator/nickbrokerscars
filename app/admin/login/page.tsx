"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { isAdminUser } from "@/lib/auth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1) Login Supabase
      const { error: signInError, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(`Login falló: ${signInError.message}`);
        return;
      }

      const user = data.user ?? data.session?.user ?? null;
      const accessToken = data.session?.access_token;
      const refreshToken = data.session?.refresh_token;

      // 2) Verificar usuario + rol + tokens
      if (!user) {
        setError("Login falló: no se obtuvo información de usuario.");
        return;
      }

      if (!isAdminUser(user)) {
        setError("Acceso denegado: tu cuenta no tiene rol admin.");
        await supabase.auth.signOut();
        return;
      }

      if (!accessToken || !refreshToken) {
        setError("Login falló: token de sesión incompleto.");
        await supabase.auth.signOut();
        return;
      }

      // 3) Guardar sesión admin server-side (cookies seguras)
      const sessionResponse = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, refreshToken }),
      });

      if (!sessionResponse.ok) {
        const body = (await sessionResponse.json().catch(() => ({}))) as {
          message?: string;
        };
        setError(body.message || "No se pudo iniciar sesión admin.");
        await supabase.auth.signOut();
        return;
      }

      // 4) Redirigir al admin.
      window.location.assign("/admin");
    } catch (err) {
      console.error("[admin/login] error", err);
      setError("Error inesperado al iniciar sesión. Reintente más tarde.");
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-md">
      <h1 className="text-2xl font-semibold">Login administrador</h1>
      <p className="mt-1 text-sm text-slate-600">
        Inicia sesión con tu email y contraseña de Supabase.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 caret-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/25 focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-sky-600 px-3 py-2 text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300"
        >
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </form>

      <div className="mt-3 text-xs text-slate-500">
        Nota: para esta fase, los administradores deben tener role de administrador en metadata.
      </div>
    </div>
  );
}
