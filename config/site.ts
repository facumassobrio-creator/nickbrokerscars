import { WHATSAPP_CONTACT_NUMBER } from '@/lib/whatsapp';

const DEFAULT_SITE_URL = 'https://nickbrokerscars.com';
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');

export interface BusinessHour {
  label: string;
  value: string;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface BrandConfig {
  name: string;
  shortName: string;
  tagline: string;
  legalName?: string;
  commercialName?: string;
}

export interface ContactConfig {
  whatsapp: string;
  whatsappDisplay: string;
  phone: string;
  email: string;
  addressLine: string;
  city: string;
  businessHours: BusinessHour[];
}

export interface SocialConfig {
  instagramHandle: string;
  instagramUrl: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
}

export interface SeoConfig {
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultOgImage: string;
  themeColor: string;
  twitterCard: 'summary' | 'summary_large_image';
  twitterSite?: string;
  twitterCreator?: string;
  homeTitle: string;
  homeDescription: string;
  vehicleTitleSuffix: string;
  adminTitle: string;
  adminDescription: string;
}

export interface AssetsConfig {
  heroImage: string;
  aboutImage: string;
  logoImage?: string;
  logoText: {
    primary: string;
    secondary?: string;
  };
  logoAlt: string;
}

export interface MessagesConfig {
  floatingWhatsappMessage: string;
  floatingWhatsappAriaLabel: string;
  whatsappCtaLabel: string;
  siteWhatsappMessage: string;
  vehicleInquiryTemplate: string;
}

export interface FooterConfig {
  creditText: string;
  creditHighlightText?: string;
  showAgencyCredit: boolean;
  scheduleLabel: string;
  locationLabel: string;
  contactLabel: string;
  socialLabel: string;
  bottomText: string;
  whatsappLabel: string;
  phoneLabel: string;
  emailLabel: string;
  instagramLabel: string;
}

export interface AdminNavigationConfig {
  label: string;
  href: string;
}

export interface ThemeConfig {
  colors: {
    background: string;
    foreground: string;
    brandPrimary: string;
    brandPrimaryDark: string;
    brandSecondary: string;
  };
  surfaces: {
    base: string;
    elevated: string;
    muted: string;
  };
  shadows: {
    brandGlow: string;
    floatingAction: string;
  };
  gradients: {
    pageBackground: string;
    cardBackground: string;
  };
  overlays: {
    heroAccent: string;
    heroDark: string;
  };
}

export interface HomeHeroConfig {
  badge: string;
  titleLines: [string, string];
  subtitle: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  trustBullets: string[];
}

export interface HomeIntroConfig {
  title: string;
  description: string;
  emptyState: string;
}

export interface HomeStatConfig {
  label: string;
  value: string;
}

export type BenefitIconKey = 'shield' | 'search' | 'document';

export interface HomeBenefitConfig {
  iconKey: BenefitIconKey;
  title: string;
  description: string;
}

export interface HomeAboutConfig {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  stats: HomeStatConfig[];
  imageAlt: string;
  imageCaption: string;
}

export interface HomeContactConfig {
  eyebrow: string;
  title: string;
}

export interface HomeLocationConfig {
  eyebrow: string;
  title: string;
  description: string;
  mapCaption: string;
  mapTitle: string;
  mapEmbedUrl: string;
}

export interface HomeVehicleCardConfig {
  premiumBadge: string;
  noImageLabel: string;
}

export interface HomeConfig {
  hero: HomeHeroConfig;
  inventoryIntro: HomeIntroConfig;
  about: HomeAboutConfig;
  benefits: HomeBenefitConfig[];
  contact: HomeContactConfig;
  location: HomeLocationConfig;
  vehicleCard: HomeVehicleCardConfig;
}

export interface SiteConfig {
  brand: BrandConfig;
  contact: ContactConfig;
  social: SocialConfig;
  seo: SeoConfig;
  navigation: {
    items: NavigationItem[];
    admin: AdminNavigationConfig;
  };
  assets: AssetsConfig;
  messages: MessagesConfig;
  footer: FooterConfig;
  theme: ThemeConfig;
  home: HomeConfig;
}

export const siteConfig = {
  brand: {
    name: 'Nickbrokers Cars',
    shortName: 'Nickbrokers',
    tagline: 'Vehículos seleccionados, atención personalizada y contacto directo.',
    legalName: 'Nickbrokers Cars',
    commercialName: 'Nickbrokers Cars',
  },
  contact: {
    whatsapp: WHATSAPP_CONTACT_NUMBER,
    whatsappDisplay: '+54 3794 40-6993',
    phone: '+54 3794 40-6993',
    email: 'nickbrockers.cars@gmail.com',
    addressLine: 'Avenida Armenia 3880',
    city: 'Corrientes Capital',
    businessHours: [
      { label: 'Lunes a Viernes', value: '9:00 a 12:30 hs · 16:30 a 20:00 hs' },
    ],
  },
  social: {
    instagramHandle: 'nickbrockers_cars',
    instagramUrl: 'https://instagram.com/nickbrockers_cars',
    facebookUrl: '',
    tiktokUrl: '',
    youtubeUrl: '',
    linkedinUrl: '',
  },
  seo: {
    siteUrl,
    defaultTitle: 'Nickbrokers Cars',
    defaultDescription: 'Vehículos seleccionados con atención personalizada y asesoramiento claro.',
    defaultOgImage: '/og-default.svg',
    themeColor: '#121214',
    twitterCard: 'summary_large_image',
    twitterSite: '@nickbrockers_cars',
    twitterCreator: '@nickbrockers_cars',
    homeTitle: 'Nickbrokers Cars - Vehículos seleccionados',
    homeDescription: 'Encontrá tu próximo vehículo con atención personalizada, transparencia y unidades seleccionadas.',
    vehicleTitleSuffix: 'Nickbrokers Cars',
    adminTitle: 'Admin | Nickbrokers Cars',
    adminDescription: 'Panel de administración de Nickbrokers Cars',
  },
  navigation: {
    items: [
      { label: 'Home', href: '/#home' },
      { label: 'Vehículos', href: '/vehicles' },
      { label: 'Nosotros', href: '/#nosotros' },
      { label: 'Contacto', href: '/#contacto' },
      { label: 'Ubicación', href: '/#ubicacion' },
    ],
    admin: {
      label: 'Admin',
      href: '/admin',
    },
  },
  assets: {
    heroImage: '/hero.jpg',
    aboutImage: '/about-placeholder.svg',
    logoImage: '/logo-nickbrokers.png',
    logoText: {
      primary: 'Nickbrokers',
      secondary: 'CARS',
    },
    logoAlt: 'Nickbrokers Cars',
  },
  messages: {
    floatingWhatsappMessage: 'Hola, quisiera recibir más información sobre los vehículos disponibles.',
    floatingWhatsappAriaLabel: 'Contactar por WhatsApp',
    whatsappCtaLabel: 'Contactar por WhatsApp',
    siteWhatsappMessage: 'Hola, quisiera recibir más información sobre los vehículos disponibles.',
    vehicleInquiryTemplate: 'Hola, estoy interesado en el {{brand}} {{model}} {{year}}. ¿Podrías darme más información?',
  },
  footer: {
    creditText: 'Desarrollado por',
    creditHighlightText: 'FGM Digital',
    showAgencyCredit: true,
    scheduleLabel: 'Horarios',
    locationLabel: 'Ubicación',
    contactLabel: 'Contacto',
    socialLabel: 'Redes',
    bottomText: 'nickbrokers cars',
    whatsappLabel: 'WhatsApp',
    phoneLabel: 'Teléfono',
    emailLabel: 'Email',
    instagramLabel: 'Instagram',
  },
  theme: {
    colors: {
      background: '#121214',
      foreground: '#f5f5f5',
      brandPrimary: '#a00000',
      brandPrimaryDark: '#8b0000',
      brandSecondary: '#101010',
    },
    surfaces: {
      base: '#101010',
      elevated: '#1b1b1b',
      muted: '#0a0a0a',
    },
    shadows: {
      brandGlow: '0 20px 50px -20px rgba(160, 0, 0, 1)',
      floatingAction: '0 12px 28px -14px rgba(0,0,0,0.9), 0 8px 20px -12px rgba(160,0,0,0.75)',
    },
    gradients: {
      pageBackground: 'linear-gradient(to bottom, #121214 0%, #0f0f10 50%, #0a0a0a 100%)',
      cardBackground: 'radial-gradient(circle at top, #202020 0%, #0a0a0a 55%)',
    },
    overlays: {
      heroAccent: 'radial-gradient(130% 95% at 18% 12%, rgba(160,0,0,0.2) 0%, rgba(160,0,0,0.09) 34%, rgba(0,0,0,0) 65%)',
      heroDark: 'linear-gradient(to right, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.62) 50%, rgba(0,0,0,0.8) 100%)',
    },
  },
  home: {
    hero: {
      badge: 'Atención Personalizada',
      titleLines: ['Nickbrokers', 'Cars'],
      subtitle: 'Encontrá tu próximo vehículo con atención personalizada, transparencia y unidades seleccionadas.',
      primaryCtaLabel: 'Ver Vehículos',
      secondaryCtaLabel: 'Contactar por WhatsApp',
      trustBullets: ['Atención Directa', 'Unidades Seleccionadas', 'Asesoramiento Claro'],
    },
    inventoryIntro: {
      title: 'Vehículos Disponibles',
      description: 'Explorá nuestra selección de vehículos disponibles y consultanos por cada unidad.',
      emptyState: 'No hay vehículos disponibles en este momento.',
    },
    about: {
      eyebrow: 'Presentación',
      title: 'Nosotros',
      paragraphs: [
        'En Nickbrokers Cars trabajamos para ofrecer vehículos seleccionados y una atención directa, clara y confiable en cada consulta.',
      ],
      stats: [
        { value: 'Atención directa', label: 'Seguimiento personalizado en cada consulta' },
        { value: 'Unidades seleccionadas', label: 'Stock elegido con criterio y transparencia' },
      ],
      imageAlt: 'Showroom de Nickbrokers Cars',
      imageCaption: 'Imagen institucional de la concesionaria.',
    },
    benefits: [
      {
        iconKey: 'shield' as const,
        title: 'Atención confiable',
        description: 'Te acompañamos con información clara y respuestas directas durante todo el proceso.',
      },
      {
        iconKey: 'search' as const,
        title: 'Selección de unidades',
        description: 'Cada vehículo publicado es revisado para mantener un estándar consistente de calidad.',
      },
      {
        iconKey: 'document' as const,
        title: 'Asesoramiento claro',
        description: 'Te orientamos en cada consulta para que tomes una decisión informada y segura.',
      },
    ],
    vehicleCard: {
      premiumBadge: 'Premium',
      noImageLabel: 'Sin imagen',
    },
    contact: {
      eyebrow: 'Contacto Directo',
      title: 'Contacto',
    },
    location: {
      eyebrow: 'Visitanos',
      title: 'Ubicación',
      description: 'Avenida Armenia 3880, Corrientes Capital',
      mapCaption: 'Lunes a Viernes: 9:00 a 12:30 hs · 16:30 a 20:00 hs',
      mapTitle: 'Mapa Nickbrokers Cars',
      mapEmbedUrl: 'https://www.google.com/maps?q=Avenida%20Armenia%203880%20Corrientes%20Capital&output=embed',
    },
  },
} satisfies SiteConfig;

export interface VehicleInquiryParams {
  brand: string;
  model: string;
  year: number | string;
}

export function buildVehicleInquiryMessage({ brand, model, year }: VehicleInquiryParams) {
  return siteConfig.messages.vehicleInquiryTemplate
    .replace('{{brand}}', brand)
    .replace('{{model}}', model)
    .replace('{{year}}', String(year));
}

export function getContactAddress() {
  return `${siteConfig.contact.addressLine}, ${siteConfig.contact.city}`;
}