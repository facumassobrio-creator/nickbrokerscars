import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedVehicleById } from '@/lib/vehiclePublicService';
import { VehicleGallery } from '@/components/VehicleGallery';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { siteConfig } from '@/config/site';
import { buildVehicleWhatsAppUrl } from '@/lib/vehicleContact';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await getPublishedVehicleById(id);

  if (!vehicle) {
    return {
      title: 'Vehículo no encontrado',
      description: siteConfig.seo.defaultDescription,
      alternates: {
        canonical: `/vehicles/${id}`,
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const vehicleTitle = `${vehicle.brand} ${vehicle.model} ${vehicle.year} - ${siteConfig.seo.vehicleTitleSuffix}`;
  const vehicleDescription = vehicle.description || `Vehículo ${vehicle.brand} ${vehicle.model} ${vehicle.year} disponible en ${siteConfig.seo.vehicleTitleSuffix}.`;
  const canonicalPath = `/vehicles/${id}`;

  return {
    title: vehicleTitle,
    description: vehicleDescription,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: 'website',
      url: canonicalPath,
      title: vehicleTitle,
      description: vehicleDescription,
      images: [siteConfig.seo.defaultOgImage],
    },
    twitter: {
      card: siteConfig.seo.twitterCard,
      title: vehicleTitle,
      description: vehicleDescription,
      images: [siteConfig.seo.defaultOgImage],
      site: siteConfig.seo.twitterSite,
      creator: siteConfig.seo.twitterCreator,
    },
  };
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const vehicle = await getPublishedVehicleById(id);

  if (!vehicle) {
    notFound();
  }

  const vehicleWhatsAppUrl = buildVehicleWhatsAppUrl({
    brand: vehicle.brand,
    model: vehicle.model,
    variant: vehicle.variant,
  });

  return (
    <div className="min-h-screen bg-brand-black text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8 lg:px-6 lg:py-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-surface/70 p-4 shadow-[0_25px_65px_rgba(0,0,0,0.45)] ring-1 ring-white/5 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
            <section className="rounded-2xl border border-white/10 bg-black/30 p-3 sm:p-4">
              <VehicleGallery images={vehicle.images} alt={`${vehicle.brand} ${vehicle.model}`} />
            </section>

            <section className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-black/35 p-5 sm:p-6">
              <header className="space-y-3">
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {vehicle.brand} {vehicle.model}
                </h1>
                <p className="inline-flex items-center rounded-full border border-brand-red/35 bg-brand-red/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
                  Año {vehicle.year}
                </p>
                <p className="text-4xl font-black tracking-tight text-brand-red sm:text-5xl">
                  {vehicle.currency} {vehicle.price.toLocaleString()}
                </p>
              </header>

              <section>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Detalles</h2>
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-white/10 bg-white/3 p-3 transition duration-200 hover:border-white/20">
                    <dt className="text-xs uppercase tracking-wide text-white/55">Marca</dt>
                    <dd className="mt-1 text-sm font-medium text-white">{vehicle.brand}</dd>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/3 p-3 transition duration-200 hover:border-white/20">
                    <dt className="text-xs uppercase tracking-wide text-white/55">Modelo</dt>
                    <dd className="mt-1 text-sm font-medium text-white">{vehicle.model}</dd>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/3 p-3 transition duration-200 hover:border-white/20">
                    <dt className="text-xs uppercase tracking-wide text-white/55">Año</dt>
                    <dd className="mt-1 text-sm font-medium text-white">{vehicle.year}</dd>
                  </div>
                  {vehicle.variant && (
                    <div className="rounded-lg border border-white/10 bg-white/3 p-3 transition duration-200 hover:border-white/20">
                      <dt className="text-xs uppercase tracking-wide text-white/55">Versión</dt>
                      <dd className="mt-1 text-sm font-medium text-white">{vehicle.variant}</dd>
                    </div>
                  )}
                  <div className="rounded-lg border border-white/10 bg-white/3 p-3 transition duration-200 hover:border-white/20">
                    <dt className="text-xs uppercase tracking-wide text-white/55">Kilometraje</dt>
                    <dd className="mt-1 text-sm font-medium text-white">{vehicle.mileage.toLocaleString()} km</dd>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/3 p-3 transition duration-200 hover:border-white/20">
                    <dt className="text-xs uppercase tracking-wide text-white/55">Combustible</dt>
                    <dd className="mt-1 text-sm font-medium text-white">{vehicle.fuel_type}</dd>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/3 p-3 transition duration-200 hover:border-white/20">
                    <dt className="text-xs uppercase tracking-wide text-white/55">Transmisión</dt>
                    <dd className="mt-1 text-sm font-medium text-white">{vehicle.transmission}</dd>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/3 p-3 transition duration-200 hover:border-white/20 sm:col-span-2">
                    <dt className="text-xs uppercase tracking-wide text-white/55">Color</dt>
                    <dd className="mt-1 text-sm font-medium text-white">{vehicle.color}</dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-xl border border-white/10 bg-black/30 p-4 sm:p-5">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Descripción</h2>
                <p className="text-sm leading-7 text-white/80 sm:text-base">
                  {vehicle.description || 'Sin descripción disponible.'}
                </p>
              </section>

              <div className="pt-1">
                <WhatsAppButton
                  href={vehicleWhatsAppUrl}
                  label="Consultar por esta unidad"
                  className="w-full sm:w-auto"
                />
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}