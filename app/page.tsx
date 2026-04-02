import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getPublishedVehicles } from '@/lib/vehiclePublicService';
import { VehicleCard } from '@/components/VehicleCard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { siteConfig } from '@/config/site';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: siteConfig.seo.homeTitle,
  description: siteConfig.seo.homeDescription,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: siteConfig.seo.homeTitle,
    description: siteConfig.seo.homeDescription,
    images: [siteConfig.seo.defaultOgImage],
  },
  twitter: {
    card: siteConfig.seo.twitterCard,
    title: siteConfig.seo.homeTitle,
    description: siteConfig.seo.homeDescription,
    images: [siteConfig.seo.defaultOgImage],
    site: siteConfig.seo.twitterSite,
    creator: siteConfig.seo.twitterCreator,
  },
};

export default async function Home() {
  const vehicles = await getPublishedVehicles();
  const vehiclePreview = vehicles.slice(0, 6);
  const { assets, contact, home, social } = siteConfig;

  const whatsappHref = buildWhatsAppUrl(siteConfig.messages.siteWhatsappMessage);
  const phoneHref = `tel:${contact.phone.replace(/\s+/g, '')}`;
  const instagramHref = social.instagramUrl;
  const mailHref = `mailto:${contact.email}`;

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-linear-to-b from-[#121214] via-[#0f0f10] to-[#0a0a0a] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-44 -left-44 h-224 w-4xl bg-[radial-gradient(circle,rgba(160,0,0,0.18)_0%,rgba(160,0,0,0.1)_34%,rgba(0,0,0,0)_74%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,rgba(0,0,0,0)_56%)]" />
      </div>

      <div className="relative z-10">
        <Navbar />
      <section id="home" className="relative min-h-[90vh] overflow-hidden flex items-center scroll-mt-24">
        {/* Background Image con Overlay Premium */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-[radial-gradient(130%_95%_at_18%_12%,rgba(160,0,0,0.14)_0%,rgba(160,0,0,0.05)_34%,rgba(0,0,0,0)_65%)]" />
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${assets.heroImage}')` }} />
          {/* Gradient Overlay - Izquierda oscura, derecha más oscura */}
          <div className="absolute inset-0 bg-linear-to-r from-black/86 via-black/74 to-black/88" />
          {/* Accent gradient sutil para profundidad */}
          <div className="absolute inset-0 bg-linear-to-b from-black/32 via-black/10 to-black/68" />
        </div>

        {/* Contenido Premium */}
        <div className="relative w-full container mx-auto px-6 lg:px-12 py-20">
          <div className="max-w-2xl">
            {/* Tag Premium */}
            <div className="inline-block mb-6 pb-3 border-b-2 border-brand-red">
              <p className="uppercase text-xs tracking-[0.2em] text-brand-red font-bold flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-brand-red rounded-full"></span>
                {home.hero.badge}
                <span className="inline-block w-2 h-2 bg-brand-red rounded-full"></span>
              </p>
            </div>

            {/* Headline Premium */}
            <h1 className="leading-[1.05] tracking-[0.04em] mb-6 text-white drop-shadow-lg font-normal uppercase">
              <span className="block whitespace-nowrap text-[clamp(2.75rem,8.2vw,96px)]">{home.hero.titleLines[0]}</span>
              <span className="block text-brand-red text-[clamp(3.2rem,10vw,120px)]">{home.hero.titleLines[1]}</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-white/90 max-w-lg mb-8 leading-relaxed font-light">
              {home.hero.subtitle}
            </p>

            {/* CTA Buttons Premium */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              {/* CTA Principal - Rojo Sólido */}
              <a
                href="#vehiculos"
                className="group relative px-8 py-4 bg-brand-red text-white font-bold uppercase tracking-widest rounded-sm text-base transition-all duration-300 hover:bg-brand-red-dark hover:shadow-2xl hover:shadow-brand-red/70 active:scale-95"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {home.hero.primaryCtaLabel}
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </a>

              {/* CTA Secundario - Outline Elegante */}
              <a
                href={buildWhatsAppUrl(siteConfig.messages.siteWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 border-2 border-brand-red text-white font-bold uppercase tracking-widest rounded-sm text-base transition-all duration-300 hover:bg-brand-red hover:text-black hover:shadow-2xl hover:shadow-brand-red/60 active:scale-95"
              >
                {home.hero.secondaryCtaLabel}
              </a>
            </div>

            {/* Trust Element */}
            <div className="mt-14 pt-8 border-t-2 border-brand-red/60">
              <p className="text-xs uppercase tracking-widest text-white/70 font-semibold">
                {home.hero.trustBullets.map((bullet, index) => (
                  <span key={bullet}>
                    <span className="text-brand-red text-base">✓</span> {bullet}
                    {index < home.hero.trustBullets.length - 1 ? '   ' : ''}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Element - Líneas sutiles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl opacity-20 -mr-48 -mt-48" />
      </section>

      <main id="vehiculos" className="container mx-auto px-4 py-14 lg:px-6 scroll-mt-24">
        <div className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">{home.inventoryIntro.title}</h2>
          <p className="mt-4 text-lg text-white/70 max-w-3xl mx-auto">{home.inventoryIntro.description}</p>
        </div>
        {vehicles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {home.inventoryIntro.emptyState}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehiclePreview.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/vehicles"
                className="inline-flex items-center rounded-md border border-brand-red/60 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-brand-red transition duration-300 hover:bg-brand-red hover:text-black"
              >
                Ver stock completo
              </Link>
            </div>
          </>
        )}
      </main>

      <section id="nosotros" className="container mx-auto px-4 py-20 lg:px-6 lg:py-32 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-stretch">
          <div className="rounded-2xl border border-white/10 bg-black/45 p-5 sm:p-7 lg:p-10 backdrop-blur-sm overflow-hidden">
            <p className="text-xs uppercase tracking-[0.24em] text-brand-red font-bold">{home.about.eyebrow}</p>
            <h2 className="mt-4 max-w-[18ch] text-3xl leading-[1.1] sm:text-5xl text-white tracking-tight wrap-break-word">{home.about.title}</h2>
            <p className="mt-5 text-white/80 leading-relaxed text-sm sm:text-lg">
              {home.about.paragraphs.join(' ')}
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3 text-sm">
              {home.about.stats.map((stat) => (
                <div key={stat.value} className="rounded-lg border border-brand-red/30 bg-black/35 p-4">
                  <p className="text-brand-red font-bold">{stat.value}</p>
                  <p className="mt-1 text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 min-h-80 sm:min-h-90 lg:min-h-120">
            <Image
              src={assets.aboutImage}
              alt={home.about.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={false}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-black/10" />
            <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-white/15 bg-black/55 p-3 text-xs text-white/70">
              {home.about.imageCaption}
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {home.benefits.map((benefit) => (
            <article key={benefit.title} className="rounded-xl border border-white/10 bg-black/45 p-7 transition duration-300 hover:border-brand-red/45 hover:-translate-y-0.5">
              <div className="text-brand-red mb-4">
                {benefit.iconKey === 'shield' && (
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3l7 4v6c0 5-3.5 7.5-7 8-3.5-.5-7-3-7-8V7l7-4z"/><path d="M9 12l2 2 4-4"/></svg>
                )}
                {benefit.iconKey === 'search' && (
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14.7 6.3a4 4 0 10-5.4 5.9l-4.8 4.8 2.8 2.8 4.8-4.8a4 4 0 005.9-5.4"/></svg>
                )}
                {benefit.iconKey === 'document' && (
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 7h18M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z"/><path d="M8 13h8M8 17h5"/></svg>
                )}
              </div>
              <h3 className="text-2xl text-white tracking-tight">{benefit.title}</h3>
              <p className="mt-3 text-white/70 leading-relaxed">{benefit.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contacto" className="container mx-auto px-4 py-20 lg:px-6 scroll-mt-24">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.24em] text-brand-red font-bold">{home.contact.eyebrow}</p>
          <h2 className="mt-3 text-4xl sm:text-5xl text-white tracking-tight">{home.contact.title}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/10 bg-black/45 p-6 transition duration-300 hover:border-brand-red/45 hover:-translate-y-0.5 hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
          >
            <div className="text-brand-red mb-4">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
            </div>
            <h3 className="text-2xl text-white tracking-tight">WhatsApp</h3>
            <p className="mt-2 text-white/70 text-sm">{contact.whatsappDisplay}</p>
          </a>

          <a
            href={phoneHref}
            className="rounded-xl border border-white/10 bg-black/45 p-6 transition duration-300 hover:border-brand-red/45 hover:-translate-y-0.5 hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
          >
            <div className="text-brand-red mb-4">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.86 19.86 0 012.08 4.18 2 2 0 014 2h3a2 2 0 012 1.72c.12.9.32 1.78.6 2.63a2 2 0 01-.45 2.11L8.1 9.91a16 16 0 006 6l1.45-1.15a2 2 0 012.11-.45c.85.28 1.73.48 2.63.6A2 2 0 0122 16.92z"/></svg>
            </div>
            <h3 className="text-2xl text-white tracking-tight">Teléfono</h3>
            <p className="mt-2 text-white/70 text-sm">{contact.phone}</p>
          </a>

          <a
            href={instagramHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/10 bg-black/45 p-6 transition duration-300 hover:border-brand-red/45 hover:-translate-y-0.5 hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
          >
            <div className="text-brand-red mb-4">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="6"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>
            </div>
            <h3 className="text-2xl text-white tracking-tight">Instagram</h3>
            <p className="mt-2 text-white/70 text-sm">@{social.instagramHandle}</p>
          </a>

          <a
            href={mailHref}
            className="rounded-xl border border-white/10 bg-black/45 p-6 transition duration-300 hover:border-brand-red/45 hover:-translate-y-0.5 hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
          >
            <div className="text-brand-red mb-4">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"/><path d="M22 7l-10 7L2 7"/></svg>
            </div>
            <h3 className="text-2xl text-white tracking-tight">Mail</h3>
            <p className="mt-2 text-white/70 text-sm">{contact.email}</p>
          </a>
        </div>
      </section>

      <section id="ubicacion" className="container mx-auto px-4 py-20 lg:px-6 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
          <div className="rounded-2xl border border-white/10 bg-black/45 p-8 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-brand-red font-bold">{home.location.eyebrow}</p>
            <h2 className="mt-3 text-4xl sm:text-5xl text-white tracking-tight">{home.location.title}</h2>
            <p className="mt-5 text-white/75 leading-relaxed">{home.location.description}</p>
            <p className="mt-3 text-sm text-white/55">{home.location.mapCaption}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/45 p-2 overflow-hidden">
            <div className="relative w-full h-90 md:h-107.5 rounded-xl overflow-hidden">
              <iframe
                title={home.location.mapTitle}
                src={home.location.mapEmbedUrl}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  );
}
