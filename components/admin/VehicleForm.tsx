"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export type VehicleFormValues = {
  brand: string;
  model: string;
  variant: string;
  year: number;
  price: number;
  currency: "ARS" | "USD" | "EUR";
  mileage: number;
  fuel_type: string;
  transmission: string;
  color: string;
  description: string;
  is_published: boolean;
  is_featured: boolean;
};

type VehicleFormProps = {
  initialValues?: Partial<VehicleFormValues>;
  onSubmit: (values: VehicleFormValues, files: { primaryImage: File | null; extraImages: File[] }) => Promise<void>;
  disabled?: boolean;
  submitLabel: string;
};

export default function VehicleForm({ initialValues, onSubmit, disabled, submitLabel }: VehicleFormProps) {
  const [brand, setBrand] = useState(initialValues?.brand ?? "");
  const [model, setModel] = useState(initialValues?.model ?? "");
  const [variant, setVariant] = useState(initialValues?.variant ?? "");
  const [year, setYear] = useState(initialValues?.year?.toString() ?? "");
  const [price, setPrice] = useState(initialValues?.price?.toString() ?? "");
  const [currency, setCurrency] = useState<"ARS" | "USD" | "EUR">(initialValues?.currency ?? "ARS");
  const [mileage, setMileage] = useState(initialValues?.mileage?.toString() ?? "");
  const [fuelType, setFuelType] = useState(initialValues?.fuel_type ?? "");
  const [transmission, setTransmission] = useState(initialValues?.transmission ?? "");
  const [color, setColor] = useState(initialValues?.color ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [isPublished, setIsPublished] = useState(initialValues?.is_published ?? false);
  const [isFeatured, setIsFeatured] = useState(initialValues?.is_featured ?? false);

  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [extraImages, setExtraImages] = useState<File[]>([]);

  const [formError, setFormError] = useState<string | null>(null);

  const primaryPreview = useMemo(() => {
    if (!primaryImage) return null;
    return URL.createObjectURL(primaryImage);
  }, [primaryImage]);

  useEffect(() => {
    return () => {
      if (primaryPreview) {
        URL.revokeObjectURL(primaryPreview);
      }
    };
  }, [primaryPreview]);

  const extraPreviews = useMemo(() => {
    return extraImages.map((image) => ({ name: image.name, url: URL.createObjectURL(image) }));
  }, [extraImages]);

  useEffect(() => {
    return () => {
      extraPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [extraPreviews]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!brand || !model || !year || !price || !mileage || !fuelType || !transmission || !color) {
      setFormError("Por favor complete los campos obligatorios.");
      return;
    }

    const payload: VehicleFormValues = {
      brand: brand.trim(),
      model: model.trim(),
      variant: variant.trim(),
      year: Number(year),
      price: Number(price),
      currency,
      mileage: Number(mileage),
      fuel_type: fuelType.trim(),
      transmission: transmission.trim(),
      color: color.trim(),
      description: description.trim(),
      is_published: isPublished,
      is_featured: isFeatured,
    };

    try {
      await onSubmit(payload, { primaryImage, extraImages });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Error al guardar el vehículo");
    }
  };

  const fieldClassName =
    "mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 transition focus:border-brand-red/70 focus:outline-none focus:ring-2 focus:ring-brand-red/35 disabled:cursor-not-allowed disabled:opacity-60";
  const selectClassName =
    `${fieldClassName} appearance-none bg-[linear-gradient(180deg,rgba(20,20,20,0.92),rgba(12,12,12,0.92))]`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/10 bg-black/45 p-6 shadow-[0_18px_42px_rgba(0,0,0,0.35)]">
      {formError && <div className="rounded-xl border border-red-700/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">{formError}</div>}

      <section className="rounded-xl border border-white/10 bg-black/30 p-4 md:p-5">
        <div className="mb-4">
          <h2 className="text-lg">Datos principales</h2>
          <p className="text-sm text-white/65">Completá la información comercial y técnica de la unidad.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-white/85">Marca *</label>
            <input value={brand} onChange={(e) => setBrand(e.target.value)} disabled={disabled} className={fieldClassName} />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/85">Modelo *</label>
            <input value={model} onChange={(e) => setModel(e.target.value)} disabled={disabled} className={fieldClassName} />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/85">Versión</label>
            <input value={variant} onChange={(e) => setVariant(e.target.value)} disabled={disabled} className={fieldClassName} />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/85">Año *</label>
            <input type="number" min={1900} max={2100} value={year} onChange={(e) => setYear(e.target.value)} disabled={disabled} className={fieldClassName} />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/85">Precio *</label>
            <input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} disabled={disabled} className={fieldClassName} />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/85">Moneda *</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value as "ARS" | "USD" | "EUR")} disabled={disabled} className={selectClassName}>
              <option value="ARS" className="bg-[#101010] text-white">ARS</option>
              <option value="USD" className="bg-[#101010] text-white">USD</option>
              <option value="EUR" className="bg-[#101010] text-white">EUR</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/85">Kilometraje *</label>
            <input type="number" min={0} value={mileage} onChange={(e) => setMileage(e.target.value)} disabled={disabled} className={fieldClassName} />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/85">Combustible *</label>
            <input value={fuelType} onChange={(e) => setFuelType(e.target.value)} disabled={disabled} className={fieldClassName} placeholder="Ej: Nafta, GNC" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/85">Transmisión *</label>
            <input value={transmission} onChange={(e) => setTransmission(e.target.value)} disabled={disabled} className={fieldClassName} placeholder="Manual/Automática" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/85">Color *</label>
            <input value={color} onChange={(e) => setColor(e.target.value)} disabled={disabled} className={fieldClassName} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-black/30 p-4 md:p-5">
        <label className="block text-sm font-medium text-white/85">Descripción</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} disabled={disabled} className={fieldClassName} rows={4}></textarea>
      </section>

      <section className="rounded-xl border border-white/10 bg-black/30 p-4 md:p-5">
        <div className="mb-4">
          <h2 className="text-lg">Imágenes</h2>
          <p className="text-sm text-white/65">Cargá portada y galería. Las vistas previas son referenciales.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block rounded-lg border border-white/15 bg-white/5 p-3">
            <span className="text-sm font-medium text-white/85">Imagen principal</span>
            <input type="file" accept="image/*" onChange={(e) => setPrimaryImage(e.target.files?.[0] ?? null)} disabled={disabled} className="mt-2 block w-full text-sm text-white/75 file:mr-3 file:rounded-md file:border-0 file:bg-brand-red file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-brand-red-dark" />
          </label>

          <label className="block rounded-lg border border-white/15 bg-white/5 p-3">
            <span className="text-sm font-medium text-white/85">Imágenes adicionales</span>
            <input type="file" accept="image/*" multiple onChange={(e) => setExtraImages(Array.from(e.target.files ?? []))} disabled={disabled} className="mt-2 block w-full text-sm text-white/75 file:mr-3 file:rounded-md file:border-0 file:bg-white/15 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-white/25" />
          </label>
        </div>
      </section>

      {primaryPreview && (
        <div className="text-sm text-white/75">Vista previa principal:</div>
      )}
      {primaryPreview && (
        <Image
          src={primaryPreview}
          alt="Preview principal"
          width={160}
          height={112}
          unoptimized
          className="mt-2 h-28 w-40 rounded-lg border border-white/20 object-cover"
        />
      )}

      {extraPreviews.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-white/75">Previews adicionales:</div>
          <div className="flex flex-wrap gap-2">
            {extraPreviews.map((item) => (
              <Image
                key={item.url}
                src={item.url}
                alt={item.name}
                width={112}
                height={80}
                unoptimized
                className="h-20 w-28 rounded-lg border border-white/20 object-cover"
              />
            ))}
          </div>
        </div>
      )}

      <section className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/30 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white/90">
            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} disabled={disabled} className="h-4 w-4 accent-brand-red" />
            Publicado
          </label>
          <label className="flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white/90">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} disabled={disabled} className="h-4 w-4 accent-brand-red" />
            Destacado
          </label>
        </div>

        <button type="submit" disabled={disabled} className="rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:opacity-70">
          {submitLabel}
        </button>
      </section>
    </form>
  );
}
