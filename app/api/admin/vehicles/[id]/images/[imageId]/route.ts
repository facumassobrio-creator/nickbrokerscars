import { NextRequest, NextResponse } from "next/server";
import { ensureAdminRequest } from "@/lib/adminApi";
import { supabaseAdmin } from "@/lib/supabaseAdminClient";
import { deleteVehicleImage, setVehiclePrimaryImage } from "@/lib/vehicleAdminService";
import { revalidatePublicVehiclePaths } from "@/lib/publicCache";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; imageId: string }> }) {
  const { id, imageId } = await params;
  const auth = await ensureAdminRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ message: auth.message }, { status: auth.status });
  }

  const { data: image, error: fetchError } = await supabaseAdmin
    .from("vehicle_images")
    .select("vehicle_id")
    .eq("id", imageId)
    .single();

  if (fetchError) {
    return NextResponse.json({ message: "Imagen no encontrada" }, { status: 404 });
  }

  if (!image || image.vehicle_id !== id) {
    return NextResponse.json({ message: "La imagen no pertenece a este vehículo" }, { status: 400 });
  }

  try {
    await deleteVehicleImage(imageId);
    revalidatePublicVehiclePaths(id);
    return NextResponse.json({ message: "Imagen eliminada" }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error eliminando imagen";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string; imageId: string }> }) {
  const { id, imageId } = await params;
  const auth = await ensureAdminRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ message: auth.message }, { status: auth.status });
  }

  const { data: image, error: fetchError } = await supabaseAdmin
    .from("vehicle_images")
    .select("vehicle_id")
    .eq("id", imageId)
    .single();

  if (fetchError) {
    return NextResponse.json({ message: "Imagen no encontrada" }, { status: 404 });
  }

  if (!image || image.vehicle_id !== id) {
    return NextResponse.json({ message: "La imagen no pertenece a este vehículo" }, { status: 400 });
  }

  try {
    await setVehiclePrimaryImage(id, imageId);
    revalidatePublicVehiclePaths(id);
    return NextResponse.json({ message: "Imagen principal actualizada" }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error actualizando imagen principal";
    return NextResponse.json({ message }, { status: 500 });
  }
}
