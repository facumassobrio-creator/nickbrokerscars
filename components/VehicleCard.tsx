import Image from 'next/image';
import Link from 'next/link';
import type { VehicleWithImages } from '@/lib/vehicleService';
import { siteConfig } from '@/config/site';
import { buildVehicleWhatsAppUrl } from '@/lib/vehicleContact';

interface VehicleCardProps {
  vehicle: VehicleWithImages;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const { id, brand, model, variant, year, price, currency, primary_image_url } = vehicle;
  const { theme, home } = siteConfig;
  const vehicleWhatsAppUrl = buildVehicleWhatsAppUrl({ brand, model, variant });
  const vehicleTitle = `${brand} ${model}`;

  return (
    <article
      style={{ background: theme.gradients.cardBackground }}
      className="group relative border border-white/10 rounded-2xl overflow-hidden shadow-xl transform transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(160,0,0,1)] hover:border-brand-red"
    >
      <Link
        href={`/vehicles/${id}`}
        aria-label={`Ver detalle de ${vehicleTitle}`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
      />

      <div className="aspect-16/11 relative bg-black">
        {primary_image_url ? (
          <Image
            src={primary_image_url}
            alt={vehicleTitle}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white/40 bg-black">
            <span className="text-sm uppercase tracking-widest">{home.vehicleCard.noImageLabel}</span>
          </div>
        )}
      </div>
      <div className="p-5 border-t border-brand-red/40">
        <h3 className="text-xl sm:text-2xl font-black leading-tight text-white group-hover:text-brand-red transition pt-3">{brand} {model}</h3>
        <p className="text-xs tracking-wider text-white/50 uppercase mt-2">Año {year}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-black text-brand-red">{currency} {price.toLocaleString()}</span>
          <span className="inline-flex px-3 py-1 rounded-full border border-brand-red/25 text-xs font-semibold uppercase text-brand-red/90">{home.vehicleCard.premiumBadge}</span>
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
          Ver más <span aria-hidden>→</span>
        </p>
      </div>

      <div className="relative z-20 px-5 pb-5">
        <a
          href={vehicleWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-md border border-brand-red bg-brand-red px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition duration-300 hover:bg-brand-red-dark hover:border-brand-red-dark"
        >
          Consultar
        </a>
      </div>
    </article>
  );
}