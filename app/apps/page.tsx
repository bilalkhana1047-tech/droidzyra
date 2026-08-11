import type { Metadata } from 'next';
import { getApps, getCategories } from '@/lib/data';
import { AppsDirectoryClient } from '@/components/apps/apps-directory-client';

export const metadata: Metadata = {
  title: 'App Directory',
  description:
    'Browse the DroidZyra app directory. Search and filter Android apps by category, developer and package name.',
  alternates: { canonical: '/apps' },
};

export default async function AppsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const query = searchParams.q ?? '';
  const categorySlug = searchParams.category ?? '';

  const [categories, { apps, total }] = await Promise.all([
    getCategories(),
    getApps({ limit: 100 }),
  ]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);
  const filtered = activeCategory
    ? apps.filter((a) => a.category_id === activeCategory.id)
    : apps;

  return (
    <AppsDirectoryClient
      apps={filtered}
      categories={categories}
      total={filtered.length}
      initialQuery={query}
      initialCategory={categorySlug}
    />
  );
}
