import { buildWhatsAppUrl } from '@/lib/whatsapp';

export interface VehicleContactInfo {
  brand: string;
  model: string;
  variant?: string | null;
  year?: number | null;
  price?: number | null;
  currency?: string | null;
  vehicleUrl?: string | null;
  dealershipName?: string | null;
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
  const yearLine = vehicle.year ? `Año: ${vehicle.year}` : null;
  const priceLine =
    typeof vehicle.price === 'number'
      ? `Precio: ${vehicle.currency || ''} ${vehicle.price.toLocaleString()}`.trim()
      : null;
  const vehicleLinkLine = vehicle.vehicleUrl ? `Link: ${vehicle.vehicleUrl}` : null;
  const dealership = vehicle.dealershipName?.trim() || 'la concesionaria';

  return [
    `Hola, estoy interesado en el ${vehicleName}.`,
    yearLine,
    priceLine,
    'Vi el anuncio en la web y quisiera mas informacion. ¿Sigue disponible?',
    vehicleLinkLine,
    `Gracias. ${dealership}.`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildVehicleWhatsAppUrl(vehicle: VehicleContactInfo): string {
  const message = buildVehicleInquiryMessage(vehicle);
  return buildWhatsAppUrl(message);
}
