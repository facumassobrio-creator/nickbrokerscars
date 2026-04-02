export type Currency = 'ARS' | 'USD' | 'EUR';

export type { VehicleImage } from './vehicleImage';

export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  variant?: string;
  year: number;
  price: number;
  currency: Currency;
  mileage: number;
  fuel_type: string;
  transmission: string;
  color: string;
  description?: string;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};
