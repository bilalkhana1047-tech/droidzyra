import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  HardDrive,
  Cpu,
  Smartphone,
  FileText,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Info,
  ArrowLeft,
  History,
} from 'lucide-react';
import { getVersionDetail, getVersionsForApp, getApps } from '@/lib/data';
import { formatDate, formatFileSize, androidVersionName } from '@/lib/format';
import { Container } from '@/components/layout/container';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { BackLink } from '@/components/shared/back-link';
import { AppIcon, VerificationBadge, SourceBadge } from '@/components/shared/badges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';
export async function generateStaticParams() {
  const { apps } = await getApps({ limit: 100 });
  const params: { slug: string; version: string }[] = [];
  for (const app of apps) {
    const { versions } = await getVersionsForApp(app.slug);
    for (const v of versions) {
      params.push({ slug: app.slug, version: v.version_name });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; version: string };
}): Promise<Metadata> {
  const { app, version } = await getVersionDetail(params.slug, params.version);
  if (!app || !version) return { title: 'Version Not Found' };
  const title = `${app.name} APK ${version.version_name} Download for Android`;

  const description =
    `Download ${app.name} APK version ${version.version_name} for Android. Check Android requirements, file size, architecture, release date and version details on DroidZyra.`;

  return {
    title,
    description,
    keywords: [
      `${app.name} APK ${version.version_name}`,
      `${app.name} APK download`,
      `${app.name} latest APK`,
      `${app.name} Android`,
      `${app.name} version ${version.version_name}`,
      app.developer,
      "Android APK",
      "APK download",
      "DroidZyra",
    ],
    alternates: {
      canonical: `/apps/${app.slug}/versions/${version.version_name}`,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: `/apps/${app.slug}/versions/${version.version_name}`,
      siteName: "DroidZyra",
      images: app.icon_url
        ? [
            {
              url: app.icon_url,
              alt: `${app.name} APK ${version.version_name}`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: app.icon_url ? [app.icon_url] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function VersionDetailPage({
  params,
}: {
  params: { slug: string; version: string };
}) {
  const { app, version } = await getVersionDetail(params.slug, params.version);
  if (!app || !version) notFound();

  const { versions: allVersions } = await getVersionsForApp(app.slug);
  const otherVersions = allVersions.filter((v) => v.id !== version.id);
  const sourceUrl = version.source_url || app.official_url;

  const specs: { icon: React.ReactNode; label: string; value: string }[] = [
    {
      icon: <Calendar className="h-4 w-4" />,
      label: 'Release date',
      value: formatDate(version.release_date),
    },
    {
      icon: <Smartphone className="h-4 w-4" />,
      label: 'Minimum Android',
      value: `Android ${version.min_android} (${androidVersionName(version.min_android)})`,
    },
    {
      icon: <Smartphone className="h-4 w-4" />,
      label: 'Target Android',
      value: `Android ${version.target_android} (${androidVersionName(version.target_android)})`,
    },
    {
      icon: <Cpu className="h-4 w-4" />,
      label: 'Architecture',
      value: version.architecture,
    },
    {
      icon: <HardDrive className="h-4 w-4" />,
      label: 'File size',
      value: formatFileSize(version.file_size),
    },
  ];

  return (
    <Container className="py-6 lg:py-10">
      <BackLink
        href={`/apps/${app.slug}/versions`}
        label={`Back to ${app.name} versions`}
      />
      <Breadcrumbs
        items={[
          { label: 'Apps', href: '/apps' },
          { label: app.name, href: `/apps/${app.slug}` },
          { label: 'Versions', href: `/apps/${app.slug}/versions` },
          { label: `v${version.version_name}` },
        ]}
        className="mb-6"
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <AppIcon
              src={app.icon_url}
              alt={app.name}
              name={app.name}
              size={64}
              className="shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  v{version.version_name}
                </h1>
                <span className="text-sm font-mono text-muted-foreground">
                  #{version.version_code}
                </span>
              </div>
              <p className="mt-1 text-muted-foreground">
                {app.name} by {app.developer}
              </p>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <VerificationBadge verified={version.verified} />
                <SourceBadge sourceType={version.source_type} />
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5 text-primary" />
                Changelog
              </CardTitle>
            </CardHeader>
            <CardContent>
              {version.changelog ? (
                <>
                  <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    {version.changelog.content}
                  </p>
                  {version.changelog.source_url && (
                    <a
                      href={version.changelog.source_url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View original changelog
                    </a>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No changelog is available for this version.
                </p>
              )}
            </CardContent>
          </Card>

          {otherVersions.length > 0 && (
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <History className="h-5 w-5 text-primary" />
                Other Versions
              </h2>
              <div className="space-y-2">
                {otherVersions.slice(0, 5).map((v) => (
                  <Link
                    key={v.id}
                    href={`/apps/${app.slug}/versions/${v.version_name}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 hover:border-primary/30 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-medium text-sm">
                        v{v.version_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(v.release_date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <VerificationBadge verified={v.verified} />
                      <ArrowLeft className="h-3 w-3 text-muted-foreground rotate-180" />
                    </div>
                  </Link>
                ))}
                {otherVersions.length > 5 && (
                  <Button asChild variant="outline" size="sm" className="mt-2">
                    <Link href={`/apps/${app.slug}/versions`}>
                      View all {allVersions.length} versions
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Version Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {specs.map((row) => (
                <div
                  key={row.label}
                  className="flex items-start justify-between gap-3 text-sm"
                >
                  <span className="flex items-center gap-2 text-muted-foreground">
                    {row.icon}
                    {row.label}
                  </span>
                  <span className="font-medium text-right text-xs">
                    {row.value}
                  </span>
                </div>
              ))}
              {version.sha256 && (
                <div className="pt-3 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    SHA-256
                  </p>
                  <code className="block break-all rounded bg-muted p-2 font-mono text-[11px]">
                    {version.sha256}
                  </code>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="p-5 space-y-4">
            <div>
              <h3 className="font-semibold">Download & Source</h3>
            </div>

            {version.verified ? (
              <div className="flex items-start gap-2.5 rounded-lg border border-success/30 bg-success/5 p-3 text-sm">
                <ShieldCheck className="h-5 w-5 text-success shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-success">Verified source</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    This version&apos;s source has been verified.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm">
                <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-warning">Unverified source</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Verification is not available for this version.
                  </p>
                </div>
              </div>
            )}

            {sourceUrl ? (
              <Button asChild className="w-full gap-2">
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit Official Source
                </a>
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                No source link available.
              </p>
            )}

            {version.custom_download_url && (
              <Button
                asChild
                variant="outline"
                className="w-full gap-2 border-primary/20 bg-primary/[0.05] font-semibold text-primary hover:bg-primary/10 hover:text-primary"
              >
                <a
                  href={`/download/${app.slug}/${version.version_name}`}
                >
                  Download APK
                </a>
              </Button>
            )}

            <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <p>
                DroidZyra does not host APK files. You will be directed to the
                official source.
              </p>
            </div>
          </Card>
        </aside>
      </div>
    </Container>
  );
}



