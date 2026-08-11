import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Layers, PackageSearch } from 'lucide-react';

import {
  getCategoryBySlug,
  getApps,
  getCategories,
} from '@/lib/data';

import { Container } from '@/components/layout/container';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { AppCard } from '@/components/shared/app-card';
import { Card, CardContent } from '@/components/ui/card';

export async function generateStaticParams() {
  const categories = await getCategories();

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: 'Category Not Found',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${category.name} Android Apps`;

  const description =
    category.description ||
    `Browse ${category.name} Android apps on DroidZyra. Explore app versions, Android compatibility, release information and trusted sources.`;

  return {
    title,
    description: description.slice(0, 160),

    alternates: {
      canonical: `/apps/category/${category.slug}`,
    },

    openGraph: {
      type: 'website',
      title: `${title} | DroidZyra`,
      description: description.slice(0, 160),
      url: `/apps/category/${category.slug}`,
      siteName: 'DroidZyra',
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const [{ apps }, categories] = await Promise.all([
    getApps({
      category: category.id,
      limit: 50,
      sort: 'latest',
    }),
    getCategories(),
  ]);

  const description =
    category.description ||
    `Explore ${category.name} Android apps available in the DroidZyra directory. Browse app information, latest versions, Android requirements, compatibility details and release history.`;

  const relatedCategories = categories
    .filter((item) => item.id !== category.id)
    .slice(0, 6);

  const pageTitle = `${category.name} Android Apps`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    description,
    url: `/apps/category/${category.slug}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'DroidZyra',
    },
    about: {
      '@type': 'Thing',
      name: category.name,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: apps.length,
      itemListElement: apps.map((app, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: app.name,
        url: `/apps/${app.slug}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <Container className="py-6 lg:py-10">
        <Breadcrumbs
          items={[
            {
              label: 'Apps',
              href: '/apps',
            },
            {
              label: category.name,
            },
          ]}
          className="mb-6"
        />

        {/* Category Header */}
        <section className="mb-10">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Layers className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {pageTitle}
              </h1>

              <p className="mt-3 max-w-3xl text-muted-foreground leading-relaxed">
                {description}
              </p>

              <p className="mt-3 text-sm text-muted-foreground">
                {apps.length} active app
                {apps.length !== 1 ? 's' : ''} currently listed in this
                category.
              </p>
            </div>
          </div>
        </section>

        {/* Apps */}
        <section>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">
                Apps in {category.name}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Explore app details, versions, compatibility and release
                information.
              </p>
            </div>

            <Link
              href="/apps"
              className="hidden items-center gap-1.5 text-sm font-medium text-primary hover:underline sm:inline-flex"
            >
              All apps
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {apps.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {apps.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <PackageSearch className="h-10 w-10 text-muted-foreground/60" />

                <h2 className="mt-4 text-lg font-semibold">
                  No apps listed yet
                </h2>

                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  There are currently no active apps in the{' '}
                  {category.name} category. Check back later as the directory
                  grows.
                </p>

                <Link
                  href="/apps"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  Browse all apps
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Category Information */}
        <section className="mt-12">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold">
                About {category.name} Android Apps
              </h2>

              <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  This DroidZyra category contains Android applications
                  associated with {category.name}. Each listed app can be
                  explored individually for information such as its developer,
                  package name, latest version, release date and Android
                  requirements.
                </p>

                <p>
                  App pages also provide access to available version history,
                  compatibility information and source details. This makes it
                  easier to compare versions and understand which Android
                  releases an app may support.
                </p>

                <p>
                  Availability of version, compatibility and source information
                  depends on the records currently maintained in the DroidZyra
                  directory.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Related Categories */}
        {relatedCategories.length > 0 && (
          <section className="mt-12">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">
                Explore Other App Categories
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Browse more Android apps across the DroidZyra directory.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCategories.map((related) => (
                <Link
                  key={related.id}
                  href={`/apps/category/${related.slug}`}
                  className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-medium group-hover:text-primary">
                        {related.name}
                      </h3>

                      {related.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {related.description}
                        </p>
                      )}
                    </div>

                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}