import { NextRequest, NextResponse } from "next/server";
import { ensureAdminRequest } from "@/lib/adminApi";
import { createVehicle, getAllVehicles } from "@/lib/vehicleAdminService";
import { revalidatePublicVehiclePaths } from "@/lib/publicCache";

export async function GET(request: NextRequest) {
  const auth = await ensureAdminRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ message: auth.message }, { status: auth.status });
  }

  try {
    const vehicles = await getAllVehicles();
    return NextResponse.json({ vehicles }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error listing vehicles";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await ensureAdminRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ message: auth.message }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const { brand, model, variant, year, price, currency, mileage, fuel_type, transmission, color, description, is_published, is_featured } = body;

    if (brand == null || String(brand).trim() === "" ||
        model == null || String(model).trim() === "" ||
        year == null || price == null || currency == null || String(currency).trim() === "" ||
        mileage == null || fuel_type == null || String(fuel_type).trim() === "" ||
        transmission == null || String(transmission).trim() === "" ||
        color == null || String(color).trim() === "") {
      return NextResponse.json({ message: "Campos requeridos incompletos" }, { status: 400 });
    }

    const vehicle = await createVehicle({
      brand,
      model,
      variant: variant || null,
      year: Number(year),
      price: Number(price),
      currency,
      mileage: Number(mileage),
      fuel_type,
      transmission,
      color,
      description: description || null,
      is_published: Boolean(is_published),
      is_featured: Boolean(is_featured),
    });

    revalidatePublicVehiclePaths(vehicle.id);

    return NextResponse.json({ vehicle }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error creando vehículo";
    return NextResponse.json({ message }, { status: 500 });
  }
}
