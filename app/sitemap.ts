import type { MetadataRoute } from 'next';
import { getApps, getVersionsForApp } from '@/lib/data';
import { siteConfig } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { apps } = await getApps({ limit: 1000 });

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/apps`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/compatibility`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/ai`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteConfig.url}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const appPages: MetadataRoute.Sitemap = apps.map((app) => ({
    url: `${siteConfig.url}/apps/${app.slug}`,
    lastModified: new Date(app.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const versionPages: MetadataRoute.Sitemap = [];

  for (const app of apps) {
    const { versions } = await getVersionsForApp(app.slug);

    for (const version of versions) {
      versionPages.push({
        url: `${siteConfig.url}/apps/${app.slug}/versions/${version.version_name}`,
        lastModified: new Date(version.release_date),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return [...staticPages, ...appPages, ...versionPages];
}