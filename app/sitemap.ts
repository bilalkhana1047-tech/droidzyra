import type { MetadataRoute } from 'next';

import {
  getSitemapApps,
  getSitemapVersions,
  getCategories,
} from '@/lib/data';

import { guides } from '@/lib/guides';
import { siteConfig } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [apps, versions, categories] = await Promise.all([
    getSitemapApps(),
    getSitemapVersions(),
    getCategories(),
  ]);

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
      url: `${siteConfig.url}/guides`,
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
    {
      url: `${siteConfig.url}/disclaimer`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteConfig.url}/dmca`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map(
    (category) => ({
      url: `${siteConfig.url}/apps/category/${category.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  );

  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${siteConfig.url}/guides/${guide.slug}`,
    lastModified: new Date(guide.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const appPages: MetadataRoute.Sitemap = apps.map((app) => ({
    url: `${siteConfig.url}/apps/${app.slug}`,
    lastModified: new Date(app.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const versionHistoryPages: MetadataRoute.Sitemap = apps.map(
    (app) => ({
      url: `${siteConfig.url}/apps/${app.slug}/versions`,
      lastModified: new Date(app.updated_at),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  );

  const appSlugMap = new Map(
    apps.map((app) => [app.id, app.slug])
  );

  const versionPages: MetadataRoute.Sitemap = versions
    .map((version) => {
      const slug = appSlugMap.get(version.app_id);

      if (!slug) {
        return null;
      }

      return {
        url: `${siteConfig.url}/apps/${slug}/versions/${version.version_name}`,
        lastModified: new Date(version.release_date),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      };
    })
    .filter(
      (
        item
      ): item is NonNullable<typeof item> =>
        item !== null
    );

  return [
    ...staticPages,
    ...categoryPages,
    ...guidePages,
    ...appPages,
    ...versionHistoryPages,
    ...versionPages,
  ];
}
