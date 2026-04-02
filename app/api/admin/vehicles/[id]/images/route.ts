import { NextRequest, NextResponse } from "next/server";
import { ensureAdminRequest } from "@/lib/adminApi";
import { insertVehicleImage, getVehicleById, reorderVehicleImages } from "@/lib/vehicleAdminService";

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
const MAX_IMAGES_PER_VEHICLE = 12;
const ALLOWED_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

function validateImageFile(file: File, label: string): string | null {
  if (!file || !(file instanceof File)) {
    return `${label}: archivo inválido.`;
  }

  if (!file.size || file.size <= 0) {
    return `${label}: el archivo está vacío.`;
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    return `${label}: formato no permitido (${file.type || "desconocido"}).`;
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `${label}: excede el tamaño máximo de 8MB.`;
  }

  return null;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await ensureAdminRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ message: auth.message }, { status: auth.status });
  }

  const vehicleId = id;
  const vehicle = await getVehicleById(vehicleId);
  if (!vehicle) {
    return NextResponse.json({ message: "Vehículo no existe" }, { status: 404 });
  }

  try {
    const formData = await request.formData();
    const primaryImage = formData.get("primaryImage") as File | null;
    const extraImages = formData.getAll("extraImages") as File[];

    if (!primaryImage && extraImages.length === 0) {
      return NextResponse.json({ message: "Se debe cargar al menos una imagen" }, { status: 400 });
    }

    const validExtraImages = extraImages.filter((image): image is File => image instanceof File);
    const filesToValidate = [primaryImage, ...validExtraImages].filter((file): file is File => file instanceof File);

    for (const [index, file] of filesToValidate.entries()) {
      const label = index === 0 && primaryImage ? "Imagen principal" : `Imagen adicional ${index}`;
      const validationError = validateImageFile(file, label);
      if (validationError) {
        return NextResponse.json({ message: validationError }, { status: 400 });
      }
    }

    const totalAfterUpload = vehicle.images.length + filesToValidate.length;
    if (totalAfterUpload > MAX_IMAGES_PER_VEHICLE) {
      return NextResponse.json(
        { message: `No se pueden superar ${MAX_IMAGES_PER_VEHICLE} imágenes por vehículo.` },
        { status: 400 }
      );
    }

    const insertedImages = [];

    if (primaryImage instanceof File) {
      const buffer = Buffer.from(await primaryImage.arrayBuffer());
      const inserted = await insertVehicleImage(vehicleId, buffer, primaryImage.name, true);
      insertedImages.push(inserted);
    }

    for (const image of validExtraImages) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const inserted = await insertVehicleImage(vehicleId, buffer, image.name, false);
      insertedImages.push(inserted);
    }

    return NextResponse.json({ images: insertedImages }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error subiendo imágenes";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await ensureAdminRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ message: auth.message }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const imageIds: string[] = Array.isArray(body?.imageIds) ? body.imageIds : [];

    if (!imageIds.length || imageIds.some((value: string) => typeof value !== "string" || value.trim() === "")) {
      return NextResponse.json({ message: "imageIds inválido" }, { status: 400 });
    }

    await reorderVehicleImages(id, imageIds);

    return NextResponse.json({ message: "Orden actualizado" }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error reordenando imágenes";
    return NextResponse.json({ message }, { status: 500 });
  }
}
