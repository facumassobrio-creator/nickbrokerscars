import Image from 'next/image';
import Link from 'next/link';
import type { VehicleWithImages } from '@/lib/vehicleService';
import { siteConfig } from '@/config/site';
import { buildVehicleWhatsAppUrl } from '@/lib/vehicleContact';

interface VehicleCardProps {
  vehicle: VehicleWithImages;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const { id, brand, model, variant, year, price, currency, primary_image_url, is_featured } = vehicle;
  const { theme, home } = siteConfig;
  const vehicleWhatsAppUrl = buildVehicleWhatsAppUrl({ brand, model, variant });
  const vehicleTitle = `${brand} ${model}`;
  const detailHref = `/vehicles/${id}`;

  return (
    <article
      style={{ background: theme.gradients.cardBackground }}
      className="group relative overflow-hidden rounded-2xl border border-white/12 shadow-[0_18px_34px_-24px_rgba(0,0,0,0.9)] transition duration-300 hover:-translate-y-1.5 hover:border-brand-red/65 hover:shadow-[0_26px_54px_-24px_rgba(194,13,18,0.78)]"
    >
      <Link
        href={detailHref}
        aria-label={`Ver detalle de ${vehicleTitle}`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
      />

      <div className="relative aspect-16/11 bg-[#101116]">
        {primary_image_url ? (
          <Image
            src={primary_image_url}
            alt={vehicleTitle}
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.06]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#0d0e12] text-white/40">
            <span className="text-sm uppercase tracking-widest">{home.vehicleCard.noImageLabel}</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/12 to-black/8" />
      </div>
      <div className="border-t border-white/10 bg-linear-to-b from-[#181a20d9] to-[#121318f0] p-5">
        <h3 className="pt-2 text-xl leading-tight font-black text-white transition group-hover:text-brand-red sm:text-2xl">{brand} {model}</h3>
        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/52">Año {year}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(194,13,18,0.18)]">{currency} {price.toLocaleString()}</span>
          {is_featured ? (
            <span className="inline-flex rounded-full border border-brand-red/35 bg-brand-red/10 px-3 py-1 text-xs font-semibold uppercase text-brand-red/95">{home.vehicleCard.premiumBadge}</span>
          ) : null}
        </div>
      </div>

      <div className="relative z-20 grid gap-2 px-5 pb-5">
        <Link
          href={detailHref}
          className="btn-secondary w-full px-4 py-2.5 text-xs"
        >
          Ver más
        </Link>
        <a
          href={vehicleWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full px-4 py-2.5 text-xs"
        >
          Consultar
        </a>
      </div>
    </article>
  );
}