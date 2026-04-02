"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/config/site";

export function Navbar() {
  const { assets, brand, navigation } = siteConfig;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 lg:px-6">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label={assets.logoAlt || brand.name}
          onClick={closeMobileMenu}
        >
          <span className="inline-block w-1.5 h-1.5 bg-brand-red rounded-full"></span>
          {assets.logoImage ? (
            <Image
              src={assets.logoImage}
              alt={assets.logoAlt || brand.name}
              width={172}
              height={48}
              className="h-9 w-auto object-contain"
              priority
            />
          ) : (
            <div className="flex flex-col leading-tight">
              <span className="text-white text-xl font-black tracking-[0.02em]">{assets.logoText.primary || brand.shortName}</span>
              {assets.logoText.secondary ? (
                <span className="text-xs font-semibold tracking-widest text-white/70">{assets.logoText.secondary}</span>
              ) : null}
            </div>
          )}
        </Link>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-white transition hover:bg-white/10 sm:hidden"
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

        <nav className="hidden items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-white/80 sm:flex sm:gap-5 sm:text-xs">
          <div className="flex items-center gap-3 sm:gap-5">
            {navigation.items.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={index === 0
                  ? "relative transition text-brand-red after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-brand-red/80 hover:text-white"
                  : "relative transition hover:text-brand-red after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-red after:transition-all after:duration-300 hover:after:w-full"
                }
              >
                {item.label}
              </Link>
            ))}
          </div>

          <span className="ml-2 sm:ml-6 h-5 w-px bg-white/15" aria-hidden />
          <Link
            href={navigation.admin.href}
            className="inline-flex items-center rounded-md border border-brand-red/60 px-2 py-1 text-brand-red transition hover:bg-brand-red hover:text-black"
          >
            {navigation.admin.label}
          </Link>
        </nav>
      </div>

      {isMobileMenuOpen ? (
        <nav
          id="mobile-admin-menu"
          className="border-t border-white/10 bg-black/95 px-4 py-3 sm:hidden"
        >
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wider text-white/85">
              {navigation.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="rounded-md px-3 py-2 transition hover:bg-white/10 hover:text-brand-red"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="my-3 h-px bg-white/10" aria-hidden />

            <Link
              href={navigation.admin.href}
              onClick={closeMobileMenu}
              className="inline-flex w-full items-center justify-center rounded-md border border-brand-red/60 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-brand-red transition hover:bg-brand-red hover:text-black"
            >
              {navigation.admin.label}
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
