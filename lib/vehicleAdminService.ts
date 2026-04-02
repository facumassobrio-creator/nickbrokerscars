import { supabaseAdmin } from "@/lib/supabaseAdminClient";
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

function normalizeFileName(fileName: string): string {
  const normalized = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return normalized || "image";
}

export type VehicleImageWithUrl = VehicleImage & {
  url?: string | null;
};

export type VehicleWithImages = Vehicle & {
  images: VehicleImageWithUrl[];
  primary_image_url?: string | null;
};

export async function getAllVehicles(): Promise<VehicleWithImages[]> {
  const { data, error } = await supabaseAdmin
    .from("vehicles")
    .select("*, vehicle_images(*)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return [];

  const result = await Promise.all(
    data.map(async (vehicle) => {
      const imagesRaw = (vehicle.vehicle_images as unknown as VehicleImage[]) ?? [];
      const orderedImagesRaw = sortImagesByPosition(imagesRaw);
      const images: VehicleImageWithUrl[] = await Promise.all(
        orderedImagesRaw.map(async (img): Promise<VehicleImageWithUrl> => {
          let url: string | null = null;
          if (img.storage_path) {
            const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin
              .storage
              .from(VEHICLE_IMAGES_BUCKET)
              .createSignedUrl(img.storage_path, 60 * 60);

            if (!signedUrlError && signedUrlData) {
              const signedData = signedUrlData as { signedURL?: string; signedUrl?: string };
              url = signedData.signedURL ?? signedData.signedUrl ?? null;
            }
          }
          return { ...img, url };
        })
      );

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

export async function getVehicleById(vehicleId: string): Promise<VehicleWithImages | null> {
  const { data, error } = await supabaseAdmin
    .from("vehicles")
    .select("*, vehicle_images(*)")
    .eq("id", vehicleId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }

  if (!data) return null;

  const imagesRaw = (data.vehicle_images as unknown as VehicleImage[]) ?? [];
  const orderedImagesRaw = sortImagesByPosition(imagesRaw);
  const images: VehicleImageWithUrl[] = await Promise.all(
    orderedImagesRaw.map(async (img): Promise<VehicleImageWithUrl> => {
      let url: string | null = null;
      if (img.storage_path) {
        const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin
          .storage
          .from(VEHICLE_IMAGES_BUCKET)
          .createSignedUrl(img.storage_path, 60 * 60);

        if (!signedUrlError && signedUrlData) {
          const signedData = signedUrlData as { signedURL?: string; signedUrl?: string };
          url = signedData.signedURL ?? signedData.signedUrl ?? null;
        }
      }
      return { ...img, url };
    })
  );

  const primaryImage = images.find((img) => img.is_primary);
  const primary_image_url = primaryImage?.url ?? null;

  return {
    ...(data as Vehicle),
    images,
    primary_image_url,
  };
}

export async function createVehicle(payload: Omit<Vehicle, "id" | "created_at" | "updated_at">): Promise<Vehicle> {
  const { data, error } = await supabaseAdmin.from("vehicles").insert(payload).select().single();
  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error("Vehicle creation failed");
  }
  return data as Vehicle;
}

export async function updateVehicle(
  vehicleId: string,
  payload: Partial<Omit<Vehicle, "id" | "created_at" | "updated_at">>
): Promise<Vehicle> {
  const { data, error } = await supabaseAdmin
    .from("vehicles")
    .update(payload)
    .eq("id", vehicleId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Vehicle update failed");
  }

  return data as Vehicle;
}

export async function deleteVehicle(vehicleId: string): Promise<void> {
  const { data: images, error: imagesError } = await supabaseAdmin
    .from("vehicle_images")
    .select("*")
    .eq("vehicle_id", vehicleId);

  if (imagesError) {
    throw new Error(imagesError.message);
  }

  if (images?.length) {
    const removePaths = (images as VehicleImage[]).map((img) => img.storage_path);
    const { error: deleteStorageError } = await supabaseAdmin
      .storage
      .from(VEHICLE_IMAGES_BUCKET)
      .remove(removePaths);

    if (deleteStorageError) {
      console.warn("Failed deleting some storage files", deleteStorageError.message);
    }
  }

  const { error: deleteImageRowsError } = await supabaseAdmin
    .from("vehicle_images")
    .delete()
    .eq("vehicle_id", vehicleId);
  if (deleteImageRowsError) {
    throw new Error(deleteImageRowsError.message);
  }

  const { error } = await supabaseAdmin.from("vehicles").delete().eq("id", vehicleId);
  if (error) {
    throw new Error(error.message);
  }
}

export async function insertVehicleImage(
  vehicleId: string,
  file: Buffer,
  fileName: string,
  isPrimary: boolean
): Promise<VehicleImage> {
  // if setting primary, clear previous
  if (isPrimary) {
    await supabaseAdmin
      .from("vehicle_images")
      .update({ is_primary: false })
      .eq("vehicle_id", vehicleId);
  }

  const { data: latestImages, error: latestImagesError } = await supabaseAdmin
    .from("vehicle_images")
    .select("position")
    .eq("vehicle_id", vehicleId)
    .order("position", { ascending: false })
    .limit(1);

  if (latestImagesError) {
    throw new Error(latestImagesError.message);
  }

  const nextPosition = (latestImages?.[0]?.position ?? -1) + 1;
  const storagePath = `vehicles/${vehicleId}/${Date.now()}-${normalizeFileName(fileName)}`;

  const { error: uploadError } = await supabaseAdmin
    .storage
    .from(VEHICLE_IMAGES_BUCKET)
    .upload(storagePath, file);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data, error: insertError } = await supabaseAdmin
    .from("vehicle_images")
    .insert({ vehicle_id: vehicleId, storage_path: storagePath, is_primary: isPrimary, position: nextPosition })
    .select()
    .single();

  if (insertError) {
    throw new Error(insertError.message);
  }

  if (!data) {
    throw new Error("Image record creation failed");
  }

  return data as VehicleImage;
}

export async function deleteVehicleImage(imageId: string): Promise<void> {
  const { data, error } = await supabaseAdmin
    .from("vehicle_images")
    .select("*")
    .eq("id", imageId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if ((data as VehicleImage | null)?.storage_path) {
    const { error: removeError } = await supabaseAdmin
      .storage
      .from(VEHICLE_IMAGES_BUCKET)
      .remove([(data as VehicleImage).storage_path]);

    if (removeError) {
      console.warn("Failed deleting storage image", removeError.message);
    }
  }

  const { error: deleteImageError } = await supabaseAdmin
    .from("vehicle_images")
    .delete()
    .eq("id", imageId);

  if (deleteImageError) {
    throw new Error(deleteImageError.message);
  }
}

export async function setVehiclePrimaryImage(vehicleId: string, imageId: string): Promise<void> {
  const { error: resetError } = await supabaseAdmin
    .from("vehicle_images")
    .update({ is_primary: false })
    .eq("vehicle_id", vehicleId);

  if (resetError) {
    throw new Error(resetError.message);
  }

  const { error: setPrimaryError } = await supabaseAdmin
    .from("vehicle_images")
    .update({ is_primary: true })
    .eq("id", imageId)
    .eq("vehicle_id", vehicleId);

  if (setPrimaryError) {
    throw new Error(setPrimaryError.message);
  }
}

export async function reorderVehicleImages(vehicleId: string, imageIds: string[]): Promise<void> {
  if (imageIds.length === 0) {
    return;
  }

  const { data: existingImages, error: existingImagesError } = await supabaseAdmin
    .from("vehicle_images")
    .select("id")
    .eq("vehicle_id", vehicleId)
    .in("id", imageIds);

  if (existingImagesError) {
    throw new Error(existingImagesError.message);
  }

  if ((existingImages ?? []).length !== imageIds.length) {
    throw new Error("Una o más imágenes no pertenecen al vehículo");
  }

  const updates = imageIds.map((id, index) =>
    supabaseAdmin
      .from("vehicle_images")
      .update({ position: index })
      .eq("id", id)
      .eq("vehicle_id", vehicleId)
  );

  const results = await Promise.all(updates);
  const firstError = results.find((result) => result.error)?.error;

  if (firstError) {
    throw new Error(firstError.message);
  }
}
