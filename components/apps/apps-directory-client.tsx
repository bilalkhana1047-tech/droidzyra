'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  Package,
  CheckCircle2,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { AppCard } from '@/components/shared/app-card';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Container } from '@/components/layout/container';
import type { App, Category } from '@/lib/types';
import { TranslatedText } from '@/components/i18n/translated-text';


export function AppsDirectoryClient({
  apps,
  categories,
  total,
  initialQuery,
  initialCategory,
  currentPage,
  totalPages,
}: {
  apps: App[];
  categories: Category[];
  total: number;
  initialQuery: string;
  initialCategory: string;
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === initialCategory),
    [categories, initialCategory]
  );

  const visible = apps;

  const updateUrl = useCallback(
    (q: string, category: string, page = 1) => {
      const params = new URLSearchParams();

      if (q) params.set('q', q);
      if (category) params.set('category', category);
      if (page > 1) params.set('page', String(page));

      const qs = params.toString();

      router.push(`/apps${qs ? `?${qs}` : ''}`);
    },
    [router]
  );

  const onSearchChange = (value: string) => {
    setQuery(value);
    updateUrl(value, initialCategory, 1);
  };

  const onCategoryChange = (slug: string) => {
    updateUrl(query, slug, 1);
  };

  const clearFilters = () => {
    setQuery('');
    router.push('/apps');
  };

  const hasFilters = Boolean(query || initialCategory);

  return (
    <main className="min-h-screen bg-background">
      {/* =====================================================
          DIRECTORY HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-primary/[0.075] via-background to-background" />

        <div className="absolute left-1/2 top-[-250px] -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-primary/[0.13] blur-3xl" />

        <div className="absolute right-[-180px] top-16 -z-10 h-80 w-80 rounded-full bg-violet-500/[0.08] blur-3xl" />

        <Container className="py-9 sm:py-12 lg:py-14">
          <Breadcrumbs
            items={[{ label: 'Apps' }]}
            className="mb-6"
          />

          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/70 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-primary shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                DroidZyra App Directory
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-[-0.045em] text-foreground sm:text-5xl">
                Discover Android apps
                <span className="block bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                  and the right versions.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Search apps by name, developer or package, browse categories
                and explore version information for your Android device.
              </p>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  {total} <TranslatedText text="apps available" />
                </span>

                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  {categories.length} categories
                </span>

                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <TranslatedText text="Search & filter" />
                </span>
              </div>
            </div>

            <div className="hidden rounded-[22px] border border-border/60 bg-background/75 p-4 shadow-lg backdrop-blur lg:block">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <LayoutGrid className="h-7 w-7" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =====================================================
          DIRECTORY CONTENT
      ===================================================== */}

      <section className="relative py-10 sm:py-12 lg:py-14">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/20 to-background" />

        <Container>
          <div className="grid gap-7 lg:grid-cols-[270px_minmax(0,1fr)]">
            {/* ================= FILTER SIDEBAR ================= */}

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-[22px] border border-border/60 bg-background shadow-[0_15px_50px_-30px_rgba(15,23,42,0.25)]">
                <div className="border-b border-border/60 bg-muted/20 px-5 py-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <SlidersHorizontal className="h-4 w-4" />
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-foreground">
                        Find Apps
                      </h2>

                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        <TranslatedText text="Search and filter the directory" />
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                    <TranslatedText text="Search" />
                  </label>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      value={query}
                      onChange={(e) => onSearchChange(e.target.value)}
                      placeholder="Search apps..."
                      className="h-11 rounded-xl bg-muted/25 pl-9 pr-9"
                      aria-label="Search apps"
                    />

                    {query && (
                      <button
                        type="button"
                        onClick={() => onSearchChange('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        aria-label="Clear search"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="my-5 h-px bg-border/60" />

                  <div className="flex items-center justify-between">
                    <h3
                      id="categories"
                      className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground"
                    >
                      Categories
                    </h3>

                    <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-semibold text-muted-foreground">
                      {categories.length}
                    </span>
                  </div>

                  <div className="mt-3 flex max-h-[430px] flex-col gap-1 overflow-y-auto pr-1">
                    <button
                      onClick={() => onCategoryChange('')}
                      className={`flex min-h-10 items-center justify-between rounded-xl px-3 text-left text-sm transition-all ${
                        !initialCategory
                          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/15'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <span className="font-medium"><TranslatedText text="All categories" /></span>

                      {!initialCategory && (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      )}
                    </button>

                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => onCategoryChange(category.slug)}
                        className={`flex min-h-10 items-center justify-between rounded-xl px-3 text-left text-sm transition-all ${
                          initialCategory === category.slug
                            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/15'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <span className="truncate font-medium">
                          <TranslatedText text={category.name} />
                        </span>

                        {initialCategory === category.slug && (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  {hasFilters && (
                    <>
                      <div className="my-5 h-px bg-border/60" />

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        className="h-10 w-full gap-2 rounded-xl"
                      >
                        <X className="h-4 w-4" />
                        <TranslatedText text="Clear all filters" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </aside>

            {/* ================= RESULTS ================= */}

            <div className="min-w-0">
              <div className="mb-6 rounded-[20px] border border-border/60 bg-background px-5 py-4 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold tracking-tight">
                        {activeCategory
                          ? <TranslatedText text={activeCategory.name} />
                          : <TranslatedText text="All Applications" />}
                      </h2>

                      <Badge
                        variant="secondary"
                        className="rounded-full"
                      >
                        {total} result
                        {total !== 1 ? 's' : ''}
                      </Badge>
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Browse available apps and explore version details.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {activeCategory && (
                      <Badge
                        variant="outline"
                        className="rounded-full px-3 py-1"
                      >
                        <TranslatedText text={activeCategory.name} />
                      </Badge>
                    )}

                    {query && (
                      <Badge
                        variant="outline"
                        className="max-w-[220px] truncate rounded-full px-3 py-1"
                      >
                        <TranslatedText text="Search" />: “{query}”
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {visible.length === 0 ? (
                <div className="overflow-hidden rounded-[24px] border border-border/60 bg-background p-4 shadow-sm">
                  <EmptyState
                    title="No apps found"
                    description="Try adjusting your search or category filter to find what you're looking for."
                    icon={<Package className="h-6 w-6" />}
                    action={
                      hasFilters ? (
                        <Button
                          variant="outline"
                          onClick={clearFilters}
                          className="gap-2 rounded-xl"
                        >
                          <X className="h-4 w-4" />
                          <TranslatedText text="Clear filters" />
                        </Button>
                      ) : undefined
                    }
                  />
                </div>
              ) : (
                <>
                  <div className="rounded-[26px] border border-border/60 bg-background/70 p-4 shadow-[0_18px_55px_-35px_rgba(15,23,42,0.25)] backdrop-blur sm:p-5">
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {visible.map((app) => (
                        <div
                          key={app.id}
                          className="group transition-all duration-300 hover:-translate-y-1"
                        >
                          <AppCard app={app} />
                        </div>
                      ))}
                    </div>
                  </div>

                                    {totalPages > 1 && (
                    <div className="mt-8 flex flex-col items-center gap-4">
                      <p className="text-xs text-muted-foreground">
                        Page {currentPage} of {totalPages} · {total} apps
                      </p>

                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage <= 1}
                          onClick={() =>
                            updateUrl(
                              query,
                              initialCategory,
                              Math.max(1, currentPage - 1)
                            )
                          }
                          className="rounded-xl"
                        >
                          ← <TranslatedText text="Previous" />
                        </Button>

                        {Array.from(
                          { length: Math.min(totalPages, 7) },
                          (_, index) => {
                            let pageNumber: number;

                            if (totalPages <= 7) {
                              pageNumber = index + 1;
                            } else if (currentPage <= 4) {
                              pageNumber = index + 1;
                            } else if (currentPage >= totalPages - 3) {
                              pageNumber = totalPages - 6 + index;
                            } else {
                              pageNumber = currentPage - 3 + index;
                            }

                            return (
                              <Button
                                key={pageNumber}
                                variant={
                                  pageNumber === currentPage
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                  updateUrl(
                                    query,
                                    initialCategory,
                                    pageNumber
                                  )
                                }
                                className="min-w-9 rounded-xl"
                              >
                                {pageNumber}
                              </Button>
                            );
                          }
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage >= totalPages}
                          onClick={() =>
                            updateUrl(
                              query,
                              initialCategory,
                              Math.min(
                                totalPages,
                                currentPage + 1
                              )
                            )
                          }
                          className="rounded-xl"
                        >
                          <TranslatedText text="Next" /> →
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}








