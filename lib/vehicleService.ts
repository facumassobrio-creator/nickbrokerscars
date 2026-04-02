/**
 * DEPRECATED: This file is kept for backward compatibility.
 * 
 * Please use the specific service modules instead:
 * - lib/vehiclePublicService.ts for public functions (getPublishedVehicles, getPublishedVehicleById)
 * - lib/vehicleAdminService.ts for admin functions (getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle, insertVehicleImage, deleteVehicleImage)
 */

// Re-export public functions from vehiclePublicService
export type { VehicleImageWithUrl, VehicleWithImages } from "@/lib/vehiclePublicService";
export { getPublishedVehicles, getPublishedVehicleById } from "@/lib/vehiclePublicService";

// Re-export admin functions from vehicleAdminService
export {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  insertVehicleImage,
  deleteVehicleImage,
} from "@/lib/vehicleAdminService";
