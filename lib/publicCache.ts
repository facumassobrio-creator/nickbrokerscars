import { revalidatePath } from "next/cache";

export function revalidatePublicVehiclePaths(vehicleId?: string): void {
  revalidatePath("/");
  revalidatePath("/vehicles");
  revalidatePath("/sitemap.xml");

  if (vehicleId) {
    revalidatePath(`/vehicles/${vehicleId}`);
  }
}
