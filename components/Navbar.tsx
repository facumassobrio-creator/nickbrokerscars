"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

export function Navbar() {
  const { assets, brand, navigation } = siteConfig;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-all duration-300 ${
        isScrolled
          ? "border-white/15 bg-[#0a0b0dcc] shadow-[0_20px_38px_-30px_rgba(0,0,0,0.95)]"
          : "border-white/10 bg-[#0d0e12a8]"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3.5 lg:px-6 lg:py-4.5">
        <Link
          href="/"
          className="-ml-1 flex items-center gap-2.5 px-1 py-1 sm:gap-3 sm:px-1.5"
          aria-label={assets.logoAlt || brand.name}
          onClick={closeMobileMenu}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-red/85 shadow-[0_0_10px_rgba(194,13,18,0.65)]"></span>
          {assets.logoImage ? (
            <Image
              src={assets.logoImage}
              alt={assets.logoAlt || brand.name}
              width={290}
              height={82}
              className="h-13 w-auto object-contain sm:h-14 lg:h-16"
              priority
            />
          ) : (
            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-black tracking-[0.03em] text-white">{assets.logoText.primary || brand.shortName}</span>
              {assets.logoText.secondary ? (
                <span className="text-xs font-semibold tracking-[0.24em] text-white/70">{assets.logoText.secondary}</span>
              ) : null}
            </div>
          )}
        </Link>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/25 text-white transition duration-300 hover:border-brand-red/60 hover:bg-brand-red/15 sm:hidden"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-admin-menu"
          aria-label={isMobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <span className="sr-only">Menu</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {isMobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>

        <nav className="hidden items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 sm:flex sm:gap-5 sm:text-xs">
          <div className="flex items-center gap-3 sm:gap-5">
            {navigation.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative pb-1 transition duration-300 hover:text-white"
              >
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-brand-red transition duration-300 group-hover:scale-x-100" aria-hidden />
              </Link>
            ))}
          </div>

          <span className="ml-2 sm:ml-6 h-5 w-px bg-white/15" aria-hidden />
          <Link
            href={navigation.admin.href}
            className="inline-flex items-center rounded-md border border-brand-red/70 bg-brand-red/8 px-3 py-1.5 text-brand-red transition duration-300 hover:border-brand-red hover:bg-brand-red hover:text-white hover:shadow-[0_10px_26px_-14px_rgba(194,13,18,0.9)]"
          >
            {navigation.admin.label}
          </Link>
        </nav>
      </div>

      {isMobileMenuOpen ? (
        <nav
          id="mobile-admin-menu"
          className="border-t border-white/10 bg-[#0a0a0eee] px-4 py-3 backdrop-blur-xl sm:hidden"
        >
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-white/85">
              {navigation.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="rounded-md px-3 py-2 transition duration-300 hover:bg-brand-red/10 hover:text-brand-red"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="my-3 h-px bg-white/10" aria-hidden />

            <Link
              href={navigation.admin.href}
              onClick={closeMobileMenu}
              className="inline-flex w-full items-center justify-center rounded-md border border-brand-red/70 bg-brand-red/8 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-brand-red transition duration-300 hover:bg-brand-red hover:text-white"
            >
              {navigation.admin.label}
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
