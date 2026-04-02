import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { siteConfig } from '@/config/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: siteConfig.seo.siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteConfig.seo.siteUrl}/vehicles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return entries;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from('vehicles')
      .select('id, updated_at')
      .eq('is_published', true)
      .order('updated_at', { ascending: false })
      .limit(500);

    if (error || !data) {
      return entries;
    }

    const vehicleEntries: MetadataRoute.Sitemap = data.map((vehicle) => ({
      url: `${siteConfig.seo.siteUrl}/vehicles/${vehicle.id}`,
      lastModified: vehicle.updated_at ? new Date(vehicle.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...entries, ...vehicleEntries];
  } catch {
    return entries;
  }
}
