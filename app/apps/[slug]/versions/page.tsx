import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  History,
  CalendarDays,
  Layers3,
  Smartphone,
  ArrowLeft,
} from 'lucide-react';

import { getVersionsForApp, getApps } from '@/lib/data';

import { Container } from '@/components/layout/container';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { BackLink } from '@/components/shared/back-link';
import { AppIcon } from '@/components/shared/badges';
import { VersionHistoryList } from '@/components/apps/version-history-list';
import { EmptyState } from '@/components/shared/empty-state';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';
export async function generateStaticParams() {
  const { apps } = await getApps({ limit: 100 });

  return apps.map((a) => ({
    slug: a.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { app } = await getVersionsForApp(params.slug);

  if (!app) {
    return {
      title: 'App Not Found',
    };
  }

  return {
    title: `${app.name} — Version History`,
    description: `Full version history for ${app.name} by ${app.developer}. Compare release dates, Android requirements, file sizes and changelogs.`,
    alternates: {
      canonical: `/apps/${app.slug}/versions`,
    },
  };
}

export default async function VersionHistoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { app, versions } = await getVersionsForApp(params.slug);

  if (!app) {
    notFound();
  }

  const latest = versions[0] ?? null;

  return (
    <main className="min-h-screen bg-background">
      {/* =====================================================
          PAGE HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-primary/[0.08] via-background to-background" />

        <div className="absolute left-1/2 top-[-230px] -z-10 h-[500px] w-[850px] -translate-x-1/2 rounded-full bg-primary/[0.12] blur-3xl" />

        <div className="absolute right-[-120px] top-16 -z-10 h-72 w-72 rounded-full bg-violet-500/[0.08] blur-3xl" />

        <Container className="py-7 sm:py-9 lg:py-11">
          <BackLink
            href={`/apps/${app.slug}`}
            label={`Back to ${app.name}`}
          />

          <Breadcrumbs
            items={[
              {
                label: 'Apps',
                href: '/apps',
              },
              {
                label: app.name,
                href: `/apps/${app.slug}`,
              },
              {
                label: 'Versions',
              },
            ]}
            className="mb-6"
          />

          <div className="rounded-[28px] border border-border/60 bg-background/75 p-6 shadow-[0_20px_70px_-38px_hsl(var(--primary)/0.35)] backdrop-blur sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="shrink-0">
                <div className="rounded-[20px] border border-border/60 bg-background p-2 shadow-lg">
                  <AppIcon
                    src={app.icon_url}
                    alt={app.name}
                    name={app.name}
                    size={82}
                    className="rounded-2xl"
                  />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="rounded-full px-3 py-1"
                  >
                    <History className="mr-1.5 h-3.5 w-3.5" />
                    Version Archive
                  </Badge>

                  <Badge
                    variant="outline"
                    className="rounded-full px-3 py-1"
                  >
                    {versions.length} version
                    {versions.length !== 1 ? 's' : ''}
                  </Badge>
                </div>

                <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] text-foreground sm:text-4xl">
                  {app.name}
                  <span className="block bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                    Version History
                  </span>
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  Browse every listed version of {app.name} by {app.developer}.
                  Compare release information and open any version for full
                  compatibility and source details.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      <Layers3 className="h-3.5 w-3.5 text-primary" />
                      Total Versions
                    </div>

                    <p className="mt-2 text-xl font-black text-foreground">
                      {versions.length}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5 text-primary" />
                      Latest Version
                    </div>

                    <p className="mt-2 text-sm font-bold text-foreground">
                      {latest ? `v${latest.version_name}` : 'Not available'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      <Smartphone className="h-3.5 w-3.5 text-primary" />
                      Platform
                    </div>

                    <p className="mt-2 text-sm font-bold text-foreground">
                      Android
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 rounded-xl bg-background/70 px-5"
                  >
                    <Link href={`/apps/${app.slug}`}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      App Overview
                    </Link>
                  </Button>

                  <Button
                    asChild
                    className="h-11 rounded-xl px-5 shadow-md shadow-primary/15"
                  >
                    <Link href={`/compatibility?app=${app.slug}`}>
                      <Smartphone className="mr-2 h-4 w-4" />
                      Check Compatibility
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =====================================================
          VERSION HISTORY CONTENT
      ===================================================== */}

      <section className="relative py-10 sm:py-12 lg:py-14">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/20 to-background" />

        <Container>
          {versions.length > 0 ? (
            <div className="mx-auto max-w-4xl">
              <div className="mb-6 rounded-[20px] border border-border/60 bg-background px-5 py-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <History className="h-4 w-4" />
                      </div>

                      <div>
                        <h2 className="text-base font-bold text-foreground">
                          All Versions
                        </h2>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Newest releases appear first
                        </p>
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant="secondary"
                    className="w-fit rounded-full"
                  >
                    {versions.length} records
                  </Badge>
                </div>
              </div>

              <div className="rounded-[26px] border border-border/60 bg-background/75 p-4 shadow-[0_18px_55px_-35px_rgba(15,23,42,0.25)] backdrop-blur sm:p-5">
                <VersionHistoryList
                  slug={app.slug}
                  versions={versions}
                />
              </div>

              <div className="mt-6 rounded-[18px] border border-primary/15 bg-primary/[0.04] px-5 py-4">
                <div className="flex items-start gap-3">
                  <History className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                  <p className="text-xs leading-6 text-muted-foreground">
                    Versions are sorted by release date, newest first.
                    Select any version to view Android requirements,
                    file details and available source information.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Card className="mx-auto max-w-3xl overflow-hidden rounded-[24px] border-border/60 bg-background p-0 shadow-sm">
              <EmptyState
                title="No versions listed yet"
                description="This app doesn't have any version records in the database yet. Check back later."
                icon={<History className="h-6 w-6" />}
              />
            </Card>
          )}
        </Container>
      </section>
    </main>
  );
}

