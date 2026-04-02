import Image from 'next/image';
import { getContactAddress, siteConfig } from '@/config/site';

export function Footer() {
  const { assets, brand, contact, footer, social } = siteConfig;
  const address = getContactAddress();

  return (
    <footer className="border-t border-white/10 bg-linear-to-b from-[#090a0d] to-[#050507] text-white">
      <div className="container mx-auto space-y-9 px-4 py-14 lg:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-7 md:items-stretch">
          <div className="flex flex-col">
            <h3 className="border-l-4 border-brand-red pl-3 text-sm font-semibold uppercase tracking-[0.15em] text-white/85">{footer.scheduleLabel}</h3>
            <div className="premium-shell mt-4 flex min-h-30 flex-1 flex-col justify-center rounded-md p-4">
              {contact.businessHours.map((businessHour) => (
                <p key={businessHour.label} className="text-sm text-white/70">
                  {businessHour.label}: {businessHour.value}
                </p>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="border-l-4 border-brand-red pl-3 text-sm font-semibold uppercase tracking-[0.15em] text-white/85">{footer.locationLabel}</h3>
            <div className="premium-shell mt-4 flex min-h-30 flex-1 flex-col justify-center rounded-md p-4">
              <p className="text-sm text-white/72">{address}</p>
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="border-l-4 border-brand-red pl-3 text-sm font-semibold uppercase tracking-[0.15em] text-white/85">{footer.contactLabel}</h3>
            <div className="premium-shell mt-4 flex min-h-30 flex-1 flex-col justify-center rounded-md p-4">
              <p className="text-sm text-white/72">{footer.whatsappLabel}: {contact.whatsappDisplay}</p>
              <p className="mt-1 text-sm text-white/72">{footer.phoneLabel}: {contact.phone}</p>
              <p className="mt-1 text-sm text-white/72">{footer.emailLabel}: {contact.email}</p>
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="border-l-4 border-brand-red pl-3 text-sm font-semibold uppercase tracking-[0.15em] text-white/85">{footer.socialLabel}</h3>
            <div className="premium-shell mt-4 flex min-h-30 flex-1 flex-col justify-center rounded-md p-4">
              <p className="text-sm text-white/72">{footer.instagramLabel}: @{social.instagramHandle}</p>
              <p className="mt-1 text-sm text-white/72">Facebook: {social.facebookName || 'Nickbrokers'}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center border-t border-white/10 pt-8">
          {assets.logoImage ? (
            <Image
              src={assets.logoImage}
              alt={assets.logoAlt || brand.name}
              width={260}
              height={88}
              className="h-14 w-auto object-contain sm:h-16"
            />
          ) : (
            <div className="text-center text-[11px] uppercase tracking-[0.22em] text-white/65">
              {footer.bottomText || brand.commercialName || brand.name}
            </div>
          )}
        </div>
        {footer.showAgencyCredit ? (
          <div className="border-t border-brand-red/35 pt-5 text-center text-xs text-white/60">
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
