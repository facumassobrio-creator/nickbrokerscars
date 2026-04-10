"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { isAdminUser } from "@/lib/auth";
import VehicleForm, { VehicleFormValues } from "@/components/admin/VehicleForm";
import { optimizeVehicleUploadImages } from "@/lib/image/optimizeImage";

export default function NewVehiclePage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

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
    setWarnings([]);
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

      const hadSelectedImages = Boolean(files.primaryImage) || files.extraImages.length > 0;
      const optimizedFiles = await optimizeVehicleUploadImages({
        primaryImage: files.primaryImage,
        extraImages: files.extraImages,
        options: { maxSide: 1600, quality: 0.78, outputType: "image/webp" },
      });

      if (optimizedFiles.warnings.length > 0) {
        setWarnings(optimizedFiles.warnings);
      }

      const hasAnyOptimizedImage = Boolean(optimizedFiles.primaryImage) || optimizedFiles.extraImages.length > 0;
      if (hadSelectedImages && !hasAnyOptimizedImage) {
        throw new Error("No se pudo procesar ninguna imagen seleccionada. Reintentá con otros archivos.");
      }

      if (hasAnyOptimizedImage) {
        const formData = new FormData();
        if (optimizedFiles.primaryImage) {
          formData.append("primaryImage", optimizedFiles.primaryImage);
        }
        optimizedFiles.extraImages.forEach((file) => formData.append("extraImages", file));

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
      {warnings.length > 0 && (
        <div className="rounded-xl border border-amber-600/60 bg-amber-950/40 px-4 py-3 text-sm text-amber-200">
          {warnings.join(" ")}
        </div>
      )}

      <VehicleForm onSubmit={handleSubmit} submitLabel={isSaving ? "Guardando..." : "Guardar vehículo"} disabled={isSaving} />
    </div>
  );
}
