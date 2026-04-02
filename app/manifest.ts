import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.brand.name,
    short_name: siteConfig.brand.shortName,
    description: siteConfig.seo.defaultDescription,
    start_url: '/',
    display: 'standalone',
    background_color: siteConfig.theme.colors.background,
    theme_color: siteConfig.seo.themeColor,
    icons: [
      {
        src: '/globe.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
