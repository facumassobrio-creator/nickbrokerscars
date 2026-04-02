import Image from 'next/image';
import { getContactAddress, siteConfig } from '@/config/site';

export function Footer() {
  const { assets, brand, contact, footer, social } = siteConfig;
  const address = getContactAddress();

  return (
    <footer className="bg-black text-white border-t border-white/10">
      <div className="container mx-auto px-4 py-12 space-y-8 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80 border-l-4 border-brand-red pl-3">{footer.scheduleLabel}</h3>
            <div className="mt-4 rounded-md border border-white/10 bg-black/35 p-3">
              {contact.businessHours.map((businessHour) => (
                <p key={businessHour.label} className="text-sm text-white/70">
                  {businessHour.label}: {businessHour.value}
                </p>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80 border-l-4 border-brand-red pl-3">{footer.locationLabel}</h3>
            <p className="mt-3 text-sm text-white/70">{address}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80 border-l-4 border-brand-red pl-3">{footer.contactLabel}</h3>
            <p className="mt-3 text-sm text-white/70">{footer.whatsappLabel}: {contact.whatsappDisplay}</p>
            <p className="mt-1 text-sm text-white/70">{footer.phoneLabel}: {contact.phone}</p>
            <p className="mt-1 text-sm text-white/70">{footer.emailLabel}: {contact.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80 border-l-4 border-brand-red pl-3">{footer.socialLabel}</h3>
            <p className="mt-3 text-sm text-white/70">{footer.instagramLabel}: @{social.instagramHandle}</p>
          </div>
        </div>
        <div className="flex justify-center">
          {assets.logoImage ? (
            <Image
              src={assets.logoImage}
              alt={assets.logoAlt || brand.name}
              width={180}
              height={60}
              className="h-10 w-auto object-contain"
            />
          ) : (
            <div className="text-center text-[11px] uppercase tracking-[0.22em] text-white/65">
              {footer.bottomText || brand.commercialName || brand.name}
            </div>
          )}
        </div>
        {footer.showAgencyCredit ? (
          <div className="border-t-2 border-brand-red/30 pt-5 text-center text-xs text-white/60">
            {footer.creditText}{' '}
            {footer.creditHighlightText ? (
              <span className="text-brand-red font-semibold">{footer.creditHighlightText}</span>
            ) : null}
          </div>
        ) : null}
      </div>
    </footer>
  );
}
