import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  Package,
  Calendar,
  HardDrive,
  Smartphone,
  History,
  Layers,
  ListChecks,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

import { getAppBySlug, getApps } from '@/lib/data';
import type { AppDetail, Version } from '@/lib/types';
import {
  formatDate,
  formatFileSize,
  androidVersionName,
} from '@/lib/format';

import { Container } from '@/components/layout/container';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { BackLink } from '@/components/shared/back-link';

import {
  AppIcon,
  StatusBadge,
  VerificationBadge,
  CompatibilityBadge,
} from '@/components/shared/badges';

import { AppCard } from '@/components/shared/app-card';
import { VersionHistoryList } from '@/components/apps/version-history-list';
import { ScreenshotsGallery } from '@/components/apps/screenshots-gallery';
import { DownloadSourceSection } from '@/components/apps/download-source-section';
import { AppFAQ } from '@/components/apps/app-faq';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export async function generateStaticParams() {
  const { apps } = await getApps({ limit: 1000 });

  return apps.map((a) => ({
    slug: a.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const app = await getAppBySlug(params.slug);

  if (!app) {
    return {
      title: 'App Not Found',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const latest = app.versions[0] ?? null;

  const description =
    app.description ??
    `${app.name} by ${app.developer}. Explore the latest version, version history, Android compatibility, screenshots and trusted download sources on DroidZyra.`;

  const cleanDescription = description
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);

  const title = `${app.name} — Version History & Compatibility`;

  return {
    title,
    description: cleanDescription,

    alternates: {
      canonical: `/apps/${app.slug}`,
    },

    keywords: [
      app.name,
      `${app.name} APK`,
      `${app.name} latest version`,
      `${app.name} old versions`,
      `${app.name} version history`,
      `${app.name} Android compatibility`,
      `${app.name} download`,
      app.developer,
      'Android apps',
      'APK versions',
      'app compatibility',
      'DroidZyra',
    ],

    openGraph: {
      type: 'website',
      title: `${app.name} | DroidZyra`,
      description: cleanDescription,
      url: `/apps/${app.slug}`,
      siteName: 'DroidZyra',
      images: app.icon_url
        ? [
            {
              url: app.icon_url,
              alt: `${app.name} app icon`,
            },
          ]
        : undefined,
    },

    twitter: {
      card: 'summary_large_image',
      title: `${app.name} | DroidZyra`,
      description: cleanDescription,
      images: app.icon_url ? [app.icon_url] : undefined,
    },

    robots: {
      index: true,
      follow: true,
    },

    other: latest
      ? {
          'app-version': latest.version_name,
          'app-developer': app.developer,
        }
      : undefined,
  };
}

export default async function AppDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const app = await getAppBySlug(params.slug);

  if (!app) {
    notFound();
  }

  const latest = app.versions[0] ?? null;
  const otherVersions = app.versions.slice(1);

  const alternatives = (await getApps({ limit: 6 })).apps
    .filter(
      (a) =>
        a.id !== app.id &&
        a.category_id === app.category_id
    )
    .slice(0, 3);

  const pageUrl = `https://droidzyra.app/apps/${app.slug}`;

  const description =
    app.description ??
    `${app.name} by ${app.developer}. Explore the latest version, version history, Android compatibility and trusted download sources on DroidZyra.`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    description,
    applicationCategory: 'MobileApplication',
    operatingSystem: 'Android',
    url: pageUrl,

    ...(app.icon_url
      ? {
          image: app.icon_url,
        }
      : {}),

    ...(app.developer
      ? {
          author: {
            '@type': 'Organization',
            name: app.developer,
          },
        }
      : {}),

    ...(latest
      ? {
          softwareVersion: latest.version_name,
          dateModified: latest.release_date,
          fileSize: latest.file_size
            ? `${latest.file_size}`
            : undefined,
        }
      : {}),

    ...(app.official_url
      ? {
          sameAs: app.official_url,
        }
      : {}),
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
        <BackLink href="/apps" label="All apps" />

        <Breadcrumbs
          items={[
            {
              label: 'Apps',
              href: '/apps',
            },
            {
              label: app.name,
            },
          ]}
          className="mb-6"
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
          <div className="space-y-8">
            <AppHeader
              app={app}
              latest={latest}
            />

            <Tabs
              defaultValue="overview"
              className="w-full"
            >
              <TabsList className="w-full justify-start flex-wrap h-auto">
                <TabsTrigger value="overview">
                  Overview
                </TabsTrigger>

                <TabsTrigger value="versions">
                  Versions ({app.versions.length})
                </TabsTrigger>

                <TabsTrigger value="compatibility">
                  Compatibility
                </TabsTrigger>

                <TabsTrigger value="faq">
                  FAQ
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="overview"
                className="space-y-8 mt-6"
              >
                {/* About the app */}
                <Section
                  title="About"
                  icon={<Package className="h-5 w-5" />}
                >
                  <Card>
                    <CardContent className="p-5">
                      <p className="text-muted-foreground leading-7">
                        {app.description ??
                          'No description available.'}
                      </p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <InfoMiniCard
                          label="Developer"
                          value={app.developer}
                          icon={
                            <Building2 className="h-4 w-4" />
                          }
                        />

                        <InfoMiniCard
                          label="Package name"
                          value={app.package_name}
                          icon={
                            <Package className="h-4 w-4" />
                          }
                        />

                        {app.category && (
                          <InfoMiniCard
                            label="Category"
                            value={app.category.name}
                            icon={
                              <Layers className="h-4 w-4" />
                            }
                          />
                        )}

                        {latest && (
                          <InfoMiniCard
                            label="Latest version"
                            value={`v${latest.version_name}`}
                            icon={
                              <History className="h-4 w-4" />
                            }
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Section>

                {/* Screenshots */}
                <Section
                  title="Screenshots"
                  icon={<Layers className="h-5 w-5" />}
                >
                  <ScreenshotsGallery
                    screenshots={app.screenshots}
                    appName={app.name}
                  />
                </Section>

                {/* Latest Version */}
                <Section
                  title="Latest Version"
                  icon={<History className="h-5 w-5" />}
                >
                  {latest ? (
                    <VersionHistoryList
                      slug={app.slug}
                      versions={[latest]}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No version information available.
                    </p>
                  )}
                </Section>

                {/* What's New */}
                {latest?.changelog?.content && (
                  <Section
                    title="What's New"
                    icon={
                      <ListChecks className="h-5 w-5" />
                    }
                  >
                    <Card>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div>
                            <p className="font-semibold">
                              Version {latest.version_name}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              Released{' '}
                              {formatDate(
                                latest.release_date
                              )}
                            </p>
                          </div>

                          {latest.changelog.published_at && (
                            <span className="text-xs text-muted-foreground">
                              Changelog updated{' '}
                              {formatDate(
                                latest.changelog.published_at
                              )}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 rounded-xl border border-border/60 bg-muted/30 p-4">
                          <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                            {latest.changelog.content}
                          </p>
                        </div>

                        {latest.changelog.source_url && (
                          <a
                            href={
                              latest.changelog.source_url
                            }
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            View changelog source
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  </Section>
                )}

                {/* Version History */}
                <Section
                  title="Version History"
                  icon={<History className="h-5 w-5" />}
                >
                  {otherVersions.length > 0 ? (
                    <>
                      <VersionHistoryList
                        slug={app.slug}
                        versions={otherVersions}
                        limit={5}
                      />

                      <div className="mt-4">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                        >
                          <Link
                            href={`/apps/${app.slug}/versions`}
                          >
                            View all {app.versions.length}{' '}
                            versions
                          </Link>
                        </Button>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Only one version is currently listed.
                    </p>
                  )}
                </Section>

                {/* Release Information */}
                {latest && (
                  <Section
                    title="Release Information"
                    icon={
                      <Calendar className="h-5 w-5" />
                    }
                  >
                    <Card>
                      <CardContent className="p-5">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          <ReleaseInfo
                            label="Version"
                            value={`v${latest.version_name}`}
                          />

                          <ReleaseInfo
                            label="Version code"
                            value={latest.version_code}
                          />

                          <ReleaseInfo
                            label="Release date"
                            value={formatDate(
                              latest.release_date
                            )}
                          />

                          <ReleaseInfo
                            label="File size"
                            value={formatFileSize(
                              latest.file_size
                            )}
                          />

                          <ReleaseInfo
                            label="Architecture"
                            value={latest.architecture}
                          />

                          <ReleaseInfo
                            label="Verification"
                            value={
                              latest.verified
                                ? 'Verified'
                                : 'Not verified'
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </Section>
                )}
              </TabsContent>

              <TabsContent
                value="versions"
                className="mt-6"
              >
                <Section
                  title="All Versions"
                  icon={<History className="h-5 w-5" />}
                >
                  {app.versions.length > 0 ? (
                    <VersionHistoryList
                      slug={app.slug}
                      versions={app.versions}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No versions are listed yet.
                    </p>
                  )}
                </Section>
              </TabsContent>

              <TabsContent
                value="compatibility"
                className="mt-6"
              >
                <Section
                  title="Compatibility"
                  icon={
                    <Smartphone className="h-5 w-5" />
                  }
                >
                  {app.compatibility.length > 0 ? (
                    <div className="space-y-3">
                      {app.compatibility.map((c) => (
                        <Card
                          key={c.id}
                          className="p-4"
                        >
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div>
                              <p className="font-medium text-sm">
                                Android{' '}
                                {c.android_version}{' '}
                                <span className="text-muted-foreground font-normal">
                                  (
                                  {androidVersionName(
                                    c.android_version
                                  )}
                                  )
                                </span>
                              </p>

                              {c.version && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Recommended: v
                                  {c.version.version_name}{' '}
                                  (#
                                  {c.version.version_code})
                                </p>
                              )}

                              {c.notes && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {c.notes}
                                </p>
                              )}
                            </div>

                            <CompatibilityBadge
                              status={c.status}
                            />
                          </div>
                        </Card>
                      ))}

                      <div className="mt-4">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                        >
                          <Link
                            href={`/compatibility?app=${app.slug}`}
                          >
                            Open in Compatibility Finder
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No structured compatibility data available
                      yet.
                    </p>
                  )}
                </Section>
              </TabsContent>

              <TabsContent
                value="faq"
                className="mt-6"
              >
                <Section
                  title="FAQ"
                  icon={
                    <HelpCircle className="h-5 w-5" />
                  }
                >
                  <AppFAQ app={app} />
                </Section>
              </TabsContent>
            </Tabs>

            {/* Related Apps */}
            {alternatives.length > 0 && (
              <Section
                title="Related Apps"
                icon={
                  <ListChecks className="h-5 w-5" />
                }
              >
                <p className="mb-4 text-sm text-muted-foreground">
                  Explore other apps in the same category
                  that you may also find useful.
                </p>

                <div className="grid gap-4 sm:grid-cols-3">
                  {alternatives.map((alt) => (
                    <AppCard
                      key={alt.id}
                      app={alt}
                    />
                  ))}
                </div>
              </Section>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-20">
            <DownloadSourceSection
              version={latest}
              appName={app.name}
              officialUrl={app.official_url}
            />

            <AppInfoSidebar
              app={app}
              latest={latest}
            />
          </aside>
        </div>
      </Container>
    </>
  );
}

function AppHeader({
  app,
  latest,
}: {
  app: AppDetail;
  latest: Version | null;
}) {
  return (
    <div className="flex items-start gap-4 sm:gap-5">
      <AppIcon
        src={app.icon_url}
        alt={app.name}
        name={app.name}
        size={80}
        className="shadow-sm"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {app.name}
          </h1>

          <StatusBadge status={app.status} />
        </div>

        <p className="mt-1 text-muted-foreground">
          {app.developer}
        </p>

        <div className="mt-3 flex items-center gap-3 flex-wrap text-sm text-muted-foreground">
          {app.category && (
            <Link
              href={`/apps?category=${app.category.slug}`}
              className="font-medium text-primary hover:underline"
            >
              {app.category.name}
            </Link>
          )}

          {latest && (
            <>
              <span className="text-muted-foreground/40">
                |
              </span>

              <span>
                Latest: v{latest.version_name}
              </span>

              <span className="text-muted-foreground/40">
                |
              </span>

              <span>
                {formatDate(latest.release_date)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AppInfoSidebar({
  app,
  latest,
}: {
  app: AppDetail;
  latest: Version | null;
}) {
  const rows: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }[] = [
    {
      icon: <Building2 className="h-4 w-4" />,
      label: 'Developer',
      value: app.developer,
    },
    {
      icon: <Package className="h-4 w-4" />,
      label: 'Package',
      value: app.package_name,
    },
    ...(latest
      ? [
          {
            icon: <Calendar className="h-4 w-4" />,
            label: 'Released',
            value: formatDate(
              latest.release_date
            ),
          },
          {
            icon: <HardDrive className="h-4 w-4" />,
            label: 'File size',
            value: formatFileSize(
              latest.file_size
            ),
          },
          {
            icon: <Smartphone className="h-4 w-4" />,
            label: 'Min Android',
            value: `Android ${
              latest.min_android
            } (${androidVersionName(
              latest.min_android
            )})`,
          },
          {
            icon: <Smartphone className="h-4 w-4" />,
            label: 'Target Android',
            value: `Android ${
              latest.target_android
            } (${androidVersionName(
              latest.target_android
            )})`,
          },
          {
            icon: <Package className="h-4 w-4" />,
            label: 'Architecture',
            value: latest.architecture,
          },
        ]
      : []),
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          App Information
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-3 text-sm"
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              {row.icon}
              {row.label}
            </span>

            <span className="font-medium text-right text-xs break-all">
              {row.value}
            </span>
          </div>
        ))}

        {latest && (
          <div className="flex items-start justify-between gap-3 text-sm pt-2 border-t border-border">
            <span className="flex items-center gap-2 text-muted-foreground">
              <History className="h-4 w-4" />
              Verification
            </span>

            <VerificationBadge
              verified={latest.verified}
            />
          </div>
        )}

        {/* Source Information */}
        {latest && (
          <div className="border-t border-border pt-3 space-y-3">
            <p className="text-sm font-semibold">
              Source Information
            </p>

            <div className="flex items-start justify-between gap-3 text-sm">
              <span className="text-muted-foreground">
                Source type
              </span>

              <span className="font-medium text-right text-xs">
                {latest.source_type === 'official'
                  ? 'Official'
                  : latest.source_type ===
                      'third-party-authorized'
                    ? 'Authorized third-party'
                    : 'Unofficial'}
              </span>
            </div>

            {latest.sha256 && (
              <div className="text-sm">
                <p className="text-muted-foreground">
                  SHA-256
                </p>

                <p className="mt-1 break-all rounded-lg bg-muted/50 p-2 font-mono text-[10px] leading-5">
                  {latest.sha256}
                </p>
              </div>
            )}

            {latest.source_url && (
              <a
                href={latest.source_url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View source
              </a>
            )}
          </div>
        )}

        {app.official_url && (
          <a
            href={app.official_url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex items-center gap-1.5 text-sm text-primary hover:underline pt-2 border-t border-border"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Official website
          </a>
        )}
      </CardContent>
    </Card>
  );
}

function InfoMiniCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>

      <p className="mt-1.5 break-all text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}

function ReleaseInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold break-all">
        {value}
      </p>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
        <span className="text-primary">
          {icon}
        </span>

        {title}
      </h2>

      {children}
    </section>
  );
}

