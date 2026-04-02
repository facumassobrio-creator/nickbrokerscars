import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { siteConfig } from "@/config/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-heading",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.seo.siteUrl),
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.seo.defaultDescription,
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: siteConfig.brand.name,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    images: [
      {
        url: siteConfig.seo.defaultOgImage,
        width: 1200,
        height: 630,
        alt: siteConfig.brand.name,
      },
    ],
  },
  twitter: {
    card: siteConfig.seo.twitterCard,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    images: [siteConfig.seo.defaultOgImage],
    site: siteConfig.seo.twitterSite,
    creator: siteConfig.seo.twitterCreator,
  },
  icons: {
    icon: '/globe.svg',
    shortcut: '/globe.svg',
    apple: '/globe.svg',
  },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: siteConfig.seo.themeColor,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <FloatingWhatsAppButton />
      </body>
    </html>
  );
}
