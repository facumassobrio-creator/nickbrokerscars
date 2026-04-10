"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { isAdminUser } from "@/lib/auth";
import VehicleForm, { VehicleFormValues } from "@/components/admin/VehicleForm";
import { optimizeVehicleUploadImages } from "@/lib/image/optimizeImage";

type RouteParams = { params: Promise<{ id: string }> };

type VehicleDetail = VehicleFormValues & {
  images: Array<{ id: string; url?: string | null; is_primary: boolean; position: number }>;
};

export default function EditVehiclePage({ params }: RouteParams) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [detail, setDetail] = useState<VehicleDetail | null>(null);
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

  useEffect(() => {
    const load = async () => {
      const { id } = await params;
      if (!id) return;
      setError(null);
      setIsLoading(true);

      try {
        const res = await fetch(`/api/admin/vehicles/${id}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || "No se encontró el vehículo");
        }

        const { vehicle } = await res.json();
        setDetail({
          brand: vehicle.brand,
          model: vehicle.model,
          variant: vehicle.variant ?? "",
          year: vehicle.year,
          price: vehicle.price,
          currency: vehicle.currency,
          mileage: vehicle.mileage,
          fuel_type: vehicle.fuel_type,
          transmission: vehicle.transmission,
          color: vehicle.color,
          description: vehicle.description ?? "",
          is_published: vehicle.is_published,
          is_featured: vehicle.is_featured,
          images: (vehicle.images ?? []).map((img: { id: string; url?: string | null; is_primary?: boolean; position?: number }) => ({
            id: img.id,
            url: img.url,
            is_primary: Boolean(img.is_primary),
            position: Number(img.position ?? 0),
          })),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error cargando vehículo");
      } finally {
        setIsLoading(false);
      }
    };

    if (!isChecking) {
      load();
    }
  }, [params, isChecking]);

  const handleDeleteImage = async (imageId: string) => {
    if (!window.confirm("¿Eliminar esta imagen?")) return;
    const { id } = await params;
    try {
      const res = await fetch(`/api/admin/vehicles/${id}/images/${imageId}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "No se pudo eliminar la imagen");
      }
      setDetail((prev) => {
        if (!prev) return prev;
        return { ...prev, images: prev.images.filter((img) => img.id !== imageId) };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error eliminando imagen");
    }
  };

  const handleSubmit = async (values: VehicleFormValues, files: { primaryImage: File | null; extraImages: File[] }) => {
    const { id } = await params;
    setError(null);
    setWarnings([]);
    setIsSaving(true);

    try {
      const res = await fetch(`/api/admin/vehicles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "No se pudo actualizar el vehículo");
      }

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
        optimizedFiles.extraImages.forEach((image) => formData.append("extraImages", image));

        const uploadRes = await fetch(`/api/admin/vehicles/${id}/images`, {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const body = await uploadRes.json().catch(() => ({}));
          throw new Error(body.message || "No se pudieron subir las imágenes");
        }
      }

      router.push("/admin/vehicles");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error actualizando vehículo");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetPrimaryImage = async (imageId: string) => {
    const { id } = await params;
    setError(null);

    try {
      const res = await fetch(`/api/admin/vehicles/${id}/images/${imageId}`, {
        method: "PATCH",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "No se pudo marcar imagen principal");
      }

      setDetail((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          images: prev.images.map((img) => ({ ...img, is_primary: img.id === imageId })),
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error marcando imagen principal");
    }
  };

  const handleMoveImage = async (imageId: string, direction: "up" | "down") => {
    if (!detail) return;

    const orderedImages = [...detail.images].sort((a, b) => a.position - b.position);
    const currentIndex = orderedImages.findIndex((img) => img.id === imageId);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= orderedImages.length) return;

    const reordered = [...orderedImages];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    const imageIds = reordered.map((img) => img.id);
    const { id } = await params;

    try {
      const res = await fetch(`/api/admin/vehicles/${id}/images`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageIds }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "No se pudo actualizar el orden");
      }

      setDetail((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          images: reordered.map((img, index) => ({ ...img, position: index })),
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error reordenando imágenes");
    }
  };

  if (isChecking || isLoading) {
    return <div className="rounded-2xl border border-white/10 bg-black/35 p-6 text-center text-white/70">Cargando datos...</div>;
  }

  if (!detail) {
    return <div className="rounded-2xl border border-white/10 bg-black/35 p-6 text-center text-white/70">Vehículo no encontrado</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/45 p-6 shadow-[0_18px_42px_rgba(0,0,0,0.35)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-brand-red">Edición de ficha</p>
          <h1 className="mt-1 text-3xl tracking-tight">Editar vehículo</h1>
          <p className="mt-2 text-sm text-white/70">Actualizá datos, imágenes y estado de publicación.</p>
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

      <VehicleForm
        initialValues={detail}
        onSubmit={handleSubmit}
        disabled={isSaving}
        submitLabel={isSaving ? "Guardando..." : "Guardar cambios"}
      />

      <div className="rounded-2xl border border-white/10 bg-black/45 p-5 shadow-[0_18px_42px_rgba(0,0,0,0.35)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl">Imágenes existentes</h2>
          <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-white/65">
            {detail.images.length} total
          </span>
        </div>
        {detail.images.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/20 bg-black/25 px-4 py-6 text-center text-white/65">No hay imágenes guardadas para este vehículo.</p>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[...detail.images]
              .sort((a, b) => a.position - b.position)
              .map((img, index, orderedImages) => (
              <div key={img.id} className="relative rounded-xl border border-white/15 bg-white/5 p-2">
                {img.url ? (
                  <div className="relative h-28 w-full overflow-hidden rounded-lg">
                    <Image
                      src={img.url}
                      alt="Imagen vehiculo"
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-28 w-full rounded-lg bg-white/10" />
                )}
                {img.is_primary ? (
                  <span className="absolute left-3 top-3 rounded bg-brand-red px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                    Principal
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img.id)}
                  className="absolute right-2 top-2 rounded-md border border-red-500/80 bg-red-600/88 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_10px_20px_-12px_rgba(220,38,38,0.95)] backdrop-blur-sm transition duration-200 hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/80"
                >
                  Eliminar
                </button>
                <div className="mt-3 grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleMoveImage(img.id, "up")}
                    disabled={index === 0}
                    className="rounded-md border border-white/25 bg-white/5 px-1 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/85 transition hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Subir
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveImage(img.id, "down")}
                    disabled={index === orderedImages.length - 1}
                    className="rounded-md border border-white/25 bg-white/5 px-1 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/85 transition hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Bajar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetPrimaryImage(img.id)}
                    disabled={img.is_primary}
                    className="rounded-md border border-brand-red/70 bg-brand-red/10 px-1 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-red transition hover:bg-brand-red/20 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Principal
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
