import type { Metadata } from 'next';
import { getApps, getCategories } from '@/lib/data';
import { AppsDirectoryClient } from '@/components/apps/apps-directory-client';

export const metadata: Metadata = {
  title: 'App Directory',
  description:
    'Browse the DroidZyra app directory. Search and filter Android apps by category, developer and package name.',
  alternates: { canonical: '/apps' },
};

const PAGE_SIZE = 24;

export default async function AppsPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    category?: string;
    page?: string;
  };
}) {
  const query = searchParams.q?.trim() ?? '';
  const categorySlug = searchParams.category ?? '';

  const categories = await getCategories();

  const activeCategory = categories.find(
    (category) => category.slug === categorySlug
  );

  const requestedPage = Number(searchParams.page ?? '1');

  const currentPage =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.floor(requestedPage)
      : 1;

  const offset = (currentPage - 1) * PAGE_SIZE;

  const { apps, total } = await getApps({
    limit: PAGE_SIZE,
    offset,
    search: query || undefined,
    category: activeCategory?.id,
  });

  const totalPages = Math.max(
    1,
    Math.ceil(total / PAGE_SIZE)
  );

  return (
    <AppsDirectoryClient
      apps={apps}
      categories={categories}
      total={total}
      initialQuery={query}
      initialCategory={categorySlug}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}