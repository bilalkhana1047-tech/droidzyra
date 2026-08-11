import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { History } from 'lucide-react';
import { getVersionsForApp, getApps } from '@/lib/data';
import { Container } from '@/components/layout/container';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { BackLink } from '@/components/shared/back-link';
import { AppIcon } from '@/components/shared/badges';
import { VersionHistoryList } from '@/components/apps/version-history-list';
import { EmptyState } from '@/components/shared/empty-state';
import { Card } from '@/components/ui/card';

export async function generateStaticParams() {
  const { apps } = await getApps({ limit: 100 });
  return apps.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { app } = await getVersionsForApp(params.slug);
  if (!app) return { title: 'App Not Found' };
  return {
    title: `${app.name} — Version History`,
    description: `Full version history for ${app.name} by ${app.developer}. Compare release dates, Android requirements, file sizes and changelogs.`,
    alternates: { canonical: `/apps/${app.slug}/versions` },
  };
}

export default async function VersionHistoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { app, versions } = await getVersionsForApp(params.slug);
  if (!app) notFound();

  return (
    <Container className="py-6 lg:py-10">
      <BackLink href={`/apps/${app.slug}`} label={`Back to ${app.name}`} />
      <Breadcrumbs
        items={[
          { label: 'Apps', href: '/apps' },
          { label: app.name, href: `/apps/${app.slug}` },
          { label: 'Versions' },
        ]}
        className="mb-6"
      />

      <div className="flex items-start gap-4 mb-8">
        <AppIcon src={app.icon_url} alt={app.name} name={app.name} size={56} />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Version History
          </h1>
          <p className="mt-1 text-muted-foreground">
            {app.name} by {app.developer} — {versions.length} version
            {versions.length !== 1 ? 's' : ''} listed.
          </p>
        </div>
      </div>

      {versions.length > 0 ? (
        <div className="max-w-3xl">
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <History className="h-4 w-4" />
            Sorted by release date, newest first. Click a version for full
            details.
          </div>
          <VersionHistoryList slug={app.slug} versions={versions} />
        </div>
      ) : (
        <Card className="p-0">
          <EmptyState
            title="No versions listed yet"
            description="This app doesn't have any version records in the database yet. Check back later."
            icon={<History className="h-6 w-6" />}
          />
        </Card>
      )}
    </Container>
  );
}
