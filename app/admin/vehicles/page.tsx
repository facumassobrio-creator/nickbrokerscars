"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { isAdminUser } from "@/lib/auth";

type VehicleListItem = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  is_published: boolean;
  primary_image_url?: string | null;
};

export default function AdminVehiclesPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [vehicles, setVehicles] = useState<VehicleListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/vehicles");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "No se pudo cargar la lista de vehículos");
      }
      const { vehicles: data } = (await res.json()) as { vehicles: VehicleListItem[] };
      setVehicles(data ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error cargando vehículos";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user ?? null;
      if (!user || !isAdminUser(user)) {
        router.replace("/admin/login");
        return;
      }
      setIsChecking(false);
      await fetchVehicles();
    };
    checkAuth();
  }, [router]);

  const onLogout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  const onDelete = async (id: string) => {
    const confirmed = window.confirm("¿Eliminar este vehículo? Esta acción no se puede deshacer.");
    if (!confirmed) return;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/vehicles/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "No se pudo eliminar");
      }
      await fetchVehicles();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al eliminar";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const items = useMemo(() => vehicles, [vehicles]);

  if (isChecking) {
    return <div className="rounded-2xl border border-white/10 bg-black/35 p-6 text-center text-white/70">Verificando acceso...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/45 p-6 shadow-[0_18px_42px_rgba(0,0,0,0.4)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-brand-red">Gestión</p>
          <h1 className="mt-1 text-3xl tracking-tight">Vehículos</h1>
          <p className="mt-2 text-sm text-white/70">Lista, edición y administración completa del inventario.</p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => router.push("/admin/vehicles/new")}
            className="rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-red-dark"
          >
            Nuevo vehículo
          </button>
          <button
            onClick={onLogout}
            className="rounded-md border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {error && <div className="rounded-xl border border-red-700/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">{error}</div>}

      {isLoading ? (
        <div className="rounded-2xl border border-white/10 bg-black/35 p-8 text-center text-white/70">Cargando vehículos...</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/20 bg-black/35 p-10 text-center">
          <p className="text-lg text-white">No hay vehículos registrados.</p>
          <p className="mt-2 text-sm text-white/60">Creá el primero para comenzar a completar el inventario.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/45 p-4 shadow-[0_18px_42px_rgba(0,0,0,0.35)]">
          <table className="min-w-full table-auto text-left text-sm text-white/90">
            <thead className="border-b border-white/10 text-[11px] uppercase tracking-[0.16em] text-white/65">
              <tr>
                <th className="px-3 py-2">Imagen</th>
                <th className="px-3 py-2">Marca</th>
                <th className="px-3 py-2">Modelo</th>
                <th className="px-3 py-2">Año</th>
                <th className="px-3 py-2">Precio</th>
                <th className="px-3 py-2">Publicado</th>
                <th className="px-3 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((vehicle) => (
                <tr key={vehicle.id} className="border-b border-white/10 transition hover:bg-white/5">
                  <td className="px-3 py-2">
                    {vehicle.primary_image_url ? (
                      <div className="relative h-16 w-24 overflow-hidden rounded-md border border-white/10">
                        <Image
                          src={vehicle.primary_image_url}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-16 w-24 rounded-md border border-dashed border-white/15 bg-white/5 text-center text-xs leading-16 text-white/45">Sin imagen</div>
                    )}
                  </td>
                  <td className="px-3 py-2">{vehicle.brand}</td>
                  <td className="px-3 py-2">{vehicle.model}</td>
                  <td className="px-3 py-2">{vehicle.year}</td>
                  <td className="px-3 py-2">{vehicle.price.toLocaleString()} {vehicle.currency}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${vehicle.is_published ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-200" : "border border-white/20 bg-white/5 text-white/60"}`}>
                      {vehicle.is_published ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-3 py-2 space-x-2">
                    <button
                      onClick={() => router.push(`/admin/vehicles/${vehicle.id}/edit`)}
                      className="rounded-md border border-white/20 bg-white/5 px-2 py-1 text-xs font-semibold text-white/90 transition hover:bg-white/10"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(vehicle.id)}
                      className="rounded-md border border-red-600/50 bg-red-600/15 px-2 py-1 text-xs font-semibold text-red-200 transition hover:bg-red-600/30"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
