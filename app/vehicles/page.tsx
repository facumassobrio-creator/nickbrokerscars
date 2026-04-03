import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { VehicleCard } from '@/components/VehicleCard';
import { PublicVehiclesAutoRefresh } from '@/components/PublicVehiclesAutoRefresh';
import { getPublishedVehicles } from '@/lib/vehiclePublicService';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Vehículos | ${siteConfig.seo.vehicleTitleSuffix}`,
  description: 'Stock actualizado de vehículos publicados en NICKBROKERS CARS con información de precio, año y detalles de cada unidad.',
  alternates: {
    canonical: '/vehicles',
  },
  openGraph: {
    type: 'website',
    url: '/vehicles',
    title: `Vehículos | ${siteConfig.seo.vehicleTitleSuffix}`,
    description: 'Stock actualizado de vehículos publicados en NICKBROKERS CARS.',
    images: [siteConfig.seo.defaultOgImage],
  },
  twitter: {
    card: siteConfig.seo.twitterCard,
    title: `Vehículos | ${siteConfig.seo.vehicleTitleSuffix}`,
    description: 'Stock actualizado de vehículos publicados en NICKBROKERS CARS.',
    images: [siteConfig.seo.defaultOgImage],
    site: siteConfig.seo.twitterSite,
    creator: siteConfig.seo.twitterCreator,
  },
};

export default async function VehiclesPage() {
  const vehicles = await getPublishedVehicles();

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0f1014] via-[#0a0b0f] to-[#07080b] text-white">
      <PublicVehiclesAutoRefresh intervalMs={15_000} />
      <Navbar />
      <main className="container mx-auto px-4 py-12 lg:px-6 lg:py-16">
        <section className="premium-shell rounded-2xl p-6 sm:p-8">
          <header className="mb-8 border-b border-white/10 pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">Stock disponible</p>
            <h1 className="mt-3 text-4xl font-black tracking-[0.05em] text-white sm:text-5xl">Vehículos</h1>
            <p className="mt-3 max-w-3xl text-sm text-white/70 sm:text-base">
              Selección completa de unidades publicadas. Consultanos por financiación, permutas y disponibilidad en tiempo real.
            </p>
          </header>

          {vehicles.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-black/30 px-5 py-10 text-center text-white/70">
              No hay vehículos disponibles en este momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
