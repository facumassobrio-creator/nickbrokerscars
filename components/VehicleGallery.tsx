"use client";

import Image from 'next/image';
import { useMemo, useState } from 'react';
import type { VehicleImageWithUrl } from '@/lib/vehicleService';

interface VehicleGalleryProps {
  images: VehicleImageWithUrl[];
  alt: string;
}

export function VehicleGallery({ images, alt }: VehicleGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const validImages = useMemo(() => images.filter((image) => Boolean(image.url)), [images]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg border border-white/10 bg-[#0d0e12bf] text-white/45">
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  if (validImages.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg border border-white/10 bg-[#0d0e12bf] text-white/45">
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  const goPrev = () => setActiveIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  const goNext = () => setActiveIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  const activeImage = validImages[activeIndex];

  return (
    <div className="space-y-4">
      <div className="relative aspect-16/10 overflow-hidden rounded-2xl border border-white/12 bg-[#0e1014d1] shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 transition-opacity duration-300">
          <Image
            key={activeImage.id}
            src={activeImage.url as string}
            alt={alt}
            fill
            className="object-cover transition-transform duration-500 hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 58vw"
            quality={80}
            priority={activeIndex === 0}
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/62 via-black/8 to-transparent" />

        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/55 px-3 py-2 text-white transition duration-300 hover:border-brand-red/75 hover:bg-brand-red/30"
            >
              ←
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Siguiente imagen"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/55 px-3 py-2 text-white transition duration-300 hover:border-brand-red/75 hover:bg-brand-red/30"
            >
              →
            </button>
          </>
        )}
      </div>

      {validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {validImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Ver imagen ${index + 1}`}
              className={`relative aspect-4/3 overflow-hidden rounded-lg border transition duration-200 ${
                index === activeIndex
                  ? 'border-brand-red ring-1 ring-brand-red/60'
                  : 'border-white/15 hover:border-brand-red/45 hover:shadow-[0_10px_22px_-14px_rgba(194,13,18,0.8)]'
              }`}
            >
              <Image
                src={image.url as string}
                alt={`${alt} miniatura ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 20vw, 120px"
                quality={60}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}