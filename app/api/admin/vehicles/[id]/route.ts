import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ensureAdminRequest } from "@/lib/adminApi";
import type { Vehicle } from "@/types/vehicle";
import { deleteVehicle, getVehicleById, updateVehicle } from "@/lib/vehicleAdminService";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await ensureAdminRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ message: auth.message }, { status: auth.status });
  }

  try {
    const vehicle = await getVehicleById(id);
    if (!vehicle) {
      return NextResponse.json({ message: "Vehículo no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ vehicle }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error consultando vehículo";
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
    const updates = {
      brand: body.brand,
      model: body.model,
      variant: body.variant,
      year: body.year !== undefined ? Number(body.year) : undefined,
      price: body.price !== undefined ? Number(body.price) : undefined,
      currency: body.currency,
      mileage: body.mileage !== undefined ? Number(body.mileage) : undefined,
      fuel_type: body.fuel_type,
      transmission: body.transmission,
      color: body.color,
      description: body.description,
      is_published: body.is_published,
      is_featured: body.is_featured,
    };

    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));

    if (!Object.keys(cleaned).length) {
      return NextResponse.json({ message: "No hay datos para actualizar" }, { status: 400 });
    }

    const updated = await updateVehicle(id, cleaned as Partial<Omit<Vehicle, "id" | "created_at" | "updated_at">>);
    
    revalidatePath("/vehicles");
    revalidatePath(`/vehicles/${id}`);
    revalidatePath("/");
    
    return NextResponse.json({ vehicle: updated }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error actualizando vehículo";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await ensureAdminRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ message: auth.message }, { status: auth.status });
  }

  try {
    await deleteVehicle(id);
    
    revalidatePath("/vehicles");
    revalidatePath(`/vehicles/${id}`);
    revalidatePath("/");
    
    return NextResponse.json({ message: "Vehículo eliminado" }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error eliminando vehículo";
    return NextResponse.json({ message }, { status: 500 });
  }
}
