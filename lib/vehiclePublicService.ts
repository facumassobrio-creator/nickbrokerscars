import { supabase } from "@/lib/supabaseClient";
import type { Vehicle } from "@/types/vehicle";
import type { VehicleImage } from "@/types/vehicleImage";

const VEHICLE_IMAGES_BUCKET = "vehicle-images";

function sortImagesByPosition(images: VehicleImage[]): VehicleImage[] {
  return [...images].sort((a, b) => {
    const positionDiff = (a.position ?? 0) - (b.position ?? 0);
    if (positionDiff !== 0) {
      return positionDiff;
    }
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
}

export type VehicleImageWithUrl = VehicleImage & {
  url?: string | null;
};

export type VehicleWithImages = Vehicle & {
  images: VehicleImageWithUrl[];
  primary_image_url?: string | null;
};

export async function getPublishedVehicles(): Promise<VehicleWithImages[]> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*, vehicle_images(*)")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return [];

  const result = await Promise.all(
    data.map(async (vehicle) => {
      const imagesRaw = (vehicle.vehicle_images as unknown as VehicleImage[]) ?? [];
      const orderedImagesRaw = sortImagesByPosition(imagesRaw);
      const images: VehicleImageWithUrl[] = orderedImagesRaw.map((img): VehicleImageWithUrl => {
        let url: string | null = null;
        if (img.storage_path) {
          const { data: publicUrlData } = supabase
            .storage
            .from(VEHICLE_IMAGES_BUCKET)
            .getPublicUrl(img.storage_path);
          url = publicUrlData.publicUrl;
        }
        return { ...img, url };
      });

      const primaryImage = images.find((img) => img.is_primary);
      const primary_image_url = primaryImage?.url ?? null;

      return {
        ...(vehicle as Vehicle),
        images,
        primary_image_url,
      };
    })
  );

  return result;
}

export async function getPublishedVehicleById(vehicleId: string): Promise<VehicleWithImages | null> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*, vehicle_images(*)")
    .eq("id", vehicleId)
    .eq("is_published", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }

  if (!data) return null;

  const imagesRaw = (data.vehicle_images as unknown as VehicleImage[]) ?? [];
  const orderedImagesRaw = sortImagesByPosition(imagesRaw);
  const images: VehicleImageWithUrl[] = orderedImagesRaw.map((img): VehicleImageWithUrl => {
    let url: string | null = null;
    if (img.storage_path) {
      const { data: publicUrlData } = supabase
        .storage
        .from(VEHICLE_IMAGES_BUCKET)
        .getPublicUrl(img.storage_path);
      url = publicUrlData.publicUrl;
    }
    return { ...img, url };
  });

  const primaryImage = images.find((img) => img.is_primary);
  const primary_image_url = primaryImage?.url ?? null;

  return {
    ...(data as Vehicle),
    images,
    primary_image_url,
  };
}
