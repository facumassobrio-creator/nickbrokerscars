"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { isAdminUser } from "@/lib/auth";
import VehicleForm, { VehicleFormValues } from "@/components/admin/VehicleForm";

export default function NewVehiclePage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user ?? null;
      if (!user || !isAdminUser(user)) {
        router.replace("/admin/login");
        return;
      }
      setIsChecking(false);
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (values: VehicleFormValues, files: { primaryImage: File | null; extraImages: File[] }) => {
    setError(null);
    setIsSaving(true);

    try {
      const createRes = await fetch("/api/admin/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!createRes.ok) {
        const body = await createRes.json().catch(() => ({}));
        throw new Error(body.message || "No se pudo crear vehículo");
      }

      const { vehicle } = (await createRes.json()) as { vehicle: { id: string } };

      if (files.primaryImage || files.extraImages.length > 0) {
        const formData = new FormData();
        if (files.primaryImage) {
          formData.append("primaryImage", files.primaryImage);
        }
        files.extraImages.forEach((file) => formData.append("extraImages", file));

        const imagesRes = await fetch(`/api/admin/vehicles/${vehicle.id}/images`, {
          method: "POST",
          body: formData,
        });

        if (!imagesRes.ok) {
          const body = await imagesRes.json().catch(() => ({}));
          throw new Error(body.message || "No se pudieron subir las imágenes");
        }
      }

      router.push("/admin/vehicles");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error guardando vehículo";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isChecking) {
    return <div className="rounded-2xl border border-white/10 bg-black/35 p-6 text-center text-white/70">Verificando acceso...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/45 p-6 shadow-[0_18px_42px_rgba(0,0,0,0.35)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-brand-red">Alta de inventario</p>
          <h1 className="mt-1 text-3xl tracking-tight">Crear vehículo</h1>
          <p className="mt-2 text-sm text-white/70">Completá la ficha para publicar una nueva unidad.</p>
        </div>
        <button onClick={() => router.push("/admin/vehicles")} className="rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white">
          Volver al listado
        </button>
      </div>

      {error && <div className="rounded-xl border border-red-700/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">{error}</div>}

      <VehicleForm onSubmit={handleSubmit} submitLabel={isSaving ? "Guardando..." : "Guardar vehículo"} disabled={isSaving} />
    </div>
  );
}
