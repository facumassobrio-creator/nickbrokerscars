import { buildWhatsAppUrl } from '@/lib/whatsapp';

export interface VehicleContactInfo {
  brand: string;
  model: string;
  variant?: string | null;
}

export function buildVehicleDisplayName(vehicle: VehicleContactInfo): string {
  const base = `${vehicle.brand} ${vehicle.model}`.trim();
  const variant = vehicle.variant?.trim();

  if (!variant) {
    return base;
  }

  return `${base} ${variant}`;
}

export function buildVehicleInquiryMessage(vehicle: VehicleContactInfo): string {
  const vehicleName = buildVehicleDisplayName(vehicle);
  return `Hola, me gustaría consultar por ${vehicleName}`;
}

export function buildVehicleWhatsAppUrl(vehicle: VehicleContactInfo): string {
  const message = buildVehicleInquiryMessage(vehicle);
  return buildWhatsAppUrl(message);
}
