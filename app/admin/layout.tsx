import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: siteConfig.seo.adminTitle,
  description: siteConfig.seo.adminDescription,
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-[#121214] via-[#0f0f10] to-[#090909] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-52 -left-52 h-136 w-136 bg-[radial-gradient(circle,rgba(160,0,0,0.18)_0%,rgba(160,0,0,0.08)_40%,rgba(0,0,0,0)_74%)]" />
        <div className="absolute right-0 top-0 h-80 w-88 bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0)_72%)]" />
      </div>

      <header className="relative z-10 border-b border-white/10 bg-black/45 backdrop-blur-lg">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-brand-red">Panel administrativo</p>
            <h1 className="text-xl tracking-wide">{siteConfig.brand.name}</h1>
          </div>
          <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider sm:gap-3">
            <Link
              href="/admin/vehicles"
              className="rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white/85 transition hover:border-brand-red/70 hover:text-white"
            >
              Vehículos
            </Link>
            <Link
              href="/"
              className="rounded-md border border-brand-red/65 bg-brand-red/10 px-3 py-2 text-brand-red transition hover:bg-brand-red hover:text-white"
            >
              Ver sitio
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8">{children}</main>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/30 to-transparent" />
    </div>
  );
}
