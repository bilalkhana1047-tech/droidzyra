'use client';

import { useState, useMemo, useCallback } from 'react';
import { Search, SlidersHorizontal, X, Package } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppCard } from '@/components/shared/app-card';
import { CategoryCard } from '@/components/shared/category-card';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Container } from '@/components/layout/container';
import type { App, Category } from '@/lib/types';

const PAGE_SIZE = 9;

export function AppsDirectoryClient({
  apps,
  categories,
  total,
  initialQuery,
  initialCategory,
}: {
  apps: App[];
  categories: Category[];
  total: number;
  initialQuery: string;
  initialCategory: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === initialCategory),
    [categories, initialCategory]
  );

  const filtered = useMemo(() => {
    let list = apps;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.developer.toLowerCase().includes(q) ||
          a.package_name.toLowerCase().includes(q) ||
          (a.description ?? '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [apps, query]);

  const visible = filtered.slice(0, visibleCount);

  const updateUrl = useCallback(
    (q: string, cat: string) => {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (cat) params.set('category', cat);
      const qs = params.toString();
      router.push(`/apps${qs ? `?${qs}` : ''}`);
    },
    [router]
  );

  const onSearchChange = (val: string) => {
    setQuery(val);
    setVisibleCount(PAGE_SIZE);
    updateUrl(val, initialCategory);
  };

  const onCategoryChange = (slug: string) => {
    setVisibleCount(PAGE_SIZE);
    updateUrl(query, slug);
  };

  const clearFilters = () => {
    setQuery('');
    setVisibleCount(PAGE_SIZE);
    router.push('/apps');
  };

  const hasFilters = Boolean(query || initialCategory);

  return (
    <Container className="py-8 lg:py-12">
      <Breadcrumbs
        items={[{ label: 'Apps' }]}
        className="mb-4"
      />

      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          App Directory
        </h1>
        <p className="text-muted-foreground">
          Browse {total} app{total !== 1 ? 's' : ''} across {categories.length}{' '}
          categories. Search, filter and find the right version for your device.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold mb-3">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search apps…"
                className="pl-9"
                aria-label="Search apps"
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Categories</h3>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => onCategoryChange('')}
                className={`text-sm text-left px-3 py-2 rounded-md transition-colors ${
                  !initialCategory
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                All categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange(cat.slug)}
                  className={`text-sm text-left px-3 py-2 rounded-md transition-colors ${
                    initialCategory === cat.slug
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {hasFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="gap-2 w-full"
            >
              <X className="h-4 w-4" />
              Clear filters
            </Button>
          )}
        </aside>

        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 flex-wrap">
              {activeCategory && (
                <Badge variant="secondary">{activeCategory.name}</Badge>
              )}
              {query && <Badge variant="secondary">&ldquo;{query}&rdquo;</Badge>}
              <span className="text-sm text-muted-foreground">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {visible.length === 0 ? (
            <EmptyState
              title="No apps found"
              description="Try adjusting your search or category filter to find what you're looking for."
              icon={<Package className="h-6 w-6" />}
              action={
                hasFilters ? (
                  <Button variant="outline" onClick={clearFilters} className="gap-2">
                    <X className="h-4 w-4" />
                    Clear filters
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>

              {visibleCount < filtered.length && (
                <div className="mt-8 flex justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  >
                    Load more ({filtered.length - visibleCount} remaining)
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
