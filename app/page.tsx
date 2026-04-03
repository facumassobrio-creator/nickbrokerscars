import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getPublishedVehicles } from '@/lib/vehiclePublicService';
import { VehicleCard } from '@/components/VehicleCard';
import { PublicVehiclesAutoRefresh } from '@/components/PublicVehiclesAutoRefresh';
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
  const facebookName = social.facebookName || 'Nickbrokers';

  const whatsappHref = buildWhatsAppUrl(siteConfig.messages.siteWhatsappMessage);
  const instagramHref = social.instagramUrl;
  const facebookHref = social.facebookUrl || 'https://facebook.com/Nickbrokers';
  const mapsHref = home.location.mapOpenUrl;
  const reviewsHref = home.reviews.reviewsLink;
  const mailHref = `mailto:${contact.email}`;
  const socialProfiles = [
    social.instagramUrl,
    social.facebookUrl,
    social.tiktokUrl,
    social.youtubeUrl,
    social.linkedinUrl,
  ].filter(Boolean);
  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: siteConfig.brand.name,
    url: siteConfig.seo.siteUrl,
    image: `${siteConfig.seo.siteUrl}${assets.logoImage || siteConfig.seo.defaultOgImage}`,
    description: siteConfig.seo.homeDescription,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.addressLine,
      addressLocality: contact.city,
      addressCountry: 'AR',
    },
    telephone: contact.phone,
    email: contact.email,
    sameAs: socialProfiles,
  };

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-linear-to-b from-[#101217] via-[#0b0c11] to-[#090a0d] text-white">
      <PublicVehiclesAutoRefresh intervalMs={30_000} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-44 -left-44 h-224 w-4xl bg-[radial-gradient(circle,rgba(160,0,0,0.18)_0%,rgba(160,0,0,0.1)_34%,rgba(0,0,0,0)_74%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,rgba(0,0,0,0)_56%)]" />
      </div>

      <div className="relative z-10">
        <Navbar />
      <section id="home" className="relative flex min-h-[94vh] items-center overflow-hidden scroll-mt-24">
        {/* Background Image con Overlay Premium */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-[radial-gradient(120%_95%_at_16%_12%,rgba(194,13,18,0.25)_0%,rgba(194,13,18,0.08)_38%,rgba(0,0,0,0)_68%)]" />
          <Image
            src={assets.heroImage}
            alt=""
            fill
            priority
            quality={82}
            className="object-cover object-[center_right_18%]"
            sizes="100vw"
          />
          {/* Gradient Overlay - Izquierda mas oscura, derecha mas clara */}
          <div className="absolute inset-0 bg-linear-to-r from-black/93 via-black/74 to-black/48" />
          {/* Accent gradient sutil para profundidad */}
          <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/10 to-black/82" />
        </div>

        {/* Contenido Premium */}
        <div className="relative container mx-auto w-full px-5 py-14 sm:px-6 lg:px-12 lg:py-22">
          <div className="grid items-end gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:gap-14">
            <div className="premium-animate-slide">
              {/* Headline Premium */}
              <h1 className="font-normal uppercase leading-[0.9] tracking-[0.04em] text-white drop-shadow-[0_10px_32px_rgba(0,0,0,0.65)]">
                <span className="block text-[clamp(3.2rem,8.6vw,8.7rem)]">{home.hero.titleLines[0]}</span>
                <span className="mt-1 block origin-left scale-x-[1.07] text-[clamp(4.6rem,12vw,12rem)] text-brand-red drop-shadow-[0_0_20px_rgba(194,13,18,0.5)]">{home.hero.titleLines[1]}</span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/78 sm:text-base lg:text-lg">
                No solo vendemos autos, cumplimos tu sueño de tener el propio
              </p>

              <div className="mt-8 h-px max-w-3xl bg-linear-to-r from-brand-red/80 via-white/25 to-transparent" />
            </div>

            <aside className="premium-shell premium-animate-rise rounded-2xl p-6 sm:p-7">
              <p className="text-base leading-relaxed text-white/82 sm:text-lg">
                {home.hero.subtitle}
              </p>

              {/* CTA Buttons Premium */}
              <div className="mt-7 flex flex-col gap-3">
                <a
                  href="#vehiculos"
                  className="btn-primary group px-7 py-3.5 text-sm sm:text-base"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {home.hero.primaryCtaLabel}
                    <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </a>

                <a
                  href={buildWhatsAppUrl(siteConfig.messages.siteWhatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary px-7 py-3.5 text-sm sm:text-base"
                >
                  {home.hero.secondaryCtaLabel}
                </a>
              </div>

              {/* Trust Element */}
              <div className="mt-8 grid grid-cols-1 gap-1.5 sm:grid-cols-3 lg:hidden">
                {home.hero.trustBullets.map((bullet) => (
                  <div key={bullet} className="inline-flex cursor-default items-center gap-2 px-0 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
                    <span className="text-brand-red">•</span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          <div className="mt-7 hidden lg:mt-9 lg:block">
            <div className="flex flex-wrap items-center gap-8 border-t border-white/12 pt-4">
              {home.hero.trustBullets.map((bullet) => (
                <div key={`${bullet}-strip`} className="flex cursor-default items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/75">
                  <span className="text-brand-red">•</span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Element - Líneas sutiles */}
        <div className="absolute -right-40 top-10 h-96 w-96 rounded-full bg-brand-red/18 opacity-45 blur-3xl" />
      </section>

      <main id="vehiculos" className="container mx-auto scroll-mt-24 px-4 py-18 lg:px-6 lg:py-22">
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-black tracking-[0.05em] text-white sm:text-5xl">{home.inventoryIntro.title}</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-white/72">{home.inventoryIntro.description}</p>
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
            <div className="mt-12 text-center">
              <Link
                href="/vehicles"
                className="btn-secondary text-sm"
              >
                Ver stock completo
              </Link>
            </div>
          </>
        )}
      </main>

      <section id="nosotros" className="container mx-auto scroll-mt-24 px-4 py-20 lg:px-6 lg:py-30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-stretch">
          <div className="premium-shell overflow-hidden rounded-2xl p-5 sm:p-7 lg:p-10">
            <p className="text-xs uppercase tracking-[0.24em] text-brand-red font-bold">{home.about.eyebrow}</p>
            <h2 className="mt-4 max-w-[18ch] text-3xl leading-[1.1] sm:text-5xl text-white tracking-tight wrap-break-word">{home.about.title}</h2>
            <p className="mt-5 max-w-[62ch] text-sm leading-[1.85] text-white/78 sm:text-base lg:text-[1.06rem]">
              {home.about.paragraphs.join(' ')}
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3 text-sm">
              {home.about.stats.map((stat) => (
                <div key={stat.value} className="rounded-lg border border-brand-red/35 bg-black/35 p-4 transition duration-300 hover:border-brand-red/55 hover:shadow-[0_14px_28px_-20px_rgba(194,13,18,0.8)]">
                  <p className="text-brand-red font-bold">{stat.value}</p>
                  <p className="mt-1 text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="h-full rounded-2xl border border-brand-red/75 bg-black/35 p-1.5 shadow-[0_14px_32px_-20px_rgba(194,13,18,0.55)]">
            <div className="premium-shell relative min-h-80 overflow-hidden rounded-xl sm:min-h-90 lg:min-h-120">
              <Image
                src={assets.aboutImage}
                alt={home.about.imageAlt}
                fill
                className="object-cover transition duration-700 hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={78}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent" />
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {home.benefits.map((benefit) => (
            <article key={benefit.title} className="premium-shell rounded-xl p-7 transition duration-300 hover:-translate-y-1 hover:border-brand-red/45 hover:shadow-[0_20px_36px_-24px_rgba(194,13,18,0.72)]">
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
              <p className="mt-3 leading-relaxed text-white/70">{benefit.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="opiniones" className="container mx-auto scroll-mt-24 px-4 pb-10 lg:px-6 lg:pb-14">
        <div className="premium-shell relative overflow-hidden rounded-3xl border border-brand-red/35 p-6 shadow-[0_28px_60px_-36px_rgba(0,0,0,0.95)] sm:p-8 lg:p-10">
          <div aria-hidden className="pointer-events-none absolute -left-24 top-18 h-56 w-56 rounded-full bg-brand-red/18 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-16 h-60 w-60 rounded-full bg-white/6 blur-3xl" />

          <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-11">
            <div className="rounded-2xl border border-white/12 bg-linear-to-br from-[#1b1d24] via-[#12141a] to-[#0d0f13] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-red">{home.reviews.eyebrow}</p>
              <h2 className="mt-3 max-w-[18ch] text-3xl font-black leading-[1.04] tracking-[0.04em] text-white sm:text-4xl lg:text-[2.85rem]">
                {home.reviews.title}
              </h2>
              <p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-white/72 sm:text-base">
                {home.reviews.subtitle}
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 border-t border-white/10 pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="rounded-xl border border-white/10 bg-black/28 px-5 py-4">
                  <p className="text-[clamp(3.4rem,8vw,5.4rem)] font-black leading-none tracking-tight text-white drop-shadow-[0_0_24px_rgba(194,13,18,0.35)]">
                    {home.reviews.rating.toFixed(1)}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-brand-red/95" aria-label={`Calificación ${home.reviews.rating.toFixed(1)} de 5`}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={`review-star-${index}`} className="text-base sm:text-lg">★</span>
                    ))}
                  </div>
                  <p className="mt-2 text-sm font-medium text-white/70">{home.reviews.summaryLabel}</p>
                </div>

                <div className="rounded-xl border border-white/14 bg-black/30 px-4 py-3 sm:min-w-34">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/62">Reseñas en Google</p>
                  <p className="mt-1 text-3xl font-black text-white">{home.reviews.reviewCount}</p>
                </div>
              </div>

              <a
                href={reviewsHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver opiniones de NICKBROKERS CARS en Google Maps"
                className="btn-secondary mt-7 w-fit border-white/55 bg-white/4 px-6 py-3 text-sm hover:border-brand-red/75"
              >
                {home.reviews.ctaLabel}
              </a>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {home.reviews.reviews.map((review, index) => (
                <article
                  key={`${review.author}-${review.quote.slice(0, 18)}`}
                  className={`group relative rounded-2xl border border-white/10 bg-linear-to-b from-[#181a21f0] to-[#101218f5] p-5 transition duration-300 hover:border-brand-red/48 hover:shadow-[0_22px_38px_-26px_rgba(194,13,18,0.82)] ${index === 0 ? 'lg:col-span-2 lg:p-6' : ''}`}
                >
                  <p className="absolute right-5 top-4 text-4xl leading-none text-brand-red/24">”</p>
                  <p className="text-3xl leading-none text-brand-red/88">“</p>
                  <p className={`mt-2 leading-relaxed text-white/80 ${index === 0 ? 'text-[0.98rem]' : 'text-sm'}`}>
                    {review.quote}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <p className="text-sm font-semibold text-white">{review.author}</p>
                    <span className="rounded-full border border-white/14 bg-black/28 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/66">
                      {review.sourceLabel}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contacto" className="container mx-auto scroll-mt-24 px-4 py-20 lg:px-6">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.24em] text-brand-red font-bold">{home.contact.eyebrow}</p>
          <h2 className="mt-3 text-4xl sm:text-5xl text-white tracking-tight">{home.contact.title}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-shell rounded-xl p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-red/45 hover:shadow-[0_20px_36px_-24px_rgba(194,13,18,0.72)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
          >
            <div className="text-brand-red mb-4">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
            </div>
            <h3 className="text-2xl text-white tracking-tight">WhatsApp</h3>
            <p className="mt-2 text-white/70 text-sm">{contact.whatsappDisplay}</p>
          </a>

          <a
            href={facebookHref}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-shell rounded-xl p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-red/45 hover:shadow-[0_20px_36px_-24px_rgba(194,13,18,0.72)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
          >
            <div className="text-brand-red mb-4">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M13.5 8H16V5h-2.5C11.57 5 10 6.57 10 8.5V11H8v3h2v5h3v-5h2.3l.7-3H13v-2.1c0-.5.4-.9.9-.9z"/></svg>
            </div>
            <h3 className="text-2xl text-white tracking-tight">Facebook</h3>
            <p className="mt-2 text-white/70 text-sm">{facebookName}</p>
          </a>

          <a
            href={instagramHref}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-shell rounded-xl p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-red/45 hover:shadow-[0_20px_36px_-24px_rgba(194,13,18,0.72)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
          >
            <div className="text-brand-red mb-4">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="6"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>
            </div>
            <h3 className="text-2xl text-white tracking-tight">Instagram</h3>
            <p className="mt-2 text-white/70 text-sm">@{social.instagramHandle}</p>
          </a>

          <a
            href={mailHref}
            className="premium-shell rounded-xl p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-red/45 hover:shadow-[0_20px_36px_-24px_rgba(194,13,18,0.72)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
          >
            <div className="text-brand-red mb-4">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"/><path d="M22 7l-10 7L2 7"/></svg>
            </div>
            <h3 className="text-2xl text-white tracking-tight">Mail</h3>
            <p className="mt-2 text-white/70 text-sm">{contact.email}</p>
          </a>
        </div>
      </section>

      <section id="ubicacion" className="container mx-auto scroll-mt-24 px-4 py-20 lg:px-6">
        <div className="grid grid-cols-1 gap-8 items-stretch lg:grid-cols-[0.9fr_1.1fr]">
          <div className="premium-shell flex h-full flex-col rounded-2xl p-8">
            <div className="flex h-full flex-col justify-center gap-3">
              <p className="text-xs uppercase tracking-[0.24em] text-brand-red font-bold">{home.location.eyebrow}</p>
              <h2 className="text-4xl sm:text-5xl text-white tracking-tight">{home.location.title}</h2>
              <p className="pt-2 text-white/75 leading-relaxed">{home.location.description}</p>
              <p className="text-sm text-white/55">{home.location.mapCaption}</p>
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir ubicación de NICKBROKERS CARS en Google Maps"
                className="btn-secondary mt-3 w-fit px-5 py-2.5 text-xs sm:text-sm"
              >
                Abrir en Maps
              </a>
            </div>
          </div>

          <div className="h-full rounded-2xl border border-brand-red/75 bg-black/35 p-1.5 shadow-[0_14px_32px_-20px_rgba(194,13,18,0.55)]">
            <div className="premium-shell relative h-90 w-full overflow-hidden rounded-xl md:h-107.5 lg:h-full lg:min-h-120">
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
